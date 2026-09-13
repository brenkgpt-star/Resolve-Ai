import { Wrench, Sparkles, Calendar as CalendarIcon, User, LogOut, LogIn, Sun, Moon, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Header({ activeTab, setActiveTab, onStartDiagnosis }) {
  const { user, logout, openLoginModal, openSignupModal } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 shadow-sm backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

          {/* Brand / Logo */}
          <button
            onClick={() => setActiveTab('diagnosis')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
          >
            <div className="w-10 h-10 bg-stone-900 dark:bg-amber-400 border border-stone-800 dark:border-amber-300 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
              <Wrench size={20} className="text-amber-400 dark:text-stone-950 transition-colors" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight uppercase leading-none block text-stone-900 dark:text-white">
                Resolve Aí
              </span>
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 tracking-wider uppercase block">
                Diagnóstico & Mercado Livre
              </span>
            </div>
          </button>

          {/* Central Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden sm:flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/60">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'diagnosis'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={15} className={activeTab === 'diagnosis' ? 'text-stone-950' : 'text-amber-500'} />
              <span>Diagnóstico IA</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag size={15} className={activeTab === 'products' ? 'text-stone-950' : 'text-amber-500'} />
              <span>Produtos & Mercado Livre</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon size={15} />
              <span>Histórico & Calendário</span>
            </button>
          </nav>

          {/* Right side: Dark Mode Toggle + Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar modo escuro"
              title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {isDark ? (
                <Sun size={18} className="animate-spin-once" />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {user ? (
              /* User is Logged In */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-xs font-black text-stone-950 shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 max-w-[120px] truncate hidden sm:inline">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 transition-colors min-h-[40px] sm:min-h-0 cursor-pointer"
                  title="Sair da conta"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              /* User is Guest */
              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold rounded-xl border border-stone-200 dark:border-stone-700 transition-colors min-h-[40px] sm:min-h-0 cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Entrar</span>
                </button>

                <button
                  onClick={openSignupModal}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl shadow-sm transition-all min-h-[40px] sm:min-h-0 cursor-pointer hover:shadow-md active:scale-95"
                >
                  <span>Cadastrar</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Bottom Nav Bar — mobile only ────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md flex shadow-lg">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
            activeTab === 'diagnosis' ? 'bg-amber-400 text-stone-950' : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Sparkles size={18} />
          <span>Diagnóstico</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
            activeTab === 'products' ? 'bg-amber-400 text-stone-950' : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <ShoppingBag size={18} />
          <span>Produtos</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
            activeTab === 'history' ? 'bg-amber-400 text-stone-950' : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <CalendarIcon size={18} />
          <span>Calendário</span>
        </button>

        {user ? (
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold text-stone-700 dark:text-stone-300"
          >
            <LogOut size={18} />
            <span className="truncate max-w-[60px]">Sair</span>
          </button>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold text-stone-700 dark:text-stone-300"
          >
            <User size={18} />
            <span>Conta</span>
          </button>
        )}
      </nav>

      {/* Spacer so content doesn't hide under bottom nav on mobile */}
      <div className="sm:hidden h-16" />
    </>
  )
}
