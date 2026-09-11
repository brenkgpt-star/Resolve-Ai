import { Wrench, Sparkles, Search, ShoppingBag } from 'lucide-react'

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart,
  onQuickSearch 
}) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-stone-900 bg-stone-100 shadow-sm backdrop-blur-md bg-stone-100/95">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Brand / Logo */}
        <button
          onClick={() => setActiveTab('diagnosis')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 bg-stone-900 border-2 border-stone-900 flex items-center justify-center shadow-neo-sm group-hover:bg-amber-400 transition-colors">
            <Wrench size={18} className="text-amber-400 group-hover:text-stone-900 transition-colors" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight uppercase leading-none block">
              Resolve Aí
            </span>
            <span className="text-[10px] font-bold text-stone-500 tracking-wider uppercase block">
              IA & Marketplace
            </span>
          </div>
        </button>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold border-2 transition-all ${
              activeTab === 'diagnosis'
                ? 'bg-amber-400 text-stone-900 border-stone-900 shadow-neo-sm'
                : 'bg-transparent text-stone-600 border-transparent hover:border-stone-300 hover:text-stone-900'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'diagnosis' ? 'text-stone-900' : 'text-amber-500'} />
            <span>Diagnóstico IA</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold border-2 transition-all ${
              activeTab === 'marketplace'
                ? 'bg-amber-400 text-stone-900 border-stone-900 shadow-neo-sm'
                : 'bg-transparent text-stone-600 border-transparent hover:border-stone-300 hover:text-stone-900'
            }`}
          >
            <Search size={14} />
            <span>Buscar Produtos</span>
          </button>
        </nav>

        {/* Right side: Cart button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm border-2 border-stone-900 shadow-neo-sm neo-btn transition-colors"
            title="Abrir Kit de Reparo"
          >
            <ShoppingBag size={16} className="text-amber-400" />
            <span className="hidden sm:inline">Meu Kit</span>
            <span className="bg-amber-400 text-stone-900 text-[11px] font-black px-1.5 py-0.2 rounded-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
