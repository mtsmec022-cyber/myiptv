import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Login() {
  const { auth, loginXtream, loginPartnerCloudGo } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'select' | 'xtream' | 'partner_code'>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [server, setServer] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [partnerCode, setPartnerCode] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/sync');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleXtreamLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginXtream(server, user, pass);
    } catch (err) {
      setError('Falha na conexão. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginPartnerCloudGo(partnerCode, user, pass);
    } catch (err: any) {
      setError(err.message || 'Falha na conexão. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-tv-bg flex items-center justify-center p-12">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-tv-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-tv-accent/40 mx-auto mb-6">
            <span className="font-bold text-5xl">V</span>
          </div>
          <h1 className="text-5xl font-bold mb-2">Vortex Player</h1>
          <p className="text-gray-400 text-xl">Escolha como deseja entrar</p>
        </div>

        {mode === 'select' && (
          <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
            <button
              id="login-opt-partner-code"
              data-focusable="true"
              onClick={() => setMode('partner_code')}
              className="bg-tv-surface p-10 rounded-[40px] border-2 border-white/5 hover:border-tv-accent transition-all text-left group tv-focus"
            >
              <Smartphone size={48} className="text-tv-accent mb-6" />
              <h2 className="text-3xl font-bold mb-2">Login via Código</h2>
              <p className="text-gray-400">Entre usando o código do parceiro, usuário e senha.</p>
            </button>

            <button
              id="login-opt-xtream"
              data-focusable="true"
              onClick={() => setMode('xtream')}
              className="bg-tv-surface p-10 rounded-[40px] border-2 border-white/5 hover:border-tv-accent transition-all text-left group tv-focus"
            >
              <Shield size={48} className="text-purple-500 mb-6" />
              <h2 className="text-3xl font-bold mb-2">Xtream Codes</h2>
              <p className="text-gray-400">Use suas credenciais de servidor, usuário e senha.</p>
            </button>
          </div>
        )}

        {mode === 'partner_code' && (
          <div className="bg-tv-surface p-12 rounded-[40px] w-full max-w-2xl border-2 border-white/5">
            <button onClick={() => setMode('select')} className="text-tv-accent mb-8 flex items-center gap-2 hover:underline">
              Voltar
            </button>
            <h2 className="text-3xl font-bold mb-8">Login via Código</h2>
            <form onSubmit={handlePartnerCodeLogin} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Código do Parceiro (ex: cloudgo)"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value)}
                  className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-xl focus:border-tv-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-xl focus:border-tv-accent outline-none"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-xl focus:border-tv-accent outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-center font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tv-accent p-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Conectar <ArrowRight /></>}
              </button>
            </form>
          </div>
        )}

        {mode === 'xtream' && (
          <div className="bg-tv-surface p-12 rounded-[40px] w-full max-w-2xl border-2 border-white/5">
            <button onClick={() => setMode('select')} className="text-tv-accent mb-8 flex items-center gap-2 hover:underline">
              Voltar
            </button>
            <h2 className="text-3xl font-bold mb-8">Configurar Xtream Codes</h2>
            <form onSubmit={handleXtreamLogin} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="URL do Servidor (ex: http://exemplo.com:8080)"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-xl focus:border-tv-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-xl focus:border-tv-accent outline-none"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-xl focus:border-tv-accent outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-center font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tv-accent p-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Conectar <ArrowRight /></>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
