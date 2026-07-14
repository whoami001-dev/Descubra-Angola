import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "descubra-angola-secret-key-2026";

// Path to user databases folder
const DB_FOLDER = path.join(process.cwd(), "user_databases");

// Ensure user_databases folder exists on startup
if (!fs.existsSync(DB_FOLDER)) {
  fs.mkdirSync(DB_FOLDER, { recursive: true });
}

app.use(express.json());
app.use("/fotos", express.static(path.join(process.cwd(), "fotos")));

// Helper function to hash passwords securely using sha256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Get safe file path based on normalized email
function getUserFilePath(email: string): string {
  const emailNormalized = email.trim().toLowerCase();
  const safeEmail = emailNormalized.replace(/[^a-zA-Z0-9]/g, "_");
  return path.join(DB_FOLDER, `${safeEmail}.json`);
}

// Read user database file
function readUserDb(email: string): any | null {
  const filePath = getUserFilePath(email);
  if (!fs.existsSync(filePath)) return null;
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading database file for ${email}:`, err);
    return null;
  }
}

// Write/Save user database file
function saveUserDb(email: string, dbData: any) {
  const filePath = getUserFilePath(email);
  try {
    fs.writeFileSync(filePath, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing database file for ${email}:`, err);
  }
}

// Ensure user DB exists, create one if it doesn't (resilience against server ephemeral restarts)
function getOrCreateUserDb(user: any): any {
  const emailNormalized = user.email.trim().toLowerCase();
  let userDbData = readUserDb(emailNormalized);
  if (!userDbData) {
    userDbData = {
      credentials: {
        id: Date.now(),
        uid: user.uid,
        email: emailNormalized,
        username: user.username || emailNormalized.split("@")[0] || "Viajante",
        passwordHash: "",
      },
      activities: [
        {
          id: "act_" + Math.random().toString(36).substring(2, 15),
          activityType: "restore",
          description: `Perfil e histórico de atividades restaurados`,
          createdAt: new Date().toISOString(),
        }
      ],
      travelPlan: null
    };
    saveUserDb(emailNormalized, userDbData);
  }
  return userDbData;
}

// Lazy-initialized Gemini AI client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// AUTHENTICATION & PROFILE API ENDPOINTS
// ==========================================

// Register a new custom user
app.post("/api/auth/register", (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Todos os campos (email, nome, palavra-passe) são obrigatórios." });
    }

    const emailNormalized = email.trim().toLowerCase();
    const usernameTrimmed = username.trim();
    const filePath = getUserFilePath(emailNormalized);

    // Check if user already exists
    if (fs.existsSync(filePath)) {
      return res.status(400).json({ error: "Este email já está registado. Escolha outro ou inicie sessão." });
    }

    const uid = "custom_" + Math.random().toString(36).substring(2, 15);
    const hashedPassword = hashPassword(password);

    // Prepare user database object
    const userDbData = {
      credentials: {
        id: Date.now(),
        uid,
        email: emailNormalized,
        username: usernameTrimmed,
        passwordHash: hashedPassword,
      },
      activities: [
        {
          id: "act_" + Math.random().toString(36).substring(2, 15),
          activityType: "register",
          description: `Conta criada por ${usernameTrimmed} (${emailNormalized})`,
          createdAt: new Date().toISOString(),
        }
      ],
      travelPlan: null
    };

    saveUserDb(emailNormalized, userDbData);

    const token = jwt.sign(
      { uid, email: emailNormalized, username: usernameTrimmed },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: userDbData.credentials.id,
        uid,
        email: emailNormalized,
        username: usernameTrimmed,
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Erro interno no servidor ao registar utilizador." });
  }
});

// Login a custom user
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email e palavra-passe são obrigatórios." });
    }

    const emailNormalized = email.trim().toLowerCase();
    const userDbData = readUserDb(emailNormalized);

    if (!userDbData) {
      return res.status(400).json({ error: "Credenciais inválidas. Verifique os dados inseridos." });
    }

    if (!userDbData.credentials.passwordHash || userDbData.credentials.passwordHash !== hashPassword(password)) {
      return res.status(400).json({ error: "Credenciais inválidas. Verifique os dados inseridos." });
    }

    // Log login activity
    userDbData.activities.unshift({
      id: "act_" + Math.random().toString(36).substring(2, 15),
      activityType: "login",
      description: `Iniciou sessão como ${userDbData.credentials.username}`,
      createdAt: new Date().toISOString(),
    });

    saveUserDb(emailNormalized, userDbData);

    const token = jwt.sign(
      { uid: userDbData.credentials.uid, email: emailNormalized, username: userDbData.credentials.username },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: userDbData.credentials.id,
        uid: userDbData.credentials.uid,
        email: emailNormalized,
        username: userDbData.credentials.username,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Erro interno no servidor ao iniciar sessão." });
  }
});

// Firebase user synchronization route (Google Sign-In)
app.post("/api/auth/firebase-sync", requireAuth, (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    const emailNormalized = user.email.toLowerCase();
    let userDbData = readUserDb(emailNormalized);
    let isNew = false;

    if (!userDbData) {
      // Create new user profile in local file db
      userDbData = {
        credentials: {
          id: Date.now(),
          uid: user.uid,
          email: emailNormalized,
          username: user.username || emailNormalized.split("@")[0] || "Viajante",
          passwordHash: "", // No password for Google accounts
        },
        activities: [
          {
            id: "act_" + Math.random().toString(36).substring(2, 15),
            activityType: "register",
            description: `Inscrição via Google: ${user.username || emailNormalized}`,
            createdAt: new Date().toISOString(),
          }
        ],
        travelPlan: null
      };
      isNew = true;
    } else {
      // Update Firebase UID if not set (linking)
      userDbData.credentials.uid = user.uid;
      userDbData.activities.unshift({
        id: "act_" + Math.random().toString(36).substring(2, 15),
        activityType: "login",
        description: `Sessão iniciada via Google: ${userDbData.credentials.username}`,
        createdAt: new Date().toISOString(),
      });
    }

    saveUserDb(emailNormalized, userDbData);

    res.json({
      user: {
        id: userDbData.credentials.id,
        uid: userDbData.credentials.uid,
        email: emailNormalized,
        username: userDbData.credentials.username,
      },
    });
  } catch (error: any) {
    console.error("Firebase Sync Error:", error);
    res.status(500).json({ error: "Erro interno ao sincronizar utilizador via Google." });
  }
});

// Logout activity logging
app.post("/api/auth/logout", requireAuth, (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autorizado" });

    const emailNormalized = user.email.toLowerCase();
    const userDbData = getOrCreateUserDb(user);

    userDbData.activities.unshift({
      id: "act_" + Math.random().toString(36).substring(2, 15),
      activityType: "logout",
      description: "Sessão terminada com sucesso",
      createdAt: new Date().toISOString(),
    });
    saveUserDb(emailNormalized, userDbData);
    res.json({ success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Erro ao registar logout." });
  }
});

// Retrieve activities list
app.get("/api/user/activities", requireAuth, (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autorizado" });

    const userDbData = getOrCreateUserDb(user);

    res.json(userDbData.activities || []);
  } catch (error: any) {
    console.error("Get Activities Error:", error);
    res.status(500).json({ error: "Erro ao carregar o histórico de atividades." });
  }
});

// Log custom user activities (page views, clicks, favorites, etc.)
app.post("/api/user/activities", requireAuth, (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autorizado" });

    const { activityType, description } = req.body;
    if (!activityType || !description) {
      return res.status(400).json({ error: "Tipo de atividade e descrição são obrigatórios." });
    }

    const emailNormalized = user.email.toLowerCase();
    const userDbData = getOrCreateUserDb(user);

    userDbData.activities.unshift({
      id: "act_" + Math.random().toString(36).substring(2, 15),
      activityType,
      description,
      createdAt: new Date().toISOString(),
    });

    saveUserDb(emailNormalized, userDbData);

    res.json({ success: true });
  } catch (error: any) {
    console.error("Post Activity Error:", error);
    res.status(500).json({ error: "Erro ao registar atividade." });
  }
});

// Retrieve user travel plan
app.get("/api/user/planner", requireAuth, (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autorizado" });

    const userDbData = getOrCreateUserDb(user);

    if (!userDbData.travelPlan) {
      return res.json(null);
    }

    res.json({
      spots: userDbData.travelPlan.spots,
      tripDays: userDbData.travelPlan.tripDays,
      transportMode: userDbData.travelPlan.transportMode,
    });
  } catch (error: any) {
    console.error("Get Planner Error:", error);
    res.status(500).json({ error: "Erro ao carregar o plano de viagem." });
  }
});

// Save or update user travel plan
app.post("/api/user/planner", requireAuth, (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autorizado" });

    const { spots: spotsList, tripDays, transportMode } = req.body;
    if (!spotsList || !Array.isArray(spotsList)) {
      return res.status(400).json({ error: "Roteiro de viagem inválido." });
    }

    const emailNormalized = user.email.toLowerCase();
    const userDbData = getOrCreateUserDb(user);

    userDbData.travelPlan = {
      spots: spotsList,
      tripDays: tripDays || 3,
      transportMode: transportMode || "car",
      updatedAt: new Date().toISOString(),
    };

    // Log activity
    userDbData.activities.unshift({
      id: "act_" + Math.random().toString(36).substring(2, 15),
      activityType: "save_planner",
      description: `Roteiro atualizado com ${spotsList.length} destino(s)`,
      createdAt: new Date().toISOString(),
    });

    saveUserDb(emailNormalized, userDbData);

    res.json({ success: true });
  } catch (error: any) {
    console.error("Save Planner Error:", error);
    res.status(500).json({ error: "Erro ao guardar o plano de viagem." });
  }
});

// ==========================================
// AI CHAT ASSISTANCE
// ==========================================
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const hasApiKey = !!process.env.GEMINI_API_KEY;
    if (!hasApiKey) {
      return res.json({
        text: `Olá! Sou o assistente virtual do **Descubra Angola**. 

Atualmente estou em modo de demonstração porque a chave do Gemini API não está configurada nos segredos do projeto. 

No entanto, posso adiantar-lhe que Angola é um país maravilhoso para visitar! Seus destaques principais incluem:
1. **Quedas de Kalandula** (Malanje) - Uma das maiores quedas d'água da África.
2. **Serra da Leba** (Huíla) - A famosa estrada sinuosa esculpida na montanha.
3. **Fenda da Tundavala** (Huíla) - Um abismo espetacular com vistas infinitas.
4. **Miradouro da Lua** (Luanda) - Falésias de paisagem lunar esculpidas pelo mar e vento.
5. **Parque Nacional da Kissama** (Luanda/Bengo) - Onde pode fazer safáris para ver elefantes, zebras e girafas.

*Configure a chave de API nos Segredos (Settings > Secrets) para ter conversas personalizadas comigo!*`
      });
    }

    const ai = getGeminiClient();

    let systemInstruction = `Você é o Guia Turístico Virtual Oficial de Angola para o portal "Descubra Angola".
Seu objetivo é promover o turismo em Angola com entusiasmo, elegância, respeito e profunda precisão cultural, histórica e geográfica.
Responda sempre em Português (e forneça traduções breves se o usuário perguntar noutra língua). 
Destaque a gastronomia angolana (como Funge, Calulu, Muamba de Galinha, Mufete), a música (Semba, Kizomba, Kuduro), e pontos turísticos emblemáticos das 18 províncias.
Apresente as respostas usando formatação Markdown elegante, com negritos, listas e espaçamentos limpos. Seja acolhedor e termine with uma expressão calorosa angolana como "Estamos Juntos!" ou "Bem-vindo a Angola!".`;

    let promptParts: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        const roleName = turn.role === "user" ? "Visitante" : "Guia Angola";
        promptParts.push(`${roleName}: ${turn.text}`);
      });
    }
    promptParts.push(`Visitante: ${message}`);
    promptParts.push(`Guia Angola:`);

    const combinedPrompt = promptParts.join("\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: combinedPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Erro ao processar sua pergunta pelo assistente de IA." });
  }
});

// Configure Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server", err);
});
