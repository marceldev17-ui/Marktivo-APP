import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { AgentChatView } from "./components/AgentChatView";
import { CampaignBuilderView } from "./components/CampaignBuilderView";
import { CreativeStudioView } from "./components/CreativeStudioView";
import { CalendarView } from "./components/CalendarView";
import { ReportsAutomationsView } from "./components/ReportsAutomationsView";
import { SplashScreen } from "./components/SplashScreen";
import { TeamShareModal } from "./components/TeamShareModal";
import { MasterPasswordScreen } from "./components/MasterPasswordScreen";
import { INITIAL_CLIENTS, MOCK_METRICS, MOCK_ALERTS, INITIAL_POSTS } from "./data/mockData";
import { SocialPost, Client } from "./types";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [masterPassword, setMasterPassword] = useState<string>("");

  useEffect(() => {
    // Verificar se não há senha configurada no servidor ou se já temos uma senha salva
    const checkAuthStatus = async () => {
      try {
        const savedPassword = localStorage.getItem("marktivo_master_pwd");
        
        const res = await fetch("/api/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: savedPassword || "" })
        });
        
        const data = await res.json();
        if (res.ok && data.success) {
          setIsAuthenticated(true);
          if (savedPassword) {
            setMasterPassword(savedPassword);
          }
        } else {
          // Se falhou, remove a senha salva que era inválida
          localStorage.removeItem("marktivo_master_pwd");
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (password: string) => {
    localStorage.setItem("marktivo_master_pwd", password);
    setMasterPassword(password);
    setIsAuthenticated(true);
  };

  const [showSplash, setShowSplash] = useState(true);
  const [isTeamShareOpen, setIsTeamShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedClientId, setSelectedClientId] = useState("ALL");
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);

  // Agent prompt transfer state
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string>("");

  const handleOpenAgentWithPrompt = (promptText: string) => {
    setAgentInitialPrompt(promptText);
    setActiveTab("agent");
  };

  const handleAddPost = (newPost: SocialPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [...prev, newClient]);
  };

  const handleUpdatePostStatus = (postId: string, status: SocialPost["status"]) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status } : p))
    );
  };

  // Se ainda estiver verificando a autenticação, mostramos uma tela preta ou loader (o splash ajuda aqui)
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  // Se não estiver autenticado, mostramos a tela de bloqueio
  if (!isAuthenticated) {
    return <MasterPasswordScreen onSuccess={handleLoginSuccess} />;
  }

  // A partir daqui, o usuário está autenticado e o `masterPassword` tem o valor correto.
  // Você precisará passar esse `masterPassword` para as chamadas de API (fetch) nos outros componentes,
  // injetando-o no header 'x-master-password'. Como o backend só checa se a variável está setada,
  // isso protegerá as requisições.

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Animated Startup Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Team Share & Access Guidance Modal */}
      <TeamShareModal
        isOpen={isTeamShareOpen}
        onClose={() => setIsTeamShareOpen(false)}
      />

      {/* Elegant Ambient Hero Backdrop Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-r from-pink-600/10 via-purple-600/15 to-cyan-500/10 blur-[130px] pointer-events-none z-0" />

      {/* Top Fixed Application Navigation Bar */}
      <Header
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
        onOpenTeamShare={() => setIsTeamShareOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === "dashboard" && (
          <DashboardView
            clients={clients}
            selectedClientId={selectedClientId}
            metrics={MOCK_METRICS}
            alerts={alerts}
            onOpenAgentWithPrompt={handleOpenAgentWithPrompt}
            onAddClient={handleAddClient}
          />
        )}

        {activeTab === "agent" && (
          <AgentChatView
            clients={clients}
            selectedClientId={selectedClientId}
            initialPrompt={agentInitialPrompt}
            onClearInitialPrompt={() => setAgentInitialPrompt("")}
          />
        )}

        {activeTab === "campaigns" && (
          <CampaignBuilderView
            clients={clients}
            selectedClientId={selectedClientId}
          />
        )}

        {activeTab === "studio" && <CreativeStudioView />}

        {activeTab === "calendar" && (
          <CalendarView
            posts={posts}
            clients={clients}
            selectedClientId={selectedClientId}
            onAddPost={handleAddPost}
            onUpdatePostStatus={handleUpdatePostStatus}
          />
        )}

        {activeTab === "reports" && (
          <ReportsAutomationsView
            clients={clients}
            selectedClientId={selectedClientId}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-white">MARKTIVO</span> © {new Date().getFullYear()} • Plataforma de Gestão de Tráfego Pago & Análise de Dados.
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <a href="https://marktivo.com.br" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              marktivo.com.br
            </a>
            <span>•</span>
            <span>Google Ads & Meta Ads Integration</span>
            <span>•</span>
            <span>Zapier & Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
