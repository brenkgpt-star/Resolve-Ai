import { Wrench, ShieldCheck, CheckCircle2, MessageCircle, Instagram } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Footer({ onScrollToChat }) {
  const { user, openLoginModal, openSignupModal, logout } = useAuth()

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-stone-300 px-6 py-14 text-xs transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <Wrench size={16} className="text-stone-950" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tight">
                Resolve Aí
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed mb-5">
              A plataforma inteligente que diagnostica defeitos domésticos e entrega a lista exata de ferramentas e peças com tamanhos recomendados para você consertar em casa sem pagar visita técnica.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/40">
                <ShieldCheck size={14} className="text-amber-400" /> 100% Gratuito
              </span>
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/40">
                <CheckCircle2 size={14} className="text-amber-400" /> Diagnóstico Preciso
              </span>
            </div>
          </div>

          {/* Col 2 - Navigation & Account */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5">
              Acesso Rápido
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onScrollToChat}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Diagnóstico Inteligente
                </button>
              </li>
              {user ? (
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Sair da Conta ({user.displayName || user.email})
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      onClick={openLoginModal}
                      className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                    >
                      Fazer Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={openSignupModal}
                      className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                    >
                      Criar Conta Gratuita
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3 - Reparos Suportados */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5">
              Reparos Suportados
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>Chuveiros sem esquentar</li>
              <li>Torneiras pingando e vazamentos</li>
              <li>Tomadas e disjuntores</li>
              <li>Portas raspando e dobradiças</li>
              <li>Pias entupidas e sifão</li>
            </ul>
          </div>

          {/* Col 4 - Contato & Redes Sociais */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3.5">
              Contato & Redes
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href="https://wa.me/5549988094157"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-stone-300 hover:text-emerald-400 transition-colors p-2 -ml-2 rounded-lg hover:bg-stone-800/60"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-stone-950 flex items-center justify-center transition-all shrink-0">
                    <MessageCircle size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 group-hover:text-emerald-300 font-medium">WhatsApp</div>
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">(49) 98809-4157</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/resolveai_original/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-stone-300 hover:text-pink-400 transition-colors p-2 -ml-2 rounded-lg hover:bg-stone-800/60"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <Instagram size={17} />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 group-hover:text-pink-300 font-medium">Instagram</div>
                    <div className="font-semibold text-white group-hover:text-pink-400 transition-colors">@resolveai_original</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Resolve Aí. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5549988094157"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              title="Fale conosco no WhatsApp"
            >
              <MessageCircle size={14} />
              <span>(49) 98809-4157</span>
            </a>
            <span className="text-stone-700">•</span>
            <a
              href="https://www.instagram.com/resolveai_original/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-pink-400 flex items-center gap-1.5 transition-colors"
              title="Siga no Instagram"
            >
              <Instagram size={14} />
              <span>@resolveai_original</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
