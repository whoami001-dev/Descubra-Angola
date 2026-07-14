import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Heart, Compass, Shield, LogIn, Award, MapPin, CheckCircle, 
  HelpCircle, ChevronDown, ChevronUp, Lock, RefreshCw, Star, Info, 
  Globe, LogOut, Trash2, Calendar, FileText, UserPlus
} from "lucide-react";
import { TOURIST_SPOTS, PROVINCES } from "../data";
import { TouristSpot } from "../types";
import { 
  UserSession, registerCustomUser, loginCustomUser, loginWithGoogle, 
  logoutUser, getSavedAccounts, removeSavedAccount, getUserActivities,
  logUserActivity
} from "../lib/authService.ts";

interface AccountViewProps {
  favoriteSpots: string[];
  onToggleFavorite: (id: string) => void;
  onNavigateToSpot: (spotId: string) => void;
  translate: (key: string) => string;
  isDarkMode: boolean;
  onAddCommentToast: (msg: string) => void;
  spots: TouristSpot[];
  currentUser: UserSession | null;
  onAuthChange: (session: UserSession | null) => void;
}

const FAQ_ITEMS = [
  { q: "Quais os requisitos para obter o visto de turismo para Angola?", a: "Vários países (incluindo Portugal, Brasil e estados da UE) gozam agora de isenção de visto para estadias curtas de até 30 dias por entrada (limite de 90 dias por ano). Para outros países, o visto de turismo pode ser solicitado online através do portal oficial de migração (SME) ou nos consulados." },
  { q: "Quais as vacinas recomendadas antes de viajar?", a: "A vacina contra a Febre Amarela é obrigatória e o certificado internacional de vacinação será exigido à entrada no aeroporto de Luanda. Recomenda-se também profilaxia para a Malária e cuidados gerais com água engarrafada." },
  { q: "Qual é a moeda oficial e como funcionam os pagamentos?", a: "A moeda oficial é o Kwanza (AOA). Embora cartões de crédito internacionais sejam aceites nos grandes hotéis de Luanda, é altamente recomendável carregar Kwanzas em numerário (dinheiro físico) para despesas no interior das províncias, portagens e mercados locais." },
  { q: "Qual a melhor época do ano para visitar Angola?", a: "A época do Cacimbo (de Maio a Outubro) é considerada a melhor altura para visitar, pois as temperaturas são mais frescas, o clima é seco e há pouca chuva, facilitando o trânsito por estradas e trilhas rústicas." }
];

export default function AccountView({
  favoriteSpots,
  onToggleFavorite,
  onNavigateToSpot,
  translate,
  isDarkMode,
  onAddCommentToast,
  spots,
  currentUser,
  onAuthChange,
}: AccountViewProps) {
  // Authentication states
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Saved accounts list (Facebook/TikTok account switcher style)
  const [savedAccounts, setSavedAccounts] = useState<UserSession[]>([]);

  // User activities timeline
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Visited tracking (Gamification)
  const [visitedProvinces, setVisitedProvinces] = useState<string[]>(["luanda", "huila"]);

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Load saved accounts on mount
  useEffect(() => {
    setSavedAccounts(getSavedAccounts());
  }, [currentUser]);

  // Load activities from Cloud SQL on login
  useEffect(() => {
    if (!currentUser) {
      setActivities([]);
      return;
    }
    const loadActivities = async () => {
      setLoadingActivities(true);
      try {
        const data = await getUserActivities(currentUser);
        setActivities(data);
      } catch (err: any) {
        console.error("Error loading activities from database:", err);
      } finally {
        setLoadingActivities(false);
      }
    };
    loadActivities();
  }, [currentUser]);

  const toggleProvinceVisited = (id: string) => {
    setVisitedProvinces((prev) => {
      const isVisited = prev.includes(id);
      const provName = PROVINCES.find(p => p.id === id)?.name || id;
      const next = isVisited ? prev.filter((p) => p !== id) : [...prev, id];
      
      onAddCommentToast(isVisited ? "Província desmarcada." : `Explorou ${provName}!`);
      
      // Log activity in background
      if (currentUser) {
        logUserActivity(
          currentUser, 
          isVisited ? "unvisit_province" : "visit_province", 
          isVisited ? `Desmarcou a província: ${provName}` : `Marcou a província ${provName} como visitada`
        ).then(() => {
          // reload activities list
          getUserActivities(currentUser).then(setActivities);
        });
      }
      return next;
    });
  };

  // Percent explored
  const percentExplored = Math.round((visitedProvinces.length / PROVINCES.length) * 100);

  // Gamification Title
  let explorerTitle = "Iniciante";
  if (percentExplored > 15) explorerTitle = "Viajante Curioso";
  if (percentExplored > 40) explorerTitle = "Explorador da Savana";
  if (percentExplored > 70) explorerTitle = "Desbravador do Planalto";
  if (percentExplored === 100) explorerTitle = "Mestre de Angola 🇦🇴";

  const favSpotsData = favoriteSpots
    .map((id) => spots.find((s) => s.id === id))
    .filter((s): s is TouristSpot => !!s);

  // Email/Password Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "register") {
        if (!usernameInput.trim()) {
          onAddCommentToast("Por favor insira um nome de utilizador.");
          setIsLoading(false);
          return;
        }
        const session = await registerCustomUser(emailInput, usernameInput, passwordInput);
        onAuthChange(session);
        onAddCommentToast(`Conta criada com sucesso! Bem-vindo, ${session.username}!`);
      } else {
        const session = await loginCustomUser(emailInput, passwordInput);
        onAuthChange(session);
        onAddCommentToast(`Bem-vindo de volta, ${session.username}!`);
      }
      // Reset inputs
      setPasswordInput("");
    } catch (err: any) {
      onAddCommentToast(err.message || "Erro de autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Authentication via Firebase Auth
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const session = await loginWithGoogle();
      onAuthChange(session);
      onAddCommentToast(`Autenticado com sucesso via Google, bem-vindo ${session.username}!`);
    } catch (err: any) {
      console.error(err);
      onAddCommentToast("Falha no login com Google. Tente uma conta de credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch instantly to a saved account (FB/TikTok style)
  const handleSwitchAccount = (session: UserSession) => {
    setIsLoading(true);
    try {
      onAuthChange(session);
      onAddCommentToast(`Sessão iniciada como ${session.username}!`);
    } catch (err) {
      onAddCommentToast("Não foi possível trocar de conta.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a saved account from lists
  const handleRemoveSaved = (e: React.MouseEvent, email: string) => {
    e.stopPropagation(); // Avoid triggering switch
    removeSavedAccount(email);
    setSavedAccounts(getSavedAccounts());
    onAddCommentToast("Conta removida deste dispositivo.");
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser(currentUser);
      onAuthChange(null);
      onAddCommentToast("Sessão terminada com sucesso.");
    } catch (err) {
      onAddCommentToast("Erro ao sair.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to map activity type to icons/colors
  const getActivityMeta = (type: string) => {
    switch (type) {
      case "register":
        return { icon: UserPlus, bg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" };
      case "login":
        return { icon: LogIn, bg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" };
      case "logout":
        return { icon: LogOut, bg: "bg-gray-100 dark:bg-gray-800 text-gray-500" };
      case "view_page":
        return { icon: Compass, bg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" };
      case "add_favorite":
        return { icon: Heart, bg: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400" };
      case "remove_favorite":
        return { icon: Heart, bg: "bg-gray-100 dark:bg-gray-800 text-gray-400" };
      case "visit_province":
        return { icon: MapPin, bg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" };
      case "save_planner":
        return { icon: FileText, bg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" };
      default:
        return { icon: Info, bg: "bg-gray-100 dark:bg-gray-800 text-gray-600" };
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!currentUser ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto">
            {/* Login / Signup form */}
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-8 rounded-3xl shadow-sm space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-brand-red/10 text-brand-red dark:text-brand-yellow rounded-full flex items-center justify-center mx-auto text-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-serif italic">
                  {authMode === "login" ? "Entrar no Descubra Angola" : "Criar uma Conta"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aceda a roteiros salvos, marque províncias visitadas e salve as suas atividades no banco de dados.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome de Utilizador</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kíluanji"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full text-xs px-4 py-2.5 bg-gray-50 dark:bg-brand-dark/20 border border-gray-200 dark:border-brand-dark rounded-xl text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Endereço de Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: kiluanji@angola.ao"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 bg-gray-50 dark:bg-brand-dark/20 border border-gray-200 dark:border-brand-dark rounded-xl text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Palavra-passe</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full text-xs px-4 py-2.5 bg-gray-50 dark:bg-brand-dark/20 border border-gray-200 dark:border-brand-dark rounded-xl text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold uppercase tracking-wider rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>{authMode === "login" ? "Iniciar Sessão" : "Concluir Cadastro"}</span>
                </button>
              </form>

              {/* Alternative Social Login */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-150 dark:border-gray-800"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">Ou aceda via</span>
                <div className="flex-grow border-t border-gray-150 dark:border-gray-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 bg-gray-150 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.463 0-6.273-2.81-6.273-6.273s2.81-6.273 6.273-6.273c1.554 0 2.97.564 4.07 1.498l2.91-2.91C18.96 2.464 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.795 0 10.598-4.148 10.598-10.598 0-.618-.052-1.205-.154-1.6h-9.444z"
                  />
                </svg>
                <span>Aceder com Conta Google</span>
              </button>

              <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-850">
                <button
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-xs text-brand-red dark:text-brand-yellow font-bold hover:underline cursor-pointer"
                >
                  {authMode === "login" ? "Não tem uma conta? Cadastre-se" : "Já tem conta? Inicie sessão"}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Profile and Dashboard Screen */
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Side: Profile Information & Achievements */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-red text-white font-bold flex items-center justify-center rounded-2xl text-lg shadow-sm">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{currentUser.username}</h3>
                    <p className="text-xs text-gray-400 font-mono truncate max-w-[160px]">{currentUser.email}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800/40 pt-3 flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-400">Nível Explorer</span>
                  <span className="px-2.5 py-1 bg-brand-yellow text-gray-950 font-bold rounded-lg text-[10px] uppercase tracking-wide">
                    {explorerTitle}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full py-2.5 border border-brand-red/20 hover:bg-brand-red/5 text-brand-red font-bold text-xs rounded-xl cursor-pointer transition text-center flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminar Sessão</span>
                </button>
              </div>

              {/* Achievements Progression Box */}
              <div className="bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 rounded-3xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-850 pb-2">
                  <Award className="text-brand-yellow w-4.5 h-4.5" />
                  <span>Insígnias do Desbravador</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <h5 className="font-bold text-gray-800 dark:text-gray-200">Primeira de Muitas</h5>
                      <p className="text-gray-400 text-[10px]">Marcou a sua primeira província explorada em Angola.</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 transition ${percentExplored > 40 ? "opacity-100" : "opacity-40"}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${percentExplored > 40 ? "text-emerald-500" : "text-gray-300"}`} />
                    <div>
                      <h5 className="font-bold text-gray-800 dark:text-gray-200">Mochileiro Experiente</h5>
                      <p className="text-gray-400 text-[10px]">Marcou mais de 40% das províncias de Angola.</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 transition ${percentExplored === 100 ? "opacity-100" : "opacity-40"}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${percentExplored === 100 ? "text-emerald-500" : "text-gray-300"}`} />
                    <div>
                      <h5 className="font-bold text-gray-800 dark:text-gray-200">Rei do Cacimbo</h5>
                      <p className="text-gray-400 text-[10px]">Explorou absolutamente todas as 18 províncias.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center/Right: Gamified Tracker & Favorites list */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exploration Progress Slider */}
              <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider flex items-center gap-1">
                    <Compass className="text-brand-red w-4.5 h-4.5" />
                    <span>Seu Progresso de Angola</span>
                  </h4>
                  <span className="text-xs font-black text-brand-red dark:text-brand-yellow font-mono">{percentExplored}% de 18 Províncias</span>
                </div>

                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-850 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-red dark:bg-brand-yellow"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentExplored}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {PROVINCES.map((p) => {
                    const isVisited = visitedProvinces.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleProvinceVisited(p.id)}
                        className={`px-3 py-2 border rounded-xl text-left text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer ${
                          isVisited
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold"
                            : "bg-gray-50 dark:bg-brand-dark/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-dark/50"
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {isVisited && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Favorites list */}
              <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider flex items-center gap-1">
                  <Heart className="text-brand-red fill-current w-4.5 h-4.5" />
                  <span>Destinos Favoritados ({favoriteSpots.length})</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favSpotsData.map((spot) => (
                    <div
                      key={spot.id}
                      className="p-3 bg-gray-50 dark:bg-brand-dark/20 rounded-2xl border border-gray-150 dark:border-gray-800 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex items-center gap-3">
                        <img src={spot.image} alt={spot.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <h5
                            onClick={() => onNavigateToSpot(spot.id)}
                            className="font-bold text-xs text-gray-900 dark:text-white hover:text-brand-red transition truncate cursor-pointer"
                          >
                            {spot.name}
                          </h5>
                          <span className="text-[9px] uppercase font-bold text-gray-400">{spot.provinceId}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleFavorite(spot.id)}
                        className="p-1 text-brand-red hover:scale-110 transition cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  ))}
                  {favoriteSpots.length === 0 && (
                    <p className="text-xs text-gray-400 italic col-span-2">Não tem destinos salvos. Explore o portal para favoritar locais!</p>
                  )}
                </div>
              </div>

              {/* Frequently Asked Questions (FAQ) Accordion */}
              <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <HelpCircle className="text-brand-red dark:text-brand-yellow w-4.5 h-4.5" />
                  <span>Dúvidas Frequentes de Turistas (FAQ)</span>
                </h4>

                <div className="space-y-3">
                  {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div key={index} className="border-b border-gray-100 dark:border-gray-800/40 pb-3 last:border-none last:pb-0">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full flex items-center justify-between gap-3 text-left text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-brand-red transition cursor-pointer"
                        >
                          <span>{item.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {isOpen && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans mt-2 pl-1">
                            {item.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
