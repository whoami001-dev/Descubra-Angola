import { auth, googleAuthProvider } from "./firebase.ts";
import { signInWithPopup, signOut as fbSignOut } from "firebase/auth";

export interface UserSession {
  id?: number;
  uid: string;
  email: string;
  username: string;
  token: string;
  isCustom: boolean;
}

// LocalStorage Keys
const ACTIVE_USER_KEY = "descubra_angola_active_user";
const SAVED_ACCOUNTS_KEY = "descubra_angola_saved_accounts";

// Get active user from localStorage
export function getActiveUser(): UserSession | null {
  const data = localStorage.getItem(ACTIVE_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

// Set active user in localStorage
export function setActiveUser(session: UserSession | null) {
  if (session) {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(session));
    // Also add to saved accounts list
    addSavedAccount(session);
  } else {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

// Get all saved accounts
export function getSavedAccounts(): UserSession[] {
  const data = localStorage.getItem(SAVED_ACCOUNTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Add an account to the saved accounts list (FB / TikTok style)
export function addSavedAccount(session: UserSession) {
  const accounts = getSavedAccounts();
  const filtered = accounts.filter((acc) => acc.email !== session.email);
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify([session, ...filtered]));
}

// Remove an account from saved accounts
export function removeSavedAccount(email: string) {
  const accounts = getSavedAccounts();
  const filtered = accounts.filter((acc) => acc.email !== email);
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(filtered));
}

// Custom Email/Password Sign Up
export async function registerCustomUser(email: string, username: string, password: string): Promise<UserSession> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar conta.");
  }

  const session: UserSession = {
    id: data.user.id,
    uid: data.user.uid,
    email: data.user.email,
    username: data.user.username,
    token: data.token,
    isCustom: true,
  };

  setActiveUser(session);
  return session;
}

// Custom Email/Password Sign In
export async function loginCustomUser(email: string, password: string): Promise<UserSession> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao iniciar sessão.");
  }

  const session: UserSession = {
    id: data.user.id,
    uid: data.user.uid,
    email: data.user.email,
    username: data.user.username,
    token: data.token,
    isCustom: true,
  };

  setActiveUser(session);
  return session;
}

// Google Authentication via Firebase Auth
export async function loginWithGoogle(): Promise<UserSession> {
  // 1. Popup Sign In
  const result = await signInWithPopup(auth, googleAuthProvider);
  const idToken = await result.user.getIdToken();

  // 2. Synchronize with our Cloud SQL server
  const response = await fetch("/api/auth/firebase-sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao sincronizar com o banco de dados.");
  }

  const session: UserSession = {
    id: data.user.id,
    uid: data.user.uid,
    email: data.user.email,
    username: data.user.username,
    token: idToken,
    isCustom: false,
  };

  setActiveUser(session);
  return session;
}

// Log out of the current session
export async function logoutUser(session: UserSession | null) {
  if (session) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
    } catch (e) {
      console.warn("Could not log logout event to server");
    }
  }

  // If Firebase session, sign out
  if (session && !session.isCustom) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn("Could not sign out of Firebase Auth");
    }
  }

  setActiveUser(null);
}

// Log a custom activity to the backend database
export async function logUserActivity(session: UserSession | null, activityType: string, description: string) {
  if (!session) return;
  try {
    await fetch("/api/user/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ activityType, description }),
    });
  } catch (e) {
    console.warn("Failed to log activity to Cloud SQL database", e);
  }
}

// Fetch activities list for the active user
export async function getUserActivities(session: UserSession): Promise<any[]> {
  const response = await fetch("/api/user/activities", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao carregar o histórico.");
  }
  return data;
}

// Fetch saved travel plan from PostgreSQL
export async function getSavedPlanner(session: UserSession): Promise<any> {
  const response = await fetch("/api/user/planner", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

// Save travel plan to PostgreSQL
export async function savePlannerToDb(session: UserSession, spots: any[], tripDays: number, transportMode: string) {
  const response = await fetch("/api/user/planner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ spots, tripDays, transportMode }),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar roteiro no banco de dados.");
  }
  return response.json();
}
