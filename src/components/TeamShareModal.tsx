import React, { useState } from "react";
import { 
  Users, 
  X, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  DollarSign, 
  Share2, 
  ExternalLink,
  Sparkles,
  Zap
} from "lucide-react";
import { MarktivoLogo } from "./MarktivoLogo";

interface TeamShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamShareModal: React.FC<TeamShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative space-y-6 my-auto text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <MarktivoLogo size="sm" />
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Compartilhar com sua Equipe
              </h2>
              <p className="text-xs text-slate-400">Acesso multiplataforma gratuito no PC e Celular</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Link Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
          <label className="text-xs font-bold text-cyan-300 block">Link de Acesso para sua Equipe:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-slate-900 text-slate-200 text-xs font-mono rounded-xl p-3 border border-slate-800 focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-cyan-500/20 transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-slate-950" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Link Copiado!" : "Copiar Link"}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            💡 Envie este link no WhatsApp da sua equipe. Qualquer membro pode abrir diretamente no celular ou computador!
          </p>
        </div>

        {/* FAQs & Direct Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card 1: Gratuidade */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
              <DollarSign className="h-5 w-5" />
              <span>O Deploy é Pago? É Gratuito?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">É 100% GRATUITO!</strong> Você e sua equipe não precisam pagar nada para usar esta ferramenta. O link compartilhado no AI Studio já funciona completo na nuvem sem necessidade de servidores pagos.
            </p>
          </div>

          {/* Card 2: PC e Celular */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-sm">
              <Smartphone className="h-5 w-5" />
              <span>Uso no Celular e no PC</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              O Marktivo foi desenhado com layout responsivo para funcionar perfeitamente em <strong className="text-white">Smartphones (iPhone e Android)</strong>, <strong className="text-white">Tablets</strong> e <strong className="text-white">Computadores (PC/Mac)</strong>.
            </p>
          </div>
        </div>

        {/* Instructions for PWA / Mobile Home Screen */}
        <div className="bg-gradient-to-r from-violet-950/60 to-slate-900 p-4 rounded-2xl border border-violet-800/50 space-y-2">
          <div className="flex items-center space-x-2 text-violet-300 font-extrabold text-xs">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Como Transformar em Aplicativo no Celular (Passo a Passo):</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
            <li><strong>no iPhone (Safari):</strong> Abra o link, clique no ícone de "Compartilhar" e selecione <em>"Adicionar à Tela de Início"</em>.</li>
            <li><strong>no Android (Chrome):</strong> Abra o link, clique nos 3 pontinhos do menu e toque em <em>"Instalar Aplicativo"</em> ou <em>"Adicionar à Tela Inicial"</em>.</li>
          </ul>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
          >
            Entendido, Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
