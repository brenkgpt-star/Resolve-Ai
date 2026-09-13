import { Sparkles, ArrowDown, UserPlus, ShieldCheck, Camera, Wrench } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Hero({ onStartDiagnosis }) {
  const { user, openLoginModal, openSignupModal } = useAuth()

  function handleStartDiagnosis() {
    if (!user) {
      openLoginModal()
      return
    }
    onStartDiagnosis()
  }

  return (
    <section className="border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 pt-12 pb-14 bg-gradient-to-b from-white via-stone-50/50 to-stone-100 dark:from-stone-950 dark:via-stone-900/50 dark:to-stone-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 dark:bg-amber-400/10 border border-amber-500/40 text-amber-900 dark:text-amber-400 font-bold text-xs px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
              <Sparkles size={14} className="text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Antes de pagar R$ 200 numa visita técnica, resolva você mesmo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5 text-stone-900 dark:text-white">
              Quebrou em casa? <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                Descubra a peça e a ferramenta
              </span> em segundos.
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
              Sem enrolação ou termos técnicos complicados. Conte o que aconteceu ou tire uma foto: nossa IA investiga o defeito e entrega o kit exato de ferramentas e peças com tamanhos recomendados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 mb-8">
              <button
                onClick={handleStartDiagnosis}
                className="w-full sm:w-auto py-4 sm:py-3.5 px-7 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>Fazer Diagnóstico Gratuito</span>
                <ArrowDown size={16} />
              </button>

              {!user && (
                <button
                  onClick={openSignupModal}
                  className="w-full sm:w-auto py-4 sm:py-3.5 px-6 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white font-bold text-sm rounded-xl border border-stone-300 dark:border-stone-700 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <UserPlus size={16} />
                  <span>Criar Conta Gratuita</span>
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-amber-500" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Camera size={16} className="text-amber-500" />
                <span>Suporte a Fotos do Celular</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench size={16} className="text-amber-500" />
                <span>Links Diretos no Mercado Livre</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real Case Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-3xl blur-xl opacity-70 dark:opacity-40" />

              <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 ml-2">caso_real.log</span>
                  </div>
                  <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Economia: R$ 165
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700/60">
                    <p className="font-bold text-stone-900 dark:text-white mb-1">
                      João, 24 anos (mora sozinho):
                    </p>
                    <p className="text-stone-600 dark:text-stone-300">
                      "O chuveiro parou de esquentar no domingo à noite. Não sabia se era fiação, disjuntor ou resistência."
                    </p>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl">
                    <p className="font-bold text-amber-700 dark:text-amber-400 mb-0.5 flex items-center gap-1.5">
                      <Sparkles size={13} />
                      Diagnóstico do Resolve Aí:
                    </p>
                    <p className="text-stone-700 dark:text-stone-300">
                      Resistência rompida por desgaste de uso. Indicou a resistência blindada certa por R$ 34,90 e o passo a passo com disjuntor desligado.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  <span>Sem visita técnica paga</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Resolvido em 25 min</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
