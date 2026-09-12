import { Wrench, Sparkles, Search, ShoppingBag } from 'lucide-react'

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart,
  onQuickSearch 
}) {
  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b-2 border-stone-900 bg-stone-100/95 shadow-sm backdrop-blur-md">
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

          {/* Central Navigation — visible only on sm+ */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold border-2 transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold border-2 transition-all ${
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
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-stone-900 hover:bg-orange-700 text-white font-bold text-sm border-2 border-stone-900 shadow-neo-sm neo-btn transition-colors min-h-[44px] sm:min-h-0"
            title="Abrir Kit de Reparo"
          >
            <ShoppingBag size={18} className="text-amber-400" />
            <span className="hidden sm:inline">Meu Kit</span>
            <span className="bg-amber-400 text-stone-900 text-xs font-black px-2 py-0.5 rounded-sm min-w-[20px] text-center">
              {cartCount}
            </span>
          </button>

        </div>
      </header>

      {/* ── Bottom Nav Bar — mobile only ────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 border-stone-900 bg-stone-100 flex">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold transition-colors ${
            activeTab === 'diagnosis'
              ? 'bg-amber-400 text-stone-900'
              : 'text-stone-500'
          }`}
        >
          <Sparkles size={22} />
          <span>Diagnóstico</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold border-l-2 border-stone-900 transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-amber-400 text-stone-900'
              : 'text-stone-500'
          }`}
        >
          <Search size={22} />
          <span>Marketplace</span>
        </button>

        <button
          onClick={onOpenCart}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold border-l-2 border-stone-900 relative transition-colors text-stone-500"
        >
          <ShoppingBag size={22} />
          <span>Meu Kit</span>
          {cartCount > 0 && (
            <span className="absolute top-2 right-1/4 bg-amber-400 text-stone-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-stone-900">
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Spacer so content doesn't hide under bottom nav on mobile */}
      <div className="sm:hidden h-16" />
    </>
  )
}
