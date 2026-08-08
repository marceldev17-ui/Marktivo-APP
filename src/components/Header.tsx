import React from "react";
import { Client } from "../types";
import { 
  TrendingUp, 
  Bot, 
  Briefcase, 
  Zap, 
  Calendar, 
  FileText, 
  Sparkles, 
  Layers, 
  Bell, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Users
} from "lucide-react";
import { MarktivoLogo } from "./MarktivoLogo";

interface HeaderProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount: number;
  onOpenTeamShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  activeTab,
  setActiveTab,
  alertCount,
  onOpenTeamShare,
}) => {
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      {/* Top Bar: Brand + Client Selector + Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <MarktivoLogo size="md" />
          <div className="flex flex-col">
            <a
              href="https://marktivo.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono"
            >
              marktivo.com.br
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Client Account Switcher + Integration Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Share with Team Button */}
          {onOpenTeamShare && (
            <button
              onClick={onOpenTeamShare}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Users className="h-4 w-4 text-cyan-400" />
              <span>Compartilhar com Equipe</span>
            </button>
          )}

          {/* Client Selector Dropdown */}
          <div className="relative">
            <div className="relative">
              <select
                value={selectedClientId}
                onChange={(e) => onSelectClient(e.target.value)}
                className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm transition-all"
              >
                <option value="ALL">🌐 Todas as Contas (Agência Geral)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    🏢 {c.name} ({c.niche})
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Sync Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Google & Meta Ads On</span>
          </div>

          {/* Quick Notification Counter */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 transition-colors"
            title="Alertas de Performance"
          >
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Painel Múltiplo</span>
          </button>

          <button
            onClick={() => setActiveTab("agent")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "agent"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Bot className="h-4 w-4 text-cyan-300" />
            <span className="flex items-center gap-1.5">
              Agente Marktivo AI
              <span className="bg-cyan-400/20 text-cyan-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-cyan-400/30">
                Grátis
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("campaigns")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "campaigns"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Gerador de Campanhas</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "studio"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Estúdio Criativo (Prompts & Copys)</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "calendar"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Calendário de Posts</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "reports"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Relatórios & Zapier</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
