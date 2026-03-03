import { Search as SearchIcon, History, TrendingUp } from 'lucide-react';

export function Search() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold mb-2">Busca</h1>
        <p className="text-gray-400">Encontre canais, filmes e séries em toda a sua biblioteca</p>
      </header>

      <div className="max-w-3xl">
        <div className="bg-tv-surface p-6 rounded-3xl flex items-center gap-6 border-2 border-white/5 focus-within:border-tv-accent transition-all">
          <SearchIcon size={32} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Digite o nome do conteúdo..." 
            className="bg-transparent border-none outline-none text-2xl w-full"
            autoFocus
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-400">
            <History size={20} />
            Buscas Recentes
          </h3>
          <div className="flex flex-wrap gap-4">
            {['Big Brother Brasil', 'Vingadores', 'HBO', 'Discovery Channel'].map((term) => (
              <button 
                key={term}
                id={`search-recent-${term}`}
                data-focusable="true"
                className="px-6 py-3 bg-tv-surface rounded-full hover:bg-white/10 tv-focus"
              >
                {term}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-400">
            <TrendingUp size={20} />
            Mais Buscados
          </h3>
          <div className="flex flex-wrap gap-4">
            {['Futebol ao Vivo', 'Lançamentos 2024', 'Desenhos Animados', 'Canais 4K'].map((term) => (
              <button 
                key={term}
                id={`search-trend-${term}`}
                data-focusable="true"
                className="px-6 py-3 bg-tv-surface rounded-full hover:bg-white/10 tv-focus"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
