import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Compass, Search, Filter, Layers, Star, Plus, Eye } from "lucide-react";
import { TOURIST_SPOTS, PROVINCES } from "../data";
import { TouristSpot, TouristCategory } from "../types";

interface MapViewProps {
  onNavigateToSpot: (spotId: string) => void;
  translate: (key: string) => string;
  isDarkMode: boolean;
  onAddSpotToPlanner: (provinceId: string, spotId: string) => void;
  spots: TouristSpot[];
}

export default function MapView({
  onNavigateToSpot,
  translate,
  isDarkMode,
  onAddSpotToPlanner,
  spots,
}: MapViewProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(spots[0] || null);

  // Filters spots based on province and category
  const filteredSpots = spots.filter((spot) => {
    const matchesProv = selectedProvinceId === "all" || spot.provinceId === selectedProvinceId;
    const matchesCat = selectedCategory === "all" || spot.category === selectedCategory;
    return matchesProv && matchesCat;
  });

  // Geographical categories
  const categories = ["all", ...Object.values(TouristCategory)];

  // Grouped Provinces for high fidelity stylized sectors
  const regions = [
    { name: "Sector Litoral (Luanda, Bengo, Cuanza Sul, Icolo e Bengo)", ids: ["luanda", "bengo", "cuanza-sul", "icolo-e-bengo"], color: "fill-red-600/10 hover:fill-red-600/20 stroke-red-600" },
    { name: "Sector Norte (Cabinda, Zaire, Uíge, Cuanza Norte)", ids: ["cabinda", "zaire", "uige", "cuanza-norte"], color: "fill-emerald-600/10 hover:fill-emerald-600/20 stroke-emerald-600" },
    { name: "Sector Centro (Malanje, Huambo, Bié)", ids: ["malanje", "huambo", "bie"], color: "fill-amber-500/10 hover:fill-amber-500/20 stroke-amber-500" },
    { name: "Sector Leste (Moxico, Lunda Norte, Lunda Sul, Moxico Leste)", ids: ["moxico", "lunda-norte", "lunda-sul", "moxico-leste"], color: "fill-blue-500/10 hover:fill-blue-500/20 stroke-blue-500" },
    { name: "Sector Sul (Huíla, Namibe, Cunene, Cuando Cubango, Cuando)", ids: ["huila", "namibe", "cunene", "cuando-cubango", "cuando"], color: "fill-orange-500/10 hover:fill-orange-500/20 stroke-orange-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 font-serif italic">
          <MapPin className="text-brand-red w-8 h-8" />
          <span>Mapa Turístico Interativo</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Explore as províncias e localize marcos históricos, praias paradisíacas, cachoeiras e parques nacionais no mapa de Angola.
        </p>
      </div>

      {/* Map Dashboard Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Center: Map and Filters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2 flex items-center gap-2 bg-white dark:bg-brand-dark px-3 py-2 border border-gray-200 dark:border-brand-dark rounded-xl shadow-sm">
              <Filter className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Todas as Províncias</option>
                {PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/2 flex items-center gap-2 bg-white dark:bg-brand-dark px-3 py-2 border border-gray-200 dark:border-brand-dark rounded-xl shadow-sm">
              <Layers className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Todas as Categorias</option>
                {categories.filter(c => c !== "all").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Styled Map Viewport */}
          <div className="relative bg-white dark:bg-brand-dark border border-gray-150 dark:border-brand-dark rounded-3xl h-[450px] overflow-hidden flex flex-col items-center justify-center p-6 shadow-sm">
            {/* Compass rose decorative overlay */}
            <div className="absolute top-6 left-6 text-gray-300 dark:text-gray-700 flex items-center gap-1">
              <Compass className="w-8 h-8 animate-spin-slow" />
              <span className="font-bold text-xs tracking-widest font-mono">N</span>
            </div>

            {/* High-fidelity Vector Map Container */}
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* stylized background ocean/grid */}
              <div className="absolute inset-0 border border-gray-100 dark:border-gray-800/60 rounded-2xl bg-grid-slate-100/50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

              {/* Angola Stylized Region Map */}
              <svg viewBox="0 0 500 500" className="w-full h-full max-h-[380px] drop-shadow-xl z-10 select-none">
                {/* Cabinda (Enclave) */}
                <g>
                  <path
                    d="M 120,40 L 150,40 L 150,60 L 120,60 Z"
                    className="fill-brand-red/10 hover:fill-brand-red/20 stroke-brand-red stroke-2 transition duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince("Cabinda")}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => setSelectedProvinceId("cabinda")}
                  />
                  <text x="135" y="52" className="text-[10px] font-extrabold fill-brand-red text-center" textAnchor="middle">CAB</text>
                </g>

                {/* Northern Sector */}
                <g>
                  <path
                    d="M 110,100 L 220,100 L 250,160 L 190,190 L 110,130 Z"
                    className="fill-emerald-600/10 hover:fill-emerald-600/25 stroke-emerald-600 stroke-2 transition duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince("Região Norte (Zaire, Uíge, Cuanza Norte)")}
                    onMouseLeave={() => setHoveredProvince(null)}
                  />
                  <text x="160" y="140" className="text-xs font-bold fill-emerald-800 dark:fill-emerald-300" textAnchor="middle">Norte</text>
                </g>

                {/* Luanda & Bengo */}
                <g>
                  <path
                    d="M 100,140 L 130,135 L 140,170 L 110,180 Z"
                    className="fill-brand-red/20 hover:fill-brand-red/35 stroke-brand-red stroke-2 transition duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince("Luanda & Bengo")}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => setSelectedProvinceId("luanda")}
                  />
                  <text x="120" y="160" className="text-[10px] font-bold fill-brand-red" textAnchor="middle">Luanda</text>
                </g>

                {/* Leste Sector (Moxico, Lundas) */}
                <g>
                  <path
                    d="M 230,100 L 370,100 L 400,280 L 310,290 L 230,200 Z"
                    className="fill-blue-600/10 hover:fill-blue-600/25 stroke-blue-600 stroke-2 transition duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince("Região Leste (Lundas, Moxico)")}
                    onMouseLeave={() => setHoveredProvince(null)}
                  />
                  <text x="310" y="170" className="text-xs font-bold fill-blue-800 dark:fill-blue-300" textAnchor="middle">Leste</text>
                </g>

                {/* Centro Sector */}
                <g>
                  <path
                    d="M 120,190 L 230,200 L 310,290 L 220,320 L 140,260 Z"
                    className="fill-brand-yellow/10 hover:fill-brand-yellow/25 stroke-brand-yellow stroke-2 transition duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince("Planalto Central (Malanje, Huambo, Bié)")}
                    onMouseLeave={() => setHoveredProvince(null)}
                  />
                  <text x="210" y="250" className="text-xs font-bold fill-brand-yellow dark:fill-brand-yellow" textAnchor="middle">Centro</text>
                </g>

                {/* Sul Sector */}
                <g>
                  <path
                    d="M 130,270 L 220,320 L 300,295 L 360,430 L 170,430 Z"
                    className="fill-orange-500/10 hover:fill-orange-500/25 stroke-orange-500 stroke-2 transition duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince("Sector Sul (Huíla, Namibe, Cunene, C. Cubango)")}
                    onMouseLeave={() => setHoveredProvince(null)}
                  />
                  <text x="240" y="370" className="text-xs font-bold fill-orange-800 dark:fill-orange-300" textAnchor="middle">Sul</text>
                </g>
              </svg>

              {/* Dynamic Interactive Mapped Pins over the vector */}
              {/* We map coordinates into simulated positions on the SVG scale */}
              {selectedProvinceId !== "all" && (() => {
                const prov = PROVINCES.find((p) => p.id === selectedProvinceId);
                if (!prov) return null;
                const pX = ((prov.mapCoord.lng - 11) / 13) * 85 + 5;
                const pY = ((Math.abs(prov.mapCoord.lat) - 5) / 13) * 85 + 5;
                return (
                  <motion.div
                    key={`prov-pin-${prov.id}`}
                    className="absolute z-40 flex flex-col items-center pointer-events-none"
                    style={{ left: `${pX}%`, top: `${pY}%`, transform: "translate(-50%, -50%)" }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {/* Glowing highlight effect */}
                    <div className="absolute w-12 h-12 bg-brand-red/30 rounded-full animate-ping" />
                    <div className="absolute w-6 h-6 bg-brand-red/60 rounded-full animate-pulse" />
                    
                    {/* Centroid small dot */}
                    <div className="w-4 h-4 bg-white border-2 border-brand-red rounded-full shadow-lg z-10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                    </div>
                    
                    {/* Elegant tooltip label */}
                    <div className="mt-1 bg-brand-red text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xl border border-red-500 whitespace-nowrap z-20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{prov.name} (Capital: {prov.capital})</span>
                    </div>
                  </motion.div>
                );
              })()}

              {filteredSpots.map((spot) => {
                // Map real coordinates to simulated coordinates on the screen
                // lat roughly -5 to -18, lng roughly 11 to 24
                const xPct = ((spot.mapCoord.lng - 11) / 13) * 85 + 5;
                const yPct = ((Math.abs(spot.mapCoord.lat) - 5) / 13) * 85 + 5;

                const isSelected = selectedSpot?.id === spot.id;

                return (
                  <motion.button
                    key={spot.id}
                    className="absolute z-30 group cursor-pointer"
                    style={{ left: `${xPct}%`, top: `${yPct}%`, transform: "translate(-50%, -100%)" }}
                    onClick={() => setSelectedSpot(spot)}
                    animate={{ scale: isSelected ? 1.25 : 1 }}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Name tooltip on hover */}
                      <div className="absolute bottom-full mb-1 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-40 border border-gray-800">
                        {spot.name}
                      </div>

                      {/* Pin Vector */}
                      <MapPin className={`w-6 h-6 transition-colors ${
                        isSelected
                          ? "text-brand-red drop-shadow-[0_4px_6px_rgba(206,17,38,0.4)]"
                          : "text-brand-yellow hover:text-brand-red drop-shadow-md"
                      }`} />

                      {/* Small pulsating light */}
                      <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-brand-red/35 animate-ping" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Sector indicator label */}
            <div className="absolute bottom-4 left-6 text-xs text-gray-400 font-semibold font-mono">
              {hoveredProvince ? `Setor: ${hoveredProvince}` : "Passe o cursor para explorar setores"}
            </div>

            {/* Legend indicators */}
            <div className="absolute bottom-4 right-6 flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-brand-yellow" />
                <span>Ponto</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-brand-red" />
                <span>Selecionado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Spot Side-Card */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-150 dark:border-gray-800 pb-2 uppercase tracking-wider">
            Ficha do Destino
          </h3>

          {selectedSpot ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between h-full space-y-4 p-4"
            >
              <div className="space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img src={selectedSpot.id === "kalandula" ? "/src/assets/images/kalandula_falls_1783893420397_1783938463169.jpg" : selectedSpot.image} alt={selectedSpot.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded text-white text-xs font-bold flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-brand-yellow fill-current" />
                    <span>{selectedSpot.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-brand-red dark:text-brand-yellow tracking-widest block font-mono">
                    {selectedSpot.provinceId}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white font-serif">{selectedSpot.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans line-clamp-4">
                    {selectedSpot.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] border-t border-gray-100 dark:border-gray-800/40">
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[9px] font-mono">Dificuldade</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedSpot.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[9px] font-mono">Preço</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedSpot.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => onNavigateToSpot(selectedSpot.id)}
                  className="w-full py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer uppercase tracking-wider"
                >
                  <Eye className="w-4 h-4" />
                  <span>Saber Mais</span>
                </button>
                <button
                  onClick={() => onAddSpotToPlanner(selectedSpot.provinceId, selectedSpot.id)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-brand-dark/40 dark:hover:bg-brand-dark/80 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar ao Roteiro</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 dark:bg-brand-dark/30 p-8 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center h-64">
              <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Selecione um marcador no mapa para ver as informações do destino.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
