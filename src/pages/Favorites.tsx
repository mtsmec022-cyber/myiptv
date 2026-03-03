import { Star, Tv, Film, PlaySquare } from 'lucide-react';

export function Favorites() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold mb-2">Meus Favoritos</h1>
        <p className="text-gray-400">Seu conteúdo preferido em um só lugar</p>
      </header>

      <div className="flex items-center justify-center h-96 bg-tv-surface/30 rounded-3xl border-2 border-dashed border-white/5">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-tv-surface rounded-full flex items-center justify-center mx-auto">
            <Star size={40} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold">Nenhum favorito ainda</h2>
          <p className="text-gray-500 max-w-xs mx-auto">
            Adicione canais, filmes ou séries aos seus favoritos para acessá-los rapidamente aqui.
          </p>
          <button 
            id="fav-browse"
            data-focusable="true"
            className="px-8 py-3 bg-tv-accent rounded-full font-bold hover:scale-105 transition-transform tv-focus"
          >
            Explorar Conteúdo
          </button>
        </div>
      </div>
    </div>
  );
}
