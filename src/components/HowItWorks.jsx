import { Sparkles, MessageSquare, Cpu, ShoppingBag, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { 
    n: '01', 
    t: 'Conta o problema', 
    d: 'Escolha uma situação frequente, digite com suas palavras ou envie uma foto do local.',
    icon: MessageSquare,
  },
  { 
    n: '02', 
    t: 'Recebe o diagnóstico', 
    d: 'Nossa inteligência com visão computacional identifica a causa raiz sem enrolação técnica.',
    icon: Cpu,
  },
  { 
    n: '03', 
    t: 'Acessa o marketplace', 
    d: 'Lista enxuta com as ferramentas e peças exatas, com tamanhos certos e sem comprar itens à toa.',
    icon: ShoppingBag,
  },
  { 
    n: '04', 
    t: 'Resolve você mesmo', 
    d: 'Siga a orientação prática com segurança e economize centenas de reais em visitas técnicas.',
    icon: CheckCircle2,
  },
]

export default function HowItWorks() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          <span>Simples, Rápido e Seguro</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-8 text-stone-900 dark:text-white">
          Como Funciona o Resolve Aí
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((s) => {
            const Icon = s.icon
            return (
              <div 
                key={s.n} 
                className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/60 hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-black text-sm">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
                  {s.t}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                  {s.d}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
