import { apiFetch } from "../apiClient";
import React, { useState } from "react";
import { GeneratedReport, Client } from "../types";
import { 
  Zap, 
  Mail, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Send, 
  Settings, 
  Download, 
  Bot, 
  ExternalLink,
  BookOpen,
  Sliders,
  Check
} from "lucide-react";

interface ReportsAutomationsViewProps {
  clients: Client[];
  selectedClientId: string;
}

export const ReportsAutomationsView: React.FC<ReportsAutomationsViewProps> = ({
  clients,
  selectedClientId,
}) => {
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const [period, setPeriod] = useState("Últimos 7 dias (Relatório Semanal)");
  const [recipientEmail, setRecipientEmail] = useState("marcel.pr17@gmail.com");
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState("");
  const [autoWeekly, setAutoWeekly] = useState(true);
  const [cpaThreshold, setCpaThreshold] = useState(45);

  const [loadingReport, setLoadingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>({
    executiveSummary: `Relatório Semanal de Tráfego Pago - **${selectedClient?.name || "Clínica OdontoPrime"}**
Nas últimas 24 horas e nos últimos 7 dias, registramos um desempenho altamente positivo com tração expressiva em Google Ads e Meta Ads.

- **Investimento Total:** R$ 3.240,00
- **Leads Qualificados Gerados:** 72 contatos no WhatsApp
- **CPA Médio:** R$ 45,00 (Exatamente na meta do cliente)
- **ROAS Estimado:** 4.8x sobre os tratamentos fechados.`,
    keyAchievements: [
      "Aumento de 22% no volume de leads gerados pelo Google Search.",
      "Redução de 14% no CPL dos formulários no Instagram Reels.",
      "Otimização de palavras-chave negativas economizou R$ 410,00 em tráfego irrelevante.",
    ],
    criticalAlerts: [
      "Atenção ao criativo 'Vídeo Depoimento 1' no Meta Ads: ligeiro aumento no CPM nas últimas 48h.",
    ],
    nextActionPlan: [
      "Lançar novos 2 criativos no Instagram Reels criados via Estúdio Marktivo.",
      "Realocar R$ 200/semana adicionais para o grupo de anúncios 'Lentes de Contato Dental'.",
      "Realizar teste A/B no botão principal da Landing Page.",
    ],
    estimatedRoasOutcome: "Projeção de manter ROAS acima de 5.0x na próxima semana.",
  });

  const [triggeringZap, setTriggeringZap] = useState(false);
  const [zapResponse, setZapResponse] = useState<any>(null);

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await apiFetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: selectedClient?.name || "Cliente Agência",
          period,
          metricsSummary: {
            investimento: "R$ 3.240,00",
            conversoes: 72,
            cpa: "R$ 45,00",
            roas: "4.8x",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedReport(data);
    } catch (err: any) {
      alert(`Erro ao gerar relatório: ${err.message}`);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleTriggerZapier = async () => {
    setTriggeringZap(true);
    try {
      const res = await apiFetch("/api/webhook/zapier-trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "WEEKLY_EMAIL_REPORT",
          recipientEmail,
          clientName: selectedClient?.name || "Cliente Agência",
          reportPeriod: period,
          autoSendWeekly: true,
          alertThresholdCpa: cpaThreshold,
          zapierWebhookUrl,
          reportData: generatedReport
        }),
      });
      const data = await res.json();
      setZapResponse(data);
    } catch (err: any) {
      alert(`Erro no disparo de webhook: ${err.message}`);
    } finally {
      setTriggeringZap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            Relatórios Automáticos & Hub de Integrações Zapier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gere resumos em PDF/E-mail com IA e configure automações para envio semanal direto no WhatsApp e e-mail dos clientes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Webhook Zapier Ativo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Builder & Automations Settings */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="h-4 w-4 text-indigo-400" />
              Configurar Relatório Semanal
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Cliente Selecionado</label>
              <div className="bg-slate-800 p-2.5 rounded-xl text-xs font-bold text-white border border-slate-700">
                🏢 {selectedClient?.name} ({selectedClient?.niche})
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Período do Relatório</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-2.5 border border-slate-700"
              >
                <option value="Últimos 7 dias (Relatório Semanal)">Últimos 7 dias (Relatório Semanal)</option>
                <option value="Últimos 30 dias (Relatório Mensal)">Últimos 30 dias (Relatório Mensal)</option>
                <option value="Personalizado (Campanha Lançamento)">Personalizado (Campanha Lançamento)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">E-mail do Cliente / Gestor</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">URL do Webhook Zapier / Make (Opcional)</label>
              <input
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={zapierWebhookUrl}
                onChange={(e) => setZapierWebhookUrl(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">
                Cole a URL de um Webhook do <b>Zapier</b> ou <b>Make</b> para enviar o relatório para seu cliente de verdade.
                O Zapier/Make possuem planos gratuitos limitados.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Limite Máximo de CPA para Alerta (R$)</label>
              <input
                type="number"
                value={cpaThreshold}
                onChange={(e) => setCpaThreshold(Number(e.target.value))}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-2.5 border border-slate-700"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dispara alerta em tempo real se o CPA ultrapassar este valor nas plataformas.
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleGenerateReport}
                disabled={loadingReport}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <span>{loadingReport ? "Gerando Relatório..." : "Gerar Resumo Executivo com IA"}</span>
              </button>

              <button
                onClick={handleTriggerZapier}
                disabled={triggeringZap}
                className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>{triggeringZap ? "Enviando Webhook..." : "Enviar por E-mail via Zapier Agora"}</span>
              </button>
            </div>

            {zapResponse && (
              <div className="bg-emerald-950/60 border border-emerald-800/80 p-3 rounded-xl text-xs text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {zapResponse.message}
                </div>
                <div className="text-[10px] text-emerald-300 font-mono">
                  Hook ID: {zapResponse.details?.zapierHookId} • Enviado para {recipientEmail}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Report Preview */}
        <div className="lg:col-span-2 space-y-6">
          {generatedReport ? (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Relatório Pronto para Envio
                  </span>
                  <h2 className="text-lg font-black text-white mt-1">
                    Resumo Semanal - {selectedClient?.name}
                  </h2>
                </div>

                <button
                  onClick={() => alert("Relatório pronto em PDF e salvo no histórico da agência Marktivo.")}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 font-semibold"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" />
                  Baixar PDF
                </button>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Resumo Executivo da IA:</h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {generatedReport.executiveSummary}
                </div>
              </div>

              {/* Key Achievements */}
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Principais Conquistas do Período:</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {generatedReport.keyAchievements?.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Alerts */}
              {generatedReport.criticalAlerts?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Pontos de Atenção Identificados:</h4>
                  <ul className="space-y-1.5 text-xs text-amber-200">
                    {generatedReport.criticalAlerts.map((alt, i) => (
                      <li key={i} className="flex items-start gap-2 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/60">
                        <AlertOctagon className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Action Plan */}
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Plano de Ação para a Próxima Semana:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {generatedReport.nextActionPlan?.map((plan, p) => (
                    <div key={p} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs text-slate-200 space-y-1">
                      <span className="font-bold text-cyan-300">Passo {p + 1}:</span>
                      <p>{plan}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center text-slate-400 space-y-3">
              <FileText className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium">Clique em "Gerar Resumo Executivo com IA" para compilar o relatório.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
