import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, MapPin, Route, Sparkles, BookOpen, Shield, User, 
  Heart, Star, Sun, Moon, Menu, X, ArrowUp, Send, CheckCircle2 
} from "lucide-react";
import HomeView from "./components/HomeView";
import ProvincesView from "./components/ProvincesView";
import SpotsView from "./components/SpotsView";
import MapView from "./components/MapView";
import PlannerView from "./components/PlannerView";
import CultureView from "./components/CultureView";
import BlogView from "./components/BlogView";
import AccountView from "./components/AccountView";
import GlobalAssistant from "./components/GlobalAssistant";
import { TOURIST_SPOTS, PROVINCES, EVENTS, BLOG_POSTS, RECIPES, CULTURE_TOPICS } from "./data";
import { TouristSpot, BlogPost, Recipe, EventItem } from "./types";
import { 
  UserSession, getActiveUser, logUserActivity, getSavedPlanner, savePlannerToDb 
} from "./lib/authService.ts";

// i18n Dictionaries
const TRANSLATIONS: Record<string, Record<string, string>> = {
  pt: {
    title: "Descubra Angola",
    subtitle: "Explore a terra dos ritmos, cores e belezas infinitas",
    hero_title: "Descubra Angola",
    hero_subtitle: "Descubra as culturas,Comidas e espacos famosos de Angola.",
    nav_home: "Início",
    nav_provinces: "Províncias",
    nav_map: "Mapa",
    nav_planner: "Planeador",
    nav_culture: "Cultura",
    nav_blog: "Blog",
    nav_admin: "Admin",
    nav_account: "Perfil",
    footer_desc: "O portal turístico oficial para explorar as maravilhas naturais, históricas e gastronómicas de Angola.",
    newsletter_title: "Subscreva a nossa Newsletter",
    newsletter_placeholder: "Seu endereço de email...",
    newsletter_btn: "Inscrever",
    copyright: "© 2026 Descubra Angola. Todos os direitos reservados. Promovendo o turismo nacional.",
    quick_links: "Links Rápidos",
    contacts: "Contactos",
    search: "Pesquisar",
  },
  en: {
    title: "Discover Angola",
    subtitle: "Explore the land of rhythms, colors, and infinite beauties",
    nav_home: "Home",
    nav_provinces: "Provinces",
    nav_map: "Map",
    nav_planner: "Planner",
    nav_culture: "Culture",
    nav_blog: "Blog",
    nav_admin: "Admin",
    nav_account: "Profile",
    footer_desc: "The official tourist portal to explore the natural, historical, and gastronomic wonders of Angola.",
    newsletter_title: "Subscribe to our Newsletter",
    newsletter_placeholder: "Your email address...",
    newsletter_btn: "Subscribe",
    copyright: "© 2026 Discover Angola. All rights reserved. Promoting national tourism.",
    quick_links: "Quick Links",
    contacts: "Contacts",
    search: "Search",
  },
  fr: {
    title: "Découvrez l'Angola",
    subtitle: "Explorez la terre des rythmes, des couleurs et des beautés infinies",
    nav_home: "Accueil",
    nav_provinces: "Provinces",
    nav_map: "Carte",
    nav_planner: "Planificateur",
    nav_culture: "Culture",
    nav_blog: "Blog",
    nav_admin: "Admin",
    nav_account: "Profil",
    footer_desc: "Le portail touristique officiel pour explorer les merveilles naturelles, historiques et gastronomiques de l'Angola.",
    newsletter_title: "Inscrivez-vous à notre Newsletter",
    newsletter_placeholder: "Votre adresse e-mail...",
    newsletter_btn: "S'abonner",
    copyright: "© 2026 Découvrez l'Angola. Tous droits réservés. Promotion du tourisme national.",
    quick_links: "Liens Rapides",
    contacts: "Contacts",
    search: "Rechercher",
  },
  es: {
    title: "Descubre Angola",
    subtitle: "Explora la tierra de los ritmos, colores y bellezas infinitas",
    nav_home: "Inicio",
    nav_provinces: "Provincias",
    nav_map: "Mapa",
    nav_planner: "Planificador",
    nav_culture: "Cultura",
    nav_blog: "Blog",
    nav_admin: "Admin",
    nav_account: "Perfil",
    footer_desc: "El portal turístico oficial para explorar las maravilhas naturales, históricas y gastronómicas de Angola.",
    newsletter_title: "Suscríbete a nuestro Boletín",
    newsletter_placeholder: "Su correo electrónico...",
    newsletter_btn: "Suscribirse",
    copyright: "© 2026 Descubre Angola. Todos os direitos reservados. Promovendo o turismo nacional.",
    quick_links: "Enlaces Rápidos",
    contacts: "Contactos",
    search: "Buscar",
  }
};

// ==========================================
// DATASET TRANSLATION HELPERS
// ==========================================
async function translateProvinces(provinces: any[], lang: string): Promise<any[]> {
  try {
    const textsToTranslate: string[] = [];
    provinces.forEach(p => {
      textsToTranslate.push(p.history || "");
      textsToTranslate.push(p.location || "");
      textsToTranslate.push(p.population || "");
      textsToTranslate.push(p.climate || "");
      textsToTranslate.push(p.culture || "");
      textsToTranslate.push(p.gastronomy || "");
      textsToTranslate.push(p.bestSeason || "");
      p.curiosities?.forEach((c: string) => textsToTranslate.push(c));
      p.restaurants?.forEach((r: any) => textsToTranslate.push(r.specialty));
      p.transport?.forEach((t: string) => textsToTranslate.push(t));
    });

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: lang })
    });
    const data = await res.json();
    const translated = data.translatedTexts || textsToTranslate;

    let index = 0;
    return provinces.map(p => {
      const history = translated[index++] || p.history;
      const location = translated[index++] || p.location;
      const population = translated[index++] || p.population;
      const climate = translated[index++] || p.climate;
      const culture = translated[index++] || p.culture;
      const gastronomy = translated[index++] || p.gastronomy;
      const bestSeason = translated[index++] || p.bestSeason;
      const curiosities = p.curiosities?.map(() => translated[index++] || "") || [];
      const restaurants = p.restaurants?.map((r: any) => ({ ...r, specialty: translated[index++] || r.specialty })) || [];
      const transport = p.transport?.map(() => translated[index++] || "") || [];
      return { ...p, history, location, population, climate, culture, gastronomy, bestSeason, curiosities, restaurants, transport };
    });
  } catch (err) {
    console.error("translateProvinces error:", err);
    return provinces;
  }
}

async function translateSpots(spots: TouristSpot[], lang: string): Promise<TouristSpot[]> {
  try {
    const textsToTranslate: string[] = [];
    spots.forEach(s => {
      textsToTranslate.push(s.description || "");
      if (s.history) textsToTranslate.push(s.history);
      textsToTranslate.push(s.price || "");
      textsToTranslate.push(s.hours || "");
      textsToTranslate.push(s.bestSeason || "");
      textsToTranslate.push(s.visitDuration || "");
      textsToTranslate.push(s.difficulty || "");
      s.curiosities?.forEach(c => textsToTranslate.push(c));
      s.whatToBring?.forEach(w => textsToTranslate.push(w));
      s.oQueFazer?.forEach(q => textsToTranslate.push(q));
    });

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: lang })
    });
    const data = await res.json();
    const translated = data.translatedTexts || textsToTranslate;

    let index = 0;
    return spots.map(s => {
      const description = translated[index++] || s.description;
      const history = s.history ? (translated[index++] || s.history) : s.history;
      const price = translated[index++] || s.price;
      const hours = translated[index++] || s.hours;
      const bestSeason = translated[index++] || s.bestSeason;
      const visitDuration = translated[index++] || s.visitDuration;
      const difficulty = translated[index++] || s.difficulty;
      const curiosities = s.curiosities?.map(() => translated[index++] || "") || [];
      const whatToBring = s.whatToBring?.map(() => translated[index++] || "") || [];
      const oQueFazer = s.oQueFazer?.map(() => translated[index++] || "") || [];
      return { ...s, description, history, price, hours, bestSeason, visitDuration, difficulty, curiosities, whatToBring, oQueFazer };
    });
  } catch (err) {
    console.error("translateSpots error:", err);
    return spots;
  }
}

async function translateBlogPosts(posts: BlogPost[], lang: string): Promise<BlogPost[]> {
  try {
    const textsToTranslate: string[] = [];
    posts.forEach(p => {
      textsToTranslate.push(p.title || "");
      textsToTranslate.push(p.category || "");
      textsToTranslate.push(p.snippet || "");
      textsToTranslate.push(p.content || "");
      textsToTranslate.push(p.readTime || "");
    });

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: lang })
    });
    const data = await res.json();
    const translated = data.translatedTexts || textsToTranslate;

    let index = 0;
    return posts.map(p => {
      const title = translated[index++] || p.title;
      const category = translated[index++] || p.category;
      const snippet = translated[index++] || p.snippet;
      const content = translated[index++] || p.content;
      const readTime = translated[index++] || p.readTime;
      return { ...p, title, category, snippet, content, readTime };
    });
  } catch (err) {
    console.error("translateBlogPosts error:", err);
    return posts;
  }
}

async function translateRecipes(recipes: Recipe[], lang: string): Promise<Recipe[]> {
  try {
    const textsToTranslate: string[] = [];
    recipes.forEach(r => {
      textsToTranslate.push(r.name || "");
      textsToTranslate.push(r.history || "");
      textsToTranslate.push(r.duration || "");
      r.ingredients?.forEach(i => textsToTranslate.push(i));
      r.recipe?.forEach(s => textsToTranslate.push(s));
    });

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: lang })
    });
    const data = await res.json();
    const translated = data.translatedTexts || textsToTranslate;

    let index = 0;
    return recipes.map(r => {
      const name = translated[index++] || r.name;
      const history = translated[index++] || r.history;
      const duration = translated[index++] || r.duration;
      const ingredients = r.ingredients?.map(() => translated[index++] || "") || [];
      const recipe = r.recipe?.map(() => translated[index++] || "") || [];
      return { ...r, name, history, duration, ingredients, recipe };
    });
  } catch (err) {
    console.error("translateRecipes error:", err);
    return recipes;
  }
}

async function translateEvents(events: EventItem[], lang: string): Promise<EventItem[]> {
  try {
    const textsToTranslate: string[] = [];
    events.forEach(e => {
      textsToTranslate.push(e.name || "");
      textsToTranslate.push(e.location || "");
      textsToTranslate.push(e.description || "");
      textsToTranslate.push(e.category || "");
    });

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: lang })
    });
    const data = await res.json();
    const translated = data.translatedTexts || textsToTranslate;

    let index = 0;
    return events.map(e => {
      const name = translated[index++] || e.name;
      const location = translated[index++] || e.location;
      const description = translated[index++] || e.description;
      const category = translated[index++] || e.category;
      return { ...e, name, location, description, category };
    });
  } catch (err) {
    console.error("translateEvents error:", err);
    return events;
  }
}

async function translateCultureTopics(topics: any, lang: string): Promise<any> {
  try {
    const textsToTranslate: string[] = [];
    const keys = ["dances", "masks", "languages", "instruments"];
    keys.forEach(k => {
      topics[k]?.forEach((item: any) => {
        textsToTranslate.push(item.name || "");
        textsToTranslate.push(item.desc || "");
      });
    });

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, targetLanguage: lang })
    });
    const data = await res.json();
    const translated = data.translatedTexts || textsToTranslate;

    let index = 0;
    const result: any = {};
    keys.forEach(k => {
      result[k] = topics[k]?.map((item: any) => {
        const name = translated[index++] || item.name;
        const desc = translated[index++] || item.desc;
        return { ...item, name, desc };
      }) || [];
    });
    return result;
  } catch (err) {
    console.error("translateCultureTopics error:", err);
    return topics;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  // States managed in App to allow global cross-interaction
  const [dbSpots, setDbSpots] = useState<TouristSpot[]>(TOURIST_SPOTS);
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>(["kalandula", "serra-leba"]);
  const [plannedSpots, setPlannedSpots] = useState<{ provinceId: string; spotId: string }[]>([]);

  // Lifted trip setup states for easy cloud-sync
  const [tripDays, setTripDays] = useState<number>(3);
  const [transportMode, setTransportMode] = useState<"car" | "bus" | "plane" | "train">("car");

  // User State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(getActiveUser());

  // UI preferences
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });
  const language = "pt";
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  
  // Global Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translation dataset states
  const [translatedProvinces, setTranslatedProvinces] = useState<any[]>(PROVINCES);
  const [translatedSpots, setTranslatedSpots] = useState<TouristSpot[]>(TOURIST_SPOTS);
  const [translatedRecipes, setTranslatedRecipes] = useState<any[]>(RECIPES);
  const [translatedBlogPosts, setTranslatedBlogPosts] = useState<any[]>(BLOG_POSTS);
  const [translatedEvents, setTranslatedEvents] = useState<any[]>(EVENTS);
  const [translatedCultureTopics, setTranslatedCultureTopics] = useState<any>(CULTURE_TOPICS);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Dynamic on-the-fly custom translations cache (for generic hardcoded strings in components)
  const [customTranslations, setCustomTranslations] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem("custom_translations");
      return saved ? JSON.parse(saved) : { en: {}, fr: {}, es: {}, pt: {} };
    } catch {
      return { en: {}, fr: {}, es: {}, pt: {} };
    }
  });

  const pendingTranslationsRef = useRef<Set<string>>(new Set());
  const translationTimeoutRef = useRef<any>(null);

  const queueTranslation = useCallback((text: string, targetLang: string) => {
    if (targetLang === "pt" || !text) return;
    if (customTranslations[targetLang]?.[text]) return;
    if (pendingTranslationsRef.current.has(text)) return;

    pendingTranslationsRef.current.add(text);

    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    translationTimeoutRef.current = setTimeout(async () => {
      const list = Array.from(pendingTranslationsRef.current) as string[];
      pendingTranslationsRef.current.clear();
      if (list.length === 0) return;

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: list, targetLanguage: targetLang })
        });
        const data = await res.json();
        const translated = data.translatedTexts;
        if (translated && Array.isArray(translated)) {
          setCustomTranslations(prev => {
            const nextLang = { ...prev[targetLang] };
            list.forEach((orig, idx) => {
              if (translated[idx]) {
                nextLang[orig] = translated[idx];
              }
            });
            const updated = { ...prev, [targetLang]: nextLang };
            localStorage.setItem("custom_translations", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.error("Failed to translate batch", err);
      }
    }, 400);
  }, [customTranslations]);
  
  // High-fidelity Translation helper
  const translate = useCallback((key: string) => {
    if (!key) return "";

    // 1. Check in static translation dictionaries
    if (TRANSLATIONS[language]?.[key]) {
      return TRANSLATIONS[language][key];
    }

    if (language === "pt") return key;

    // Try finding key by its Portuguese value in TRANSLATIONS pt
    const foundKey = Object.keys(TRANSLATIONS["pt"]).find(k => TRANSLATIONS["pt"][k] === key);
    if (foundKey && TRANSLATIONS[language]?.[foundKey]) {
      return TRANSLATIONS[language][foundKey];
    }

    // 2. Check in dynamic translations cache
    if (customTranslations[language]?.[key]) {
      return customTranslations[language][key];
    }

    // 3. Queue for translation
    queueTranslation(key, language);
    return key;
  }, [language, customTranslations, queueTranslation]);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };
  
  // Dark Mode side effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    } catch (e) {
      console.warn(e);
    }
  }, [isDarkMode]);

  // Language side effects and dynamic dataset translation
  useEffect(() => {
    try {
      localStorage.setItem("language", language);
    } catch (e) {
      console.warn(e);
    }

    if (language === "pt") {
      setTranslatedProvinces(PROVINCES);
      setTranslatedSpots(dbSpots);
      setTranslatedRecipes(RECIPES);
      setTranslatedBlogPosts(BLOG_POSTS);
      setTranslatedEvents(EVENTS);
      setTranslatedCultureTopics(CULTURE_TOPICS);
      return;
    }

    const cacheKey = `translated_data_${language}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setTranslatedProvinces(parsed.provinces);
        setTranslatedSpots(parsed.spots);
        setTranslatedRecipes(parsed.recipes);
        setTranslatedBlogPosts(parsed.blogPosts);
        setTranslatedEvents(parsed.events);
        setTranslatedCultureTopics(parsed.cultureTopics);
        return;
      }
    } catch (e) {
      console.warn("Failed to load cached translation", e);
    }

    // Translate datasets in background sequentially with short delay to respect Gemini API rate limits
    const translateAllDatasets = async () => {
      setIsTranslating(true);
      try {
        const provs = await translateProvinces(PROVINCES, language);
        await new Promise(resolve => setTimeout(resolve, 300));
        const sps = await translateSpots(dbSpots, language);
        await new Promise(resolve => setTimeout(resolve, 300));
        const recs = await translateRecipes(RECIPES, language);
        await new Promise(resolve => setTimeout(resolve, 300));
        const posts = await translateBlogPosts(BLOG_POSTS, language);
        await new Promise(resolve => setTimeout(resolve, 300));
        const evs = await translateEvents(EVENTS, language);
        await new Promise(resolve => setTimeout(resolve, 300));
        const topics = await translateCultureTopics(CULTURE_TOPICS, language);

        setTranslatedProvinces(provs);
        setTranslatedSpots(sps);
        setTranslatedRecipes(recs);
        setTranslatedBlogPosts(posts);
        setTranslatedEvents(evs);
        setTranslatedCultureTopics(topics);

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          provinces: provs,
          spots: sps,
          recipes: recs,
          blogPosts: posts,
          events: evs,
          cultureTopics: topics
        }));
      } catch (err) {
        console.error("Dynamic translation error", err);
      } finally {
        setIsTranslating(false);
      }
    };

    translateAllDatasets();
  }, [language, dbSpots]);

  // Scroll to top detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Load travel plan from database on mount or user switch
  useEffect(() => {
    if (!currentUser) {
      setPlannedSpots([]);
      return;
    }
    const loadSavedPlan = async () => {
      try {
        const saved = await getSavedPlanner(currentUser);
        if (saved) {
          setPlannedSpots(saved.spots || []);
          setTripDays(saved.tripDays || 3);
          setTransportMode(saved.transportMode || "car");
        } else {
          setPlannedSpots([]);
        }
      } catch (err) {
        console.warn("Could not load planner from Cloud SQL", err);
      }
    };
    loadSavedPlan();
  }, [currentUser]);

  // 2. Auto-sync travel planner to Cloud SQL on any change
  useEffect(() => {
    if (!currentUser) return;
    const syncPlanner = async () => {
      try {
        await savePlannerToDb(currentUser, plannedSpots, tripDays, transportMode);
      } catch (err) {
        console.warn("Failed to automatically sync travel plan to cloud database:", err);
      }
    };

    const timeout = setTimeout(syncPlanner, 800); // Debounce
    return () => clearTimeout(timeout);
  }, [plannedSpots, tripDays, transportMode, currentUser]);

  // 3. Log user activity automatically on page navigation
  useEffect(() => {
    if (!currentUser) return;
    let description = "";
    if (selectedSpotId) {
      const spot = dbSpots.find((s) => s.id === selectedSpotId);
      description = `Visualizou o ponto turístico: ${spot ? spot.name : selectedSpotId}`;
    } else if (selectedProvinceId && currentView === "provinces") {
      const province = PROVINCES.find((p) => p.id === selectedProvinceId);
      description = `Visualizou a província: ${province ? province.name : selectedProvinceId}`;
    } else {
      const viewNames: Record<string, string> = {
        home: "Página Inicial",
        provinces: "Secção de Províncias",
        map: "Mapa Interativo",
        planner: "Planeador de Viagem",
        culture: "Secção Cultural",
        blog: "Blogue de Viagens",
        account: "Perfil do Utilizador",
        admin: "Painel de Administração",
      };
      description = `Navegou para: ${viewNames[currentView] || currentView}`;
    }

    logUserActivity(currentUser, "view_page", description);
  }, [currentView, selectedSpotId, selectedProvinceId, currentUser]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteSpots((prev) => {
      const exists = prev.includes(id);
      const spot = dbSpots.find((s) => s.id === id);
      const spotName = spot ? spot.name : id;
      
      if (exists) {
        showToast("Removido dos favoritos.");
        if (currentUser) {
          logUserActivity(currentUser, "remove_favorite", `Removeu o destino ${spotName} dos favoritos`);
        }
        return prev.filter((item) => item !== id);
      } else {
        showToast("Adicionado aos seus favoritos!");
        if (currentUser) {
          logUserActivity(currentUser, "add_favorite", `Adicionou o destino ${spotName} aos favoritos`);
        }
        return [...prev, id];
      }
    });
  };

  const handleAddSpotToPlanner = (provinceId: string, spotId: string) => {
    if (!currentUser) {
      showToast("Por favor, crie uma conta ou inicie sessão para usar o Planeador!");
      setCurrentView("account");
      return;
    }
    setPlannedSpots((prev) => {
      const exists = prev.some((item) => item.spotId === spotId);
      if (exists) {
        showToast("Este destino já está no seu roteiro!");
        return prev;
      }
      showToast("Destino adicionado ao seu roteiro de viagem!");
      
      const spot = dbSpots.find((s) => s.id === spotId);
      const spotName = spot ? spot.name : spotId;
      logUserActivity(currentUser, "add_planner", `Adicionou ${spotName} ao planeador de viagem`);
      
      return [...prev, { provinceId, spotId }];
    });
  };

  const handleRemoveFromPlanner = (spotId: string) => {
    if (!currentUser) return;
    setPlannedSpots((prev) => prev.filter((item) => item.spotId !== spotId));
    showToast("Destino removido do roteiro.");
    
    const spot = dbSpots.find((s) => s.id === spotId);
    const spotName = spot ? spot.name : spotId;
    logUserActivity(currentUser, "remove_planner", `Removeu ${spotName} do planeador de viagem`);
  };

  // Database actions from Admin
  const handleAddSpotToDatabase = (newSpot: TouristSpot) => {
    setDbSpots((prev) => [newSpot, ...prev]);
  };

  const handleDeleteSpotFromDatabase = (spotId: string) => {
    setDbSpots((prev) => prev.filter((s) => s.id !== spotId));
    // also remove from favorite & planner if exist
    setFavoriteSpots((prev) => prev.filter((id) => id !== spotId));
    setPlannedSpots((prev) => prev.filter((item) => item.spotId !== spotId));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
    showToast("Subscrição concluída! Obrigado.");
  };

  // Render view router helper
  const renderView = () => {
    if (selectedSpotId) {
      return (
        <SpotsView
          spotId={selectedSpotId}
          onBack={() => setSelectedSpotId(null)}
          translate={translate}
          favoriteSpots={favoriteSpots}
          onToggleFavorite={handleToggleFavorite}
          onAddCommentToast={showToast}
          onAddSpotToPlanner={handleAddSpotToPlanner}
          spots={translatedSpots}
          currentUser={currentUser}
          onNavigateToAuth={() => setCurrentView("account")}
        />
      );
    }

    switch (currentView) {
      case "home":
        return (
          <HomeView
            onNavigate={(view, targetId) => {
              if (view === "spot" && targetId) {
                setSelectedSpotId(targetId);
              } else if (view === "province" && targetId) {
                setCurrentView("provinces");
                setSelectedProvinceId(targetId);
              } else {
                setCurrentView(view);
                setSelectedProvinceId(null);
                setSelectedSpotId(null);
              }
            }}
            onSearch={(term) => {
              const termLower = term.toLowerCase();
              // Try to find matching spot
              const matchedSpot = translatedSpots.find((s) => s.name.toLowerCase().includes(termLower));
              if (matchedSpot) {
                setSelectedSpotId(matchedSpot.id);
                showToast(`Destino "${matchedSpot.name}" encontrado!`);
                return;
              }
              // Try to find matching province
              const matchedProvince = translatedProvinces.find((p) => p.name.toLowerCase().includes(termLower));
              if (matchedProvince) {
                setCurrentView("provinces");
                setSelectedProvinceId(matchedProvince.id);
                showToast(`Província de "${matchedProvince.name}" encontrada!`);
                return;
              }
              showToast(`A pesquisar por "${term}". Veja as opções disponíveis.`);
              setCurrentView("provinces");
            }}
            favoriteSpots={favoriteSpots}
            onToggleFavorite={handleToggleFavorite}
            translate={translate}
            isDarkMode={isDarkMode}
            spots={translatedSpots}
          />
        );
      case "provinces":
        return (
          <ProvincesView
            selectedProvinceId={selectedProvinceId}
            onSelectProvince={setSelectedProvinceId}
            onNavigateToSpot={setSelectedSpotId}
            translate={translate}
            isDarkMode={isDarkMode}
            onAddCommentToast={showToast}
            spots={translatedSpots}
            provinces={translatedProvinces}
          />
        );
      case "map":
        return (
          <MapView
            onNavigateToSpot={setSelectedSpotId}
            translate={translate}
            isDarkMode={isDarkMode}
            onAddSpotToPlanner={handleAddSpotToPlanner}
            spots={translatedSpots}
          />
        );
      case "planner":
        return (
          <PlannerView
            plannedSpots={plannedSpots}
            onRemoveFromPlanner={handleRemoveFromPlanner}
            onAddSpotToPlanner={handleAddSpotToPlanner}
            translate={translate}
            isDarkMode={isDarkMode}
            onAddCommentToast={showToast}
            spots={translatedSpots}
            currentUser={currentUser}
            onNavigateToAuth={() => setCurrentView("account")}
            tripDays={tripDays}
            setTripDays={setTripDays}
            transportMode={transportMode}
            setTransportMode={setTransportMode}
          />
        );
      case "culture":
        return (
          <CultureView
            translate={translate}
            isDarkMode={isDarkMode}
            onAddCommentToast={showToast}
            recipes={translatedRecipes}
            cultureTopics={translatedCultureTopics}
          />
        );
      case "blog":
        return (
          <BlogView
            translate={translate}
            isDarkMode={isDarkMode}
            onAddCommentToast={showToast}
            blogPosts={translatedBlogPosts}
          />
        );
      case "account":
        return (
          <AccountView
            favoriteSpots={favoriteSpots}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToSpot={setSelectedSpotId}
            translate={translate}
            isDarkMode={isDarkMode}
            onAddCommentToast={showToast}
            spots={translatedSpots}
            currentUser={currentUser}
            onAuthChange={(session) => {
              setCurrentUser(session);
              if (session) {
                showToast(`Sessão iniciada como ${session.username}!`);
              }
            }}
          />
        );
      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-100 flex flex-col justify-between font-sans transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo brand */}
          <button
            onClick={() => {
              setCurrentView("home");
              setSelectedProvinceId(null);
              setSelectedSpotId(null);
            }}
            className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 bg-brand-red flex items-center justify-center font-black text-lg rounded-md text-white shadow-md group-hover:rotate-6 transition duration-200">
              A
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-brand-dark dark:text-white uppercase flex items-center gap-1 leading-none">
                <span>Descubra</span>
                <span className="text-brand-yellow">Angola</span>
              </span>
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-widest mt-0.5">{translate("subtitle").substring(0, 36)}...</span>
            </div>
          </button>

          {/* Desktop Navigation Link row */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: "home", label: "nav_home", icon: Compass },
              { id: "provinces", label: "nav_provinces", icon: MapPin },
              { id: "map", label: "nav_map", icon: MapPin },
              { id: "planner", label: "nav_planner", icon: Route },
              { id: "culture", label: "nav_culture", icon: Sparkles },
              { id: "blog", label: "nav_blog", icon: BookOpen },
              { id: "account", label: "nav_account", icon: User },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id && !selectedSpotId;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id);
                    setSelectedProvinceId(null);
                    setSelectedSpotId(null);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? "bg-brand-red text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-gray-50 dark:hover:bg-brand-dark/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{translate(link.label)}</span>
                </button>
              );
            })}
          </nav>

          {/* Preferences bar (Theme, Hamburguer) */}
          <div className="flex items-center gap-2">
            
            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-xl transition cursor-pointer text-gray-500"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-850 border border-gray-100 dark:border-gray-850 rounded-xl transition cursor-pointer text-gray-700 dark:text-gray-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 print:hidden overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {[
                { id: "home", label: "nav_home", icon: Compass },
                { id: "provinces", label: "nav_provinces", icon: MapPin },
                { id: "map", label: "nav_map", icon: MapPin },
                { id: "planner", label: "nav_planner", icon: Route },
                { id: "culture", label: "nav_culture", icon: Sparkles },
                { id: "blog", label: "nav_blog", icon: BookOpen },
                { id: "account", label: "nav_account", icon: User },
              ].map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id && !selectedSpotId;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentView(link.id);
                      setSelectedProvinceId(null);
                      setSelectedSpotId(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer text-left uppercase tracking-wider ${
                      isActive
                        ? "bg-brand-red text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{translate(link.label)}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL VIEW CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        {renderView()}
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-gray-850 py-12 md:py-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Intro Column */}
            <div className="space-y-4">
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                DESCUBRA <span className="text-brand-yellow">ANGOLA</span>
              </span>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {translate("footer_desc")}
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{translate("quick_links")}</h4>
              <ul className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <li><button onClick={() => setCurrentView("provinces")} className="hover:text-brand-red cursor-pointer transition">Ver as 18 Províncias</button></li>
                <li><button onClick={() => setCurrentView("map")} className="hover:text-brand-red cursor-pointer transition">Mapa do Território</button></li>
                <li><button onClick={() => setCurrentView("culture")} className="hover:text-brand-red cursor-pointer transition">Cultura e Gastronomia</button></li>
                <li><button onClick={() => setCurrentView("blog")} className="hover:text-brand-red cursor-pointer transition">Artigos e Dicas</button></li>
              </ul>
            </div>

            {/* Contacts Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{translate("contacts")}</h4>
              <p className="text-xs text-gray-500 font-sans">
                Email: info@descubraangola.ao<br />
                Linha de Apoio: +244 923 000 000<br />
                Ministério do Turismo de Angola
              </p>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{translate("newsletter_title")}</h4>
              
              {!newsletterSubscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 bg-gray-50 dark:bg-brand-dark/80 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
                  <input
                    type="email"
                    required
                    placeholder={translate("newsletter_placeholder")}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-transparent px-3 text-xs text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Subscrição concluída com sucesso!</span>
                </div>
              )}
            </div>
          </div>

          {/* Copyrights */}
          <div className="border-t border-gray-100 dark:border-gray-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <span>{translate("copyright")}</span>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Termos de Uso</span>
              <span className="hover:underline cursor-pointer">Políticas</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOAT SCROLL TO TOP */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-brand-red hover:bg-brand-red-hover text-white rounded-full shadow-xl z-50 transition cursor-pointer flex items-center justify-center animate-fade-in"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* GLOBAL AI TRAVEL ASSISTANT WIDGET */}
      <GlobalAssistant />

      {/* GLOBAL TOAST BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-8 bg-brand-dark text-white border border-gray-800 rounded-2xl p-4 shadow-2xl z-50 flex items-center gap-2.5 max-w-sm"
          >
            <div className="w-5 h-5 bg-brand-red rounded-full flex items-center justify-center text-xs flex-shrink-0 text-white font-bold">
              ✓
            </div>
            <p className="text-xs font-semibold font-sans">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
