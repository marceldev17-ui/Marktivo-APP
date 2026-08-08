import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  onSuccess: (password: string) => void;
}

export function MasterPasswordScreen({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        onSuccess(password);
      } else {
        setError(data.error || "Senha incorreta.");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-sm text-slate-400">Insira a chave mestra para acessar a plataforma.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
          <div className="mb-4">
            <input
              type="password"
              placeholder="Digite a senha mestra..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-center tracking-widest"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 text-xs text-red-400 text-center bg-red-950/30 border border-red-900/50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar na Plataforma"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-slate-600">
          Marktivo © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
