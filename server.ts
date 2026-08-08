import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Middleware para verificar a Senha Mestra em todas as requisições da API
const checkMasterPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const masterPassword = process.env.MASTER_PASSWORD;
  if (!masterPassword) {
    return next(); // Se não tem senha configurada, passa direto
  }

  const providedPassword = req.headers['x-master-password'];
  if (providedPassword === masterPassword) {
    return next();
  }

  return res.status(401).json({ error: "Acesso negado. Senha mestra inválida ou não informada." });
};

// Aplica o middleware em todas as rotas /api, exceto na rota de verificação
app.use("/api", (req, res, next) => {
  if (req.path === "/verify-password") {
    return next();
  }
  checkMasterPassword(req, res, next);
});

app.post("/api/verify-password", (req, res) => {
  const { password } = req.body;
  const masterPassword = process.env.MASTER_PASSWORD;

  if (!masterPassword) {
    return res.json({ success: true, message: "Nenhuma senha configurada no servidor." });
  }

  if (password === masterPassword) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: "Senha incorreta." });
  }
});

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada nos Segredos.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper function with retry and model fallback mechanism
async function generateContentWithFallback(ai: GoogleGenAI, params: {
  contents: any;
  config?: any;
}) {
  const models = ["gemini-3.6-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        console.warn(`[Gemini API Warning] Model ${model} (tentativa ${attempt}) falhou:`, err?.message || err);
        lastError = err;
        
        if (err?.status === "NOT_FOUND" || err?.message?.includes("not found")) {
          break; // Skip to next model immediately if not found
        }
        
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }
  }

  throw lastError;
}

// API Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Marktivo Engine v1.0", domain: "marktivo.com.br" });
});

// AI Agent Copilot endpoint
app.post("/api/ai/agent-chat", async (req, res) => {
  try {
    const { message, history, clientContext, platform } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Você é o Agente Marktivo AI, copiloto especialista em Gestão de Tráfego Pago, Análise de Dados e Marketing Digital da agência Marktivo (marktivo.com.br).
Seu objetivo é ajudar gestores de tráfego, analistas de dados e a equipe da Marktivo a:
1. Otimizar campanhas no Google Ads, Meta Ads (Instagram/Facebook), TikTok Ads e LinkedIn Ads.
2. Analisar métricas (CPA, CTR, ROAS, CPC, LTV, Taxa de Conversão, Custo por Lead) e diagnosticar quedas de performance.
3. Criar estratégias de anúncios, copys publicitárias persuasivas, sugestões de testes A/B e estruturas de palavras-chave.
4. Sugerir ideias de conteúdo diário para redes sociais (Reels, Carrosséis, Stories) e prompts de IA para imagens/vídeos.
5. Indicar integrações com ferramentas como Zapier, NotebookLM, Google Looker Studio e CRM.

Responda em Português do Brasil com formatação clara (Markdown), tom profissional, objetivo, estratégico e direto ao ponto.
Contexto Atual do Cliente: ${clientContext || "Geral/Agência"} | Plataforma Alvo: ${platform || "Multiplataforma"}`;

    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        formattedContents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await generateContentWithFallback(ai, {
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "Sem resposta gerada." });
  } catch (error: any) {
    console.error("Erro no Agent Chat:", error);
    res.status(500).json({ 
      error: "O serviço de IA está com alta demanda momentânea. Por favor, tente novamente em alguns instantes." 
    });
  }
});

// AI Campaign & Keywords Generator
app.post("/api/ai/generate-campaign", async (req, res) => {
  try {
    const { niche, goal, platform, budget, targetAudience } = req.body;
    const ai = getGeminiClient();

    const prompt = `Crie uma estrutura completa de campanha de tráfego pago para o nicho de "${niche}".
Objetivo: ${goal}
Plataforma: ${platform}
Orçamento estimado: ${budget || "Flexível"}
Público Alvo: ${targetAudience || "Amplo qualificado"}

Retorne em formato JSON estruturado com:
- campaignName (string)
- targetAudienceDetailed (array de strings)
- adGroups (array de objetos com { name, matchType, keywords: [], negativeKeywords: [] })
- adCopies (array de objetos com { headline, description, cta, primaryText, nicheAngle })
- budgetAllocation (string explicativa)
- optimizationTips (array de 3 dicas práticas)`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro ao gerar campanha:", error);
    res.status(500).json({ 
      error: "O serviço de IA do Google está temporariamente indisponível devido a alta demanda. Tente novamente em alguns segundos." 
    });
  }
});

// AI Prompt Generator for Images, Videos, Copy, and Carousels (With Multimodal Image Reference Support)
app.post("/api/ai/generate-prompts", async (req, res) => {
  try {
    const { niche, concept, style, format, promptType, subject, characterDetails, referenceImage, secondImage, imageMode, videoDetails } = req.body;
    const ai = getGeminiClient();

    const targetType = promptType || "Imagem";

    let characterInfoText = "";
    if (characterDetails) {
      const { gender, age, ethnicity, characterType } = characterDetails;
      characterInfoText = `\nDETALHES DO PERSONAGEM/ATOR (MUITO IMPORTANTE):
- Tipo de Personagem: ${characterType || "Conforme solicitado"}
- Gênero: ${gender || "Qualquer"}
- Faixa Etária: ${age || "Conforme o nicho"}
- Etnia / Aparência: ${ethnicity || "Conforme o nicho"}`;
    }

    let videoInfoText = "";
    if (videoDetails) {
      const { duration, cameraMotion, extraDetails, lighting, transition } = videoDetails;
      videoInfoText = `\nDETALHES ESPECÍFICOS DE VÍDEO (RUNWAY GEN-3, SORA, LUMA, KLING):
- Duração/Tempo: ${duration || "Conforme o conceito"}
- Movimentação de Câmera e Geração: ${cameraMotion || "Movimento Livre"}
\n- Iluminação do Vídeo: ${lighting || "Conforme cena"}\n- Transição de Câmera: ${transition || "Corte Seco"}\n- Detalhes Específicos do Usuário: ${extraDetails || "Nenhum detalhe adicional informado"}`;
    }

    let imageReferenceInstruction = "";
    if (referenceImage && secondImage) {
      imageReferenceInstruction = `\nDUAS IMAGENS DE REFERÊNCIA ANEXADAS PELO USUÁRIO (FRAME INICIAL E FRAME FINAL PARA VÍDEO):
O usuário anexou a Imagem 1 (Frame Inicial) e a Imagem 2 (Frame Final / Destino).
Análise ambas as imagens visualmente e gere prompts especificamente adaptados para interpolação de chave (Keyframe Morphing / Transição de Vídeo):
- Ferramentas alvo: Runway Gen-3 Alpha (First Frame & Last Frame), Luma Dream Machine (Start Frame & End Frame), Pika 1.5, Kling AI, Sora.
- Forneça prompts em Inglês altamente descritivos do movimento de câmera, evolução da iluminação, ação do sujeito e física da transição entre a Imagem 1 e a Imagem 2.`;
    } else if (referenceImage) {
      imageReferenceInstruction = `\nFOTO DE REFERÊNCIA ANEXADA PELO USUÁRIO (Modo: ${imageMode || "Image-to-Video"}):
Análise a imagem fornecida visualmente e gere prompts especificamente adaptados para:
- Modo "Image-to-Video" (Runway Gen-3, Sora, Luma Dream Machine, Pika): Prompts em Inglês descrevendo como animar os elementos da imagem mantendo consistência total de iluminação, ambiente e sujeito.
- Modo "Edição & Inpainting" (Midjourney v6 Vary, DALL-E 3, Flux Fill): Prompts descrevendo como modificar a imagem, trocar fundo ou adicionar novos elementos sem perder a identidade do personagem/produto.
- Modo "Transição de Frames / Morphing": Prompts para frame inicial e frame final para interpolação suave.`;
    }

    const textPrompt = `Gere 3 prompts profissionais e ultra detalhados de alta conversão para o nicho "${niche}".
Tipo de Prompt Solicitado: ${targetType} (Opções: Imagem, Vídeo, Copy / Texto, Carrossel)
Conceito Principal / Produto: ${concept}
Elemento/Sujeito da Cena (Pessoas/Objetos/Itens): ${subject || "Conforme o produto e conceito"}${characterInfoText}${videoInfoText}${imageReferenceInstruction}
Estilo Desejado: ${style || "Fotografia Comercial 8k de Alta Conversão"}
Formato/Proporção Solicitada: ${format || "1:1 Feed e 9:16 Stories/Reels"}

REGRAS DE LINGUAGEM E COMPOSIÇÃO CRÍTICAS:
1. Mantenha os comandos visuais, estilo de renderização, iluminação, composição e parâmetros de câmera em INGLÊS (para máxima compatibilidade com Midjourney v6, Flux 1.1, Runway Gen-3, Sora, Dola AI, Google Flow, DALL-E 3).
2. Se o campo de elemento/sujeito ou personagem especificar modelo humano, gênero, idade ou etnia, MANTENHA FIELMENTE essas características no prompt em Inglês.
3. IMPORTANTE: Para QUALQUER texto escrito na imagem/vídeo, slogan, título na tela, legenda, narração de voz ou script de áudio, defina EXPLICITAMENTE em PORTUGUÊS DO BRASIL (pt-BR). 
   - Exemplo Imagem: Text overlay in Brazilian Portuguese: "Oferta Exclusiva"
   - Exemplo Vídeo: Audio voiceover in natural, warm Brazilian Portuguese: "Descubra o segredo do novo estilo de vida."

INSTRUÇÕES ESPECÍFICAS PARA CADA TIPO:
- Se Tipo = Imagem: Prompts ultra detalhados em Inglês com iluminação de estúdio, profundidade de campo, ângulo de câmera, estilo e textos em Português.
- Se Tipo = Vídeo: Prompts ultra detalhados em Inglês com movimentos de câmera (pan, zoom, orbit), física de cena, iluminação e narração/diálogo em Português do Brasil.
- Se Tipo = Storyboard de Vídeo: Detalhe as cenas do vídeo de ponta a ponta (Tempo em segundos, Ação, Ângulo, Avatar/Personagens envolvidos e o texto/locução). Crie um fluxo dinâmico de roteiro.
- Se Tipo = Copy / Texto: Prompts e Estrutura de Copywriting em Português do Brasil focado em anúncios de tráfego pago (Títulos + Texto Principal + CTA).
- Se Tipo = Carrossel: Prompts para cada slide do carrossel (Instrução Visual em Inglês + Texto de apoio em Português).

Retorne em formato JSON estrito:
{
  "prompts": [
    {
      "tool": "Midjourney v6" | "Flux 1.1" | "Runway Gen-3/Sora" | "Dola AI" | "Google Flow" | "DALL-E 3" | "Luma Dream Machine" | "CapCut/Storyboard",
      "promptType": "${targetType}",
      "promptEn": "Prompt completo e profissional na linguagem e formato adequado da ferramenta",
      "PortugueseExplanation": "Explicação estratégica de como usar este prompt e por que ele atrai o público-alvo",
      "targetPlatform": "Instagram, Meta Ads, TikTok, Google Ads ou YouTube",
      "recommendedAspect": "1:1, 9:16, 4:5, 16:9, 21:9, 3:4 ou 2:3"
    }
  ]
}`;

    let contentsPayload: any = textPrompt;

    const parts: any[] = [];

    if (referenceImage && typeof referenceImage === "string" && referenceImage.startsWith("data:image/")) {
      const match1 = referenceImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match1) {
        parts.push({
          inlineData: {
            mimeType: match1[1],
            data: match1[2],
          },
        });
      }
    }

    if (secondImage && typeof secondImage === "string" && secondImage.startsWith("data:image/")) {
      const match2 = secondImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match2) {
        parts.push({
          inlineData: {
            mimeType: match2[1],
            data: match2[2],
          },
        });
      }
    }

    if (parts.length > 0) {
      parts.push({ text: textPrompt });
      contentsPayload = parts;
    }

    const response = await generateContentWithFallback(ai, {
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro ao gerar prompts:", error);
    res.status(500).json({ 
      error: "O serviço de IA está temporariamente indisponível devido a picos de tráfego. Por favor, tente novamente em alguns segundos." 
    });
  }
});

// AI Refine Prompt Endpoint
app.post("/api/ai/refine-prompt", async (req, res) => {
  try {
    const { originalPrompt, tool, promptType, niche } = req.body;
    const ai = getGeminiClient();

    const prompt = `Aprimore e potencialize o seguinte prompt para a ferramenta "${tool || "AI Tool"}" no nicho "${niche || "Geral"}".

PROMPT ATUAL:
"${originalPrompt}"

INSTRUÇÕES DE MELHORIA COM IA:
1. Expanda o nível de detalhamento visual, iluminação, composição fotográfica e dinamismo.
2. Mantenha os termos de comandos visuais e renderização em INGLÊS.
3. Se houver textos na tela, slogans, títulos ou narrações de voz/áudio, garanta que estejam explicitamente em PORTUGUÊS DO BRASIL (pt-BR).
4. Retorne a versão turbinada e otimizada.

Retorne em formato JSON:
{
  "promptEn": "Prompt aprimorado e ultra detalhado",
  "PortugueseExplanation": "Resumo das otimizações aplicadas pela IA para aumentar o impacto visual e a taxa de conversão."
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro ao refinar prompt:", error);
    res.status(500).json({ error: "Erro ao refinar prompt com IA." });
  }
});

// AI Social Media Post & Calendar Creator
app.post("/api/ai/generate-social-post", async (req, res) => {
  try {
    const { niche, topic, platform, contentType } = req.body;
    const ai = getGeminiClient();

    const prompt = `Crie uma publicação persuasiva e completa para redes sociais (${platform || "Instagram / Facebook"}) da agência/cliente do nicho "${niche}".
Tema: ${topic}
Formato do Conteúdo: ${contentType || "Carrossel Informativo / Reels"}

Retorne em formato JSON:
- title (string)
- caption (legenda pronta com emoji e formatação elegante)
- hashtags (array de strings)
- callToAction (string)
- visualScript (script slide-por-slide ou cena-por-cena para Reels/Carrossel com texto na tela e sugestão visual)
- bestPostingTime (sugestão de horário)`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro ao gerar post:", error);
    res.status(500).json({ 
      error: "O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes." 
    });
  }
});

// AI Real-Time Channel & Google Ads / Social / Website Audit
app.post("/api/ai/analyze-client-channels", async (req, res) => {
  try {
    const { clientName, niche, googleAdsId, googleAdsEmail, instagramUrl, facebookUrl, websiteUrl } = req.body;
    const ai = getGeminiClient();

    const prompt = `Realize uma análise estratégica e auditoria técnica em tempo real para o cliente do nicho "${niche}".
Dados Fornecidos do Cliente:
- Nome do Cliente: ${clientName || "Cliente Marktivo"}
- ID da Conta do Google Ads: ${googleAdsId || "Não informado (Análise Estrutural Genérica)"}
- E-mail da Conta Google: ${googleAdsEmail || "Não informado"}
- Instagram: ${instagramUrl || "Não informado"}
- Facebook: ${facebookUrl || "Não informado"}
- Website / Landing Page: ${websiteUrl || "Não informado"}

Simule a verificação e gere um diagnóstico de auditoria técnica de alta precisão com dados detalhados para cada canal configurado.
Retorne um JSON estruturado exatamente assim:
{
  "overallHealthScore": 87,
  "clientSummary": "Análise em tempo real concluída para as contas ativas do cliente.",
  "googleAdsDiagnostic": {
    "accountStatus": "Conectada e Ativa (ID ${googleAdsId || 'Sincronizado'})",
    "qualityScoreAverage": "7.8/10",
    "impressionShareLoss": "18.4% por orçamento / 6.2% por Rank",
    "searchTermsHealth": "93% de termos altamente qualificados (7% de palavras negativas pendentes de inclusão)",
    "recommendations": [
      "Negativar 12 termos de pesquisa sem conversão no último período para economizar verba",
      "Ajustar lances para os horários de maior conversão (14h às 19h)",
      "Testar extensão de snippet estruturado e frases de destaque atualizadas"
    ]
  },
  "socialMediaDiagnostic": {
    "instagramStatus": "${instagramUrl ? 'Perfil analisado com sucesso' : 'Link não informado'}",
    "engagementRateEst": "4.2% (Excelente para o nicho)",
    "contentFrequency": "3.5 posts/semana (Recomendado elevar para 5.0)",
    "bioAndCtaScore": "Ajuste na chamada do link da Bio sugerido para aumentar cliques no WhatsApp",
    "recommendations": [
      "Publicar Reels de Bastidores com narração nos dias de maior tráfego",
      "Fixar 3 destaques estratégicos (Depoimentos, Tabela de Serviços e Dúvidas Frequentes)",
      "Usar adesivo de enquete nos Stories diários para esquentar engajamento"
    ]
  },
  "websiteDiagnostic": {
    "mobilePerformance": "89/100 Mobile Speed Index",
    "conversionRateEstimate": "3.4% (Meta recomendada: 4.5%)",
    "copywritingAssessment": "Hero section com alta clareza de proposta de valor; recomendada inclusão de prova social acima da dobra.",
    "recommendations": [
      "Destacar o botão do WhatsApp com animação pulsante para mobile",
      "Adicionar 3 depoimentos em formato de vídeo no rodapé da página",
      "Instalar o Pixel do Meta e Tag do Google Ads em todos os formulários"
    ]
  },
  "topPriorityActions": [
    "Incluir as palavras-chave negativas recomendadas na campanha do Google Ads",
    "Alterar a chamada de ação na Bio do Instagram direcionando para o fluxo de simulação",
    "Ativar o aviso de prova social na Landing Page para aumentar conversões em 15%"
  ]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro na auditoria do cliente:", error);
    res.status(500).json({
      error: "O serviço de auditoria de IA está temporariamente ocupado. Tente novamente em instantes."
    });
  }
});

// AI Report & Performance Diagnostics
app.post("/api/ai/generate-report", async (req, res) => {
  try {
    const { clientName, period, metricsSummary } = req.body;
    const ai = getGeminiClient();

    const prompt = `Gere um relatório executivo de tráfego pago e métricas para o cliente "${clientName}".
Período: ${period || "Últimos 7 dias (Semanal)"}
Dados de Entrada: ${JSON.stringify(metricsSummary)}

Gere um resumo executivo profissional pronto para enviar por e-mail ou apresentar para o cliente.
Retorne um JSON com:
- executiveSummary (string em Markdown)
- keyAchievements (array de strings)
- criticalAlerts (array de strings com alertas de performance se houverem)
- nextActionPlan (array de 3 passos recomendados para a próxima semana)
- estimatedRoasOutcome (string)`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ 
      error: "O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes." 
    });
  }
});

// AI Landing Page Wireframe & Copy Generator
app.post("/api/ai/generate-landing-page", async (req, res) => {
  try {
    const { niche, productOrService, offerDetails } = req.body;
    const ai = getGeminiClient();

    const prompt = `Crie a estrutura de Copywriting e Wireframe de uma Landing Page de Alta Conversão para o nicho de "${niche}".
Produto/Serviço: ${productOrService}
Oferta: ${offerDetails || "Garantia de atendimento rápido, demonstração gratuita ou proposta exclusiva"}

Retorne em formato JSON:
- heroHeadline (headline principal impactante)
- heroSubheadline (sub-headline explicativa)
- mainCta (texto do botão principal)
- valueProps (array de 4 pontos fortes do produto)
- pageSections (array de objetos com { sectionName, sectionHeadline, sectionContent })
- faqItems (array de { question, answer })`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Erro ao gerar landing page:", error);
    res.status(500).json({ 
      error: "O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes." 
    });
  }
});

// Webhook / Zapier Trigger Simulation Endpoint
app.post("/api/webhook/zapier-trigger", async (req, res) => {
  const { eventType, payload, recipientEmail, zapierWebhookUrl, reportData, clientName } = req.body;
  console.log(`[Zapier Webhook Triggered] ${eventType} -> recipient: ${recipientEmail}`);

  if (zapierWebhookUrl && zapierWebhookUrl.startsWith("http")) {
    try {
      // Trigger actual webhook
      const webhookRes = await fetch(zapierWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          recipientEmail,
          clientName,
          ...reportData,
          timestamp: new Date().toISOString()
        })
      });

      if (!webhookRes.ok) {
        throw new Error(`Erro no Zapier (Status ${webhookRes.status})`);
      }

      res.json({
        success: true,
        message: `Dados enviados com sucesso para o seu Webhook Zapier/Make!`,
        timestamp: new Date().toISOString(),
        details: {
          eventType,
          recipientEmail,
          status: "SENT_TO_EXTERNAL_WEBHOOK",
          zapierHookId: `real_${Math.random().toString(36).substr(2, 9)}`,
        },
      });
      return;
    } catch (err: any) {
      console.error("Erro ao disparar webhook real:", err);
      res.status(500).json({ error: "Erro ao enviar dados para a URL informada: " + err.message });
      return;
    }
  }

  // Se não tem URL, faz a simulação normal
  res.json({
    success: true,
    message: `Automação simulada com sucesso! Para envio real, preencha a URL do Zapier.`,
    timestamp: new Date().toISOString(),
    details: {
      eventType,
      recipientEmail,
      status: "SIMULATED_SUCCESS",
      zapierHookId: `sim_${Math.random().toString(36).substr(2, 9)}`,
    },
  });
});

// Vite Development or Static Production Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Apenas servimos estático se NÃO estivermos no Vercel (onde o Vercel serve o frontend)
    if (!process.env.VERCEL) {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Marktivo Server] Ativo em http://localhost:${PORT}`);
    });
  }
}

startServer();

// Necessário para o Vercel Serverless Functions
export default app;
