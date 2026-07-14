import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin.ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "descubra-angola-secret-key-2026";

export interface DecodedUser {
  uid: string;
  email: string;
  username?: string;
  isCustom?: boolean;
}

export interface AuthRequest extends Request {
  user?: DecodedUser;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autorizado: Token ausente" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    // 1. Try to verify as custom local JWT first
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.uid) {
        req.user = {
          uid: decoded.uid,
          email: decoded.email,
          username: decoded.username,
          isCustom: true,
        };
        return next();
      }
    } catch (err) {
      // Not a valid local JWT, fall back to Firebase
    }

    // 2. Fall back to verifying via Firebase ID Token
    const decodedFirebase = await adminAuth.verifyIdToken(token);
    req.user = {
      uid: decodedFirebase.uid,
      email: decodedFirebase.email || "",
      username: decodedFirebase.name || decodedFirebase.email?.split("@")[0] || "Viajante",
      isCustom: false,
    };
    next();
  } catch (error) {
    console.error("Erro ao verificar token (Local/Firebase):", error);
    return res.status(401).json({ error: "Não autorizado: Token inválido ou expirado" });
  }
};
