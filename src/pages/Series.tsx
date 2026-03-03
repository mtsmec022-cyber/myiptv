import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Loader2, Search } from 'lucide-react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { XtreamService } from '../services/xtreamService';

import { storage, StorageKeys } from '../services/storageService';

const SeriesCard = React.memo(({ series, onClick, style }: any) => (
  <div style={style} className="p-3">
    <button
      id={series.id}
      data-focusable="true"
      onClick={onClick}
      className="flex flex-col gap-3 group tv-focus text-left w-full h-full"
    >
      <div className="aspect-[2/3] bg-tv-surface rounded-2xl overflow-hidden relative border border-white/5 shadow-lg">
        <img 
          src={series.poster || 'https://via.placeholder.com/300x450?text=Serie'} 
          alt={series.title} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e: any) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Serie'; }}
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          {series.rating}
        </div>
      </div>
      <div>
        <p className="font-bold truncate text-sm">{series.title}</p>
        <p className="text-xs text-gray-500">{series.seasons} Temporadas</p>
      </div>
    </button>
  </div>
));

export function Series() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFromCache() {
      const cats = await storage.get<any[]>(StorageKeys.SERIES_CATS);
      const streams = await storage.get<any[]>(StorageKeys.SERIES_STREAMS);

      if (cats && streams) {
        setCategories([{ category_id: 'Todos', category_name: 'Todos' }, ...cats]);
        
        setSeries(streams.map((s: any) => ({
          id: s.series_id,
          title: s.name,
          rating: s.rating || '0.0',
          poster: s.cover || s.last_episode?.cover,
          category_id: s.category_id,
          seasons: 'Várias'
        })));
        setLoading(false);
      }
 else {
        navigate('/sync');
      }
    }
    loadFromCache();
  }, [auth, navigate]);

  const filteredSeries = React.useMemo(() => {
    let filtered = series;
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(s => s.category_id === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(q));
    }
    return filtered;
  }, [series, selectedCategory, searchQuery]);

  const Cell = React.useCallback(({ columnIndex, rowIndex, style, data }: any) => {
    const index = rowIndex * 6 + columnIndex;
    const s = data[index];
    if (!s) return null;
    return (
      <SeriesCard 
        series={s} 
        style={style}
        onClick={() => {}} // Series detail would go here
      />
    );
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={64} className="animate-spin text-tv-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Séries</h1>
          <p className="text-gray-400">Explore nossa biblioteca de {filteredSeries.length} séries</p>
        </div>
        <div className="bg-tv-surface px-6 py-3 rounded-xl flex items-center gap-3 border border-white/5">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar série..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-lg w-64"
          />
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.category_id}
            id={`cat-${cat.category_id}`}
            data-focusable="true"
            onClick={() => setSelectedCategory(cat.category_id)}
            className={cn(
              "px-8 py-3 rounded-full text-lg font-medium transition-all shrink-0 tv-focus",
              selectedCategory === cat.category_id ? "bg-tv-accent text-white" : "bg-tv-surface text-gray-400 hover:bg-white/5"
            )}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={6}
              columnWidth={width / 6}
              height={height}
              rowCount={Math.ceil(filteredSeries.length / 6)}
              rowHeight={width / 6 * 1.7}
              width={width}
              itemData={filteredSeries}
              className="no-scrollbar"
            >
              {Cell}
            </Grid>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
