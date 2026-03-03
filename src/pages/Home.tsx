import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Film, PlaySquare, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { storage, StorageKeys } from '../services/storageService';

const CategoryCard = React.memo(({ cat, index, onClick }: any) => (
  <motion.button
    id={cat.id}
    data-focusable="true"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05, duration: 0.2 }}
    onClick={onClick}
    className={cn(
      "relative h-64 rounded-3xl overflow-hidden p-8 text-left group tv-focus",
      "bg-gradient-to-br shadow-xl", cat.color
    )}
  >
    <div className="relative z-10 h-full flex flex-col justify-between">
      <cat.icon size={48} className="text-white/80" />
      <div>
        <h2 className="text-3xl font-bold mb-1">{cat.title}</h2>
        <p className="text-white/60 font-medium">{cat.count}</p>
      </div>
    </div>
    <cat.icon 
      size={200} 
      className="absolute -right-10 -bottom-10 text-white/5 rotate-12 pointer-events-none" 
    />
  </motion.button>
));

export function Home() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ live: 0, movies: 0, series: 0 });

  useEffect(() => {
    async function loadCounts() {
      const live = await storage.get<any[]>(StorageKeys.LIVE_STREAMS);
      const movies = await storage.get<any[]>(StorageKeys.VOD_STREAMS);
      const series = await storage.get<any[]>(StorageKeys.SERIES_STREAMS);

      setCounts({
        live: live?.length || 0,
        movies: movies?.length || 0,
        series: series?.length || 0
      });
    }
    loadCounts();
  }, []);

  const categories = React.useMemo(() => [
    { id: 'cat-live', title: 'TV AO VIVO', icon: Tv, count: `${counts.live.toLocaleString()} Canais`, color: 'from-blue-600 to-blue-900', path: '/live' },
    { id: 'cat-movies', title: 'FILMES', icon: Film, count: `${counts.movies.toLocaleString()} Títulos`, color: 'from-purple-600 to-purple-900', path: '/movies' },
    { id: 'cat-series', title: 'SÉRIES', icon: PlaySquare, count: `${counts.series.toLocaleString()} Séries`, color: 'from-emerald-600 to-emerald-900', path: '/series' },
    { id: 'cat-favs', title: 'FAVORITOS', icon: Star, count: '0 Itens', color: 'from-amber-600 to-amber-900', path: '/favorites' },
  ], [counts]);

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-5xl font-bold tracking-tight mb-2">Vortex Player</h1>
        <p className="text-gray-400 text-xl">O que vamos assistir hoje?</p>
      </header>

      <div className="grid grid-cols-2 gap-8">
        {categories.map((cat, index) => (
          <CategoryCard 
            key={cat.id} 
            cat={cat} 
            index={index} 
            onClick={() => navigate(cat.path)} 
          />
        ))}
      </div>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-400 uppercase tracking-widest">Continuar Assistindo</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              id={`recent-${i}`}
              data-focusable="true"
              className="shrink-0 w-80 aspect-video bg-tv-surface rounded-2xl overflow-hidden relative group tv-focus border border-white/5"
            >
              <img 
                src={`https://picsum.photos/seed/movie-${i}/400/225`} 
                alt="Movie" 
                loading="lazy"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="h-1 bg-white/20 rounded-full mb-2">
                  <div className="h-full bg-tv-accent w-1/2 rounded-full" />
                </div>
                <p className="font-medium truncate">Filme Exemplo {i}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
