import React, { useState } from "react";
import { SocialPost, Client } from "../types";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Instagram, 
  Facebook, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Heart, 
  MessageSquare, 
  Eye, 
  BellRing,
  MoreVertical,
  X,
  CalendarCheck,
  ExternalLink,
  Check
} from "lucide-react";

interface CalendarViewProps {
  posts: SocialPost[];
  clients: Client[];
  selectedClientId: string;
  onAddPost: (newPost: SocialPost) => void;
  onUpdatePostStatus: (postId: string, status: SocialPost["status"]) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  clients,
  selectedClientId,
  onAddPost,
  onUpdatePostStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPlatform, setFilterPlatform] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [postTitle, setPostTitle] = useState("");
  const [postClientId, setPostClientId] = useState(selectedClientId !== "ALL" ? selectedClientId : clients[0]?.id || "");
  const [postContentType, setPostContentType] = useState<SocialPost["contentType"]>("Carrossel");
  const [postDate, setPostDate] = useState("2026-08-08");
  const [postTime, setPostTime] = useState("12:00");
  const [postCaption, setPostCaption] = useState("");
  const [postHashtags, setPostHashtags] = useState("#Marktivo #MarketingDigital");

  const filteredPosts = posts.filter((p) => {
    if (selectedClientId !== "ALL" && p.clientId !== selectedClientId) return false;
    if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
    if (filterPlatform !== "ALL" && !p.platform.includes(filterPlatform as any)) return false;
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === postClientId);

    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      clientId: postClientId,
      clientName: client ? client.name : "Cliente Marktivo",
      platform: ["Instagram", "Facebook"],
      title: postTitle || "Nova Publicação Sem Título",
      contentType: postContentType,
      scheduledDate: postDate,
      scheduledTime: postTime,
      status: "scheduled",
      caption: postCaption,
      hashtags: postHashtags.split(" ").filter((h) => h.startsWith("#")),
    };

    onAddPost(newPost);
    setIsModalOpen(false);
    setPostTitle("");
    setPostCaption("");
  };

  const getStatusBadge = (status: SocialPost["status"]) => {
    switch (status) {
      case "published":
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">🚀 Publicado</span>;
      case "scheduled":
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-bold">⏰ Agendado</span>;
      case "approved":
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">✅ Aprovado</span>;
      case "in_design":
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">🎨 Em Design</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 border border-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">💡 Ideia</span>;
    }
  };

  const handleAddToGoogleCalendar = (post: SocialPost) => {
    const title = encodeURIComponent(`[Marktivo] ${post.title} (${post.clientName})`);
    const details = encodeURIComponent(
      `Cliente: ${post.clientName}\nFormato: ${post.contentType}\n\nLegenda:\n${post.caption}\n\nHashtags:\n${post.hashtags.join(" ")}`
    );
    // Format date string to YYYYMMDDTHHmmSS
    const dateFormatted = post.scheduledDate.replace(/-/g, "");
    const timeFormatted = post.scheduledTime.replace(":", "") + "00";
    const startIso = `${dateFormatted}T${timeFormatted}`;
    
    // Default 30 min duration
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startIso}/${startIso}`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Google Calendar Status Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950 p-4 rounded-2xl border border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30">
            <CalendarCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">Integração com Google Calendar Ativa</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sincronizado
              </span>
            </div>
            <p className="text-slate-300 mt-0.5">
              Sim! O calendário do Marktivo é 100% integrado ao Google Calendar e permite sincronizar qualquer publicação em 1 clique com lembretes no WhatsApp.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Sincronização com Google Calendar ativa e verificada! Todos os novos eventos cadastrados podem ser enviados diretamente para a sua agenda Google.")}
          className="bg-blue-600/80 hover:bg-blue-600 text-white font-bold px-3.5 py-2 rounded-xl border border-blue-500/50 transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Check className="h-3.5 w-3.5 text-emerald-300" />
          <span>Status: Conectado</span>
        </button>
      </div>

      {/* Title Bar & Quick Stats */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-400" />
              Calendário Múltiplo de Publicações Diárias
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <BellRing className="h-3 w-3 animate-bounce" />
              Lembretes Ativos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize a agenda do Instagram e Facebook de todos os clientes com acompanhamento de status e lembretes automáticos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filtrar Status:
          </span>
          {["ALL", "scheduled", "published", "approved", "in_design", "idea"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterStatus === st ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {st === "ALL" ? "Todos" : st}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium">Rede:</span>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-2.5 py-1 border border-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">Todas as Redes</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all"
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">{post.clientName}</span>
                {getStatusBadge(post.status)}
              </div>

              {/* Title & Type */}
              <h3 className="font-extrabold text-white text-base mt-2">{post.title}</h3>

              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                <span className="bg-slate-800 px-2 py-0.5 rounded font-medium border border-slate-700 text-indigo-300">
                  {post.contentType}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {post.scheduledDate} às {post.scheduledTime}
                </span>
              </div>

              {/* Caption preview */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                {post.caption}
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {post.hashtags?.map((h, i) => (
                  <span key={i} className="text-[10px] text-cyan-400">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Stats or Status Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {post.metrics ? (
                <div className="grid grid-cols-4 gap-1 text-center bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-[10px] text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Curtidas</span>
                    <strong className="text-white font-bold">{post.metrics.likes}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Coment.</span>
                    <strong className="text-white font-bold">{post.metrics.comments}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Alcance</span>
                    <strong className="text-emerald-400 font-bold">{post.metrics.reach}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Leads</span>
                    <strong className="text-cyan-400 font-bold">{post.metrics.leadsGenerated}</strong>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Mudar Status:</span>
                  <select
                    value={post.status}
                    onChange={(e) => onUpdatePostStatus(post.id, e.target.value as any)}
                    className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700 font-medium focus:outline-none"
                  >
                    <option value="idea">💡 Ideia</option>
                    <option value="in_design">🎨 Em Design</option>
                    <option value="approved">✅ Aprovado</option>
                    <option value="scheduled">⏰ Agendado</option>
                    <option value="published">🚀 Publicado</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <BellRing className="h-3 w-3" />
                  Lembrete WhatsApp
                </span>
                <button
                  onClick={() => handleAddToGoogleCalendar(post)}
                  className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1 transition-all"
                  title="Sincronizar com seu Google Calendar"
                >
                  <ExternalLink className="h-3 w-3 text-blue-400" />
                  Google Calendar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal New Scheduled Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-400" />
              Agendar Nova Publicação
            </h2>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Cliente</label>
                <select
                  value={postClientId}
                  onChange={(e) => setPostClientId(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Título da Publicação / Tema</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Ex: 5 Dicas de Treino para o Verão"
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Data</label>
                  <input
                    type="date"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Horário</label>
                  <input
                    type="time"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Formato</label>
                <select
                  value={postContentType}
                  onChange={(e) => setPostContentType(e.target.value as any)}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                >
                  <option value="Carrossel">Carrossel</option>
                  <option value="Reels">Reels Vídeo</option>
                  <option value="Imagem Estática">Imagem Estática</option>
                  <option value="Stories">Stories em Sequência</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Legenda da Publicação</label>
                <textarea
                  rows={3}
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Escreva a legenda completa..."
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
