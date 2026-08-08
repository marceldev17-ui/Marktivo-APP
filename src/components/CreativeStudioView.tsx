import { apiFetch } from "../apiClient";
import React, { useState, useEffect } from "react";
import { GeneratedPrompt, GeneratedSocialPost, SavedPrompt } from "../types";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Layout, 
  Share2, 
  Copy, 
  Check, 
  Wand2, 
  Globe, 
  FileText,
  Bookmark,
  BookmarkCheck,
  Trash2,
  FolderHeart,
  X,
  ExternalLink,
  ChevronDown,
  Upload
} from "lucide-react";

import { VoiceInputBtn } from "./CampaignBuilderView";

const POPULAR_NICHES = [
  "🏋️ E-commerce, Fitness & Suplementos",
  "🏥 Saúde, Odontologia & Estética",
  "🏠 Imobiliário de Luxo & Construtoras",
  "🍕 Gastronomia, Bares & Restaurantes",
  "⚖️ Advocacia, Consultoria & Contabilidade",
  "🚗 Automotivo & Estética Automotiva",
  "📚 Educação, Cursos & Infoprodutos",
  "👗 Moda, Vestuário & Acessórios",
  "💻 Tecnologia, SaaS, Software & B2B",
  "🎨 Design, Marketing & Agências",
  "🐾 Pet Shop, Medicina Veterinária & Animais",
  "✈️ Turismo, Viagens, Hotéis & Pousadas",
  "🌿 Agro, Energia Solar & Indústria",
  "✏️ Outro / Digitar Nicho Personalizado..."
];

// Mapeamento dinâmico de Ideias de Anúncios por Nicho
const NICHE_CONCEPTS_MAP: Record<string, string[]> = {
  "E-commerce, Fitness & Suplementos": [
    "✨ Pote/Produto flutuando no ar com partículas de luz e iluminação neon",
    "📦 Unboxing cinematográfico da embalagem premium com abertura em câmera lenta",
    "⚡ Atleta suando em estúdio dark com foco macro no produto e raios de energia",
    "🔥 Antes e Depois impressionante de transformação física em alta resolução",
    "🥤 Shakeira misturando o produto com explosão de frutas e gotas d'água em 8k",
    "🏷️ Anúncio promocional com texto 'Oferta Exclusiva' em português e produto no centro",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Saúde, Odontologia & Estética": [
    "✨ Doutor(a) sorrindo em clínica ultramoderna com iluminação soft box clean",
    "🦷 Sorriso perfeito em close-up com brilho cinematográfico e acabamento de lente natural",
    "💆 Paciente relaxada recebendo tratamento estético em spa de alto padrão",
    "🔥 Antes e depois de harmonização com linha divisória luminosa e estúdio 8k",
    "🔬 Equipamento dermatológico/odontológico futurista em ação com feixes de luz",
    "🏷️ Anúncio com texto 'Agende Sua Avaliação' em português e ambiente acolhedor",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Imobiliário de Luxo & Construtoras": [
    "🏰 Mansão moderna ao pôr do sol com iluminação aconchegante e piscina iluminada",
    "🔑 Corretor de luxo abrindo a porta principal revelando sala duplex de 300m²",
    "👨‍👩‍👧 Família feliz na cozinha planejada de conceito aberto com luz natural",
    "🌇 Tour aéreo de drone FP9 voando do mar até a varanda do apartamento",
    "🛋️ Maquete 3D ultra detalhada do empreendimento com vegetação e luzes de led",
    "🏷️ Anúncio com texto 'Últimas Unidades no Lançamento' em português",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Gastronomia, Bares & Restaurantes": [
    "🍔 Hambúrguer artesanal caindo queijo derretido fumegando em super câmera lenta",
    "🍷 Taça de vinho sendo servida com reflexos de velas e jantar romântico de luxo",
    "👨‍🍳 Chef finalizando prato gourmet com pinça e flores comestíveis em close-up",
    "🍕 Pizza artesanal sendo puxada com queijo esticando e crosta crocante",
    "🍹 Drink autoral com gelo transparente, fumaça de nitrogênio e frutas frescas",
    "🏷️ Anúncio com texto 'Peça pelo Delivery' em português com apetite apelo",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Advocacia, Consultoria & Contabilidade": [
    "👔 Advogado/Consultor em escritório elegante de andar alto com vista panorâmica",
    "⚖️ Balança da justiça moderna em mesa de madeira nobre com iluminação dramática",
    "🤝 Aperto de mão entre executivos selando contrato de grande valor",
    "💻 Especialista analisando documentos e relatórios no tablet em ambiente corporativo",
    "🏷️ Anúncio com texto 'Proteja Seu Patrimônio' em português e fundo sóbrio",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Automotivo & Estética Automotiva": [
    "🏎️ Carro esportivo acelerando no asfalto molhado à noite com reflexos neon",
    "✨ Foco macro na pintura espelhada com gotas d'água e espuma de vitrificação",
    "🛞 Roda de liga leve em estúdio escuro com iluminação técnica de destaque",
    "🔑 Cliente recebendo as chaves do novo veículo no pátio da concessionária",
    "🏷️ Anúncio com texto 'Proteção Cerâmica Premium' em português",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Educação, Cursos & Infoprodutos": [
    "🚀 Aluno comemorando resultado de vendas/aprovação no celular em estúdio moderno",
    "📚 Palestrante no palco com luzes de grande evento e plateia atenta",
    "💻 Ambiente de estudos minimalista com notebook, café e anotações organizadas",
    "🎬 Criador de conteúdo gravando aula com câmera profissional e iluminação de led",
    "🏷️ Anúncio com texto 'Inscrições Abertas' em português com selo de garantia",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Moda, Vestuário & Acessórios": [
    "👠 Modelo desfilando em rua de capital fashion com iluminação de moda editorial",
    "🕶️ Óculos de sol/Relógio de luxo em estúdio reflexivo com raios solares e sombras",
    "👗 Troca rápida de looks em transição de vídeo fluida estilo Reels/TikTok",
    "🧵 Detalhes de costura e tecido de alta qualidade em foco macro super nítido",
    "🏷️ Anúncio com texto 'Nova Coleção de Verão' em português e cores vivas",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Tecnologia, SaaS, Software & B2B": [
    "📊 Dashboard 3D futurista com gráficos subindo e luzes neon ciano e roxo",
    "💻 Executivo trabalhando em laptop em escritório de vidro com cidade ao fundo",
    "🤖 Robô/IA interagindo com holograma de dados e métricas em tempo real",
    "🔒 Escudo digital de segurança cibernética com feixes de luz e conexões",
    "🏷️ Anúncio com texto 'Automação Inteligente para Sua Empresa' em português",
    "✏️ Outro / Digitar conceito personalizado..."
  ],
  "Geral": [
    "✨ Pote/Produto flutuando no ar com partículas de luz e iluminação neon",
    "📦 Unboxing/Abertura de caixa cinematográfica em estúdio de alto padrão",
    "⚡ Antes e Depois impressionante de transformação de cliente em alta resolução",
    "🔥 Anúncio promocional com texto 'Oferta Exclusiva' em português e elementos 3D",
    "🏰 Lifestyle de luxo com modelo usando o produto em ambiente sofisticado",
    "🎥 Vídeo dinâmico de uso do produto com cortes rápidos e narração em português",
    "🌿 Estúdio minimalista com sombras suaves e estética clean elegante",
    "✏️ Outro / Digitar conceito personalizado..."
  ]
};

// Opções de Sujeitos / Elementos na Cena
const SCENE_SUBJECTS = [
  "📦 Apenas Produto / Objeto (Sem Pessoas, Foco Total na Embalagem/Item)",
  "👤 Modelo Humano interagindo com o Produto (Uso Real, Segurando, Experimentando)",
  "🌟 Atleta / Modelo Profissional de Luxo (Postura Editorial, Estética de Comercial)",
  "👩‍⚕️ Especialista / Profissional no Local de Trabalho (Doutor, Chef, Corretor, CEO)",
  "👨‍👩‍👧 Família ou Grupo de Clientes Felizes e Satisfeitos",
  "🎨 Avatar 3D / Personagem de Animação",
  "🐾 Mascote / Animal em Cena (Cão, Gato, Leão, Águia, etc.)",
  "👽 Extraterrestre / Alienígena / Personagem Sci-Fi",
  "🤖 Robô / Android Futurista / Ciborgue",
  "🏛️ Cenário / Arquitetura / Ambiente de Luxo (Foco no Local, Sem Pessoas)",
  "✨ Elemento Abstrato / Animação 3D Futurista",
  "✏️ Outro / Digitar Sujeito Personalizado..."
];

// Detalhes do Ator / Personagem
const CHARACTER_TYPES = [
  "👤 Modelo Humano Realista (Comercial / Fotografia)",
  "🎨 Avatar 3D (Estilo Pixar / Disney / Animação)",
  "🐾 Mascote / Animal (Cão, Gato, Leão, Águia, etc.)",
  "👽 Extraterrestre / Alienígena / Personagem Sci-Fi",
  "🤖 Robô / Android Futurista / Ciborgue",
  "👩‍💼 Executivo / Profissional Especialista",
  "🏋️ Atleta / Fitness de Alta Performance",
  "📦 Apenas Objeto / Produto (Sem Pessoas na Cena)",
];

const CHARACTER_GENDERS = [
  "Qualquer / Conforme o contexto",
  "👩 Mulher",
  "👨 Homem",
  "👫 Casal (Homem e Mulher)",
  "👥 Grupo / Equipe de Pessoas",
  "✨ Agênero / Andrógeno / Unissex"
];

const CHARACTER_AGES = [
  "Qualquer / Conforme o contexto",
  "👶 Criança / Bebê (2 a 10 anos)",
  "🧑 Jovem / Adolescente (15 a 22 anos)",
  "👨 Jovem Adulto (23 a 35 anos)",
  "🧔 Adulto Maduro (36 a 52 anos)",
  "👴 Sênior / Terceira Idade (55+ anos)"
];

const CHARACTER_ETHNICITIES = [
  "Qualquer / Conforme o contexto",
  "🏿 Negra / Afrodiaspórica",
  "🏽 Parda / Latina / Hispânica",
  "🏻 Branca / Caucasiana",
  "🌏 Asiática (Leste / Sudeste Asiático)",
  "🇮🇳 Indiana / Sul-Asiática",
  "🪶 Indígena / Nativa",
  "🕌 Árabe / Oriente Médio",
  "🌌 Fantasia / Peles Coloridas (Verde, Azul, Cromada, Dourada)"
];

// Sugestões de Adição Rápida (Chips / Tags)
const QUICK_ELEMENT_TAGS = [
  "✨ Partículas de Luz",
  "⚡ Efeito Neon",
  "💧 Gotas d'água",
  "💨 Fumaça/Vapor de Estúdio",
  "📸 Foco Macro Nítido",
  "👤 Modelo Humano de Luxo",
  "🔥 Texto 'Oferta Especial'",
  "🏆 Texto 'Mais Vendido'",
  "🌿 Plantas / Estética Clean",
  "💎 Brilho 8k Octane Render",
];

const VISUAL_STYLES = [
  "📸 Fotografia Comercial 8k (Iluminação Cinematográfica de Estúdio, Foco Nítido)",
  "🎨 Animação 3D Disney / Pixar (Colorido, Expressivo, Iluminação Encantadora)",
  "💎 3D Render Hiper-Realista (Octane Render, Unreal Engine 5, Raytracing, 8k)",
  "📷 Fotografia Realista com Luz Natural (Estilo Documentário, Tons Quentes)",
  "🎨 Pintura em Aquarela Artística (Cores Suaves, Pinceladas Fluídas e Elegante)",
  "🖌️ Pintura a Óleo Clássica (Textura de Tela, Iluminação Dramática de Galeria)",
  "🖤 Fotografia Preto e Branco Dramática (Alto Contraste, Estilo Noir, Elegante)",
  "📻 Retrô / Vintage Anos 80 (Cores Neon, Textura VHS, Synthwave)",
  "🌃 Cyberpunk Futurista (Luzes Neon Violeta e Ciano, Chuva e Hologramas)",
  "🖼️ Ilustração Vetorial Plana Modern (Flat Art, Cores Vibrantes para Anúncios)",
  "💥 Estilo HQ / Quadrinhos (Linhas Marcadas, Pop Art, Efeitos de Ação)",
  "✨ Estilo Lofi / Chillwave (Tons Pastéis, Atmosfera Aconchegante e Relaxante)",
  "🎨 Estilo Studio Ghibli (Anime Clássico, Cenários Detalhados e Naturais)",
  "🗿 Escultura Clássica de Mármore (Iluminação Suave, Estética Elegante e Pura)",
  "🖌️ Ilustração Infantil (Lúdico, Cores Vivas, Traços Arredondados e Fofos)",
  "✏️ Outro / Digitar estilo personalizado..."
];

const ASPECT_RATIOS = [
  "1:1 (Quadrado Perfeito - Feed Meta / LinkedIn / WhatsApp)",
  "9:16 (Vertical Reels / TikTok / Shorts / Stories - 1080x1920)",
  "4:5 (Retrato Vertical - Feed Instagram / Facebook - Alto Engajamento)",
  "16:9 (Landscape Widescreen - YouTube / Google Display / TV)",
  "21:9 (Ultra-Wide Cinematográfico - Banners / B-Roll / Vídeos)",
  "3:4 (Retrato Clássico - Pinterest / TikTok Card / E-commerce)",
  "2:3 (Fotográfico Vertical - Catalogo de Moda / E-commerce)"
];

export const CreativeStudioView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"prompts" | "social" | "landing">("prompts");

  // 1. Prompts Generator State
  const [selectedNicheOption, setSelectedNicheOption] = useState("🏋️ E-commerce, Fitness & Suplementos");
  const [customNiche, setCustomNiche] = useState("");
  const [promptType, setPromptType] = useState<"Imagem" | "Vídeo" | "Storyboard de Vídeo" | "Copy / Texto" | "Carrossel">("Imagem");

  const [selectedConceptPreset, setSelectedConceptPreset] = useState("✨ Pote/Produto flutuando no ar com partículas de luz e iluminação neon");
  const [promptConcept, setPromptConcept] = useState("Pote de suplemento premium flutuando com luzes neon e iluminação de estúdio");

  const [selectedSubjectPreset, setSelectedSubjectPreset] = useState("📦 Apenas Produto / Objeto (Sem Pessoas, Foco Total na Embalagem/Item)");
  const [promptSubject, setPromptSubject] = useState("Apenas produto em destaque com foco macro e detalhes nítidos");

  // Detalhes estendidos de personagens
  const [charType, setCharType] = useState("👤 Modelo Humano Realista (Comercial / Fotografia)");
  const [charGender, setCharGender] = useState("Qualquer / Conforme o contexto");
  const [charAge, setCharAge] = useState("👨 Jovem Adulto (23 a 35 anos)");
  const [charEthnicity, setCharEthnicity] = useState("Qualquer / Conforme o contexto");

  // Anexo de Imagem de Referência / Image-to-Video / Multi-Frame Keyframe
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<"image-to-video" | "edit-inpainting" | "frame-transition">("image-to-video");

  // Notificações Toast
  const [toastNotif, setToastNotif] = useState<string | null>(null);

  const [selectedStylePreset, setSelectedStylePreset] = useState("📸 Fotografia Comercial 8k (Iluminação Cinematográfica de Estúdio, Foco Nítido)");
  const [promptStyle, setPromptStyle] = useState("Fotografia comercial 8k, ultra detalhado, iluminação cinematográfica de estúdio");

  const [promptFormat, setPromptFormat] = useState("1:1 (Quadrado Perfeito - Feed Meta / LinkedIn / WhatsApp)");
  // Estados Específicos para Vídeo
  const [videoDuration, setVideoDuration] = useState("5 Segundos (Curto / Loop)");
  const [videoCameraMotion, setVideoCameraMotion] = useState("Lento Pan / Deslizamento Suave");
  const [videoPromptDetails, setVideoPromptDetails] = useState("Transição suave, zoom progressivo no elemento central, estabilização cinematográfica");
  const [videoLighting, setVideoLighting] = useState("Cinematográfica (High-End Comercial)");
  const [videoTransition, setVideoTransition] = useState("Corte Seco / Nenhuma");
  
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([
    {
      id: "p_1",
      tool: "Midjourney v6",
      promptType: "Imagem",
      promptEn: "Commercial product photography of a premium fitness supplement tub floating in mid-air, dark cinematic background, dramatic neon blue and purple backlighting, micro-droplets of water, studio lighting, text overlay in Brazilian Portuguese: 'Energia Pura', highly detailed 8k, octane render --ar 1:1 --v 6.0",
      PortugueseExplanation: "Foto comercial de alta qualidade com texto em português pronto para anúncios no Instagram.",
      targetPlatform: "Instagram / Meta Ads",
      recommendedAspect: "1:1 ou 4:5",
      niche: "E-commerce & Suplementos",
    },
    {
      id: "p_2",
      tool: "Runway Gen-3/Sora",
      promptType: "Vídeo",
      promptEn: "Slow motion 60fps cinematic video of an athlete scooping pre-workout powder, energetic neon particle explosion, dramatic studio lighting, intense focus, audio voiceover in natural Brazilian Portuguese: 'Supere seus limites todos os dias.', 4k resolution.",
      PortugueseExplanation: "Roteiro e prompt para vídeo curto de Reels/TikTok com narração em Português do Brasil.",
      targetPlatform: "Instagram Reels & TikTok Ads",
      recommendedAspect: "9:16",
      niche: "E-commerce & Suplementos",
    },
  ]);

  // Saved Prompts Library
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    try {
      const stored = localStorage.getItem("marktivo_saved_prompts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("marktivo_saved_prompts", JSON.stringify(savedPrompts));
    } catch (e) {
      console.error(e);
    }
  }, [savedPrompts]);

  // 2. Social Post State
  const [postNiche, setPostNiche] = useState("Imobiliário de Luxo");
  const [postTopic, setPostTopic] = useState("Tour em Cobertura Duplex em Balneário Camboriú");
  const [postType, setPostType] = useState("Carrossel Informativo");
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [generatedSocial, setGeneratedSocial] = useState<GeneratedSocialPost | null>({
    title: "Tour Exclusivo: Cobertura Duplex de 400m² à Beira-Mar",
    caption: "Acordar todos os dias com a vista definitiva do oceano não é apenas um privilégio, é o seu novo estilo de vida. 🌊🏢\n\nNo post de hoje apresentamos a Cobertura Duplex no Residencial Horizon Luxury:\n✨ 4 Suítes master com hidromassagem\n✨ Varanda gourmet privativa com piscina aquecida\n✨ Automação residencial completa por comando de voz\n\nQuer agendar uma visita privativa antes que seja vendida? Clique no link da bio ou envie uma mensagem direta!",
    hashtags: ["#ImoveisDeLuxo", "#BalnearioCamboriu", "#HorizonImoveis", "#CoberturaDuplex", "#ArquiteturaDeLuxo"],
    callToAction: "Envie 'COBERTURA' no Direct para receber o book em PDF.",
    visualScript: "Slide 1: Foto impactante da varanda com piscina e mar ao fundo.\nSlide 2: Living integrado de 120m².\nSlide 3: Suíte master com hidromassagem.\nSlide 4: Vista noturna da cidade.\nSlide 5: CTA com contato da equipe Horizon.",
    bestPostingTime: "Quinta-feira às 18:30 (Horário de pico de investidores)",
  });

  // 3. Landing Page State
  const [lpNiche, setLpNiche] = useState("Saúde & Odontologia");
  const [lpProduct, setLpProduct] = useState("Lentes de Contato Dental de Porcelana");
  const [lpOffer, setLpOffer] = useState("Simulação 3D Gratuita + Consulta Sem Compromisso");
  const [loadingLp, setLoadingLp] = useState(false);
  const [generatedLp, setGeneratedLp] = useState<any>({
    heroHeadline: "Conquiste o Sorriso dos Seus Sonhos com Lentes de Contato Dental de Altíssima Durabilidade",
    heroSubheadline: "Sua transformação estética com acabamento 100% natural, sem dor e realizada por mestres em Odontologia Estética.",
    mainCta: "Agendar Simulação 3D Gratuita no WhatsApp",
    valueProps: [
      "Simulação 3D prévia antes do procedimento",
      "Porcelana importada de durabilidade superior",
      "Parcelamento em até 12x no cartão",
      "Atendimento VIP e privativo",
    ],
    pageSections: [
      {
        sectionName: "Sessão 1: Antes e Depois & Casos Reais",
        sectionHeadline: "A transformação que muda sua autoestima para sempre",
        sectionContent: "Exibição do carrossel interativo com mais de 50 sorrisos transformados pela equipe da clínica.",
      },
      {
        sectionName: "Sessão 2: Como Funciona o Passo a Passo",
        sectionHeadline: "Do planejamento digital ao seu novo sorriso em 3 etapas simples",
        sectionContent: "1. Avaliação e Escaneamento 3D -> 2. Prova do Test-Drive -> 3. Aplicação definitiva e polimento.",
      },
    ],
    faqItems: [
      {
        question: "A aplicação das lentes de contato dental dói?",
        answer: "Não! O procedimento é minimamente invasivo e realizado sob anestesia local computadorizada totalmente indolor.",
      },
      {
        question: "Quanto tempo duram as lentes de porcelana?",
        answer: "Com os cuidados de higiene normais e visitas de manutenção, as lentes de porcelana duram entre 15 e 20 anos.",
      },
    ],
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getConceptIdeasForActiveNiche = () => {
    const currentNiche = selectedNicheOption === "✏️ Outro / Digitar Nicho Personalizado..."
      ? customNiche
      : selectedNicheOption;
    
    const clean = currentNiche.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
    
    for (const key of Object.keys(NICHE_CONCEPTS_MAP)) {
      if (clean.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clean.toLowerCase())) {
        return NICHE_CONCEPTS_MAP[key];
      }
    }
    return NICHE_CONCEPTS_MAP["Geral"];
  };

  const handleNicheChange = (val: string) => {
    setSelectedNicheOption(val);
    const cleanNiche = val.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
    let foundIdeas = NICHE_CONCEPTS_MAP["Geral"];
    for (const key of Object.keys(NICHE_CONCEPTS_MAP)) {
      if (cleanNiche.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanNiche.toLowerCase())) {
        foundIdeas = NICHE_CONCEPTS_MAP[key];
        break;
      }
    }
    if (foundIdeas && foundIdeas.length > 0) {
      setSelectedConceptPreset(foundIdeas[0]);
      const cleanFirst = foundIdeas[0].replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
      setPromptConcept(cleanFirst);
    }
  };

  const handleSelectConceptPreset = (val: string) => {
    setSelectedConceptPreset(val);
    if (val !== "✏️ Outro / Digitar conceito personalizado...") {
      const cleanVal = val.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
      setPromptConcept(cleanVal);
    }
  };

  const handleSelectSubjectPreset = (val: string) => {
    setSelectedSubjectPreset(val);
    if (val !== "✏️ Outro / Digitar Sujeito Personalizado...") {
      const cleanVal = val.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
      setPromptSubject(cleanVal);
    }
  };

  const handleSelectStylePreset = (val: string) => {
    setSelectedStylePreset(val);
    if (val !== "✏️ Outro / Digitar estilo personalizado...") {
      const cleanVal = val.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
      setPromptStyle(cleanVal);
    }
  };

  const triggerToast = (msg: string) => {
    setToastNotif(msg);
    setTimeout(() => setToastNotif(null), 3000);
  };

  const isTagInConcept = (tag: string) => {
    const cleanTag = tag.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ'"]/u, '').trim().toLowerCase();
    return promptConcept.toLowerCase().includes(cleanTag);
  };

  const handleToggleTag = (tag: string) => {
    const cleanTag = tag.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ'"]/u, '').trim();
    if (isTagInConcept(tag)) {
      const regex = new RegExp(`,?\\s*${cleanTag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
      let updated = promptConcept.replace(regex, '').trim();
      if (updated.startsWith(',')) updated = updated.substring(1).trim();
      setPromptConcept(updated);
      triggerToast(`🗑️ Elemento "${cleanTag}" removido do conceito!`);
    } else {
      setPromptConcept((prev) => (prev.trim() ? `${prev.trim()}, ${cleanTag}` : cleanTag));
      triggerToast(`✨ Elemento "${cleanTag}" adicionado ao conceito!`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("A imagem de referência deve ter no máximo 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setReferenceImage(base64);
      triggerToast("🖼️ Imagem 1 (Frame Inicial) anexada!");
    };
    reader.readAsDataURL(file);
  };

  const handleSecondImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("A segunda imagem deve ter no máximo 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSecondImage(base64);
      setImageMode("frame-transition");
      triggerToast("🎞️ Imagem 2 (Frame Final) anexada! Modo Keyframe Ativado.");
    };
    reader.readAsDataURL(file);
  };

  const handleRefinePrompt = async (promptToRefine: GeneratedPrompt) => {
    setRefiningId(promptToRefine.id);
    try {
      const res = await apiFetch("/api/ai/refine-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrompt: promptToRefine.promptEn,
          tool: promptToRefine.tool,
          promptType: promptToRefine.promptType,
          niche: promptToRefine.niche,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGeneratedPrompts((prev) =>
        prev.map((p) =>
          p.id === promptToRefine.id
            ? {
                ...p,
                promptEn: data.promptEn || p.promptEn,
                PortugueseExplanation: `✨ [Aprimorado por IA com áudio/texto em Português]: ${data.PortugueseExplanation || p.PortugueseExplanation}`,
              }
            : p
        )
      );
    } catch (err: any) {
      alert(`Erro ao refinar prompt: ${err.message}`);
    } finally {
      setRefiningId(null);
    }
  };

  const getEffectiveNiche = () => {
    if (selectedNicheOption === "✏️ Outro / Digitar Nicho Personalizado...") {
      return customNiche.trim() || "Geral";
    }
    return selectedNicheOption.replace(/^[^\w\sáéíóúâêôãõçÀÈÌÒÙÁÉÍÓÚÂÊÔÃÕÇ]/u, '').trim();
  };

  const handleGeneratePrompts = async () => {
    setLoadingPrompts(true);
    const effectiveNiche = getEffectiveNiche();

    try {
      const res = await apiFetch("/api/ai/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: effectiveNiche,
          concept: promptConcept,
          subject: promptSubject,
          style: promptStyle,
          format: promptFormat,
          promptType: promptType,
          videoDetails: (promptType === "Vídeo" || promptType === "Storyboard de Vídeo") ? { duration: videoDuration, cameraMotion: videoCameraMotion, extraDetails: videoPromptDetails, lighting: videoLighting, transition: videoTransition } : undefined,
          characterDetails: {
            characterType: charType,
            gender: charGender,
            age: charAge,
            ethnicity: charEthnicity,
          },
          referenceImage: referenceImage,
          secondImage: secondImage,
          imageMode: imageMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na API de prompts");
      if (data.prompts && Array.isArray(data.prompts)) {
        const enriched = data.prompts.map((p: any, idx: number) => ({
          ...p,
          id: `p_${Date.now()}_${idx}`,
          promptType: p.promptType || promptType,
          niche: effectiveNiche,
        }));
        setGeneratedPrompts(enriched);
      }
    } catch (err: any) {
      alert(`Erro ao gerar prompts: ${err.message}`);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const handleSavePrompt = (promptToSave: GeneratedPrompt) => {
    const isAlreadySaved = savedPrompts.some((s) => s.promptEn === promptToSave.promptEn);
    if (isAlreadySaved) {
      triggerToast("Este prompt já está na sua biblioteca de salvos.");
      return;
    }

    const newSaved: SavedPrompt = {
      ...promptToSave,
      id: `saved_${Date.now()}`,
      savedAt: new Date().toLocaleDateString("pt-BR"),
    };

    setSavedPrompts((prev) => [newSaved, ...prev]);
    triggerToast("✅ Prompt salvo na sua biblioteca!");

  };

  const handleRemoveSavedPrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleGenerateSocial = async () => {
    setLoadingSocial(true);
    try {
      const res = await apiFetch("/api/ai/generate-social-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: postNiche,
          topic: postTopic,
          contentType: postType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedSocial(data);
    } catch (err: any) {
      alert(`Erro ao gerar post: ${err.message}`);
    } finally {
      setLoadingSocial(false);
    }
  };

  const handleGenerateLp = async () => {
    setLoadingLp(true);
    try {
      const res = await apiFetch("/api/ai/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: lpNiche,
          productOrService: lpProduct,
          offerDetails: lpOffer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedLp(data);
    } catch (err: any) {
      alert(`Erro ao gerar landing page: ${err.message}`);
    } finally {
      setLoadingLp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-amber-400" />
              Estúdio Criativo (Prompts & Copys)
            </h1>
            {savedPrompts.length > 0 && (
              <button
                onClick={() => setIsSavedDrawerOpen(true)}
                className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-amber-500/30 transition-all"
              >
                <FolderHeart className="h-3.5 w-3.5 text-amber-400" />
                {savedPrompts.length} Prompts Salvos
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Geração de prompts especialistas para Midjourney, Sora, Runway, ChatGPT Copys e Landing Pages organizados por nicho.
          </p>
        </div>

        {/* Sub-tab selection buttons */}
        <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("prompts")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "prompts" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Gerador de Prompts Especialista</span>
          </button>

          <button
            onClick={() => setActiveSubTab("social")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "social" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Posts Diários & Reels</span>
          </button>

          <button
            onClick={() => setActiveSubTab("landing")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === "landing" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Copy para Sites & LPs</span>
          </button>
        </div>
      </div>

      {/* BANNER DE FERRAMENTAS E IAS GRATUITAS */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Ferramentas & IAs Gratuitas para a Equipe da Agência
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">1-Clique para Acessar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {[
            { name: "ChatGPT", url: "https://chatgpt.com", bg: "bg-emerald-950/80 border-emerald-800 text-emerald-300", icon: "💬" },
            { name: "Gemini", url: "https://gemini.google.com", bg: "bg-blue-950/80 border-blue-800 text-blue-300", icon: "✨" },
            { name: "Meta AI", url: "https://www.meta.ai/", bg: "bg-sky-950/80 border-sky-800 text-sky-300", icon: "♾️" },
            { name: "Perplexity", url: "https://www.perplexity.ai/?login-new=false&login-source=oneTapHome", bg: "bg-teal-950/80 border-teal-800 text-teal-300", icon: "🔍" },
            { name: "Canva", url: "https://www.canva.com", bg: "bg-cyan-950/80 border-cyan-800 text-cyan-300", icon: "🎨" },
            { name: "CapCut", url: "https://www.capcut.com", bg: "bg-slate-950/80 border-slate-700 text-slate-200", icon: "🎬" },
            { name: "DeepSeek", url: "https://chat.deepseek.com", bg: "bg-indigo-950/80 border-indigo-800 text-indigo-300", icon: "🧠" },
            { name: "Qwen AI", url: "https://chat.qwenlm.ai", bg: "bg-purple-950/80 border-purple-800 text-purple-300", icon: "🌐" },
            { name: "Dola AI", url: "https://www.dola.com/chat", bg: "bg-emerald-950/80 border-emerald-800 text-emerald-300", icon: "🤖" },
            { name: "Google Flow", url: "https://labs.google/fx/pt/tools/flow", bg: "bg-amber-950/80 border-amber-800 text-amber-300", icon: "⚡" },
            { name: "Google Videos", url: "https://docs.google.com/videos/u/0/?pli=1", bg: "bg-rose-950/80 border-rose-800 text-rose-300", icon: "📹" },
            { name: "NotebookLM", url: "https://notebook.google.com/", bg: "bg-violet-950/80 border-violet-800 text-violet-300", icon: "📓" },
            { name: "Copilot", url: "https://copilot.microsoft.com/", bg: "bg-blue-950/80 border-blue-800 text-blue-300", icon: "🤖" },
            { name: "Lovable", url: "https://lovable.dev/login?redirect=%2Fdashboard%2Fprojects", bg: "bg-rose-950/80 border-rose-800 text-rose-300", icon: "❤️" },
            { name: "Lovart AI", url: "https://www.lovart.ai/pt", bg: "bg-pink-950/80 border-pink-800 text-pink-300", icon: "🎨" },
            { name: "Claude AI", url: "https://claude.ai", bg: "bg-yellow-950/80 border-yellow-800 text-yellow-300", icon: "📝" },
            { name: "Hugging Face", url: "https://huggingface.co/spaces", bg: "bg-orange-950/80 border-orange-800 text-orange-300", icon: "🤗" },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className={`p-2 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.02] ${tool.bg}`}
            >
              <span className="font-extrabold flex items-center gap-1.5 text-[11px]">
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: GERADOR DE PROMPTS ESPECIALISTA (IMAGEM, VÍDEO, COPY, CARROSSEL) */}
      {activeSubTab === "prompts" && (
        <div className="space-y-6">
          {/* Form Filter Box */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            {/* Type of Prompt selector */}
            <div>
              <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-2">
                1. Selecione o Tipo de Conteúdo / Finalidade do Prompt:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPromptType("Imagem")}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    promptType === "Imagem"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>🖼️ Prompt de Imagem</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromptType("Vídeo")}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    promptType === "Vídeo"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>🎥 Prompt de Vídeo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromptType("Storyboard de Vídeo")}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    promptType === "Storyboard de Vídeo"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Layout className="h-4 w-4" />
                  <span>🎬 Storyboard de Vídeo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromptType("Copy / Texto")}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    promptType === "Copy / Texto"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>📝 Prompt de Copy / Anúncio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPromptType("Carrossel")}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    promptType === "Carrossel"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Layout className="h-4 w-4" />
                  <span>📊 Prompt de Carrossel</span>
                </button>
              </div>
            </div>

            {/* Toast Notification Banner */}
            {toastNotif && (
              <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
                <Sparkles className="h-4 w-4" />
                <span>{toastNotif}</span>
              </div>
            )}

            {/* Niche & Details Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* 1. NICHO */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  1. Nicho / Setor de Atuação
                </label>
                <select
                  value={selectedNicheOption}
                  onChange={(e) => handleNicheChange(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mb-2"
                >
                  {POPULAR_NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                {selectedNicheOption === "✏️ Outro / Digitar Nicho Personalizado..." && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Digite o nicho específico (ex: Pet Shop de Luxo)..."
                      value={customNiche}
                      onChange={(e) => setCustomNiche(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-amber-500/60 focus:outline-none"
                    />
                    <VoiceInputBtn onResult={setCustomNiche} />
                  </div>
                )}
              </div>

              {/* 2. SUJEITO / ELEMENTO DA CENA & DETALHES DO ATOR */}
              <div className="md:col-span-2 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold text-amber-400 block">
                    2. Pessoas, Objetos, Avatares, ETs ou Animações na Cena
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Personalização Total do Ator</span>
                </div>

                <select
                  value={selectedSubjectPreset}
                  onChange={(e) => handleSelectSubjectPreset(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mb-2"
                >
                  {SCENE_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Sub-grid para atributos de personagens (Gênero, Idade, Etnia, Tipo) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Tipo de Sujeito</label>
                    <select
                      value={charType}
                      onChange={(e) => setCharType(e.target.value)}
                      className="w-full bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg p-2 border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      {CHARACTER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Gênero</label>
                    <select
                      value={charGender}
                      onChange={(e) => setCharGender(e.target.value)}
                      className="w-full bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg p-2 border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      {CHARACTER_GENDERS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Faixa Etária</label>
                    <select
                      value={charAge}
                      onChange={(e) => setCharAge(e.target.value)}
                      className="w-full bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg p-2 border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      {CHARACTER_AGES.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Etnia / Aparência</label>
                    <select
                      value={charEthnicity}
                      onChange={(e) => setCharEthnicity(e.target.value)}
                      className="w-full bg-slate-800 text-slate-200 text-[11px] font-medium rounded-lg p-2 border border-slate-700 focus:outline-none cursor-pointer"
                    >
                      {CHARACTER_ETHNICITIES.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptSubject}
                    onChange={(e) => setPromptSubject(e.target.value)}
                    placeholder="Detalhamento livre das pessoas, modelos, roupas, mascotes ou objetos..."
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <VoiceInputBtn onResult={setPromptSubject} />
                </div>
              </div>

              {/* 3. CONCEITO / IDEIA DO ANÚNCIO (DINÂMICO PELO NICHO) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300 block">
                    3. Ideia / Conceito do Anúncio
                  </label>
                  <span className="text-[10px] text-amber-400 font-bold">✨ Sugestões por Nicho</span>
                </div>
                <select
                  value={selectedConceptPreset}
                  onChange={(e) => handleSelectConceptPreset(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mb-2"
                >
                  {getConceptIdeasForActiveNiche().map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptConcept}
                    onChange={(e) => setPromptConcept(e.target.value)}
                    placeholder="Detalhamento do produto ou gancho do anúncio..."
                    className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <VoiceInputBtn onResult={(text) => setPromptConcept((prev) => prev ? prev + " " + text : text)} />
                </div>
              </div>

              {/* 4. ESTILO VISUAL */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  4. Estilo Visual / Render
                </label>
                <select
                  value={selectedStylePreset}
                  onChange={(e) => handleSelectStylePreset(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer mb-2"
                >
                  {VISUAL_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={promptStyle}
                  onChange={(e) => setPromptStyle(e.target.value)}
                  placeholder="Ajustar estilo visual..."
                  className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 5. FORMATO / PROPORÇÃO */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  5. Formato / Proporção (Aspect Ratio)
                </label>
                <select
                  value={promptFormat}
                  onChange={(e) => setPromptFormat(e.target.value)}
                  className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar} value={ar}>
                      {ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* BLOCO EXCLUSIVO PARA VÍDEOS */}
              {(promptType === "Vídeo" || promptType === "Storyboard de Vídeo") && (
                <div className="md:col-span-2 lg:col-span-3 bg-indigo-950/40 rounded-2xl p-5 border border-indigo-500/50 relative overflow-hidden shadow-lg mt-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                      <Video className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-indigo-300 uppercase tracking-wide">Configurações Avançadas de Vídeo</h4>
                      <p className="text-[10px] text-indigo-200/70">Tempo, movimentação de câmera, iluminação, transições (Runway Gen-3, Sora, Luma, Kling)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 mb-4">
                    <div>
                      <label className="text-[11px] font-bold text-indigo-200 block mb-1">Duração do Vídeo</label>
                      <select
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl p-2.5 border border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="4 a 5 Segundos (Gen-3 Alpha / Luma Curto)">4 a 5 Segundos (Gen-3 Alpha / Luma Curto)</option>
                        <option value="10 Segundos (Gen-3 Longo / Runway)">10 Segundos (Gen-3 Longo / Runway)</option>
                        <option value="15 a 30 Segundos (Sora / Kling)">15 a 30 Segundos (Sora / Kling)</option>
                        <option value="Loop Infinito (Cinemagraph)">Loop Infinito (Cinemagraph)</option>
                        <option value="Time-lapse (Passagem rápida de tempo)">Time-lapse (Passagem rápida de tempo)</option>
                        <option value="Slow Motion (Câmera Lenta - 120fps)">Slow Motion (Câmera Lenta - 120fps)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-indigo-200 block mb-1">Movimento de Câmera</label>
                      <select
                        value={videoCameraMotion}
                        onChange={(e) => setVideoCameraMotion(e.target.value)}
                        className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl p-2.5 border border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Lento Pan / Deslizamento Suave">Lento Pan / Deslizamento Suave</option>
                        <option value="Zoom In Lento (Aproximação)">Zoom In Lento (Aproximação)</option>
                        <option value="Zoom Out (Afastamento Revelador)">Zoom Out (Afastamento Revelador)</option>
                        <option value="Drone View (Vista Aérea Dinâmica)">Drone View (Vista Aérea Dinâmica)</option>
                        <option value="FPV (Visão em Primeira Pessoa)">FPV (Visão em Primeira Pessoa)</option>
                        <option value="Estático / Fixo (Cinemagraph)">Estático / Fixo (Cinemagraph)</option>
                        <option value="Orbital (Giro 360º ao redor do objeto)">Orbital (Giro 360º ao redor do objeto)</option>
                        <option value="Tracking Shot (Acompanhando o sujeito)">Tracking Shot (Acompanhando o sujeito)</option>
                        <option value="Transição Morph / Caótico">Transição Morph / Caótico</option>
                        <option value="Câmera de Mão (Handheld Shaky)">Câmera de Mão (Handheld Shaky)</option>
                        <option value="Crane Shot (Movimento Vertical Elevado)">Crane Shot (Movimento Vertical Elevado)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-indigo-200 block mb-1">Iluminação do Vídeo</label>
                      <select
                        value={videoLighting}
                        onChange={(e) => setVideoLighting(e.target.value)}
                        className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl p-2.5 border border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Cinematográfica (High-End Comercial)">Cinematográfica (High-End Comercial)</option>
                        <option value="Golden Hour (Pôr do Sol Mágico)">Golden Hour (Pôr do Sol Mágico)</option>
                        <option value="Iluminação Natural / Dia Ensolarado">Iluminação Natural / Dia Ensolarado</option>
                        <option value="Cyberpunk / Neon Glow (Noturno)">Cyberpunk / Neon Glow (Noturno)</option>
                        <option value="Dark & Moody (Sombrio / Suspense)">Dark & Moody (Sombrio / Suspense)</option>
                        <option value="Luz de Estúdio (Softbox / Produto)">Luz de Estúdio (Softbox / Produto)</option>
                        <option value="Volume Lighting / God Rays">Volume Lighting / God Rays</option>
                        <option value="Vintage / VHS / Retrô 80s">Vintage / VHS / Retrô 80s</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-indigo-200 block mb-1">Transição entre Cenas</label>
                      <select
                        value={videoTransition}
                        onChange={(e) => setVideoTransition(e.target.value)}
                        className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl p-2.5 border border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Corte Seco / Nenhuma">Corte Seco / Nenhuma</option>
                        <option value="Fade in/out (Suave)">Fade in/out (Suave)</option>
                        <option value="Match Cut (Corte por movimento)">Match Cut (Corte por movimento)</option>
                        <option value="Glitch / Ruído Digital">Glitch / Ruído Digital</option>
                        <option value="Whip Pan (Giro Rápido)">Whip Pan (Giro Rápido)</option>
                        <option value="Morphing / Derretimento">Morphing / Derretimento</option>
                        <option value="Light Leak (Vazamento de Luz)">Light Leak (Vazamento de Luz)</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <label className="text-[11px] font-bold text-indigo-200 block mb-1">Direção Específica (Prompt Detalhado de Vídeo)</label>
                    <input
                      type="text"
                      value={videoPromptDetails}
                      onChange={(e) => setVideoPromptDetails(e.target.value)}
                      placeholder="Ex: Câmera gira lentamente enquanto a água espirra em câmera lenta sobre o produto..."
                      className="w-full bg-slate-900 text-white text-xs font-medium rounded-xl p-3 border border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
              {/* 6. ANEXO DE IMAGENS DE REFERÊNCIA / VÍDEO KEYFRAMES / EDIÇÃO */}
              <div className="md:col-span-2 lg:col-span-3 bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 mt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4" />
                      Anexar Imagens (Frame Inicial + Frame Final para Vídeos, Edição e Keyframe Morphing)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Envie <b>1 imagem</b> para Animação/Edição ou <b>2 imagens (Frame Inicial + Final)</b> para interpolação de vídeos no Runway Gen-3, Luma e Sora.
                    </p>
                  </div>

                  {(referenceImage || secondImage) && (
                    <button
                      type="button"
                      onClick={() => {
                        setReferenceImage(null);
                        setSecondImage(null);
                        triggerToast("🗑️ Imagens de referência removidas.");
                      }}
                      className="text-[11px] bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 px-3 py-1 rounded-lg transition-all font-bold"
                    >
                      ✕ Limpar Todas as Imagens
                    </button>
                  )}
                </div>

                {/* Grid de Uploads (Imagem 1 + Imagem 2) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {/* BOX IMAGEM 1 (FRAME INICIAL) */}
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                        🖼️ Imagem 1: Frame Inicial / Origem
                      </span>
                      {referenceImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setReferenceImage(null);
                            triggerToast("🗑️ Imagem 1 removida.");
                          }}
                          className="text-[10px] text-red-400 hover:underline font-bold"
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    {!referenceImage ? (
                      <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/80 h-28">
                        <Upload className="h-5 w-5 text-amber-400 mb-1 animate-pulse" />
                        <span className="text-xs font-bold text-slate-200 text-center">
                          Clique para Anexar Imagem 1
                        </span>
                        <span className="text-[10px] text-slate-400 text-center mt-0.5">
                          Foto principal para animar ou editar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-amber-500/40 h-28 bg-slate-950 flex items-center justify-center">
                        <img
                          src={referenceImage}
                          alt="Frame Inicial"
                          className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                          Frame 1
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOX IMAGEM 2 (FRAME FINAL) */}
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                        🎞️ Imagem 2: Frame Final / Destino (Opcional)
                      </span>
                      {secondImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setSecondImage(null);
                            triggerToast("🗑️ Imagem 2 removida.");
                          }}
                          className="text-[10px] text-red-400 hover:underline font-bold"
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    {!secondImage ? (
                      <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/80 h-28">
                        <Upload className="h-5 w-5 text-amber-400 mb-1" />
                        <span className="text-xs font-bold text-slate-200 text-center">
                          + Anexar Imagem 2 (Frame Final)
                        </span>
                        <span className="text-[10px] text-slate-400 text-center mt-0.5">
                          Para transição/morphing de vídeo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSecondImageUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-amber-500/40 h-28 bg-slate-950 flex items-center justify-center">
                        <img
                          src={secondImage}
                          alt="Frame Final"
                          className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                          Frame 2 (Final)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seleção de Modo quando há imagens */}
                {(referenceImage || secondImage) && (
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-300 block">
                      Modo de Processamento das Imagens:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setImageMode("image-to-video")}
                        className={`p-2 rounded-xl text-[11px] font-extrabold border transition-all text-left ${
                          imageMode === "image-to-video"
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        🎬 Image-to-Video
                        <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                          Animar foto em movimento (Runway, Sora, Luma)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageMode("edit-inpainting")}
                        className={`p-2 rounded-xl text-[11px] font-extrabold border transition-all text-left ${
                          imageMode === "edit-inpainting"
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        🖌️ Edição & Inpainting
                        <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                          Modificar e trocar elementos mantendo o estilo
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageMode("frame-transition")}
                        className={`p-2 rounded-xl text-[11px] font-extrabold border transition-all text-left ${
                          imageMode === "frame-transition"
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        🎞️ Interpolação Frame 1 ➡️ 2
                        <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                          Keyframe morphing entre frame inicial e final
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CHIPS RÁPIDOS DE INSPIRAÇÃO E ADIÇÃO RÁPIDA (COM FEEDBACK VISUAL INTERATIVO) */}
              <div className="md:col-span-2 lg:col-span-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-slate-300 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    Adicionar/Remover Elementos Rápidos no Conceito (Clique para Alternar):
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold hidden sm:inline">
                    Itens com '✓' já estão ativos
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ELEMENT_TAGS.map((tag) => {
                    const active = isTagInConcept(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
                          active
                            ? "bg-amber-500/20 border border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)] font-bold"
                            : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:border-slate-500"
                        }`}
                        title={active ? "Clique para remover do conceito" : "Clique para adicionar ao conceito"}
                      >
                        <span>{active ? "✓" : "+"}</span>
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BOTÃO GERAR */}
              <div className="md:col-span-2 lg:col-span-3 flex items-end pt-2">
                <button
                  onClick={handleGeneratePrompts}
                  disabled={loadingPrompts}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{loadingPrompts ? "Criando Prompts Especialistas de Alta Conversão..." : `Gerar Prompts de ${promptType} para ${getEffectiveNiche()}`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Cards Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Prompts Gerados para: <strong className="text-cyan-300">{getEffectiveNiche()}</strong>
            </h3>

            <button
              onClick={() => setIsSavedDrawerOpen(true)}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5"
            >
              <FolderHeart className="h-4 w-4 text-amber-400" />
              Ver Biblioteca de Prompts Salvos ({savedPrompts.length})
            </button>
          </div>

          {/* Prompt Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPrompts.map((p, idx) => {
              const isSaved = savedPrompts.some((s) => s.promptEn === p.promptEn);

              return (
                <div
                  key={p.id || idx}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    {/* Tool Badge & Type Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        {p.tool}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleRefinePrompt(p)}
                          disabled={refiningId === p.id}
                          className="bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-50 text-white font-extrabold px-2 py-0.5 rounded text-[10px] transition-all flex items-center gap-1 shadow-sm"
                          title="Melhorar prompt com inteligência artificial mantendo regras de linguagem"
                        >
                          <Wand2 className="h-3 w-3 text-amber-300" />
                          <span>{refiningId === p.id ? "Melhorando..." : "Melhorar com IA"}</span>
                        </button>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {p.promptType === "Vídeo" ? "🎥 Vídeo" : p.promptType === "Imagem" ? "🖼️ Imagem" : p.promptType === "Copy / Texto" ? "📝 Copy" : "📊 Carrossel"}
                        </span>
                      </div>
                    </div>

                    {/* Prompt Box */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 relative group">
                      <p className="text-xs font-mono text-cyan-300 select-all leading-relaxed whitespace-pre-wrap">{p.promptEn}</p>
                      
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <button
                          onClick={() => handleCopy(`prompt_${idx}`, p.promptEn)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === `prompt_${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedKey === `prompt_${idx}` ? "Copiado!" : "Copiar Prompt"}</span>
                        </button>

                        <button
                          onClick={() => handleSavePrompt(p)}
                          className={`flex items-center gap-1 font-extrabold ${
                            isSaved ? "text-emerald-400" : "text-amber-400 hover:text-amber-300"
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          <span>{isSaved ? "Salvo" : "Salvar Prompt"}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic">{p.PortugueseExplanation}</p>

                    {/* 1-Click Launch Action Buttons for Free AI Tools */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-amber-400 block tracking-wider">
                        🚀 Copiar & Usar Direto na Ferramenta:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { name: "ChatGPT", url: "https://chatgpt.com", color: "hover:bg-emerald-600 bg-emerald-900/60 text-emerald-200" },
                          { name: "Gemini", url: "https://gemini.google.com", color: "hover:bg-blue-600 bg-blue-900/60 text-blue-200" },
                          { name: "Meta AI", url: "https://www.meta.ai/", color: "hover:bg-sky-600 bg-sky-900/60 text-sky-200" },
                          { name: "Perplexity", url: "https://www.perplexity.ai/?login-new=false&login-source=oneTapHome", color: "hover:bg-teal-600 bg-teal-900/60 text-teal-200" },
                          { name: "Canva", url: "https://www.canva.com", color: "hover:bg-cyan-600 bg-cyan-900/60 text-cyan-200" },
                          { name: "CapCut", url: "https://www.capcut.com", color: "hover:bg-slate-700 bg-slate-800 text-slate-200" },
                          { name: "DeepSeek", url: "https://chat.deepseek.com", color: "hover:bg-indigo-600 bg-indigo-900/60 text-indigo-200" },
                          { name: "Dola AI", url: "https://www.dola.com/chat", color: "hover:bg-emerald-600 bg-emerald-900/60 text-emerald-200" },
                          { name: "Google Flow", url: "https://labs.google/fx/pt/tools/flow", color: "hover:bg-amber-600 bg-amber-900/60 text-amber-200" },
                          { name: "Google Videos", url: "https://docs.google.com/videos/u/0/?pli=1", color: "hover:bg-rose-600 bg-rose-900/60 text-rose-200" },
                          { name: "Lovart AI", url: "https://www.lovart.ai/pt", color: "hover:bg-pink-600 bg-pink-900/60 text-pink-200" },
                          { name: "NotebookLM", url: "https://notebook.google.com/", color: "hover:bg-violet-600 bg-violet-900/60 text-violet-200" },
                          { name: "Copilot", url: "https://copilot.microsoft.com/", color: "hover:bg-blue-600 bg-blue-900/60 text-blue-200" },
                          { name: "Lovable", url: "https://lovable.dev/login?redirect=%2Fdashboard%2Fprojects", color: "hover:bg-rose-600 bg-rose-900/60 text-rose-200" },
                        ].map((t) => (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(p.promptEn);
                              window.open(t.url, "_blank");
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-extrabold border border-slate-700 transition-all flex items-center gap-1 ${t.color}`}
                            title={`Copiar prompt e abrir ${t.name}`}
                          >
                            <span>{t.name}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Rede Ideal: <strong className="text-white">{p.targetPlatform}</strong></span>
                    <span>Proporção: <strong className="text-white">{p.recommendedAspect}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: POSTS DIÁRIOS PARA REDES SOCIAIS (INSTAGRAM & FACEBOOK) */}
      {activeSubTab === "social" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nicho do Cliente</label>
              <input
                type="text"
                value={postNiche}
                onChange={(e) => setPostNiche(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Tema da Publicação</label>
              <input
                type="text"
                value={postTopic}
                onChange={(e) => setPostTopic(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Formato do Conteúdo</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Carrossel Informativo">Carrossel Informativo (Educativo)</option>
                <option value="Reels Curto em Vídeo">Reels Curto em Vídeo (Engajamento)</option>
                <option value="Post de Oferta Direta">Post de Oferta Direta (Vendas)</option>
                <option value="Stories em Sequência">Stories em Sequência (Interação)</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={handleGenerateSocial}
                disabled={loadingSocial}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loadingSocial ? "Gerando Post com IA..." : "Gerar Conteúdo Diário Completo"}</span>
              </button>
            </div>
          </div>

          {generatedSocial && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-white">{generatedSocial.title}</h2>
                <button
                  onClick={() => handleCopy("social_post", `${generatedSocial.title}\n\n${generatedSocial.caption}\n\n${generatedSocial.hashtags.join(" ")}`)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 font-semibold"
                >
                  {copiedKey === "social_post" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  Copiar Legenda Completa
                </button>
              </div>

              {/* Legenda Pronta */}
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">Legenda para Instagram / Facebook:</span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {generatedSocial.caption}
                </div>
              </div>

              {/* Roteiro Visual */}
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">Roteiro Visual / Estrutura de Slides:</span>
                <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap">
                  {generatedSocial.visualScript}
                </div>
              </div>

              {/* Hashtags e Horário Recomendado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block font-bold mb-1">Hashtags Estratégicas:</span>
                  <div className="flex flex-wrap gap-1">
                    {generatedSocial.hashtags.map((tag, i) => (
                      <span key={i} className="bg-slate-800 text-indigo-300 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block font-bold">Horário Sugerido de Publicação:</span>
                  <span className="text-emerald-400 font-bold">{generatedSocial.bestPostingTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: COPY PARA SITES & LANDING PAGES */}
      {activeSubTab === "landing" && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nicho de Atuação</label>
              <input
                type="text"
                value={lpNiche}
                onChange={(e) => setLpNiche(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Produto ou Serviço</label>
              <input
                type="text"
                value={lpProduct}
                onChange={(e) => setLpProduct(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Oferta / Gancho do Botão</label>
              <input
                type="text"
                value={lpOffer}
                onChange={(e) => setLpOffer(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-medium rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={handleGenerateLp}
                disabled={loadingLp}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>{loadingLp ? "Gerando Landing Page..." : "Gerar Copywriter & Estrutura de Landing Page"}</span>
              </button>
            </div>
          </div>

          {generatedLp && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Hero Section Wireframe */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-900/60 space-y-3 text-center">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  Dobra Principal (Hero Section)
                </span>
                <h2 className="text-2xl font-black text-white max-w-2xl mx-auto leading-tight">
                  {generatedLp.heroHeadline}
                </h2>
                <p className="text-xs text-slate-300 max-w-xl mx-auto">
                  {generatedLp.heroSubheadline}
                </p>
                <div className="pt-2">
                  <button className="bg-emerald-500 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20">
                    {generatedLp.mainCta}
                  </button>
                </div>
              </div>

              {/* Value Props Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Propostas de Valor Principais:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {generatedLp.valueProps?.map((vp: string, i: number) => (
                    <div key={i} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200">
                      ✨ {vp}
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Sections Wireframe */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Estrutura de Seções do Site:</h4>
                <div className="space-y-3">
                  {generatedLp.pageSections?.map((sec: any, s: number) => (
                    <div key={s} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400">{sec.sectionName}</span>
                      <h5 className="font-bold text-white text-sm">{sec.sectionHeadline}</h5>
                      <p className="text-xs text-slate-300">{sec.sectionContent}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Perguntas Frequentes (FAQ):</h4>
                <div className="space-y-2">
                  {generatedLp.faqItems?.map((faq: any, f: number) => (
                    <div key={f} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                      <div className="font-bold text-xs text-white">❓ {faq.question}</div>
                      <div className="text-xs text-slate-300 mt-1">💬 {faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DRAWER / MODAL FOR SAVED PROMPTS */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FolderHeart className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg font-black text-white">Biblioteca de Prompts Salvos</h2>
                </div>
                <button
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {savedPrompts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Bookmark className="h-10 w-10 mx-auto text-slate-600" />
                  <p className="text-xs">Nenhum prompt salvo ainda. Clique em "Salvar Prompt" para guardar seus favoritos!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPrompts.map((sp) => (
                    <div key={sp.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative group">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {sp.tool}
                        </span>
                        <span className="text-[10px] text-slate-400">{sp.savedAt}</span>
                      </div>

                      <p className="text-xs font-mono text-cyan-300 leading-relaxed select-all">{sp.promptEn}</p>
                      <p className="text-[11px] text-slate-300 italic">{sp.PortugueseExplanation}</p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleCopy(`saved_${sp.id}`, sp.promptEn)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === `saved_${sp.id}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>Copiar</span>
                        </button>

                        <button
                          onClick={() => handleRemoveSavedPrompt(sp.id)}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-center">
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl"
              >
                Fechar Biblioteca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
