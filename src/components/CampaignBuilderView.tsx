import { apiFetch } from "../apiClient";
import React, { useState, useEffect } from "react";
import { Client, GeneratedCampaign } from "../types";
import { 
  Briefcase, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Target, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  Tag, 
  Flame,
  Bot,
  Building2,
  Mic
} from "lucide-react";

interface CampaignBuilderViewProps {
  clients?: Client[];
  selectedClientId?: string;
}

const CAMPAIGN_GOALS = [
  "🎯 Geração de Leads Qualificados no WhatsApp",
  "🛒 Conversões & Vendas Diretas no E-commerce",
  "📅 Agendamento de Consultas & Reuniões",
  "📱 Vendas no Instagram Direct & Direct Message",
  "🔥 Retargeting & Remarketing de Visitantes",
  "📢 Alcance & Reconhecimento de Marca",
  "📥 Captação de Formulários (Lead Generation)",
  "🎁 Distribuição de Iscas Digitais (E-books, Webinars)",
  "🎟️ Inscrições para Eventos e Lançamentos",
  "⭐ Fidelização e Upsell de Clientes Atuais",
  "✏️ Outro Objetivo Personalizado..."
];

const TARGET_AUDIENCES = [
  "Homens e Mulheres de 25 a 55 anos na região metropolitana",
  "Jovens de 18 a 30 anos (Geração Z e Millennials)",
  "Mães e Pais de crianças pequenas",
  "Empreendedores, CEOs e Donos de Pequenos Negócios (B2B)",
  "Pessoas de Alta Renda (Classe A/B) interessadas em luxo",
  "Estudantes universitários e recém-formados",
  "Pessoas focadas em saúde, bem-estar e esportes",
  "Idosos e aposentados (60+ anos)",
  "Viajantes frequentes e nômades digitais",
  "Profissionais de tecnologia e desenvolvedores",
  "✏️ Outro / Personalizado..."
];

export const VoiceInputBtn: React.FC<{ onResult: (text: string) => void }> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListen = () => {
    if (isListening) return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      onResult(speechResult);
    };
    
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`p-1.5 rounded-lg border transition-colors ${
        isListening
          ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse"
          : "bg-slate-700/50 text-slate-400 hover:text-white border-slate-600 hover:bg-slate-600"
      }`}
      title="Falar"
    >
      <Mic className="h-4 w-4" />
    </button>
  );
};

export const CampaignBuilderView: React.FC<CampaignBuilderViewProps> = ({
  clients = [],
  selectedClientId = "ALL"
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(selectedClientId !== "ALL" ? selectedClientId : (clients[0]?.id || "custom"));
  const [niche, setNiche] = useState("Saúde & Odontologia");
  const [selectedGoalOption, setSelectedGoalOption] = useState(CAMPAIGN_GOALS[0]);
  const [customGoalText, setCustomGoalText] = useState("");
  const [platform, setPlatform] = useState("Google Ads Search & Meta Ads");
  const [budget, setBudget] = useState("R$ 3.000 / mês");
  const [selectedAudienceOption, setSelectedAudienceOption] = useState(TARGET_AUDIENCES[0]);
  const [customAudienceText, setCustomAudienceText] = useState("");

  // Sync selected company when dropdown changes
  useEffect(() => {
    if (selectedCompanyId !== "custom") {
      const found = clients.find((c) => c.id === selectedCompanyId);
      if (found) {
        setNiche(found.niche);
        setBudget(`R$ ${found.monthlyBudget.toLocaleString('pt-BR')} / mês`);
      }
    }
  }, [selectedCompanyId, clients]);

  const getEffectiveGoal = () => {
    if (selectedGoalOption === "✏️ Outro Objetivo Personalizado...") {
      return customGoalText.trim() || "Geração de Vendas";
    }
    return selectedGoalOption.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
  };

  const getEffectiveAudience = () => {
    if (selectedAudienceOption === "✏️ Outro / Personalizado...") {
      return customAudienceText.trim() || "Público geral";
    }
    return selectedAudienceOption;
  };

  const [loading, setLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState<GeneratedCampaign | null>({
    campaignName: "Marktivo_GADS_OdontoPrime_Search_Leads_v1",
    targetAudienceDetailed: [
      "Pessoas buscando tratamentos estéticos dentários na cidade",
      "Público de alta renda interessado em Invisalign e Lentes de Contato Dental",
      "Remarketing de visitantes dos últimos 30 dias na Landing Page",
    ],
    adGroups: [
      {
        name: "Grupo 1: Lentes de Contato Dental (Alta Intenção)",
        matchType: "Correspondência de Frase \" \" e Exata [ ]",
        keywords: [
          "\"lentes de contato dental preco\"",
          "\"quanto custa lente nos dentes\"",
          "\"clinica de facetas de porcelana\"",
          "[lente de contato dental em balneario]",
          "\"melhor dentista para lentes de contato\"",
        ],
        negativeKeywords: [
          "gratis",
          "pdf",
          "curso",
          "vagas de emprego",
          "faculdade",
          "caseiro",
        ],
      },
      {
        name: "Grupo 2: Implantes Odontológicos Protocolo",
        matchType: "Correspondência de Frase \" \"",
        keywords: [
          "\"implante dentario valor\"",
          "\"protocolo carga imediata\"",
          "\"especialista em implante dentario\"",
          "\"clinica odontologica implante\"",
        ],
        negativeKeywords: [
          "como fazer em casa",
          "concurso",
          "salario",
          "SUS",
        ],
      },
    ],
    adCopies: [
      {
        headline: "Sorriso Perfeito em Poucas Sessões",
        description: "Lentes de Contato Dental de alta durabilidade e acabamento natural. Agende sua avaliação sem compromisso na OdontoPrime.",
        cta: "Agendar Avaliação pelo WhatsApp",
        primaryText: "Recupere sua autoestima com quem é referência em estética dental. Atendimento personalizado e parcelamento facilitado.",
        nicheAngle: "Foco em Estética e Confiança Social",
      },
      {
        headline: "Lentes de Contato Dental Sem Dor",
        description: "Tecnologia de ponta em facetas e lentes de porcelana. Venha conquistar o sorriso dos seus sonhos com especialistas renomados.",
        cta: "Falar com Especialista",
        primaryText: "Transformação completa do seu sorriso com simulação 3D prévia antes do procedimento.",
        nicheAngle: "Foco em Tecnologia e Sem Dor",
      },
    ],
    budgetAllocation: "60% do orçamento focado em Google Search (Captura de alta intenção) + 40% em Meta Ads (Instagram Reels & Feed para remarketing visual).",
    optimizationTips: [
      "Adicionar extensão de chamada e extensões de imagem com sorrisos reais dos pacientes.",
      "Ajustar lances de dispositivo: Aumentar +15% para smartphones.",
      "Configurar ação de conversão específica para clique no botão do WhatsApp na Landing Page.",
    ],
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateCampaign = async () => {
    setLoading(true);
    const effectiveGoal = getEffectiveGoal();
    const effectiveAudience = getEffectiveAudience();

    try {
      const response = await apiFetch("/api/ai/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          niche, 
          goal: effectiveGoal, 
          platform, 
          budget, 
          targetAudience: effectiveAudience 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao gerar campanha");
      setCampaignResult(data);
    } catch (err: any) {
      alert(`Falha ao gerar estrutura de campanha: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (textKey: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(textKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportCSV = () => {
    if (!campaignResult) return;

    let csvContent = "data:text/csv;charset=utf-8,Grupo de Anuncios,Palavra Chave,Palavra Chave Negativa\n";
    campaignResult.adGroups.forEach((group) => {
      group.keywords.forEach((kw) => {
        csvContent += `"${group.name}","${kw}",""\n`;
      });
      group.negativeKeywords.forEach((neg) => {
        csvContent += `"${group.name}","","${neg}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marktivo_campanha_${niche.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            Gerador de Campanhas & Palavras-Chave de Alta Conversão
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crie estruturas completas de anúncios para Google Ads e Meta Ads organizadas por nicho de atuação em segundos.
          </p>
        </div>

        {campaignResult && (
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Exportar para Google/Meta CSV</span>
          </button>
        )}
      </div>

      {/* Form Controls */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-indigo-400 block mb-1">1. Selecione a Empresa / Cliente *</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                🏢 {c.name} ({c.niche})
              </option>
            ))}
            <option value="custom">✏️ Outra Empresa / Nova Empresa Externa...</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Nicho de Atuação / Produto</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Odontologia Estética..."
              className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <VoiceInputBtn onResult={setNiche} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-indigo-400 block mb-1">2. Objetivo da Campanha *</label>
          <select
            value={selectedGoalOption}
            onChange={(e) => setSelectedGoalOption(e.target.value)}
            className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CAMPAIGN_GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {selectedGoalOption === "✏️ Outro Objetivo Personalizado..." && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Digite o objetivo específico da campanha..."
                value={customGoalText}
                onChange={(e) => setCustomGoalText(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-indigo-500/60 focus:outline-none"
              />
              <VoiceInputBtn onResult={setCustomGoalText} />
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Plataformas</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Google Ads Search & Meta Ads">Google Ads Search + Meta Ads</option>
            <option value="Google Ads Search Apenas">Google Ads Search (Rede de Pesquisa)</option>
            <option value="Google Performance Max (PMax)">Google Performance Max (PMax)</option>
            <option value="Meta Ads (Instagram Reels & Feed)">Meta Ads (Instagram Reels & Feed)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Orçamento Estimado</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: R$ 50/dia ou R$ 3.000/mês"
              className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <VoiceInputBtn onResult={setBudget} />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-300 block mb-1">Público-Alvo & Localização</label>
          <select
            value={selectedAudienceOption}
            onChange={(e) => setSelectedAudienceOption(e.target.value)}
            className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          >
            {TARGET_AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {selectedAudienceOption === "✏️ Outro / Personalizado..." && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customAudienceText}
                onChange={(e) => setCustomAudienceText(e.target.value)}
                placeholder="Ex: Homens e Mulheres de 30 a 65 anos na cidade X interessados em imóveis"
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <VoiceInputBtn onResult={setCustomAudienceText} />
            </div>
          )}
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            onClick={handleGenerateCampaign}
            disabled={loading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span>{loading ? "Gerando Estrutura com IA..." : "Gerar Estrutura de Campanha com IA"}</span>
          </button>
        </div>
      </div>

      {/* Generated Results Output */}
      {campaignResult && (
        <div className="space-y-6">
          {/* Campaign Header & Budget Strategy */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Nome Sugerido da Campanha
                </span>
                <h2 className="text-lg font-black text-white mt-1">{campaignResult.campaignName}</h2>
              </div>

              <button
                onClick={() => handleCopyText("camp_name", campaignResult.campaignName)}
                className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                {copiedKey === "camp_name" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copiar Nome</span>
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Estratégia de Alocação de Verba:</h4>
              <p className="text-xs text-slate-300 bg-slate-850 p-3 rounded-xl border border-slate-800">
                {campaignResult.budgetAllocation}
              </p>
            </div>

            {/* Target Audiences */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Segmentação de Público Recomendada:</h4>
              <div className="flex flex-wrap gap-2">
                {campaignResult.targetAudienceDetailed?.map((aud, i) => (
                  <span key={i} className="bg-slate-800 text-slate-200 text-xs px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-cyan-400" />
                    {aud}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Groups & Keywords Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaignResult.adGroups.map((group, idx) => (
              <div key={idx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-400" />
                    {group.name}
                  </h3>
                  {group.matchType && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {group.matchType}
                    </span>
                  )}
                </div>

                {/* Keywords List */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                    <span>Palavras-Chave de Busca ({group.keywords.length})</span>
                    <button
                      onClick={() => handleCopyText(`kw_${idx}`, group.keywords.join("\n"))}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === `kw_${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      Copiar
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 space-y-1 max-h-40 overflow-y-auto">
                    {group.keywords.map((kw, k) => (
                      <div key={k}>{kw}</div>
                    ))}
                  </div>
                </div>

                {/* Negative Keywords List */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-1">
                    <span>Palavras-Chave Negativas ({group.negativeKeywords.length})</span>
                    <button
                      onClick={() => handleCopyText(`neg_${idx}`, group.negativeKeywords.join("\n"))}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === `neg_${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      Copiar
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-rose-300 space-y-1 max-h-32 overflow-y-auto">
                    {group.negativeKeywords.map((neg, n) => (
                      <div key={n}>- {neg}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ad Copies & Creative Angles */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Flame className="h-5 w-5 text-amber-500" />
              Copys Publicitárias & Ângulos de Vendas Gerados
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignResult.adCopies.map((ad, i) => (
                <div key={i} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {ad.nicheAngle || `Anúncio ${i + 1}`}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          `ad_${i}`,
                          `Título: ${ad.headline}\nDescrição: ${ad.description}\nCTA: ${ad.cta}\nTexto Principal: ${ad.primaryText}`
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === `ad_${i}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      Copiar Copy
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Título do Anúncio:</span>
                    <div className="text-sm font-bold text-white">{ad.headline}</div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Descrição:</span>
                    <div className="text-xs text-slate-200">{ad.description}</div>
                  </div>

                  {ad.primaryText && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block">Texto Principal (Meta Ads):</span>
                      <div className="text-xs text-slate-300 italic">{ad.primaryText}</div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Chamada para Ação:</span>
                    <span className="font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {ad.cta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Tips */}
          {campaignResult.optimizationTips && (
            <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 p-5 rounded-2xl border border-indigo-800/60 space-y-2">
              <h4 className="font-bold text-indigo-200 text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Dicas de Otimização Recomendadas para Esta Campanha
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-5 list-disc">
                {campaignResult.optimizationTips.map((tip, t) => (
                  <li key={t}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
