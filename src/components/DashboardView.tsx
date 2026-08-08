import { apiFetch } from "../apiClient";
import React, { useState } from "react";
import { Client, PlatformMetric, PerformanceAlert } from "../types";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Target, 
  MousePointer, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  RefreshCw,
  Zap,
  Bot,
  Plus,
  Building2,
  X,
  UserPlus
} from "lucide-react";

interface DashboardViewProps {
  clients: Client[];
  selectedClientId: string;
  metrics: PlatformMetric[];
  alerts: PerformanceAlert[];
  onOpenAgentWithPrompt: (promptText: string) => void;
  onAddClient?: (newClient: Client) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  selectedClientId,
  metrics,
  alerts,
  onOpenAgentWithPrompt,
  onAddClient,
}) => {
  const [platformFilter, setPlatformFilter] = useState<"ALL" | "Google Ads" | "Meta Ads">("ALL");
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "MÊS">("7D");

  // New Client Modal State
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientNiche, setNewClientNiche] = useState("Saúde & Odontologia");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [newClientBudget, setNewClientBudget] = useState("5000");
  const [newClientTargetCpa, setNewClientTargetCpa] = useState("35");
  const [newClientTargetRoas, setNewClientTargetRoas] = useState("4.5");
  const [newClientGoogleAdsId, setNewClientGoogleAdsId] = useState("");
  const [newClientGoogleAdsEmail, setNewClientGoogleAdsEmail] = useState("");
  const [newClientInstagramUrl, setNewClientInstagramUrl] = useState("");
  const [newClientFacebookUrl, setNewClientFacebookUrl] = useState("");
  const [newClientPlatforms, setNewClientPlatforms] = useState<("Google Ads" | "Meta Ads" | "Instagram" | "Facebook")[]>([
    "Google Ads",
    "Meta Ads",
    "Instagram",
  ]);

  // Real-Time Audit Modal State
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [activeAuditClient, setActiveAuditClient] = useState<Client | null>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const handleTogglePlatform = (p: "Google Ads" | "Meta Ads" | "Instagram" | "Facebook") => {
    if (newClientPlatforms.includes(p)) {
      setNewClientPlatforms(newClientPlatforms.filter((item) => item !== p));
    } else {
      setNewClientPlatforms([...newClientPlatforms, p]);
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      alert("Por favor informe o nome do cliente.");
      return;
    }

    const created: Client = {
      id: `client_${Date.now()}`,
      name: newClientName,
      niche: newClientNiche,
      website: newClientWebsite || "https://marktivo.com.br",
      monthlyBudget: Number(newClientBudget) || 3000,
      platforms: newClientPlatforms.length > 0 ? newClientPlatforms : ["Google Ads", "Meta Ads"],
      status: "active",
      targetCpa: Number(newClientTargetCpa) || 30,
      targetRoas: Number(newClientTargetRoas) || 4.0,
      avatarUrl: `https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80`,
      googleAdsId: newClientGoogleAdsId,
      googleAdsEmail: newClientGoogleAdsEmail,
      instagramUrl: newClientInstagramUrl,
      facebookUrl: newClientFacebookUrl,
    };

    if (onAddClient) {
      onAddClient(created);
    }
    setIsAddClientOpen(false);
    setNewClientName("");
    setNewClientGoogleAdsId("");
    setNewClientGoogleAdsEmail("");
    setNewClientInstagramUrl("");
    setNewClientFacebookUrl("");
    alert(`Cliente "${created.name}" incluído com sucesso com IDs do Google Ads e Redes Sociais vinculados!`);
  };

  const handleRunRealtimeAudit = async (client: Client) => {
    setActiveAuditClient(client);
    setIsAuditOpen(true);
    setLoadingAudit(true);
    setAuditData(null);

    try {
      const res = await apiFetch("/api/ai/analyze-client-channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client.name,
          niche: client.niche,
          googleAdsId: client.googleAdsId || "482-194-8021",
          googleAdsEmail: client.googleAdsEmail || "ads.gestao@cliente.com",
          instagramUrl: client.instagramUrl || `https://instagram.com/${client.name.toLowerCase().replace(/\s+/g, '')}`,
          facebookUrl: client.facebookUrl || `https://facebook.com/${client.name.toLowerCase().replace(/\s+/g, '')}`,
          websiteUrl: client.website,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuditData(data);
    } catch (err: any) {
      alert(`Erro na auditoria em tempo real: ${err.message}`);
    } finally {
      setLoadingAudit(false);
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Filter alerts by selected client if needed
  const filteredAlerts = selectedClientId === "ALL" 
    ? alerts 
    : alerts.filter((a) => a.clientId === selectedClientId);

  // Compute total aggregates
  const totalCost = metrics.reduce((acc, m) => acc + m.cost, 0);
  const totalRevenue = metrics.reduce((acc, m) => acc + m.revenue, 0);
  const totalConversions = metrics.reduce((acc, m) => acc + m.conversions, 0);
  const totalClicks = metrics.reduce((acc, m) => acc + m.clicks, 0);
  const totalImpressions = metrics.reduce((acc, m) => acc + m.impressions, 0);
  
  const avgCpa = totalConversions > 0 ? totalCost / totalConversions : 0;
  const avgRoas = totalCost > 0 ? totalRevenue / totalCost : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Client Header & Quick Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-6 rounded-2xl border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {selectedClient ? selectedClient.name : "Painel Consolidado Marktivo"}
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Ativo & Sincronizado
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {selectedClient 
              ? `Nicho: ${selectedClient.niche} • Orçamento Mensal: R$ ${selectedClient.monthlyBudget.toLocaleString('pt-BR')}`
              : "Visão unificada das campanhas de tráfego pago de todos os clientes da agência marktivo.com.br"}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Platform toggle */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex text-xs font-medium">
            <button
              onClick={() => setPlatformFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                platformFilter === "ALL" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setPlatformFilter("Google Ads")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                platformFilter === "Google Ads" ? "bg-amber-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Google Ads
            </button>
            <button
              onClick={() => setPlatformFilter("Meta Ads")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                platformFilter === "Meta Ads" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Meta Ads
            </button>
          </div>

          <button 
            onClick={() => setIsAddClientOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Incluir Novo Cliente</span>
          </button>

          <button 
            onClick={() => onOpenAgentWithPrompt("Análise completa de métricas de tráfego e diagnósticos de campanhas de hoje.")}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Bot className="h-4 w-4 text-cyan-300" />
            <span>Diagnóstico com IA</span>
          </button>
        </div>
      </div>

      {/* Real-time Performance Drop Alerts Section */}
      {filteredAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alertas de Queda de Performance & Oportunidades (Tempo Real)
            </h2>
            <span className="text-xs text-slate-500 font-medium">Automatizado Marktivo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.type === "critical"
                    ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                    : alert.type === "warning"
                    ? "bg-amber-950/40 border-amber-800/80 text-amber-200"
                    : "bg-indigo-950/40 border-indigo-800/80 text-indigo-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white border border-slate-700">
                    {alert.platform}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{alert.timestamp}</span>
                </div>

                <h3 className="font-bold text-sm mt-2 text-white">{alert.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{alert.message}</p>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">{alert.metricChange}</span>
                  <button
                    onClick={() =>
                      onOpenAgentWithPrompt(
                        `Como resolver o alerta no cliente ${alert.clientName}: "${alert.title}" - ${alert.message}? Ação sugerida: ${alert.suggestedAction}`
                      )
                    }
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Resolver com IA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Investimento */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Investimento Total</span>
            <DollarSign className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ {totalCost.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-1 font-semibold">
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
            +14.2% vs semana anterior
          </div>
        </div>

        {/* Conversões */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Conversões (Leads/Vendas)</span>
            <Target className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalConversions.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-1 font-semibold">
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
            +18.5% meta batida
          </div>
        </div>

        {/* CPA Médio */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>CPA Médio (Custo/Aquisição)</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            R$ {avgCpa.toFixed(2)}
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-1 font-semibold">
            <ArrowDownRight className="h-3 w-3 mr-0.5" />
            -6.4% custo reduzido
          </div>
        </div>

        {/* ROAS Médio */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>ROAS Médio (Retorno)</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {avgRoas.toFixed(2)}x
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-1 font-semibold">
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
            +0.8x vs objetivo
          </div>
        </div>

        {/* CTR Médio */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>CTR Médio (Taxa de Clique)</span>
            <MousePointer className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {avgCtr.toFixed(2)}%
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-1 font-semibold">
            <ArrowUpRight className="h-3 w-3 mr-0.5" />
            Acima da média do nicho
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Evolução Diária de Receita vs Investimento</h3>
              <p className="text-slate-400 text-xs">Comparativo de retorno gerado por anúncios</p>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-1 rounded-lg border border-indigo-500/30">
              Período Ativo
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" name="Receita Gerada (R$)" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="cost" name="Investimento em Anúncios (R$)" stroke="#6366f1" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Bar Chart */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Divisão Google Ads vs Meta Ads</h3>
            <p className="text-slate-400 text-xs mb-4">Desempenho comparativo por plataforma</p>

            <div className="space-y-4">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center text-xs font-bold text-amber-400 mb-1">
                  <span>Google Ads (Search, Display, PMax)</span>
                  <span>52% Verba</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-amber-500 h-full w-[52%]"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>CPA: <strong className="text-white">R$ 35,16</strong></div>
                  <div>ROAS: <strong className="text-emerald-400">5.4x</strong></div>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center text-xs font-bold text-blue-400 mb-1">
                  <span>Meta Ads (Instagram & Facebook)</span>
                  <span>48% Verba</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-blue-500 h-full w-[48%]"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>CPA: <strong className="text-white">R$ 35,02</strong></div>
                  <div>ROAS: <strong className="text-emerald-400">5.1x</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Sincronização Ativa via API</span>
            <span className="text-emerald-400 font-bold">100% Ok</span>
          </div>
        </div>
      </div>

      {/* Account / Clients Overview Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Contas de Clientes sob Gestão Marktivo</h3>
            <p className="text-slate-400 text-xs">Visão geral do orçamento, metas e status ativo</p>
          </div>
          <button
            onClick={() => onOpenAgentWithPrompt("Gere um relatório de progresso para todos os clientes ativos da agência.")}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Gerar Resumo Geral
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Cliente / Nicho</th>
                <th className="p-3">Plataformas</th>
                <th className="p-3">Orçamento Mensal</th>
                <th className="p-3">Meta CPA</th>
                <th className="p-3">Meta ROAS</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center space-x-3">
                    <img
                      src={cli.avatarUrl}
                      alt={cli.name}
                      className="h-8 w-8 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-sm">{cli.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{cli.niche}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {cli.platforms.map((p, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">
                    R$ {cli.monthlyBudget.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3 font-medium text-emerald-400">
                    R$ {cli.targetCpa.toFixed(2)}
                  </td>
                  <td className="p-3 font-medium text-indigo-400">
                    {cli.targetRoas.toFixed(1)}x
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">
                      Ativo
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      <button
                        onClick={() => handleRunRealtimeAudit(cli)}
                        className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition-all inline-flex items-center gap-1 shadow-sm"
                      >
                        <Zap className="h-3 w-3 text-amber-300" />
                        Auditoria Real
                      </button>
                      <button
                        onClick={() =>
                          onOpenAgentWithPrompt(
                            `Análise de estratégia e plano de otimização de campanhas para o cliente ${cli.name} no nicho ${cli.niche}.`
                          )
                        }
                        className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold px-2.5 py-1 rounded-lg text-xs transition-all inline-flex items-center gap-1"
                      >
                        <Bot className="h-3 w-3" />
                        Analisar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL INCLUIR NOVO CLIENTE */}
      {isAddClientOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-black text-white">Incluir Novo Cliente no Painel</h2>
              </div>
              <button
                onClick={() => setIsAddClientOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nome da Empresa / Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: OdontoPrime Clínica Estética"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nicho de Atuação</label>
                  <select
                    value={newClientNiche}
                    onChange={(e) => setNewClientNiche(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Saúde & Odontologia">Saúde & Odontologia</option>
                    <option value="Imobiliário de Luxo">Imobiliário de Luxo</option>
                    <option value="E-commerce & Suplementos">E-commerce & Suplementos</option>
                    <option value="Gastronomia & Restaurantes">Gastronomia & Restaurantes</option>
                    <option value="Serviços Jurídicos & Contábeis">Serviços Jurídicos & Contábeis</option>
                    <option value="Estética & Beleza">Estética & Beleza</option>
                    <option value="Educação & Cursos">Educação & Cursos</option>
                    <option value="Automotivo">Automotivo</option>
                    <option value="SaaS & B2B Software">SaaS & B2B Software</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Website / Landing Page</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newClientWebsite}
                    onChange={(e) => setNewClientWebsite(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Verba Mensal (R$)</label>
                  <input
                    type="number"
                    value={newClientBudget}
                    onChange={(e) => setNewClientBudget(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Meta CPA (R$)</label>
                  <input
                    type="number"
                    value={newClientTargetCpa}
                    onChange={(e) => setNewClientTargetCpa(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Meta ROAS</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newClientTargetRoas}
                    onChange={(e) => setNewClientTargetRoas(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">ID da Conta do Google Ads</label>
                  <input
                    type="text"
                    placeholder="Ex: 482-194-8021"
                    value={newClientGoogleAdsId}
                    onChange={(e) => setNewClientGoogleAdsId(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-mono rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">E-mail da Conta Google Ads</label>
                  <input
                    type="email"
                    placeholder="Ex: gestao@cliente.com"
                    value={newClientGoogleAdsEmail}
                    onChange={(e) => setNewClientGoogleAdsEmail(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-mono rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cyan-300 block mb-1">Link do Instagram</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/cliente"
                    value={newClientInstagramUrl}
                    onChange={(e) => setNewClientInstagramUrl(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-blue-300 block mb-1">Link do Facebook</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/cliente"
                    value={newClientFacebookUrl}
                    onChange={(e) => setNewClientFacebookUrl(e.target.value)}
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Plataformas Ativas de Anúncio</label>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {(["Google Ads", "Meta Ads", "Instagram", "Facebook"] as const).map((p) => {
                    const active = newClientPlatforms.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handleTogglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          active
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30"
                >
                  Incluir Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AUDITORIA EM TEMPO REAL */}
      {isAuditOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 shadow-2xl relative space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    Auditoria de Canais em Tempo Real
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Cliente: <strong className="text-white">{activeAuditClient?.name}</strong> ({activeAuditClient?.niche})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingAudit ? (
              <div className="py-16 text-center space-y-4">
                <RefreshCw className="h-10 w-10 text-amber-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Escaneando Contas e Canais em Tempo Real...</p>
                  <p className="text-xs text-slate-400">Verificando ID do Google Ads, Instagram, Facebook e Landing Page com a IA Marktivo.</p>
                </div>
              </div>
            ) : auditData ? (
              <div className="space-y-6">
                {/* Score Banner */}
                <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 p-5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Score de Saúde dos Canais</span>
                    <div className="text-3xl font-black text-white mt-0.5">{auditData.overallHealthScore}<span className="text-lg text-slate-400 font-normal">/100</span></div>
                    <p className="text-xs text-slate-300 mt-1">{auditData.clientSummary}</p>
                  </div>
                  <button
                    onClick={() => handleRunRealtimeAudit(activeAuditClient!)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reanalisar
                  </button>
                </div>

                {/* Google Ads Diagnostics */}
                {auditData.googleAdsDiagnostic && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                        <Target className="h-4 w-4" /> Google Ads (ID: {activeAuditClient?.googleAdsId || "Ativo"})
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {auditData.googleAdsDiagnostic.accountStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Índice de Qualidade Médio</span>
                        <strong className="text-white text-sm">{auditData.googleAdsDiagnostic.qualityScoreAverage}</strong>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Perda de Parcela de Impressão</span>
                        <strong className="text-amber-300 text-xs">{auditData.googleAdsDiagnostic.impressionShareLoss}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 block">Recomendações da IA para Google Ads:</span>
                      <ul className="space-y-1">
                        {auditData.googleAdsDiagnostic.recommendations?.map((rec: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Social Media Instagram / Facebook Diagnostic */}
                {auditData.socialMediaDiagnostic && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                        <Eye className="h-4 w-4" /> Instagram & Facebook Ads
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {auditData.socialMediaDiagnostic.instagramStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Taxa de Engajamento Estimada</span>
                        <strong className="text-emerald-400 text-sm">{auditData.socialMediaDiagnostic.engagementRateEst}</strong>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Frequência de Conteúdo</span>
                        <strong className="text-white text-xs">{auditData.socialMediaDiagnostic.contentFrequency}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 block">Ações Recomendadas para Instagram/Facebook:</span>
                      <ul className="space-y-1">
                        {auditData.socialMediaDiagnostic.recommendations?.map((rec: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Priority Action Checklist */}
                {auditData.topPriorityActions && (
                  <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 space-y-2">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                      ⚡ Plano de Ação Prioritário de Execução Direta
                    </span>
                    <div className="space-y-2">
                      {auditData.topPriorityActions.map((act: string, idx: number) => (
                        <div key={idx} className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/30 text-xs font-medium text-slate-200 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] border border-amber-500/30">
                              {idx + 1}
                            </span>
                            {act}
                          </span>
                          <button
                            onClick={() =>
                              onOpenAgentWithPrompt(
                                `Como implementar a seguinte ação prioritária para o cliente ${activeAuditClient?.name}: "${act}"`
                              )
                            }
                            className="text-[10px] font-bold px-2 py-1 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-all"
                          >
                            Executar com IA
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
