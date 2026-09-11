import { Sparkles } from 'lucide-react'

const STEPS = [
  { 
    n: '01', 
    t: 'Conta o problema', 
    d: 'Escolha uma situação frequente ou descreva em segundos com suas próprias palavras.' 
  },
  { 
    n: '02', 
    t: 'Recebe o diagnóstico', 
    d: 'Nossa inteligência identifica a provável causa física sem enrolação técnica.' 
  },
  { 
    n: '03', 
    t: 'Acessa o marketplace', 
    d: 'Lista enxuta com as ferramentas e peças exatas, com preços justos e sem comprar itens à toa.' 
  },
  { 
    n: '04', 
    t: 'Resolve você mesmo', 
    d: 'Siga a dica prática de instalação com alertas de segurança e economize centenas de reais.' 
  },
]

export default function HowItWorks() {
  return (
    <section className="px-4 sm:px-6 py-14 bg-white border-b-2 border-stone-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase mb-1">
          <Sparkles size={14} />
          <span>Simples, Rápido e Seguro</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-8 text-stone-900">
          Como Funciona o Resolve Aí
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-2 border-stone-900 bg-stone-100 shadow-neo">
          {STEPS.map((s, idx) => (
            <div 
              key={s.n} 
              className={`p-5 bg-white ${idx !== 0 ? 'border-t-2 sm:border-t-0 sm:border-l-2 border-stone-900' : ''}`}
            >
              <div className="font-mono text-orange-700 font-black text-lg mb-2">
                {s.n}
              </div>
              <h3 className="font-bold text-base text-stone-900 mb-1.5">
                {s.t}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
