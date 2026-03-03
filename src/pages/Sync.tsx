import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { XtreamService } from '../services/xtreamService';
import { storage, StorageKeys } from '../services/storageService';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Sync() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'Autenticando...', weight: 10 },
    { label: 'Carregando Canais...', weight: 30 },
    { label: 'Carregando Filmes...', weight: 30 },
    { label: 'Carregando Séries...', weight: 30 },
  ];

  useEffect(() => {
    async function performSync() {
      if (!auth.credentials) {
        navigate('/login');
        return;
      }

      const xtream = new XtreamService(
        auth.credentials.server,
        auth.credentials.user,
        auth.credentials.pass
      );

      try {
        // Clear old cache before sync
        storage.clearOldLocalStorage(); // Free up localStorage space
        await storage.clearAll(); // Clear IndexedDB

        // Step 1: Auth
        setStep(0);
        await xtream.authenticate();
        setProgress(10);

        // Step 2: Live
        setStep(1);
        const [liveCats, liveStreamsRaw] = await Promise.all([
          xtream.getLiveCategories(),
          xtream.getLiveStreams()
        ]);
        
        // Optimize Live Streams: Keep only what's needed for the list
        const liveStreams = liveStreamsRaw.map((s: any) => ({
          stream_id: s.stream_id,
          name: s.name,
          stream_icon: s.stream_icon,
          category_id: s.category_id
        }));

        await storage.set(StorageKeys.LIVE_CATS, liveCats);
        await storage.set(StorageKeys.LIVE_STREAMS, liveStreams);
        setProgress(40);

        // Step 3: VOD
        setStep(2);
        const [vodCats, vodStreamsRaw] = await Promise.all([
          xtream.getVodCategories(),
          xtream.getVodStreams()
        ]);

        // Optimize VOD Streams
        const vodStreams = vodStreamsRaw.map((s: any) => ({
          stream_id: s.stream_id,
          name: s.name,
          stream_icon: s.stream_icon,
          category_id: s.category_id,
          rating: s.rating,
          year: s.year
        }));

        await storage.set(StorageKeys.VOD_CATS, vodCats);
        await storage.set(StorageKeys.VOD_STREAMS, vodStreams);
        setProgress(70);

        // Step 4: Series
        setStep(3);
        const [seriesCats, seriesStreamsRaw] = await Promise.all([
          xtream.getSeriesCategories(),
          xtream.getSeriesStreams()
        ]);

        // Optimize Series Streams
        const seriesStreams = seriesStreamsRaw.map((s: any) => ({
          series_id: s.series_id,
          name: s.name,
          cover: s.cover,
          category_id: s.category_id,
          rating: s.rating,
          last_episode: s.last_episode ? { cover: s.last_episode.cover } : null
        }));

        await storage.set(StorageKeys.SERIES_CATS, seriesCats);
        await storage.set(StorageKeys.SERIES_STREAMS, seriesStreams);
        setProgress(100);

        // Finalize
        setTimeout(() => navigate('/'), 800);
      } catch (err: any) {
        console.error('Sync Error:', err);
        let msg = 'Erro ao sincronizar dados. Verifique sua conexão.';
        if (err.message?.includes('quota') || err.name === 'QuotaExceededError') {
          msg = 'Espaço insuficiente no navegador. Tente limpar o cache ou usar outro navegador.';
        }
        setError(msg);
      }
    }

    performSync();
  }, [auth, navigate]);

  return (
    <div className="fixed inset-0 bg-tv-bg flex items-center justify-center p-12">
      <div className="w-full max-w-2xl space-y-12 text-center">
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/5"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="553"
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
              className="text-tv-accent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-4xl font-bold">{progress}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              {error ? (
                <>
                  <AlertCircle size={48} className="text-red-500" />
                  <h2 className="text-3xl font-bold text-red-500">{error}</h2>
                  <button 
                    onClick={() => navigate('/login')}
                    className="mt-4 px-8 py-3 bg-white/10 rounded-full font-bold hover:bg-white/20"
                  >
                    Voltar ao Login
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">{steps[step]?.label}</h2>
                  <p className="text-gray-400 text-xl">Isso pode levar alguns segundos dependendo da sua lista.</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4">
          {steps.map((s, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < step ? 'bg-tv-accent' : i === step ? 'bg-white animate-pulse' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
