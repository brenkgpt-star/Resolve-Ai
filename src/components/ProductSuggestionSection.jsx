import { useState, forwardRef } from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import ProductVariantPanel from './ProductVariantPanel.jsx'

const ProductSuggestionSection = forwardRef(function ProductSuggestionSection(
  { categories, onExploreProducts },
  ref
) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (!categories || categories.length === 0) return null

  return (
    <section
      ref={ref}
      className="border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-12 sm:py-16 bg-stone-100/70 dark:bg-stone-950 scroll-mt-20 transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles size={14} />
          <span>Passo 2 de 2: O que você vai precisar</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white mb-1.5">
              {selectedCategory ? selectedCategory.name : 'Escolha o produto certo'}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm max-w-lg">
              {selectedCategory
                ? 'Veja os tamanhos disponíveis e escolha o ideal para o seu caso.'
                : 'Clique em cada item abaixo para ver tamanhos, especificações e comprar no Mercado Livre.'}
            </p>
          </div>

          {!selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-xl shadow-sm font-bold shrink-0">
                {categories.length} {categories.length === 1 ? 'item necessário' : 'itens necessários'}
              </span>
              {onExploreProducts && (
                <button
                  onClick={onExploreProducts}
                  className="text-xs font-black bg-[#FFE600] hover:bg-yellow-300 text-stone-950 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  Ver Loja Completa →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content: either variant panel or category cards */}
        {selectedCategory ? (
          <ProductVariantPanel
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        ) : (
          <>
            {/* Category cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="text-left group rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 flex flex-col gap-3.5 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-500/60 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-2xl shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {cat.emoji}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:bg-amber-400 dark:group-hover:bg-amber-400 transition-colors">
                      <ChevronRight
                        size={16}
                        className="text-stone-400 dark:text-stone-500 group-hover:text-stone-950 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-stone-900 dark:text-white leading-snug mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-500 dark:text-stone-400">{cat.variants.length} opções de tamanho</span>
                    <span className="text-amber-600 dark:text-amber-400 group-hover:underline transition-all">
                      Ver opções →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer tip banner */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Clique em qualquer item acima para escolher o tamanho correto e ver links diretos no Mercado Livre.
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
