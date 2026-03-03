import { Plus, Database, Globe, Shield, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export function Settings() {
  return (
    <div className="max-w-4xl space-y-12">
      <header>
        <h1 className="text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie suas listas e preferências do aplicativo</p>
      </header>

      <div className="grid gap-8">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Database size={24} className="text-tv-accent" />
            Listas de Reprodução
          </h3>
          <div className="grid gap-4">
            <button 
              id="set-add-m3u"
              data-focusable="true"
              className="flex items-center justify-between p-6 bg-tv-surface rounded-2xl border border-white/5 hover:border-tv-accent/50 transition-all tv-focus"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Globe size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Adicionar M3U via URL</p>
                  <p className="text-gray-400">Importe canais usando um link .m3u ou .m3u8</p>
                </div>
              </div>
              <Plus size={24} />
            </button>

            <button 
              id="set-add-xtream"
              data-focusable="true"
              className="flex items-center justify-between p-6 bg-tv-surface rounded-2xl border border-white/5 hover:border-tv-accent/50 transition-all tv-focus"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                  <Shield size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Xtream Codes API</p>
                  <p className="text-gray-400">Conecte usando usuário, senha e URL do servidor</p>
                </div>
              </div>
              <Plus size={24} />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Info size={24} className="text-tv-accent" />
            Sobre o Aplicativo
          </h3>
          <div className="bg-tv-surface rounded-2xl p-8 border border-white/5 space-y-6">
            <div className="flex justify-between items-center pb-4 border-bottom border-white/5">
              <span className="text-gray-400">Versão do App</span>
              <span className="font-mono">1.0.0-stable</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-bottom border-white/5">
              <span className="text-gray-400">ID do Dispositivo</span>
              <span className="font-mono">VX-9928-X12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status da Licença</span>
              <span className="text-emerald-500 font-bold">ATIVADO</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
