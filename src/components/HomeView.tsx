import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Search, Compass, Star, ChevronRight, Award, Shield, Trees, Waves, Users } from "lucide-react";
import { PROVINCES, TOURIST_SPOTS } from "../data";
import { Province, TouristSpot } from "../types";

interface HomeViewProps {
  onNavigate: (view: string, targetId?: string) => void;
  translate: (key: string) => string;
  isDarkMode: boolean;
  onSearch: (term: string) => void;
  favoriteSpots: string[];
  onToggleFavorite: (id: string) => void;
  spots: TouristSpot[];
}

export default function HomeView({
  onNavigate,
  translate,
  isDarkMode,
  onSearch,
  favoriteSpots,
  onToggleFavorite,
  spots,
}: HomeViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  // Get some top-rated spots for featured section
  const featuredSpots = spots.slice(0, 3);

  // Statistics data
  const stats = [
    { value: "21", label: "Províncias", icon: MapPin },
    { value: "40+", label: "Pontos Turísticos", icon: Compass },
    { value: "6", label: "Parques Nacionais", icon: Trees },
    { value: "15+", label: "Museus Históricos", icon: Award },
    { value: "30+", label: "Praias Paradisíacas", icon: Waves },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden rounded-3xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/regenerated_image_1783975741586.jpg"
            alt="Luanda Marginal"
            className="w-full h-full object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center mb-2">
              <img
                src="/fotos/Luanda/Luanda.jpg"
                alt="Luanda"
                className="w-40 h-28 md:w-48 md:h-32 object-cover rounded-2xl border-4 border-brand-yellow/80 shadow-2xl hover:scale-105 transition duration-300"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight uppercase font-sans">
              {translate("hero_title") || "Descubra Angola"}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
              {translate("hero_subtitle") || "descubra os melhores lugares magicos de um do melhor pais de Africa, Angola"}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-3 rounded-full max-w-2xl mx-auto border border-white/20 shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-2 bg-white/95 px-5 py-3 rounded-full">
              <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder={translate("search_placeholder") || "Pesquisar por Província, Praia, Cachoeira, Hotel..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-gray-800 focus:outline-none text-sm font-medium placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-red hover:bg-brand-red-hover text-white font-bold px-8 py-3 rounded-full transition duration-200 shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Compass className="w-4 h-4" />
              <span>{translate("search_btn") || "Explorar"}</span>
            </button>
          </motion.form>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <button
              onClick={() => onNavigate("provinces")}
              className="px-8 py-3 bg-brand-yellow hover:opacity-90 text-brand-dark font-extrabold rounded-full transition cursor-pointer flex items-center gap-1.5 text-sm uppercase tracking-wider shadow-md"
            >
              <span>{translate("btn_provinces") || "Ver Províncias"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("planner")}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 font-semibold rounded-full transition cursor-pointer text-sm uppercase tracking-wider"
            >
              {translate("btn_planner") || "Planear Roteiro"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Animated Statistics */}
      <section className="bg-brand-light dark:bg-brand-dark border border-gray-200/60 dark:border-gray-850 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            // Align color accent for stats like the design HTML
            const colorClass = idx % 2 === 0 ? "text-brand-dark dark:text-white" : "text-brand-red";
            return (
              <div key={idx} className="bg-white dark:bg-brand-dark/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/60 flex flex-col items-center text-center shadow-sm">
                <div className={`p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl mb-2 ${colorClass}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className={`text-3xl font-black tracking-tight ${colorClass}`}>
                  {stat.value}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Destinations (Cards) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-150 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-3xl font-serif italic text-gray-900 dark:text-white flex items-center gap-2">
              <Compass className="text-brand-red w-6 h-6 animate-pulse" />
              <span>{translate("featured_destinations_title") || "Destinos Mais Visitados"}</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {translate("featured_destinations_subtitle") || "As maravilhas naturais mais recomendadas de Angola por aventureiros de todo o mundo."}
            </p>
          </div>
          <button
            onClick={() => onNavigate("provinces")}
            className="text-brand-red hover:text-brand-red-hover hover:underline font-bold flex items-center gap-1 text-sm cursor-pointer uppercase tracking-wider"
          >
            <span>{translate("view_all") || "Ver todos"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSpots.map((spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-brand-dark rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group h-full"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(spot.id);
                  }}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition shadow ${
                    favoriteSpots.includes(spot.id)
                      ? "bg-brand-red text-white"
                      : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Star className={`w-4 h-4 ${favoriteSpots.includes(spot.id) ? "fill-current" : ""}`} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-black/60 text-white backdrop-blur-sm border border-white/10 uppercase tracking-widest">
                    {spot.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-brand-red font-bold uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    <span>{spot.provinceId.toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-red transition">
                    {spot.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 pt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-brand-yellow fill-current" />
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">{spot.rating}</span>
                  </div>
                  <button
                    onClick={() => onNavigate("spot", spot.id)}
                    className="text-xs font-bold text-gray-900 dark:text-gray-200 hover:text-brand-red transition flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                  >
                    <span>{translate("btn_learn_more") || "Saber Mais"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Visit Angola? Bento Grid Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {translate("why_angola_title") || "Por que visitar Angola?"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {translate("why_angola_subtitle") || "Um tesouro africano autêntico e de contrastes geográficos, que combina patrimónios da humanidade com hospitalidade contagiante."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Biodiversidade */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl w-fit">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400">
                Biodiversidade e Ecoturismo
              </h3>
              <p className="text-sm text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                Explore a Floresta do Maiombe, safáris deslumbrantes no Parque Nacional da Kissama e o mítico projeto Okavango-Zambeze. Veja a raríssima Palanca Negra Gigante.
              </p>
            </div>
          </div>

          {/* Card 2: Cultura e Ritmo */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400">
                Cultura e Ritmo Vibrantes
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                Deixe-se encantar pelos ritmos globais do Semba e da Kizomba, e sinta o pulsar frenético do Kuduro nas ruas de Luanda. Um povo hospitaleiro com sorrisos infinitos.
              </p>
            </div>
          </div>

          {/* Card 3: Praias Virgens */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl w-fit">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400">
                Praias Virgens de Surf e Descanso
              </h3>
              <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Ondas de classe mundial em Cabo Ledo, as águas de temperatura morna do Atlântico e baías tranquilas na província de Benguela para relaxamento total.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {translate("testimonials_title") || "Depoimentos de Exploradores"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {translate("testimonials_subtitle") || "Veja a opinião de turistas nacionais e internacionais que viveram de perto a magia de Angola."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-brand-yellow fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              &ldquo;Visitar as Quedas de Kalandula foi uma das experiências mais místicas da minha vida. O volume de água e a bruma verdejante são indescritíveis. A pousada no topo é super charmosa!&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-extrabold text-sm uppercase">
                IG
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Igor</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Turista de Luanda</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-brand-yellow fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              &ldquo;Cabo Ledo é o meu refúgio favorito. O mar de água morna, o peixe mufete fresco assado pelas zungueiras na areia e as ondas perfeitas para o surf tornam-no num destino imbatível.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-dark font-extrabold text-sm uppercase">
                IP
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Isaac Pereira</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Turista do Namibe</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-brand-yellow fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              &ldquo;A estrada da Serra da Leba é impressionante. Conduzir por aquelas curvas envolto em névoa e chegar ao topo com aquela vista monumental da planície árida foi de tirar o fôlego.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white font-extrabold text-sm uppercase">
                MM
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Mauro Mota</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Turista da Huíla</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-3xl p-6 text-center space-y-4">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {translate("partners_title") || "Apoiado pelos principais operadores"}
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          <span className="font-extrabold text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-wider font-sans">
            MINISTÉRIO DO TURISMO
          </span>
          <span className="font-extrabold text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-wider font-mono">
            TAAG Angola Airlines
          </span>
          <span className="font-extrabold text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-wider">
            INFO-TUR ANGOLA
          </span>
          <span className="font-extrabold text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-wider">
            HOTÉIS DE ANGOLA
          </span>
        </div>
      </section>
    </div>
  );
}
