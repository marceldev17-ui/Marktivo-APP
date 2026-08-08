export interface Client {
  id: string;
  name: string;
  niche: string;
  website: string;
  monthlyBudget: number;
  platforms: ("Google Ads" | "Meta Ads" | "Instagram" | "Facebook")[];
  status: "active" | "paused";
  targetCpa: number;
  targetRoas: number;
  avatarUrl: string;
  googleAdsId?: string;
  googleAdsEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export interface PlatformMetric {
  date: string;
  platform: "Google Ads" | "Meta Ads" | "Total";
  impressions: number;
  clicks: number;
  ctr: number; // percentage
  cpc: number; // R$
  cost: number; // R$
  conversions: number;
  cpa: number; // R$
  roas: number; // x
  revenue: number; // R$
}

export interface PerformanceAlert {
  id: string;
  clientId: string;
  clientName: string;
  platform: "Google Ads" | "Meta Ads";
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  metricChange: string;
  suggestedAction: string;
}

export interface SocialPost {
  id: string;
  clientId: string;
  clientName: string;
  platform: ("Instagram" | "Facebook")[];
  title: string;
  contentType: "Reels" | "Carrossel" | "Imagem Estática" | "Stories";
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: "idea" | "in_design" | "approved" | "scheduled" | "published";
  caption: string;
  hashtags: string[];
  visualScript?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    leadsGenerated: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GeneratedCampaign {
  campaignName: string;
  targetAudienceDetailed: string[];
  adGroups: {
    name: string;
    matchType?: string;
    keywords: string[];
    negativeKeywords: string[];
  }[];
  adCopies: {
    headline: string;
    description: string;
    cta: string;
    primaryText?: string;
    nicheAngle: string;
  }[];
  budgetAllocation: string;
  optimizationTips: string[];
}

export interface GeneratedPrompt {
  id?: string;
  tool: "Midjourney v6" | "Flux 1.1" | "Runway Gen-3/Sora" | "Imagen 3" | "ChatGPT/Claude Copy" | "DALL-E 3";
  promptType: "Imagem" | "Vídeo" | "Copy / Texto" | "Carrossel";
  promptEn: string;
  PortugueseExplanation: string;
  targetPlatform: string;
  recommendedAspect: string;
  niche?: string;
}

export interface SavedPrompt extends GeneratedPrompt {
  id: string;
  savedAt: string;
}

export interface GeneratedSocialPost {
  title: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  visualScript: string;
  bestPostingTime: string;
}

export interface GeneratedReport {
  executiveSummary: string;
  keyAchievements: string[];
  criticalAlerts: string[];
  nextActionPlan: string[];
  estimatedRoasOutcome: string;
}

export interface ZapierWebhookPayload {
  eventType: string;
  recipientEmail: string;
  clientName: string;
  reportPeriod: string;
  autoSendWeekly: boolean;
  alertThresholdCpa: number;
}
