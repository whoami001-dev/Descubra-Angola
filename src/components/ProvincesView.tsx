import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Search, Compass, Star, ChevronRight, ArrowLeft, History, Users, Thermometer, Sparkles, BookOpen, Utensils, ThumbsUp, MessageSquare, Plus, Check } from "lucide-react";
import { PROVINCES, TOURIST_SPOTS } from "../data";
import { Province, TouristSpot, Review } from "../types";

interface ProvincesViewProps {
  selectedProvinceId: string | null;
  onSelectProvince: (id: string | null) => void;
  onNavigateToSpot: (spotId: string) => void;
  translate: (key: string) => string;
  isDarkMode: boolean;
  onAddCommentToast: (msg: string) => void;
  spots: TouristSpot[];
  provinces?: Province[];
}

// Initial mockup reviews
const INITIAL_REVIEWS: Record<string, Review[]> = {
  luanda: [
    { id: "r1", author: "Marcos Mateus", avatar: "MM", rating: 5, text: "Luanda é incrível! O Mufete na Ilha é maravilhoso e as praias de Cabo Ledo são perfeitas.", date: "10/07/2026", likes: 12, replies: [] },
    { id: "r2", author: "Marie Dupont", avatar: "MD", rating: 4, text: "Beautiful city, full of contrasts. The sunset at Miradouro da Lua is stunning.", date: "08/07/2026", likes: 8, replies: [{ author: "Guia Angola", text: "Welcome to Luanda! We are glad you loved it.", date: "09/07/2026" }] }
  ],
  malanje: [
    { id: "r3", author: "João Bento", avatar: "JB", rating: 5, text: "As Quedas de Kalandula são de tirar o fôlego. Recomendo muito o guia voluntário local.", date: "05/07/2026", likes: 15, replies: [] }
  ],
  huila: [
    { id: "r4", author: "Clara Ginga", avatar: "CG", rating: 5, text: "O Lubango é a cidade mais linda do país! O clima alpino e a Tundavala são extraordinários.", date: "01/07/2026", likes: 20, replies: [] }
  ]
};

export default function ProvincesView({
  selectedProvinceId,
  onSelectProvince,
  onNavigateToSpot,
  translate,
  isDarkMode,
  onAddCommentToast,
  spots,
  provinces,
}: ProvincesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClimate, setSelectedClimate] = useState("all");
  const [reviews, setReviews] = useState<Record<string, Review[]>>(INITIAL_REVIEWS);

  // New review form state
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // Filters
  const climates = ["all", "Tropical", "Semiárido", "Temperado", "Equatorial", "Desértico"];

  const provincesList = provinces || PROVINCES;

  const filteredProvinces = provincesList.filter((prov) => {
    const matchesSearch =
      prov.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prov.capital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClimate =
      selectedClimate === "all" ||
      prov.climate.toLowerCase().includes(selectedClimate.toLowerCase());
    return matchesSearch && matchesClimate;
  });

  const selectedProvince = provincesList.find((p) => p.id === selectedProvinceId);
  const spotsInProvince = selectedProvince
    ? spots.filter((s) => s.provinceId === selectedProvince.id)
    : [];

  // Handlers for comments
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim() || !selectedProvinceId) return;

    const newReview: Review = {
      id: "r_" + Date.now(),
      author: newAuthor,
      avatar: newAuthor.substring(0, 2).toUpperCase(),
      rating: newRating,
      text: newText,
      date: new Date().toLocaleDateString("pt-PT"),
      likes: 0,
      replies: []
    };

    setReviews((prev) => ({
      ...prev,
      [selectedProvinceId]: [newReview, ...(prev[selectedProvinceId] || [])]
    }));

    // Reset Form
    setNewAuthor("");
    setNewText("");
    setNewRating(5);
    onAddCommentToast("Avaliação submetida com sucesso!");
  };

  const handleLikeReview = (reviewId: string) => {
    if (!selectedProvinceId) return;
    setReviews((prev) => {
      const provReviews = prev[selectedProvinceId] || [];
      const updated = provReviews.map((rev) => {
        if (rev.id === reviewId) {
          return { ...rev, likes: rev.likes + 1 };
        }
        return rev;
      });
      return { ...prev, [selectedProvinceId]: updated };
    });
  };

  const handleAddReply = (reviewId: string) => {
    if (!replyText.trim() || !selectedProvinceId) return;

    setReviews((prev) => {
      const provReviews = prev[selectedProvinceId] || [];
      const updated = provReviews.map((rev) => {
        if (rev.id === reviewId) {
          return {
            ...rev,
            replies: [
              ...rev.replies,
              {
                author: "Guia Angola (Admin)",
                text: replyText,
                date: new Date().toLocaleDateString("pt-PT")
              }
            ]
          };
        }
        return rev;
      });
      return { ...prev, [selectedProvinceId]: updated };
    });

    setReplyText("");
    setReplyingToId(null);
    onAddCommentToast("Resposta publicada!");
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!selectedProvinceId ? (
          /* Provinces Listing View */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-serif italic text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <Compass className="text-brand-red w-8 h-8" />
                <span>As 21 Províncias de Angola</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Explore a identidade de cada província de Angola, suas curiosidades, clima e atrativos turísticos únicos.
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 p-4 rounded-2xl">
              <div className="flex-1 flex items-center gap-2 bg-white dark:bg-brand-dark px-4 py-2.5 border border-gray-250 dark:border-gray-800 rounded-xl shadow-sm">
                <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Pesquisar por Província ou Capital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none text-sm font-medium placeholder-gray-400"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Clima:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {climates.map((climate) => (
                    <button
                      key={climate}
                      onClick={() => setSelectedClimate(climate)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold cursor-pointer transition ${
                        (climate === "all" && selectedClimate === "all") ||
                        (climate !== "all" && selectedClimate.includes(climate))
                          ? "bg-brand-red text-white shadow-sm"
                          : "bg-white dark:bg-brand-dark border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-450 hover:bg-gray-50 dark:hover:bg-brand-dark/60"
                      }`}
                    >
                      {climate === "all" ? "Todos" : climate}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid layout for 21 Provinces */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProvinces.map((prov, index) => (
                <motion.div
                  key={prov.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => onSelectProvince(prov.id)}
                  className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={prov.image}
                      alt={prov.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold tracking-tight">{prov.name}</h3>
                      <p className="text-xs text-gray-200 font-light">Capital: {prov.capital}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-md flex items-center gap-1 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 text-brand-yellow fill-current" />
                      <span>{prov.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed font-sans">
                      {prov.history}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 pt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                        <MapPin className="w-3 h-3 text-brand-red" />
                        <span>{prov.location}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-red dark:text-brand-yellow flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                        Explorar <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProvinces.length === 0 && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma província encontrada para sua busca.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* Exclusive Province Detail View */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            {/* Breadcrumb / Back Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectProvince(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer text-gray-700 dark:text-gray-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span className="hover:underline cursor-pointer" onClick={() => onSelectProvince(null)}>
                  Províncias
                </span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 dark:text-white">{selectedProvince?.name}</span>
              </div>
            </div>

            {/* Immersive Cover */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
              <img
                src={selectedProvince?.image}
                alt={selectedProvince?.name}
                className="w-full h-full object-cover brightness-[0.55]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-4">
                <span className="px-3 py-1 bg-brand-yellow text-brand-dark font-extrabold rounded-lg text-xs uppercase tracking-wider shadow">
                  Capital: {selectedProvince?.capital}
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight font-serif italic">Província do {selectedProvince?.name}</h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="w-4 h-4 text-brand-red" /> {selectedProvince?.location}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Users className="w-4 h-4 text-brand-yellow" /> {selectedProvince?.population}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Thermometer className="w-4 h-4 text-brand-yellow" /> {selectedProvince?.climate}
                  </span>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                    <Star className="w-4 h-4 text-brand-yellow fill-current" />
                    <span className="font-extrabold">{selectedProvince?.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* History Section */}
                <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wider font-sans">
                    <History className="text-brand-red w-5 h-5" />
                    <span>História da Província</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                    {selectedProvince?.history}
                  </p>
                </div>

                {/* Cultural and Gastronomic identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wider font-sans">
                      <Sparkles className="text-brand-yellow w-4 h-4" />
                      <span>Cultura e Ritmos</span>
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedProvince?.culture}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wider font-sans">
                      <Utensils className="text-brand-red w-4 h-4" />
                      <span>Gastronomia Regional</span>
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedProvince?.gastronomy}
                    </p>
                  </div>
                </div>

                {/* Spots in this Province */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Compass className="text-brand-red w-5 h-5" />
                    <span>Pontos Turísticos em {selectedProvince?.name}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {spotsInProvince.map((spot) => (
                      <div
                        key={spot.id}
                        onClick={() => onNavigateToSpot(spot.id)}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition shadow-sm cursor-pointer group flex flex-col justify-between h-full"
                      >
                        <div className="relative h-40">
                          <img
                            src={spot.image}
                            alt={spot.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition"
                          />
                          <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded text-white text-xs font-bold flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                            <span>{spot.rating}</span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition">
                              {spot.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {spot.description}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-red-600 dark:text-amber-500 flex items-center gap-0.5 self-end">
                            Saber Mais <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                    {spotsInProvince.length === 0 && (
                      <div className="col-span-2 text-center p-8 bg-gray-50 dark:bg-gray-950 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <Compass className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mais atrativos turísticos serão registados brevemente.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews and Comments Section */}
                <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="text-red-600 dark:text-amber-500 w-5 h-5" />
                    <span>Avaliações dos Visitantes ({reviews[selectedProvince?.id || ""]?.length || 0})</span>
                  </h3>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {(reviews[selectedProvince?.id || ""] || []).map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-red-600/10 text-red-600 font-extrabold flex items-center justify-center text-sm">
                              {rev.avatar}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{rev.author}</h4>
                              <p className="text-xs text-gray-400">{rev.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? "text-amber-400 fill-current" : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                          {rev.text}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 pt-1">
                          <button
                            onClick={() => handleLikeReview(rev.id)}
                            className="flex items-center gap-1 hover:text-red-600 cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{rev.likes} Útil</span>
                          </button>
                          <button
                            onClick={() => setReplyingToId(replyingToId === rev.id ? null : rev.id)}
                            className="flex items-center gap-1 hover:text-red-600 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Responder ({rev.replies?.length || 0})</span>
                          </button>
                        </div>

                        {/* Replies List */}
                        {rev.replies && rev.replies.length > 0 && (
                          <div className="ml-8 mt-3 pl-4 border-l-2 border-red-600/10 dark:border-amber-500/10 space-y-3">
                            {rev.replies.map((reply, rid) => (
                              <div key={rid} className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-red-600 dark:text-amber-500">{reply.author}</span>
                                  <span className="text-gray-400">{reply.date}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                                  {reply.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        {replyingToId === rev.id && (
                          <div className="ml-8 mt-3 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Escreva uma resposta..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 text-xs px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-800 dark:text-white focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddReply(rev.id)}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 cursor-pointer"
                            >
                              Enviar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {(reviews[selectedProvince?.id || ""] || []).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum comentário publicado nesta província. Seja o primeiro!</p>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Deixe a sua Avaliação</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Seu Nome</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Manuel Agostinho"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          className="w-full text-xs px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Classificação</label>
                        <div className="flex items-center gap-1 h-10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                            >
                              <Star className={`w-6 h-6 ${star <= newRating ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Seu Comentário</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Como foi sua experiência nesta província? O que mais gostou?"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full text-xs px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-800 dark:text-white focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-red-900/10 cursor-pointer ml-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Submeter Comentário</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side Cards */}
              <div className="space-y-6">
                {/* Traveler Guide Card */}
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-amber-600 flex items-center gap-1.5 border-b border-amber-500/15 pb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Guia Prático do Viajante</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wide">Melhor Época para Visitar</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-0.5">{selectedProvince?.bestSeason}</p>
                    </div>
                    <div className="border-t border-amber-500/10 pt-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wide">Como Chegar e Transportes</h4>
                      <ul className="list-disc pl-4 text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                        {selectedProvince?.transport.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Hotels List Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <Check className="text-emerald-500 w-4.5 h-4.5" />
                    <span>Onde Hospedar-se</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedProvince?.hotels.map((hotel, index) => (
                      <div key={index} className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2 last:border-none last:pb-0">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{hotel.name}</h4>
                          <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                            {[...Array(hotel.stars)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded">
                          {hotel.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restaurants List Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <Utensils className="text-red-500 w-4.5 h-4.5" />
                    <span>Onde Comer (Restaurantes)</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedProvince?.restaurants.map((rest, index) => (
                      <div key={index} className="flex items-center justify-between text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2 last:border-none last:pb-0">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{rest.name}</h4>
                          <span className="text-gray-400 block text-[10px] uppercase mt-0.5">{rest.specialty}</span>
                        </div>
                        <span className="font-semibold text-gray-500 dark:text-gray-400">
                          {rest.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curiosities Bullet List */}
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl p-5 space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-2">
                    <Sparkles className="text-amber-500 w-4.5 h-4.5" />
                    <span>Curiosidades</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    {selectedProvince?.curiosities.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span className="font-sans leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
