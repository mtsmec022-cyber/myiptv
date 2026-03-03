import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { XtreamService } from '../services/xtreamService';

import { storage, StorageKeys } from '../services/storageService';

const ChannelCard = React.memo(({ channel, onClick, style }: any) => (
  <div style={style} className="p-3">
    <button
      id={channel.id}
      data-focusable="true"
      onClick={onClick}
      className="flex flex-col gap-3 group tv-focus w-full h-full"
    >
      <div className="aspect-square bg-tv-surface rounded-2xl flex items-center justify-center p-6 border border-white/5 group-hover:border-tv-accent/50 transition-colors shadow-lg overflow-hidden">
        <img 
          src={channel.logo || 'https://via.placeholder.com/150?text=TV'} 
          alt={channel.name} 
          loading="lazy"
          className="w-full h-full object-contain opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          onError={(e: any) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=TV'; }}
        />
      </div>
      <div className="text-center">
        <p className="font-medium truncate text-sm">{channel.name}</p>
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{channel.category}</p>
        </div>
      </div>
    </button>
  </div>
));

export function LiveTV() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFromCache() {
      const cats = await storage.get<any[]>(StorageKeys.LIVE_CATS);
      const streams = await storage.get<any[]>(StorageKeys.LIVE_STREAMS);

      if (cats && streams) {
        setCategories([{ category_id: 'Todos', category_name: 'Todos' }, ...cats]);
        
        const xtream = auth.type === 'xtream' 
          ? new XtreamService(auth.credentials.server, auth.credentials.user, auth.credentials.pass)
          : null;

        setChannels(streams.map((s: any) => ({
          id: s.stream_id,
          name: s.name,
          logo: s.stream_icon,
          category_id: s.category_id,
          category: cats.find((c: any) => c.category_id === s.category_id)?.category_name || 'Geral',
          url: xtream ? xtream.getStreamUrl(s.stream_id, 'ts') : 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        })));
        setLoading(false);
      } else {
        // If no cache, redirect to sync
        navigate('/sync');
      }
    }
    loadFromCache();
  }, [auth, navigate]);

  const filteredChannels = React.useMemo(() => {
    let filtered = channels;
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(c => c.category_id === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [channels, selectedCategory, searchQuery]);

  const Cell = React.useCallback(({ columnIndex, rowIndex, style, data }: any) => {
    const index = rowIndex * 6 + columnIndex;
    const channel = data[index];
    if (!channel) return null;
    return (
      <ChannelCard 
        channel={channel} 
        style={style}
        onClick={() => navigate(`/player?url=${encodeURIComponent(channel.url)}&title=${encodeURIComponent(channel.name)}`)} 
      />
    );
  }, [navigate]);

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
          <h1 className="text-4xl font-bold mb-2">TV ao Vivo</h1>
          <p className="text-gray-400">Navegue por {filteredChannels.length} canais</p>
        </div>
        <div className="bg-tv-surface px-6 py-3 rounded-xl flex items-center gap-3 border border-white/5">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar canal..." 
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
              rowCount={Math.ceil(filteredChannels.length / 6)}
              rowHeight={width / 6 * 1.3}
              width={width}
              itemData={filteredChannels}
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
