import { useState, forwardRef } from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import ProductVariantPanel from './ProductVariantPanel.jsx'

const ProductSuggestionSection = forwardRef(function ProductSuggestionSection(
  { categories },
  ref
) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (!categories || categories.length === 0) return null

  return (
    <section
      ref={ref}
      className="border-b-2 border-stone-900 px-4 sm:px-6 py-10 sm:py-12 bg-stone-100 scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase mb-1">
          <Sparkles size={14} />
          <span>Passo 2 de 2: O que você vai precisar</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 mb-1">
              {selectedCategory ? selectedCategory.name : 'Escolha o produto certo'}
            </h2>
            <p className="text-stone-600 text-sm max-w-lg">
              {selectedCategory
                ? 'Veja os tamanhos disponíveis e escolha o ideal para o seu caso.'
                : 'Clique em cada item abaixo para ver tamanhos, especificações e onde comprar.'}
            </p>
          </div>

          {!selectedCategory && (
            <span className="font-mono text-xs border-2 border-stone-900 bg-white px-2.5 py-1.5 shadow-neo-sm font-bold shrink-0">
              {categories.length} {categories.length === 1 ? 'item necessário' : 'itens necessários'}
            </span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left group border-2 border-stone-900 p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-neo active:scale-[0.98] transition-all duration-150 cursor-pointer ${cat.colorClass}`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-full border-2 border-stone-900 flex items-center justify-center text-2xl shrink-0 ${cat.iconBg}`}>
                      {cat.emoji}
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all mt-1 shrink-0"
                    />
                  </div>

                  <div>
                    <h3 className="font-black text-base text-stone-900 leading-snug mb-1 group-hover:text-orange-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="border-t border-stone-200 pt-2 flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-500">{cat.variants.length} opções de tamanho</span>
                    <span className="text-amber-600 group-hover:text-orange-700 transition-colors">
                      Ver opções →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer tip banner */}
            <div className="border-2 border-stone-900 bg-white p-4 flex items-center gap-3 shadow-neo-sm">
              <span className="text-xl">💡</span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clique em qualquer item acima para escolher o tamanho correto e ver onde comprar pelo melhor preço no Mercado Livre.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
})

export default ProductSuggestionSection
