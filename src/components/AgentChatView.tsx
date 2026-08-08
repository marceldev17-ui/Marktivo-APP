import { apiFetch } from "../apiClient";
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Client } from "../types";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  BookOpen,
  Zap,
  Cpu,
  Layers,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

interface AgentChatViewProps {
  clients: Client[];
  selectedClientId: string;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  clients,
  selectedClientId,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Olá! Sou o **Agente Marktivo AI**, seu copiloto gratuito especialista em **Gestão de Tráfego Pago, Análise de Dados e Estratégia Digital**.

Estou pronto para te ajudar com:
- **Otimizações no Google Ads & Meta Ads** (CPA, CTR, ROAS, CPC, Orçamentos).
- **Estratégias de Anúncios e Palavras-Chave** por nicho de atuação.
- **Roteiros para Reels e Copys** de alta conversão.
- **Diagnósticos de Queda de Performance** e alertas em tempo real.
- **Integrações com NotebookLM, Flow, Gemini e Zapier**.

${selectedClient ? `📍 *Foco Atual:* **${selectedClient.name}** (${selectedClient.niche})` : "🌐 *Foco Atual:* **Visão Agência Marktivo**"}

Em que posso te auxiliar agora?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setLoading(true);

    try {
      const response = await apiFetch("/api/ai/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          clientContext: selectedClient 
            ? `Cliente: ${selectedClient.name} | Nicho: ${selectedClient.niche} | Meta CPA: R$ ${selectedClient.targetCpa}`
            : "Visão Geral Marktivo",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao consultar o Agente AI");

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Erro no chat do Agente:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: `⚠️ Ops, ocorreu uma falha na comunicação: ${err?.message || "Servidor indisponível"}. Por favor, tente novamente.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PRESET_PROMPTS = [
    "Como otimizar o CPA em campanhas de Meta Ads quando o custo por lead está muito alto?",
    "Sugerir palavras-chave negativas para e-commerce de suplementos no Google Ads",
    "Qual a melhor estrutura de campanha no Meta Ads para lançamento de imóvel de luxo?",
    "Como configurar uma automação via Zapier para enviar relatório por e-mail semanalmente?",
    "Como usar o NotebookLM para organizar briefs de clientes da agência?",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Chat Window */}
      <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[750px] shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-850 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 flex items-center justify-center">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Bot className="h-5 w-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-white text-base">Agente Marktivo AI</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE • FREE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Assistente de Gestão de Tráfego, Análise de Métricas e Criação de Anúncios
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "welcome",
                  role: "assistant",
                  content: "Histórico limpo. Como posso ajudar com sua gestão de tráfego hoje?",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="text-xs text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1"
            title="Limpar Conversa"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nova Conversa</span>
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-cyan-300"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm relative group ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-800/90 text-slate-100 border border-slate-700/80"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-2">{msg.content}</div>

                {/* Footer bar inside message */}
                <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-cyan-300 flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl text-xs text-slate-300 border border-slate-700 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Agente Marktivo analisando métricas e gerando recomendações...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-850/80 border-t border-slate-800/80 overflow-x-auto flex gap-2 scrollbar-none">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset)}
              disabled={loading}
              className="bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-700/80 whitespace-nowrap transition-all flex items-center gap-1.5"
            >
              <Lightbulb className="h-3 w-3 text-amber-400 flex-shrink-0" />
              <span>{preset}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Digite sua dúvida de tráfego, solicitação de copy, ideias ou análise de campanha..."
            disabled={loading}
            className="flex-1 bg-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputPrompt.trim()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white p-3 rounded-xl shadow-lg transition-all flex items-center justify-center font-bold"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right Sidebar: Recommended Free Marketing Ecosystem Tools */}
      <div className="space-y-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="h-4 w-4 text-cyan-400" />
            Ecossistema Grátis de IA & Automação
          </h3>

          {/* NotebookLM */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                NotebookLM
              </span>
              <a
                href="https://notebooklm.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                Abrir <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Carregue os briefs, PDFs e dados dos clientes para criar um caderno inteligente de pesquisa.
            </p>
          </div>

          {/* Flow & Gemini */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Flow & Gemini 3.6
              </span>
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                Gemini <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Geração de ideias, copywriting avançado e estruturação de funis de vendas com IA do Google.
            </p>
          </div>

          {/* Zapier */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-orange-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-orange-400" />
                Zapier Automações
              </span>
              <a
                href="https://zapier.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                Zapier <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Conecte os webhooks do Marktivo para enviar e-mails semanais, alertas no WhatsApp e sincronizar CRMs.
            </p>
          </div>
        </div>

        {/* Quick Tips Box */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 p-4 rounded-2xl border border-indigo-800/50 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-indigo-200 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Dica do Gestor Marktivo
          </div>
          <p>
            "Ao testar novos públicos no Meta Ads, combine 1 público de Interesses com 1 público de Lookalike 1% e monitore o CPA durante 72h antes de alterar orçamento."
          </p>
        </div>
      </div>
    </div>
  );
};
