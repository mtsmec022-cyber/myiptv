import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Tv, Film, PlaySquare, Settings, Search, Star, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { id: 'nav-home', icon: Home, label: 'Início', path: '/' },
  { id: 'nav-live', icon: Tv, label: 'TV ao Vivo', path: '/live' },
  { id: 'nav-movies', icon: Film, label: 'Filmes', path: '/movies' },
  { id: 'nav-series', icon: PlaySquare, label: 'Séries', path: '/series' },
  { id: 'nav-favorites', icon: Star, label: 'Favoritos', path: '/favorites' },
  { id: 'nav-search', icon: Search, label: 'Busca', path: '/search' },
  { id: 'nav-settings', icon: Settings, label: 'Ajustes', path: '/settings' },
];

export const Sidebar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-24 hover:w-64 transition-all duration-300 bg-tv-surface flex flex-col items-center py-8 z-50 group border-r border-white/5">
      <div className="mb-12">
        <div className="w-12 h-12 bg-tv-accent rounded-xl flex items-center justify-center shadow-lg shadow-tv-accent/20">
          <span className="font-bold text-2xl">V</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-4 w-full px-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              id={item.id}
              data-focusable="true"
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-200 w-full group/btn",
                "hover:bg-white/10 focus:bg-tv-accent focus:text-white",
                isActive ? "bg-tv-accent/20 text-tv-accent" : "text-gray-400"
              )}
            >
              <item.icon size={24} className="shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-6 w-full px-4">
        <button
          id="nav-logout"
          data-focusable="true"
          onClick={logout}
          className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 w-full text-red-500 hover:bg-red-500/10 focus:bg-red-500 focus:text-white"
        >
          <LogOut size={24} className="shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium whitespace-nowrap">
            Sair
          </span>
        </button>
        <div className="text-gray-600 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
          v1.0.0
        </div>
      </div>
    </aside>
  );
});
