import { Wrench, Sparkles, Calendar as CalendarIcon, User, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header({ activeTab, setActiveTab, onStartDiagnosis }) {
  const { user, logout, openLoginModal, openSignupModal } = useAuth()

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b-2 border-stone-900 bg-stone-100/95 shadow-sm backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

          {/* Brand / Logo */}
          <button
            onClick={() => setActiveTab('diagnosis')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
          >
            <div className="w-9 h-9 bg-stone-900 border-2 border-stone-900 flex items-center justify-center shadow-neo-sm group-hover:bg-amber-400 transition-colors">
              <Wrench size={18} className="text-amber-400 group-hover:text-stone-900 transition-colors" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight uppercase leading-none block">
                Resolve Aí
              </span>
              <span className="text-[10px] font-bold text-stone-500 tracking-wider uppercase block">
                Diagnóstico & Calendário
              </span>
            </div>
          </button>

          {/* Central Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('diagnosis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                activeTab === 'diagnosis'
                  ? 'bg-amber-400 text-stone-900 border-stone-900 shadow-neo-sm'
                  : 'bg-transparent text-stone-600 border-transparent hover:border-stone-300 hover:text-stone-900'
              }`}
            >
              <Sparkles size={14} className={activeTab === 'diagnosis' ? 'text-stone-900' : 'text-amber-500'} />
              <span>Diagnóstico IA</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-stone-900 border-stone-900 shadow-neo-sm'
                  : 'bg-transparent text-stone-600 border-transparent hover:border-stone-300 hover:text-stone-900'
              }`}
            >
              <CalendarIcon size={14} />
              <span>Histórico & Calendário</span>
            </button>
          </nav>

          {/* Right side: Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              /* User is Logged In */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white border-2 border-stone-900 px-3 py-1.5 shadow-neo-sm">
                  <div className="w-6 h-6 rounded-full bg-amber-400 border border-stone-900 flex items-center justify-center text-xs font-black text-stone-900 shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-stone-900 max-w-[120px] truncate hidden sm:inline">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold border-2 border-stone-900 shadow-neo-sm neo-btn transition-colors min-h-[44px] sm:min-h-0"
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
                  className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white hover:bg-stone-200 text-stone-900 text-xs font-bold border-2 border-stone-900 shadow-neo-sm neo-btn transition-colors min-h-[44px] sm:min-h-0"
                >
                  <LogIn size={14} />
                  <span>Entrar</span>
                </button>

                <button
                  onClick={openSignupModal}
                  className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-black border-2 border-stone-900 shadow-neo-sm neo-btn transition-colors min-h-[44px] sm:min-h-0"
                >
                  <span>Cadastrar</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Bottom Nav Bar — mobile only ────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 border-stone-900 bg-stone-100 flex shadow-lg">
        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold transition-colors ${
            activeTab === 'diagnosis' ? 'bg-amber-400 text-stone-900' : 'text-stone-600 bg-stone-100'
          }`}
        >
          <Sparkles size={20} />
          <span>Diagnóstico</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold border-l-2 border-stone-900 transition-colors ${
            activeTab === 'history' ? 'bg-amber-400 text-stone-900' : 'text-stone-600 bg-stone-100'
          }`}
        >
          <CalendarIcon size={20} />
          <span>Calendário</span>
        </button>

        {user ? (
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold border-l-2 border-stone-900 text-stone-700 bg-white"
          >
            <LogOut size={20} />
            <span>Sair ({user.displayName?.split(' ')[0] || 'Perfil'})</span>
          </button>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-bold border-l-2 border-stone-900 text-stone-700 bg-white"
          >
            <User size={20} />
            <span>Conta</span>
          </button>
        )}
      </nav>

      {/* Spacer so content doesn't hide under bottom nav on mobile */}
      <div className="sm:hidden h-16" />
    </>
  )
}
