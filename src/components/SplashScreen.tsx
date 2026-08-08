import React, { useEffect, useState } from "react";
import { MarktivoLogo } from "./MarktivoLogo";
import { Sparkles, Cpu, CheckCircle2 } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(10);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 200);
    const timer2 = setTimeout(() => setProgress(85), 600);
    const timer3 = setTimeout(() => setProgress(100), 1000);

    const finishTimer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        onFinish();
      }, 500); // fade out duration
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 transition-opacity duration-500 overflow-hidden select-none ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Animated Ambient Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md w-full">
        {/* Glowing Logo matching logo2.png */}
        <div className="transform transition-transform duration-700 hover:scale-105">
          <MarktivoLogo size="xl" variant="vertical" showSubtitle={true} />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
            <span>Ecossistema de Inteligência em Tráfego</span>
          </p>
          <p className="text-xs text-slate-400">
            Carregando inteligência artificial, clientes e gerador de campanhas...
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900 border border-slate-800 p-1 rounded-full shadow-inner relative overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-300 shadow-md shadow-cyan-500/30"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 w-full px-2">
          <span className="flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            Gemini AI Engine
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {progress}% Pronto
          </span>
        </div>
      </div>
    </div>
  );
};
