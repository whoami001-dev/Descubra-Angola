import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, Compass, ArrowLeft, Send, Sparkles, MessageSquare, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { BLOG_POSTS } from "../data";
import { BlogPost, ChatMessage } from "../types";

interface BlogViewProps {
  translate: (key: string) => string;
  isDarkMode: boolean;
  onAddCommentToast: (msg: string) => void;
  blogPosts?: BlogPost[];
}

export default function BlogView({
  translate,
  isDarkMode,
  onAddCommentToast,
  blogPosts,
}: BlogViewProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // AI Chat state for the active article
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const postsList = blogPosts || BLOG_POSTS;
  const activePost = postsList.find((p) => p.id === selectedPostId);

  const categories = ["all", "Guias", "Dicas", "Cultura", "História"];

  const filteredPosts = postsList.filter((post) => {
    return selectedCategory === "all" || post.category === selectedCategory;
  });

  // Handler for AI assistant questions
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activePost) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `O utilizador está a ler o artigo intitulado "${activePost.title}" sobre Angola. Conteúdo resumido do artigo: ${activePost.content.substring(0, 500)}. Pergunta do utilizador: ${userMsg.text}`,
          history: chatMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            text: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha no servidor");
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        sender: "bot",
        text: data.text,
        timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        sender: "bot",
        text: "Desculpe, ocorreu uma falha ao comunicar com o Assistente de IA de Angola. Verifique sua ligação à internet.",
        timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    setChatMessages([
      {
        sender: "bot",
        text: "Olá! Sou o assistente inteligente de Angola. Tem alguma dúvida específica sobre este artigo ou quer dicas extras sobre o destino citado?",
        timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!selectedPostId ? (
          /* Blog Main Feed */
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-serif italic text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <BookOpen className="text-brand-red w-8 h-8" />
                <span>Blog de Viagem & Notícias</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fique por dentro das melhores dicas de viagem, novidades de vistos, relatos de viajantes e artigos históricos sobre Angola.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 flex-wrap bg-gray-50 dark:bg-brand-dark/30 p-2.5 rounded-full border border-gray-150 dark:border-gray-850 w-fit">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-brand-red text-white shadow-sm"
                      : "bg-white dark:bg-brand-dark border border-gray-250 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
                  }`}
                >
                  {cat === "all" ? "Todos os Artigos" : cat}
                </button>
              ))}
            </div>

            {/* Blog Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectPost(post.id)}
                  className="bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-black/60 border border-white/10 backdrop-blur-md text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5 text-brand-yellow" /> {post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-red transition tracking-tight leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-sans line-clamp-3 leading-relaxed">
                        {post.snippet}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border-t border-gray-100 dark:border-gray-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <div className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-[10px]">
                        {post.author.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{post.author}</span>
                    </div>
                    <span className="text-xs font-bold text-brand-red dark:text-brand-yellow flex items-center gap-0.5 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                      Ler Artigo <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Immersive Article Reader with AI side chat */
          <motion.div
            key="reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Back to Blog */}
            <button
              onClick={() => setSelectedPostId(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-brand-red cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o Feed</span>
            </button>

            {/* Split layout: Content left, Chatbot right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: Article Body */}
              <div className="lg:col-span-2 bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-805 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-brand-red/5 border border-brand-red/20 text-brand-red dark:text-brand-yellow dark:border-brand-yellow/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {activePost?.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight font-serif italic">
                    {activePost?.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 font-medium pb-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1"><User className="w-4 h-4 text-brand-red" /> Por {activePost?.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-brand-yellow" /> {activePost?.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-brand-yellow" /> {activePost?.readTime} de leitura</span>
                  </div>
                </div>

                {/* Article Image Cover */}
                <div className="h-64 rounded-2xl overflow-hidden shadow-md">
                  <img src={activePost?.image} alt={activePost?.title} className="w-full h-full object-cover" />
                </div>

                {/* Body Text */}
                <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                  {activePost?.content}
                </p>
              </div>

              {/* Right Column: Interactive Gemini Chat Assistant */}
              <div className="bg-gray-50 dark:bg-brand-dark/40 border border-gray-150 dark:border-gray-850 rounded-3xl p-5 shadow-sm space-y-4 sticky top-6">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-850 pb-3">
                  <div className="p-2 bg-brand-red/10 text-brand-red dark:text-brand-yellow rounded-xl">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white leading-none">Assistente de Viagem IA</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Esclareça dúvidas sobre este artigo</p>
                  </div>
                </div>

                {/* Chat Log Window */}
                <div className="h-[260px] overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs font-sans leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-brand-red text-white rounded-tr-none"
                            : "bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono mt-0.5">{msg.timestamp}</span>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="mr-auto flex items-center gap-2 bg-white dark:bg-brand-dark border border-gray-150 dark:border-gray-800 p-3 rounded-2xl text-xs text-gray-500 rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="font-sans text-[10px] italic">Pensando...</span>
                    </div>
                  )}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    required
                    disabled={isAiLoading}
                    placeholder="Pergunte ao assistente..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white dark:bg-brand-dark border border-gray-200 dark:border-gray-800 rounded-xl text-gray-800 dark:text-white focus:outline-none disabled:opacity-50 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="p-2.5 bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
