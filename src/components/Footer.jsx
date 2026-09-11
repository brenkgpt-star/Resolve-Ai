import { Wrench, ShieldCheck, Truck, Sparkles } from 'lucide-react'

export default function Footer({ onSwitchTab }) {
  return (
    <footer className="border-t-2 border-stone-900 bg-stone-900 text-stone-300 px-6 py-12 text-xs">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-amber-400 border border-stone-900 flex items-center justify-center">
                <Wrench size={16} className="text-stone-900" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tight">
                Resolve Aí
              </span>
            </div>
            <p className="text-stone-400 text-xs max-w-sm leading-relaxed mb-4">
              A plataforma inteligente que diagnostica defeitos domésticos e entrega a lista exata de ferramentas e peças para você consertar em casa sem pagar visita técnica.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-amber-400" /> Garantia 30 dias
              </span>
              <span className="flex items-center gap-1">
                <Truck size={13} className="text-amber-400" /> Envio rápido
              </span>
            </div>
          </div>

          {/* Col 2 - Navigation */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSwitchTab('diagnosis')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Diagnóstico Inteligente
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSwitchTab('marketplace')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Marketplace & Busca de Peças
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSwitchTab('marketplace')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Kits de Emergência
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 - Categories */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Categorias Populares
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Chuveiros e Resistências</li>
              <li>Torneiras e Vedações</li>
              <li>Tomadas e Disjuntores</li>
              <li>Fechaduras e Dobradiças</li>
              <li>Kits de Ferramentas Manuais</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Resolve Aí. Todos os direitos reservados.
          </div>
          <div>
            Feito para quem mora sozinho e valoriza autonomia e economia.
          </div>
        </div>
      </div>
    </footer>
  )
}
