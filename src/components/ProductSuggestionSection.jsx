import { useState, forwardRef } from 'react'
import { Sparkles, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Flame, ArrowRight } from 'lucide-react'
import ProductVariantPanel from './ProductVariantPanel.jsx'

const ProductSuggestionSection = forwardRef(function ProductSuggestionSection(
  { categories, onExploreProducts },
  ref
) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (!categories || categories.length === 0) return null

  // Garante ordenação decrescente por % de necessidade
  const sortedCategories = [...categories].sort((a, b) => (b.necessityPercent || 0) - (a.necessityPercent || 0))

  return (
    <section
      ref={ref}
      className="border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-12 sm:py-16 bg-stone-100/80 dark:bg-stone-950 scroll-mt-20 transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="inline-flex items-center gap-2 bg-amber-400/10 dark:bg-amber-400/15 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-500/30 px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider mb-3">
          <Sparkles size={14} className="animate-pulse" />
          <span>Ranking de Necessidade da IA (%)</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-stone-900 dark:text-white mb-2">
              {selectedCategory ? selectedCategory.name : 'O que é mais necessário no momento'}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-2xl leading-relaxed">
              {selectedCategory
                ? 'Consulte as especificações detalhadas e escolha a medida correta para o seu caso no Mercado Livre.'
                : 'A IA calculou a urgência e probabilidade de cada item solucionar o seu defeito agora. Compre primeiro o item do topo do ranking para não gastar à toa.'}
            </p>
          </div>

          {!selectedCategory && (
            <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
              <span className="font-mono text-xs border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl shadow-sm font-bold shrink-0 flex items-center gap-1.5">
                <Flame size={14} />
                Ordenado por % de Urgência
              </span>
              {onExploreProducts && (
                <button
                  onClick={onExploreProducts}
                  className="text-xs font-black bg-[#FFE600] hover:bg-yellow-300 active:scale-95 text-stone-950 px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer transition-all"
                >
                  Ver Catálogo Completo →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content: either variant panel or ranked cards */}
        {selectedCategory ? (
          <ProductVariantPanel
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        ) : (
          <>
            {/* Ranking Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {sortedCategories.map((cat, idx) => {
                const rankNumber = idx + 1
                const percent = cat.necessityPercent || (rankNumber === 1 ? 95 : rankNumber === 2 ? 78 : 64)
                const isTopRank = rankNumber === 1

                return (
                  <div
                    key={cat.id}
                    className={`rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
                      isTopRank
                        ? 'border-amber-400 dark:border-amber-500 bg-white dark:bg-stone-900 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/30'
                        : rankNumber === 2
                        ? 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-500/60'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md hover:border-stone-400 dark:hover:border-stone-700'
                    }`}
                  >
                    {/* Top Podium Ribbon */}
                    <div
                      className={`px-5 py-3 flex items-center justify-between text-xs font-black uppercase tracking-wider border-b ${
                        isTopRank
                          ? 'bg-amber-400 text-stone-950 border-amber-300 font-black'
                          : rankNumber === 2
                          ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-900'
                          : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{isTopRank ? '🥇' : rankNumber === 2 ? '🥈' : '🥉'}</span>
                        <span>#{rankNumber} no Ranking</span>
                      </div>
                      <span className="text-[11px] font-extrabold tracking-normal">
                        {cat.priorityLabel || (isTopRank ? 'Causa Raiz Mais Provável' : 'Ferramenta Necessária')}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col gap-4 flex-1">
                      {/* Product Header */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                          {cat.emoji}
                        </div>
                        <div className="flex-1">
                          {cat.role && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                              {cat.role}
                            </span>
                          )}
                          <h3 className="font-black text-lg text-stone-900 dark:text-white leading-tight">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      {/* Necessity Percentage Gauge */}
                      <div className="bg-stone-50 dark:bg-stone-950/70 rounded-2xl p-3.5 border border-stone-100 dark:border-stone-800">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                            Grau de Necessidade
                          </span>
                          <span className="text-xl font-black text-stone-900 dark:text-white">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isTopRank
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : rankNumber === 2
                                ? 'bg-gradient-to-r from-sky-400 to-blue-500'
                                : 'bg-gradient-to-r from-stone-400 to-stone-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 flex justify-between">
                          <span>{isTopRank ? 'Crítico no momento' : 'Apoio técnico'}</span>
                          <span>Prioridade #{rankNumber}</span>
                        </div>
                      </div>

                      {/* Detailed specifications & AI explanation */}
                      <div className="space-y-2.5 text-xs flex-1">
                        {cat.whyNeeded && (
                          <div className="text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-100 dark:border-stone-800/80">
                            <strong className="text-stone-900 dark:text-white font-bold block mb-0.5">
                              🔍 Por que é {isTopRank ? 'o mais necessário' : 'necessário'}:
                            </strong>
                            <span>{cat.whyNeeded}</span>
                          </div>
                        )}

                        {cat.recommendedSpec && (
                          <div className="text-stone-600 dark:text-stone-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40 text-[11px]">
                            <strong className="text-amber-700 dark:text-amber-400 font-bold block mb-0.5">
                              📏 Especificação Recomendada:
                            </strong>
                            <span>{cat.recommendedSpec}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Button */}
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-sm ${
                          isTopRank
                            ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/20'
                            : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700'
                        }`}
                      >
                        <span>Ver Tamanhos & Comprar</span>
                        <ArrowRight size={14} />
                      </button>

                      <div className="text-center text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        {cat.variants?.length || 3} opções e modelos calibrados
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer tip banner */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  <strong>Dica de Economia:</strong> Comece resolvendo o item <strong>#1 do ranking</strong>. Em mais de 80% dos casos, apenas ele é suficiente para consertar o problema sem trocar outras peças.
                </p>
              </div>

              {onExploreProducts && (
                <button
                  onClick={onExploreProducts}
                  className="shrink-0 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explorar Todo o Catálogo</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
})

export default ProductSuggestionSection
