import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, ArrowLeft, Star, Heart, Share2, DollarSign, Calendar, Clock, Gauge, Clipboard, CheckSquare, Hotel, Utensils, ThumbsUp, MessageSquare, Plus, ChevronRight, Compass } from "lucide-react";
import { TOURIST_SPOTS, PROVINCES } from "../data";
import { TouristSpot, Review } from "../types";
import { UserSession, logUserActivity } from "../lib/authService";

interface SpotsViewProps {
  spotId: string;
  onBack: () => void;
  translate: (key: string) => string;
  favoriteSpots: string[];
  onToggleFavorite: (id: string) => void;
  onAddCommentToast: (msg: string) => void;
  onAddSpotToPlanner: (provinceId: string, spotId: string) => void;
  spots: TouristSpot[];
  currentUser?: UserSession | null;
  onNavigateToAuth?: () => void;
}

const SPOT_REVIEWS_MOCK: Record<string, Review[]> = {
  kalandula: [
    { id: "sr1", author: "Eduardo Neto", avatar: "EN", rating: 5, text: "Uma das visões mais incríveis da minha vida. A força das águas é inacreditável. Vale a pena descer até a base das quedas com um guia local!", date: "11/07/2026", likes: 24, replies: [] },
    { id: "sr2", author: "Sarah Jenkins", avatar: "SJ", rating: 5, text: "Absolutely stunning! Kalandula falls are so majestic. Make sure to bring a raincoat, the spray gets you completely wet but it is so refreshing!", date: "09/07/2026", likes: 14, replies: [] }
  ],
  "serra-leba": [
    { id: "sr3", author: "Carlos Miguel", avatar: "CM", rating: 5, text: "A condução nas curvas da Leba dá um frio na barriga incrível, mas a estrada é impecável. A vista lá de cima no pôr do sol é obrigatória.", date: "07/07/2026", likes: 18, replies: [] }
  ]
};

export default function SpotsView({
  spotId,
  onBack,
  translate,
  favoriteSpots,
  onToggleFavorite,
  onAddCommentToast,
  onAddSpotToPlanner,
  spots,
  currentUser,
  onNavigateToAuth,
}: SpotsViewProps) {
  const spot = spots.find((s) => s.id === spotId);
  const province = PROVINCES.find((p) => p.id === spot?.provinceId);

  const [reviews, setReviews] = useState<Record<string, Review[]>>(SPOT_REVIEWS_MOCK);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");

  const [replyText, setReplyText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const [likedReviewIds, setLikedReviewIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("liked_reviews");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!spot) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ponto turístico não encontrado.</p>
        <button onClick={onBack} className="text-red-600 hover:underline mt-2">Voltar</button>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      onAddCommentToast("Link de partilha copiado para a área de transferência!");
    }).catch(() => {
      onAddCommentToast("Não foi possível copiar o link, mas partilhe: " + spot.name);
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onAddCommentToast("Inicie sessão para poder deixar um comentário!");
      if (onNavigateToAuth) onNavigateToAuth();
      return;
    }
    if (!newText.trim()) return;

    const authorName = currentUser.username;
    const newReview: Review = {
      id: "sr_" + Date.now(),
      author: authorName,
      avatar: authorName.substring(0, 2).toUpperCase(),
      rating: newRating,
      text: newText,
      date: new Date().toLocaleDateString("pt-PT"),
      likes: 0,
      replies: []
    };

    setReviews((prev) => ({
      ...prev,
      [spotId]: [newReview, ...(prev[spotId] || [])]
    }));

    setNewText("");
    setNewRating(5);
    onAddCommentToast("Comentário adicionado com sucesso!");

    // Save activity in user database file
    logUserActivity(
      currentUser,
      "add_review",
      `Deixou um comentário de ${newRating} estrelas no destino ${spot.name}`
    );
  };

  const handleLikeReview = (reviewId: string) => {
    const alreadyLiked = likedReviewIds.includes(reviewId);
    let nextLiked: string[];

    if (alreadyLiked) {
      nextLiked = likedReviewIds.filter((id) => id !== reviewId);
    } else {
      nextLiked = [...likedReviewIds, reviewId];
    }

    setLikedReviewIds(nextLiked);
    try {
      localStorage.setItem("liked_reviews", JSON.stringify(nextLiked));
    } catch (e) {
      console.warn(e);
    }

    setReviews((prev) => {
      const spotRevs = prev[spotId] || [];
      const updated = spotRevs.map((rev) => {
        if (rev.id === reviewId) {
          return { ...rev, likes: rev.likes + (alreadyLiked ? -1 : 1) };
        }
        return rev;
      });
      return { ...prev, [spotId]: updated };
    });

    if (currentUser) {
      logUserActivity(
        currentUser,
        alreadyLiked ? "unlike_review" : "like_review",
        alreadyLiked
          ? `Removeu o gosto do comentário de outro viajante em ${spot.name}`
          : `Gostou do comentário de outro viajante em ${spot.name}`
      );
    }
  };

  const handleAddReply = (reviewId: string) => {
    if (!currentUser) {
      onAddCommentToast("Inicie sessão para poder responder a comentários!");
      if (onNavigateToAuth) onNavigateToAuth();
      return;
    }
    if (!replyText.trim()) return;

    const authorName = currentUser.username;

    setReviews((prev) => {
      const spotRevs = prev[spotId] || [];
      const updated = spotRevs.map((rev) => {
        if (rev.id === reviewId) {
          return {
            ...rev,
            replies: [
              ...rev.replies,
              {
                author: authorName,
                text: replyText,
                date: new Date().toLocaleDateString("pt-PT")
              }
            ]
          };
        }
        return rev;
      });
      return { ...prev, [spotId]: updated };
    });

    setReplyText("");
    setReplyingToId(null);
    onAddCommentToast("Resposta adicionada!");

    // Save activity in user database file
    logUserActivity(
      currentUser,
      "add_reply",
      `Respondeu a um comentário no destino ${spot.name}`
    );
  };

  const isFav = favoriteSpots.includes(spot.id);

  return (
    <div className="space-y-8">
      {/* Top Bar with Navigation and Share/Like */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-brand-dark dark:hover:bg-brand-dark/70 rounded-xl transition cursor-pointer text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span className="hover:underline cursor-pointer" onClick={onBack}>
              Destinos
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 dark:text-white truncate max-w-[150px]">{spot.name}</span>
          </div>
        </div>

        {/* Share and Favorite Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-brand-dark dark:hover:bg-brand-dark/80 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
            <span>Partilhar</span>
          </button>
          <button
            onClick={() => onToggleFavorite(spot.id)}
            className={`px-4 py-2.5 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              isFav
                ? "bg-brand-red border-brand-red text-white shadow-sm"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-brand-dark dark:hover:bg-brand-dark/80 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
            <span>{isFav ? "Favoritado" : "Favoritar"}</span>
          </button>
          <button
            onClick={() => onAddSpotToPlanner(spot.provinceId, spot.id)}
            className="px-4 py-2.5 bg-brand-yellow hover:bg-brand-yellow-hover text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar ao Roteiro</span>
          </button>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-sm">
        <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-brand-yellow font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-brand-red" />
            <span>{province?.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-serif italic text-white">{spot.name}</h1>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-black/60 border border-white/10 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider text-white">
              {spot.category}
            </span>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-xs font-extrabold backdrop-blur-sm border border-white/10 text-white">
              <Star className="w-3.5 h-3.5 text-brand-yellow fill-current" />
              <span>{spot.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spot Description and Info Bento Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2 uppercase tracking-wide">
              <Compass className="text-brand-red w-5 h-5" />
              <span>Sobre o Destino</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              {spot.description}
            </p>
          </div>

          {/* History */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2 uppercase tracking-wide">
              <Clock className="text-brand-red w-5 h-5" />
              <span>História e Significado</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              {spot.history}
            </p>
          </div>

          {/* What to Bring / What to do Checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                <Clipboard className="w-5 h-5" />
                <span>O que levar</span>
              </h3>
              <ul className="space-y-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                {spot.whatToBring.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-yellow/5 border border-brand-yellow/10 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-brand-yellow flex items-center gap-2 border-b border-brand-yellow/10 pb-2">
                <CheckSquare className="w-5 h-5 text-brand-yellow" />
                <span>O que fazer (Atividades)</span>
              </h3>
              <ul className="space-y-2 text-xs font-medium text-gray-800 dark:text-gray-300">
                {spot.oQueFazer.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-brand-yellow flex-shrink-0 fill-current" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comments and Reviews */}
          <div className="space-y-6 pt-4 border-t border-gray-150 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              <MessageSquare className="text-brand-red w-5 h-5" />
              <span>Comentários de Viajantes ({reviews[spotId]?.length || 0})</span>
            </h3>

            {/* Comments List */}
            <div className="space-y-4">
              {(reviews[spotId] || []).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-5 rounded-2xl shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-yellow/10 text-gray-950 dark:text-brand-yellow font-extrabold flex items-center justify-center text-sm">
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
                            i < rev.rating ? "text-brand-yellow fill-current" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                    {rev.text}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 pt-1">
                    <button
                      onClick={() => handleLikeReview(rev.id)}
                      className={`flex items-center gap-1 cursor-pointer uppercase tracking-wider transition-colors ${
                        likedReviewIds.includes(rev.id)
                          ? "text-brand-red font-extrabold"
                          : "hover:text-brand-red text-gray-400"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likedReviewIds.includes(rev.id) ? "fill-current text-brand-red animate-bounce" : ""}`} />
                      <span>{rev.likes} Útil</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onAddCommentToast("Inicie sessão na sua conta para poder responder a comentários!");
                          if (onNavigateToAuth) onNavigateToAuth();
                          return;
                        }
                        setReplyingToId(replyingToId === rev.id ? null : rev.id);
                      }}
                      className="flex items-center gap-1 hover:text-brand-red cursor-pointer uppercase tracking-wider"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Responder ({rev.replies?.length || 0})</span>
                    </button>
                  </div>

                  {/* Replies */}
                  {rev.replies && rev.replies.length > 0 && (
                    <div className="ml-8 mt-3 pl-4 border-l-2 border-brand-yellow/20 space-y-3">
                      {rev.replies.map((reply, rid) => (
                        <div key={rid} className="bg-gray-50 dark:bg-brand-dark/40 p-3 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-brand-red dark:text-brand-yellow">{reply.author}</span>
                            <span className="text-gray-400">{reply.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Action */}
                  {replyingToId === rev.id && currentUser && (
                    <div className="ml-8 mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Escreva uma resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 bg-gray-50 dark:bg-brand-dark/20 border border-gray-200 dark:border-brand-dark rounded-lg text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                      />
                      <button
                        onClick={() => handleAddReply(rev.id)}
                        className="px-3 py-2 bg-brand-red text-white rounded-lg text-xs font-bold transition hover:bg-brand-red-hover cursor-pointer uppercase tracking-wider"
                      >
                        Enviar
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {(reviews[spotId] || []).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic font-sans">Ainda não há comentários sobre este destino. Seja o primeiro a opinar!</p>
              )}
            </div>

            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handleAddReview} className="bg-gray-50 dark:bg-brand-dark/20 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Adicionar Comentário</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">A comentar como</label>
                    <div className="w-full text-xs px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-dark rounded-xl text-gray-800 dark:text-white font-semibold flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-brand-yellow/20 text-gray-950 dark:text-brand-yellow font-bold text-[10px] flex items-center justify-center">
                        {currentUser.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{currentUser.username}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Sua Classificação</label>
                    <div className="flex items-center gap-1 h-10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-brand-yellow hover:scale-110 transition cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= newRating ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Mensagem</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escreva a sua avaliação autêntica do ponto turístico..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full text-xs px-4 py-3 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-dark rounded-xl text-gray-800 dark:text-white focus:outline-none resize-none placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer ml-auto uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Comentário</span>
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 dark:bg-brand-dark/20 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl text-center space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Inicie sessão ou crie uma conta para poder comentar ou responder a outros viajantes sobre este destino.
                </p>
                {onNavigateToAuth && (
                  <button
                    onClick={onNavigateToAuth}
                    className="px-5 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition shadow-sm"
                  >
                    Iniciar Sessão / Registar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Grid (Right Column) */}
        <div className="space-y-6">
          {/* Detailed Specifications card */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wider">
              Especificações Técnicas
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-brand-red/10 text-brand-red rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Preço Estimado</h4>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{spot.price}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-gray-800/40 pt-3">
                <div className="p-2.5 bg-brand-yellow/10 text-brand-yellow rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Horário de Funcionamento</h4>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{spot.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-gray-800/40 pt-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Melhor época</h4>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{spot.bestSeason}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-gray-800/40 pt-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Tempo médio de visita</h4>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{spot.visitDuration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 dark:border-gray-800/40 pt-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Nível de Dificuldade</h4>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-1 ${
                    spot.difficulty === "Fácil"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : spot.difficulty === "Moderado"
                      ? "bg-brand-yellow/10 text-brand-yellow"
                      : "bg-brand-red/10 text-brand-red"
                  }`}>
                    {spot.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Coordinates card */}
          <div className="bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1">
              <MapPin className="text-brand-red w-4.5 h-4.5" />
              <span>Coordenadas Geográficas</span>
            </h3>
            <div className="space-y-1 font-mono text-xs text-gray-500">
              <p>Latitude: {spot.mapCoord.lat}° S</p>
              <p>Longitude: {spot.mapCoord.lng}° E</p>
            </div>
            <p className="text-[11px] text-gray-400 italic">Use no seu dispositivo GPS para navegar precisamente.</p>
          </div>

          {/* Near Accommodation Card */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-2">
              <Hotel className="text-emerald-500 w-4.5 h-4.5" />
              <span>Alojamentos Próximos</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {spot.nearbyHotels.map((hotel, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-sans">{hotel}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Near Restaurants Card */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-2">
              <Utensils className="text-brand-red w-4.5 h-4.5" />
              <span>Restaurantes Próximos</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {spot.nearbyRestaurants.map((rest, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  <span className="font-sans">{rest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
