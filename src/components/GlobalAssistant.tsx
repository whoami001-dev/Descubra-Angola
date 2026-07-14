import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, Bot, CornerDownLeft, Loader2, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

export default function GlobalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick-questions to help user interact
  const SUGGESTIONS = [
    "Pratos típicos de Luanda?",
    "Como ir à Serra da Leba?",
    "O que é a Muxima?",
    "Onde ver a Palanca Negra?",
  ];

  // Initialize with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          sender: "bot",
          text: "Olá! Sou a Sofia, a sua guia turística virtual de Angola. 🇦🇴\n\nEstou aqui para tirar todas as suas dúvidas sobre as 18 províncias, a nossa deliciosa gastronomia (como o Mufete e o Calulu), ritmos tradicionais, ou para ajudar a planear o seu roteiro perfeito.\n\nComo posso ajudar-lhe hoje? **Estamos juntos!**",
          timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
    }
  }, [chatMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
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
          message: userMsg.text,
          history: chatMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            text: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro no servidor");
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
        text: "Desculpe, ocorreu uma falha ao comunicar com o Assistente de IA de Angola. Por favor, verifique a sua ligação ou tente novamente mais tarde.",
        timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (hasNewMessageAlert) {
      setHasNewMessageAlert(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-20 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-brand-dark border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 mr-0"
            id="global-ai-assistant"
          >
            {/* Header */}
            <div className="bg-brand-red text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 relative">
                  <Bot className="w-5 h-5 text-brand-yellow animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-brand-red" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm tracking-wide">Sofia - Guia Virtual</h4>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-yellow fill-current animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-brand-yellow font-extrabold uppercase">IA de Angola</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition text-white/80 hover:text-white cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-brand-dark/25 scrollbar-thin">
              {chatMessages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-brand-red/10 border border-brand-red/15 flex items-center justify-center text-brand-red text-xs font-bold flex-shrink-0">
                        SO
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-sm ${
                        isUser
                          ? "bg-brand-red text-white rounded-tr-none font-medium"
                          : "bg-white dark:bg-brand-dark/95 border border-gray-150 dark:border-gray-805 text-gray-800 dark:text-gray-200 rounded-tl-none whitespace-pre-wrap"
                      }`}
                    >
                      {msg.text}
                      <span
                        className={`block text-[9px] mt-1.5 text-right opacity-60 font-mono ${
                          isUser ? "text-white/80" : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 border border-brand-red/15 flex items-center justify-center text-brand-red text-xs font-bold flex-shrink-0 animate-spin">
                    <Loader2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white dark:bg-brand-dark/95 border border-gray-150 dark:border-gray-805 p-3.5 rounded-2xl rounded-tl-none text-xs text-gray-500 flex items-center gap-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span>Sofia está a digitar...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips (shown when not loading and input is empty) */}
            {!isAiLoading && inputMessage.trim() === "" && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-850 bg-white dark:bg-brand-dark flex gap-2 overflow-x-auto scrollbar-none">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="flex-shrink-0 px-3 py-1.5 bg-gray-50 hover:bg-brand-red/5 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-yellow transition cursor-pointer flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3 text-brand-yellow" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-gray-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pergunte sobre Angola... (ex: visto, praias, funge)"
                className="flex-1 bg-gray-50 dark:bg-brand-dark/80 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-800 dark:text-white focus:outline-none focus:border-brand-red placeholder-gray-400"
                disabled={isAiLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isAiLoading}
                className="p-2 bg-brand-red hover:bg-brand-red-hover disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-xl transition cursor-pointer flex items-center justify-center flex-shrink-0"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="relative">
        <motion.button
          onClick={toggleAssistant}
          className={`p-3.5 rounded-full shadow-2xl z-50 cursor-pointer flex items-center justify-center transition duration-300 relative border ${
            isOpen
              ? "bg-brand-dark border-gray-800 text-white"
              : "bg-brand-red hover:bg-brand-red-hover text-white border-red-500 hover:scale-105"
          }`}
          whileTap={{ scale: 0.95 }}
          id="toggle-global-assistant"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}

          {/* New message notification alert bubble */}
          {hasNewMessageAlert && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-yellow border-2 border-white text-[8px] text-brand-dark font-black justify-center items-center">
                !
              </span>
            </span>
          )}
        </motion.button>

        {/* Small descriptive floating label */}
        {hasNewMessageAlert && !isOpen && (
          <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 bg-brand-dark text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-xl border border-gray-800 whitespace-nowrap hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow fill-current animate-pulse" />
            <span>Fale com a Sofia! IA Integrada</span>
          </div>
        )}
      </div>
    </div>
  );
}
