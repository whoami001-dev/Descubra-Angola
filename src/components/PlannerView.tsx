import React from "react";
import { motion } from "motion/react";
import { 
  Route, Compass, MapPin, Clock, DollarSign, Plus, Trash2, 
  ArrowRight, Printer, Navigation, Car, Bus, Plane, Train, Lock, ArrowUpRight
} from "lucide-react";
import { TouristSpot } from "../types";
import { UserSession, logUserActivity } from "../lib/authService.ts";

interface PlannerViewProps {
  plannedSpots: { provinceId: string; spotId: string }[];
  onRemoveFromPlanner: (spotId: string) => void;
  onAddSpotToPlanner: (provinceId: string, spotId: string) => void;
  translate: (key: string) => string;
  isDarkMode: boolean;
  onAddCommentToast: (msg: string) => void;
  spots: TouristSpot[];
  currentUser: UserSession | null;
  onNavigateToAuth: () => void;
  tripDays: number;
  setTripDays: (days: number) => void;
  transportMode: "car" | "bus" | "plane" | "train";
  setTransportMode: (mode: "car" | "bus" | "plane" | "train") => void;
}

export default function PlannerView({
  plannedSpots,
  onRemoveFromPlanner,
  onAddSpotToPlanner,
  translate,
  isDarkMode,
  onAddCommentToast,
  spots,
  currentUser,
  onNavigateToAuth,
  tripDays,
  setTripDays,
  transportMode,
  setTransportMode,
}: PlannerViewProps) {
  
  // 1. If NOT logged in, show a premium-grade high-fidelity Lock Screen
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-8 md:p-12 rounded-3xl shadow-lg text-center space-y-6 relative overflow-hidden"
        >
          {/* Subtle colored accent shapes */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-red via-brand-yellow to-emerald-500" />
          
          <div className="w-16 h-16 bg-brand-red/10 text-brand-red dark:text-brand-yellow rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-serif italic">
              Planeador de Viagem Restrito
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Para desenhar roteiros de viagem personalizados pelas províncias de Angola, estimar distâncias, prever custos de transporte e sincronizar tudo no banco de dados, necessita de uma conta ativa.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-brand-dark/40 border border-gray-100 dark:border-gray-850 p-5 rounded-2xl text-left space-y-3">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Vantagens de Membro</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                <span>Cálculo automático de distâncias (Haversine) entre locais</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                <span>Estimativa de gastos com combustível e tarifas em USD/Kwanzas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Guardar automaticamente no nosso banco de dados relacional Cloud SQL</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>Exportar roteiro completo em formato PDF ou imprimir cronograma</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onNavigateToAuth}
            className="px-8 py-3.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold uppercase tracking-wider rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 mx-auto shadow-md"
          >
            <span>Criar Conta ou Iniciar Sessão</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  // --- FULL FULL-STACK PLANNER IMPLEMENTATION FOR AUTHENTICATED USERS ---
  const spotsInItinerary = plannedSpots
    .map((item) => spots.find((s) => s.id === item.spotId))
    .filter((s): s is TouristSpot => !!s);

  const unselectedSpots = spots.filter(
    (s) => !plannedSpots.some((item) => item.spotId === s.id)
  );

  // Haversine formula to compute geodesic distance between spots
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Compute stats
  let totalDistance = 0;
  for (let i = 0; i < spotsInItinerary.length - 1; i++) {
    const s1 = spotsInItinerary[i];
    const s2 = spotsInItinerary[i + 1];
    totalDistance += calculateDistance(
      s1.mapCoord.lat,
      s1.mapCoord.lng,
      s2.mapCoord.lat,
      s2.mapCoord.lng
    );
  }

  // Transport details config
  const transportConfig = {
    car: { label: "Carro Próprio / Alugado", factor: 0.15, speed: 85, icon: Car },
    bus: { label: "Autocarro Interprovincial", factor: 0.06, speed: 70, icon: Bus },
    plane: { label: "Voo Doméstico (TAAG)", factor: 0.85, speed: 650, icon: Plane },
    train: { label: "Caminho de Ferro (CFL/CFB/CFN)", factor: 0.08, speed: 50, icon: Train }
  };

  const selectedTransport = transportConfig[transportMode];
  const travelTimeHrs = totalDistance > 0 ? Math.round(totalDistance / selectedTransport.speed) : 0;
  const transportCostEst = totalDistance > 0 ? Math.round(totalDistance * selectedTransport.factor) : 0;

  const handlePrint = () => {
    // Log printing activity
    logUserActivity(currentUser, "export_pdf", `Imprimiu/Exportou o roteiro de viagem de ${tripDays} dias`);
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Print Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-6 rounded-3xl shadow-sm print:border-none print:shadow-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-brand-red animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase font-serif">
              Seu Roteiro Personalizado
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-sans leading-none">
            Utilizador ativo: <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{currentUser.username}</span>
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-brand-dark/50 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 print:hidden"
        >
          <Printer className="w-4 h-4 text-brand-red" />
          <span>Imprimir ou Exportar PDF</span>
        </button>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Setup controls */}
        <div className="space-y-6 print:hidden">
          {/* Section 1: Days and Transport */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
              Configurações Básicas
            </h3>

            {/* Days selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Duração da Viagem</label>
              <div className="flex flex-wrap items-center gap-1.5">
                {[2, 3, 5, 7, 10, 14].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTripDays(days)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      tripDays === days
                        ? "bg-brand-red text-white"
                        : "bg-gray-50 hover:bg-gray-100 dark:bg-brand-dark/40 dark:hover:bg-brand-dark/80 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {days} d
                  </button>
                ))}
              </div>
            </div>

            {/* Transport selection */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Meio de Transporte</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(transportConfig).map(([key, value]) => {
                  const Icon = value.icon;
                  const isSelected = transportMode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTransportMode(key as any)}
                      className={`p-3 border rounded-xl flex items-center gap-2 text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-brand-yellow/10 border-brand-yellow text-gray-950 dark:text-brand-yellow"
                          : "bg-gray-50 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-brand-dark/40"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{value.label.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Add spots */}
          <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
              Adicionar Pontos ao Roteiro
            </h3>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {unselectedSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-2.5 bg-gray-50 dark:bg-brand-dark/20 rounded-xl border border-gray-150 dark:border-gray-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{spot.name}</h4>
                    <span className="text-[10px] text-gray-400 block uppercase font-mono">{spot.provinceId}</span>
                  </div>
                  <button
                    onClick={() => onAddSpotToPlanner(spot.provinceId, spot.id)}
                    className="p-1.5 bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {unselectedSpots.length === 0 && (
                <p className="text-xs text-gray-400 italic">Todos os pontos turísticos foram adicionados ao roteiro!</p>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right: Route Preview and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Dashboard Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider font-mono">Pontos</span>
              <div className="flex items-center gap-1">
                <Compass className="w-4 h-4 text-brand-red" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{spotsInItinerary.length} Destinos</span>
              </div>
            </div>

            <div className="space-y-1 border-l border-gray-200 dark:border-gray-800/80 pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider font-mono">Distância</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand-yellow" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{totalDistance} km</span>
              </div>
            </div>

            <div className="space-y-1 border-l border-gray-200 dark:border-gray-800/80 pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider font-mono">Tempo Viagem</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{travelTimeHrs} hrs</span>
              </div>
            </div>

            <div className="space-y-1 border-l border-gray-200 dark:border-gray-800/80 pl-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider font-mono">Transporte Est.</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">~{transportCostEst} USD</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5 border-b border-gray-150 dark:border-gray-800 pb-2 print:hidden uppercase tracking-wider">
              <Route className="text-brand-red w-5 h-5" />
              <span>Cronograma de Viagem Gerado</span>
            </h3>

            {spotsInItinerary.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-3xl p-8 space-y-3">
                <Compass className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto animate-bounce" />
                <h4 className="font-bold text-gray-900 dark:text-white">Roteiro Vazio</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-sans">
                  Adicione pontos turísticos usando o painel lateral ou clicando em &quot;Adicionar ao Roteiro&quot; em qualquer destino para montar o seu plano.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Daily Timeline Node Loop */}
                {spotsInItinerary.map((spot, index) => {
                  const assignedDay = Math.min(index + 1, tripDays);

                  let distanceToNext = 0;
                  if (index < spotsInItinerary.length - 1) {
                    const nextSpot = spotsInItinerary[index + 1];
                    distanceToNext = calculateDistance(spot.mapCoord.lat, spot.mapCoord.lng, nextSpot.mapCoord.lat, nextSpot.mapCoord.lng);
                  }

                  return (
                    <div key={spot.id} className="relative flex gap-4 items-start pl-2">
                      {/* Left vertical connector line */}
                      {index < spotsInItinerary.length - 1 && (
                        <div className="absolute top-8 left-6 bottom-[-24px] w-0.5 bg-gray-200 dark:bg-gray-800" />
                      )}

                      {/* Day circular indicator */}
                      <div className="w-9 h-9 rounded-full bg-brand-red text-white font-bold flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-sm">
                        D{assignedDay}
                      </div>

                      {/* Timeline Body card */}
                      <div className="flex-1 bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 p-5 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase text-brand-red dark:text-brand-yellow tracking-widest block font-mono">
                              PROVÍNCIA DO {spot.provinceId.toUpperCase()}
                            </span>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white font-serif">{spot.name}</h4>
                          </div>

                          <button
                            onClick={() => onRemoveFromPlanner(spot.id)}
                            className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition cursor-pointer print:hidden"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
                          {spot.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-400 uppercase pt-2 border-t border-gray-100 dark:border-gray-800/40">
                          <div>
                            <span>Categoria:</span>
                            <span className="text-gray-800 dark:text-gray-200 block font-sans lowercase first-letter:uppercase">{spot.category}</span>
                          </div>
                          <div>
                            <span>Horário:</span>
                            <span className="text-gray-800 dark:text-gray-200 block font-mono">{spot.hours}</span>
                          </div>
                          <div>
                            <span>Preço:</span>
                            <span className="text-gray-800 dark:text-gray-200 block font-mono">{spot.price}</span>
                          </div>
                        </div>

                        {/* Travel vector info to next spot */}
                        {distanceToNext > 0 && (
                          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-brand-yellow border-t border-brand-yellow/5 print:text-black uppercase tracking-wider">
                            <ArrowRight className="w-4 h-4 text-brand-red" />
                            <span>Seguir viagem por {distanceToNext} km até ao próximo destino via {selectedTransport.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
