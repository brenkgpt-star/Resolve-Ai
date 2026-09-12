import { Sparkles, Search, ArrowDown } from 'lucide-react'

export default function Hero({ onStartDiagnosis, onExploreMarketplace }) {
  return (
    <section className="border-b-2 border-stone-900 px-4 sm:px-6 pt-12 pb-10 bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-400 border-2 border-stone-900 text-stone-900 font-bold text-xs px-3 py-1 mb-4 shadow-neo-sm">
          <Sparkles size={13} />
          <span>Antes de pagar R$ 200 numa visita técnica, resolva você mesmo</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.98] max-w-2xl mb-5 text-stone-900">
          Quebrou em casa? Descubra o que comprar em 30 segundos.
        </h1>

        <p className="text-stone-700 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
          Sem termos técnicos complicados. Conte o que aconteceu, nosso assistente inteligente identifica o defeito e monta o kit de ferramentas e peças exatas no nosso marketplace.
        </p>

        {/* Quick action buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-8">
          <button
            onClick={onStartDiagnosis}
            className="w-full sm:w-auto py-4 sm:py-3 px-6 bg-stone-900 hover:bg-orange-700 text-white font-bold text-base sm:text-sm border-2 border-stone-900 shadow-neo neo-btn flex items-center justify-center gap-2 min-h-[52px] sm:min-h-0"
          >
            <span>Fazer Diagnóstico Gratuito</span>
            <ArrowDown size={16} />
          </button>

          <button
            onClick={onExploreMarketplace}
            className="w-full sm:w-auto py-4 sm:py-3 px-6 bg-white hover:bg-amber-100 text-stone-900 font-bold text-base sm:text-sm border-2 border-stone-900 shadow-neo neo-btn flex items-center justify-center gap-2 min-h-[52px] sm:min-h-0"
          >
            <Search size={16} />
            <span>Explorar Marketplace</span>
          </button>
        </div>

        {/* Real life scenario box */}
        <div className="border-2 border-stone-900 bg-white flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 max-w-xl shadow-neo-sm">
          <span className="flex-none bg-amber-400 border-2 border-stone-900 text-[11px] font-black px-2 py-0.5 -rotate-2 h-fit self-start">
            CASO REAL
          </span>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            <strong className="text-stone-900">João, 24 anos, mora sozinho:</strong> chuveiro parou de
            esquentar no domingo à noite. Não sabe qual resistência comprar nem se é isso mesmo.
            O Resolve Aí indicou a resistência certa de R$ 34,90 e o passo a passo seguro para trocar.
          </p>
        </div>
      </div>
    </section>
  )
}
