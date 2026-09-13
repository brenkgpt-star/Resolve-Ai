import { ArrowLeft, Tag, ExternalLink, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'

export default function ProductVariantPanel({ category, onBack }) {
  const percent = category.necessityPercent || 90
  const rank = category.rank || 1

  return (
    <div className="animate-fadeIn">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>← Voltar ao Ranking Geral de Produtos</span>
      </button>

      {/* Category hero with AI Ranking % Badge */}
      <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-7 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              {category.emoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  rank === 1
                    ? 'bg-amber-400 text-stone-950'
                    : rank === 2
                    ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}>
                  #{rank} no Ranking da IA
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  {category.priorityLabel || 'Item Recomendado'}
                </span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-stone-900 dark:text-white leading-tight">
                {category.name}
              </h3>
            </div>
          </div>

          {/* Necessity Meter */}
          <div className="sm:text-right bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 shrink-0">
            <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Índice de Necessidade
            </div>
            <div className="text-2xl font-black text-amber-500 dark:text-amber-400 flex items-baseline sm:justify-end gap-1">
              <span>{percent}%</span>
              <span className="text-xs font-semibold text-stone-400">no momento</span>
            </div>
          </div>
        </div>

        {/* Technical Specification Box from AI */}
        {(category.whyNeeded || category.recommendedSpec || category.checkBeforeBuy) && (
          <div className="bg-stone-50 dark:bg-stone-950/60 rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 flex flex-col gap-3 text-xs">
            {category.whyNeeded && (
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 dark:text-white block font-bold">Por que a IA classificou com {percent}% de necessidade:</strong>
                  <span className="text-stone-600 dark:text-stone-300 leading-relaxed">{category.whyNeeded}</span>
                </div>
              </div>
            )}

            {category.recommendedSpec && (
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 dark:text-white block font-bold">Especificação exata sugerida para não errar a compra:</strong>
                  <span className="text-stone-600 dark:text-stone-300 leading-relaxed">{category.recommendedSpec}</span>
                </div>
              </div>
            )}

            {category.checkBeforeBuy && (
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 dark:text-white block font-bold">Dica de inspeção prévia no local:</strong>
                  <span className="text-stone-600 dark:text-stone-300 leading-relaxed">{category.checkBeforeBuy}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variants label */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-wider">
            Tamanhos e Modelos Calibrados ({category.variants.length} opções disponíveis):
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Veja a taxa de compatibilidade de cada opção nas casas brasileiras antes de escolher no Mercado Livre.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.variants.map((variant) => (
          <div
            key={variant.id}
            className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Header strip with market badge */}
            <div className="bg-stone-900 dark:bg-stone-950 text-white px-5 py-3.5 border-b border-stone-800">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-black text-sm block leading-snug">{variant.size}</span>
                {variant.compatibilityRate && (
                  <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full shrink-0">
                    {variant.compatibilityRate}
                  </span>
                )}
              </div>
              <span className="text-stone-400 text-[11px] font-mono block">{variant.spec}</span>
            </div>

            <div className="p-5 flex flex-col gap-3.5 flex-1">
              {variant.marketBadge && (
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg self-start">
                  ⭐ {variant.marketBadge}
                </div>
              )}

              {/* Price range */}
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-amber-500 shrink-0" />
                <span className="text-2xl font-black text-stone-900 dark:text-white">{variant.priceRange}</span>
              </div>

              {/* Tip */}
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-l-2 border-amber-400 pl-3 py-0.5 flex-1">
                {variant.tip}
              </p>

              {/* Mercado Livre Button */}
              <a
                href={variant.mercadoLivreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-yellow-300 active:scale-95 text-stone-950 font-black text-sm py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all min-h-[48px]"
              >
                <ExternalLink size={15} />
                <span>Buscar no Mercado Livre</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-stone-400 dark:text-stone-500 mt-6 text-center">
        Os preços são estimativas médias do Mercado Livre. Sempre verifique o frete e as avaliações do vendedor.
      </p>
    </div>
  )
}
