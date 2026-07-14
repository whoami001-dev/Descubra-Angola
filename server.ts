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

// ==========================================
// DYNAMIC TRANSLATION SERVICE
// ==========================================
const offlineTranslateText = (str: string, targetLanguage: string): string => {
  if (!str) return str;
  let result = str;
  if (targetLanguage === "en") {
    result = result
      .replace(/Descubra Angola/g, "Discover Angola")
      .replace(/Províncias/g, "Provinces")
      .replace(/História/g, "History")
      .replace(/Localização/g, "Location")
      .replace(/População/g, "Population")
      .replace(/Clima/g, "Climate")
      .replace(/Cultura/g, "Culture")
      .replace(/Gastronomia/g, "Gastronomy")
      .replace(/Curiosidades/g, "Curiosities")
      .replace(/Melhor Época para Visitar/g, "Best Season to Visit")
      .replace(/Hotéis/g, "Hotels")
      .replace(/Restaurantes/g, "Restaurants")
      .replace(/Transportes/g, "Transports")
      .replace(/Início/g, "Home")
      .replace(/Mapa/g, "Map")
      .replace(/Planeador/g, "Planner")
      .replace(/Saber Mais/g, "Learn More")
      .replace(/Ver todos/g, "View all")
      .replace(/Pesquisar/g, "Search")
      .replace(/Por que visitar Angola\?/g, "Why visit Angola?")
      .replace(/Depoimentos de Exploradores/g, "Explorers' Testimonials")
      .replace(/Comentário/g, "Comment")
      .replace(/Resposta/g, "Reply");
    return result;
  }
  if (targetLanguage === "fr") {
    result = result
      .replace(/Descubra Angola/g, "Découvrez l'Angola")
      .replace(/Províncias/g, "Provinces")
      .replace(/História/g, "Histoire")
      .replace(/Localização/g, "Emplacement")
      .replace(/População/g, "Population")
      .replace(/Clima/g, "Climat")
      .replace(/Cultura/g, "Culture")
      .replace(/Gastronomia/g, "Gastronomie")
      .replace(/Curiosidades/g, "Curiosités")
      .replace(/Melhor Época para Visitar/g, "Meilleure Saison à Visiter")
      .replace(/Hotéis/g, "Hôtels")
      .replace(/Restaurantes/g, "Restaurants")
      .replace(/Transportes/g, "Transports")
      .replace(/Início/g, "Accueil")
      .replace(/Mapa/g, "Carte")
      .replace(/Planeador/g, "Planificateur")
      .replace(/Saber Mais/g, "Savoir Plus")
      .replace(/Ver todos/g, "Voir tout")
      .replace(/Pesquisar/g, "Rechercher")
      .replace(/Por que visitar Angola\?/g, "Pourquoi visiter l'Angola?")
      .replace(/Depoimentos de Exploradores/g, "Témoignages d'Explorateurs");
    return result;
  }
  if (targetLanguage === "es") {
    result = result
      .replace(/Descubra Angola/g, "Descubre Angola")
      .replace(/Províncias/g, "Provincias")
      .replace(/História/g, "Historia")
      .replace(/Localização/g, "Ubicación")
      .replace(/População/g, "Población")
      .replace(/Clima/g, "Clima")
      .replace(/Cultura/g, "Cultura")
      .replace(/Gastronomia/g, "Gastronomía")
      .replace(/Curiosidades/g, "Curiosidades")
      .replace(/Melhor Época para Visitar/g, "Mejor Época para Visitar")
      .replace(/Hotéis/g, "Hoteles")
      .replace(/Restaurantes/g, "Restaurantes")
      .replace(/Transportes/g, "Transportes")
      .replace(/Início/g, "Inicio")
      .replace(/Mapa/g, "Mapa")
      .replace(/Planeador/g, "Planificador")
      .replace(/Saber Mais/g, "Saber Más")
      .replace(/Ver todos/g, "Ver todos")
      .replace(/Pesquisar/g, "Buscar")
      .replace(/Por que visitar Angola\?/g, "¿Por qué visitar Angola?")
      .replace(/Depoimentos de Exploradores/g, "Testimonios de Exploradores");
    return result;
  }
  return result;
};

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = ((error?.message || "") + " " + JSON.stringify(error || "")).toLowerCase();
    const isRateLimit = error?.status === 429 || errorStr.includes("429") || errorStr.includes("quota") || error?.code === 429;
    const isServiceUnavailable = error?.status === 503 || errorStr.includes("503") || errorStr.includes("unavailable") || error?.code === 503;
    
    if ((isRateLimit || isServiceUnavailable) && retries > 0) {
      console.warn(`Gemini API rate limited or service unavailable. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

app.post("/api/translate", async (req, res) => {
  const { text, texts, targetLanguage } = req.body;
  try {
    if (!targetLanguage) {
      return res.status(400).json({ error: "targetLanguage is required" });
    }

    if (targetLanguage === "pt") {
      // Already in source language
      if (texts && Array.isArray(texts)) {
        return res.json({ translatedTexts: texts });
      }
      return res.json({ translatedText: text });
    }

    const langName = {
      en: "English",
      fr: "French",
      es: "Spanish",
      pt: "Portuguese"
    }[targetLanguage as string] || targetLanguage;

    const hasApiKey = !!process.env.GEMINI_API_KEY;
    if (!hasApiKey) {
      if (texts && Array.isArray(texts)) {
        return res.json({ translatedTexts: texts.map(t => offlineTranslateText(t, targetLanguage)) });
      }
      return res.json({ translatedText: offlineTranslateText(text, targetLanguage) });
    }

    const ai = getGeminiClient();

    if (texts && Array.isArray(texts)) {
      const systemInstruction = `You are a professional, high-fidelity language translator. 
Translate the provided list of strings accurately to ${langName}.
Keep the same tone, preserve proper names like "Kalandula", "Leba", "Angola", "Luanda", "Malanje", "Benguela", "Huíla", "Namibe" if they shouldn't change.
Return ONLY a valid JSON array of strings containing the translations, in the exact same order as the input. Do not wrap in markdown or say anything else.`;

      const prompt = `Translate the following array of strings to ${langName}: \n${JSON.stringify(texts)}`;

      try {
        const response = await retryWithBackoff(async () => {
          return await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          });
        }, 3, 1000);

        const parsed = JSON.parse(response.text || "[]");
        return res.json({ translatedTexts: parsed });
      } catch (err: any) {
        console.error("Gemini list translation failed (falling back to offline):", err);
        // Fallback to offline translation
        return res.json({ translatedTexts: texts.map(t => offlineTranslateText(t, targetLanguage)) });
      }
    } else if (text) {
      const systemInstruction = `You are a professional language translator. Translate the text to ${langName}. 
Preserve formatting, tone, and line breaks. Return ONLY the translated text. No explanations.`;

      try {
        const response = await retryWithBackoff(async () => {
          return await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: text,
            config: {
              systemInstruction,
              temperature: 0.1,
            }
          });
        }, 3, 1000);

        return res.json({ translatedText: response.text });
      } catch (err: any) {
        console.error("Gemini text translation failed (falling back to offline):", err);
        return res.json({ translatedText: offlineTranslateText(text, targetLanguage) });
      }
    } else {
      return res.status(400).json({ error: "Either text or texts is required" });
    }
  } catch (error: any) {
    console.error("Translation API Critical Error:", error);
    // Ultimate fallback: return original text/texts rather than crashing or returning 500
    if (texts && Array.isArray(texts)) {
      return res.json({ translatedTexts: texts.map(t => offlineTranslateText(t, targetLanguage)) });
    }
    return res.json({ translatedText: offlineTranslateText(text || "", targetLanguage) });
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
