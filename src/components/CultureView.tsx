import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Utensils, Award, BookOpen, Clock, Gauge, Compass, Sparkles, CheckSquare, Star, Users, MapPin } from "lucide-react";
import { RECIPES, CULTURE_TOPICS, PROVINCES } from "../data";
import { Recipe } from "../types";

interface CultureViewProps {
  translate: (key: string) => string;
  isDarkMode: boolean;
  onAddCommentToast: (msg: string) => void;
  recipes?: Recipe[];
  cultureTopics?: any;
}

export default function CultureView({
  translate,
  isDarkMode,
  onAddCommentToast,
  recipes,
  cultureTopics,
}: CultureViewProps) {
  const [activeTab, setActiveTab] = useState<"culture" | "gastronomy">("culture");
  
  const activeRecipes = recipes || RECIPES;
  const activeCultureTopics = cultureTopics || CULTURE_TOPICS;

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(activeRecipes[0]);

  useEffect(() => {
    setSelectedRecipe(activeRecipes[0]);
  }, [recipes]);

  // Checklist states for ingredients
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredient]: !prev[ingredient]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header and Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-serif italic text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-brand-red w-8 h-8" />
            <span>Identidade, Cultura & Gastronomia</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Explore a alma angolana através de seus ritmos contagiantes, línguas nacionais, instrumentos seculares e sabores tradicionais.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-gray-50 dark:bg-brand-dark p-1 rounded-full border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("culture")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
              activeTab === "culture"
                ? "bg-brand-red text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
            }`}
          >
            Expressões Culturais
          </button>
          <button
            onClick={() => setActiveTab("gastronomy")}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
              activeTab === "gastronomy"
                ? "bg-brand-red text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
            }`}
          >
            Gastronomia e Receitas
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "culture" ? (
          /* Culture Section */
          <motion.div
            key="culture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Traditional Dances Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-brand-red pl-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                  <Users className="text-brand-red w-5 h-5" />
                  <span>Danças e Ritmos Angolanos</span>
                </h2>
                <p className="text-xs text-gray-400">O compasso e a ginga que conquistaram as pistas de dança do mundo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeCultureTopics.dances.map((dance, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <span className="text-[10px] font-bold uppercase text-brand-red tracking-wider">Ritmo Tradicional</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{dance.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                      {dance.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sacred Masks (Cokwe) */}
            <div className="space-y-6">
              <div className="border-l-4 border-brand-yellow pl-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                  <Award className="text-brand-yellow w-5 h-5" />
                  <span>Máscaras Sagradas de Ritual</span>
                </h2>
                <p className="text-xs text-gray-400">Arte ancestral entalhada e carregada de significações espirituais.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeCultureTopics.masks.map((mask, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <span className="text-[10px] font-bold uppercase text-brand-yellow tracking-wider">Escultura Sagrada</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{mask.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                      {mask.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* National Instruments & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* National Languages */}
              <div className="bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="text-brand-red w-4.5 h-4.5" />
                  <span>Línguas Nacionais Bantas</span>
                </h3>
                <div className="space-y-4">
                  {activeCultureTopics.languages.map((lang, i) => (
                    <div key={i} className="text-xs">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">{lang.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{lang.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* National Instruments */}
              <div className="bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="text-brand-yellow w-4.5 h-4.5" />
                  <span>Instrumentos Tradicionais</span>
                </h3>
                <div className="space-y-4">
                  {activeCultureTopics.instruments.map((inst, i) => (
                    <div key={i} className="text-xs">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">{inst.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{inst.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Gastronomy Section */
          <motion.div
            key="gastronomy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Recipes List (Left Column) */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-805 pb-2 uppercase tracking-wider">
                Pratos Tradicionais
              </h3>

              <div className="space-y-3">
                {activeRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setCheckedIngredients({});
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition cursor-pointer ${
                      selectedRecipe?.id === recipe.id
                        ? "bg-brand-red/5 border-brand-red text-brand-red dark:text-brand-yellow dark:border-brand-yellow"
                        : "bg-white dark:bg-brand-dark border-gray-150 dark:border-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm truncate">{recipe.name}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase font-bold mt-1">
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {recipe.duration}</span>
                        <span>•</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Recommended Restaurants Card */}
              <div className="bg-gray-50 dark:bg-brand-dark/30 border border-gray-150 dark:border-gray-850 rounded-2xl p-4 space-y-3 mt-6">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Onde Comer o Melhor Funge</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white">Restaurante O Quintal</h5>
                    <p className="text-gray-500">Comida tradicional caseira no centro de Luanda.</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
                    <h5 className="font-bold text-gray-900 dark:text-white">Lookal Mar</h5>
                    <p className="text-gray-500">Mufete grelhado premium na Ilha de Luanda.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Recipe Detailed Display (Center/Right Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {selectedRecipe ? (
                <div className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-850 rounded-3xl p-6 shadow-sm space-y-6">
                  {/* Hero Cover */}
                  <div className="relative h-56 rounded-2xl overflow-hidden">
                    <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-extrabold font-serif italic">{selectedRecipe.name}</h3>
                      <div className="flex items-center gap-4 text-xs font-semibold mt-1">
                        <span className="flex items-center gap-0.5"><Clock className="w-4 h-4 text-brand-yellow" /> {selectedRecipe.duration}</span>
                        <span className="flex items-center gap-0.5"><Gauge className="w-4 h-4 text-brand-red" /> Dificuldade: {selectedRecipe.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* History of Recipe */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-brand-red dark:text-brand-yellow tracking-wider">Origem & Tradição</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                      {selectedRecipe.history}
                    </p>
                  </div>

                  {/* Ingredients checklist */}
                  <div className="space-y-3 bg-gray-50 dark:bg-brand-dark/20 p-5 rounded-2xl border border-gray-150/40 dark:border-gray-800">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Ingredientes Necessários (Marque o que já tem)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <button
                          key={i}
                          onClick={() => toggleIngredient(ing)}
                          className="flex items-center gap-2 text-xs font-medium text-left text-gray-700 dark:text-gray-300 hover:text-brand-red cursor-pointer"
                        >
                          <CheckSquare className={`w-4 h-4 flex-shrink-0 ${checkedIngredients[ing] ? "text-emerald-500 fill-emerald-500/10" : "text-gray-300"}`} />
                          <span className={`${checkedIngredients[ing] ? "line-through text-gray-400" : ""}`}>{ing}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step by Step Cooking Guide */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-brand-red dark:text-brand-yellow tracking-wider">Modo de Preparo Passo a Passo</h4>
                    <div className="space-y-4">
                      {selectedRecipe.recipe.map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-full bg-brand-red text-white font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans mt-0.5">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-950 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center h-64">
                  <Utensils className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Selecione um prato para revelar a sua receita típica.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
