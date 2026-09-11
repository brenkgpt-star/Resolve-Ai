import { forwardRef } from 'react'
import ProductCard from './ProductCard.jsx'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'

const Marketplace = forwardRef(function Marketplace(
  { products, note, onSelectProduct, onAddToCart, onOpenFullMarketplace }, 
  ref
) {
  return (
    <section ref={ref} className="border-b-2 border-stone-900 px-4 sm:px-6 py-12 bg-stone-100 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end gap-4 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase mb-1">
              <Sparkles size={14} />
              <span>Passo 2 de 2: Kit Recomendado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1 text-stone-900">
              O Kit Exato Para Resolver Isso
            </h2>
            <p className="text-stone-600 text-sm max-w-md">{note}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs border-2 border-stone-900 bg-white px-2.5 py-1.5 whitespace-nowrap shadow-neo-sm font-bold">
              {products.length} itens recomendados
            </span>

            <button
              onClick={onOpenFullMarketplace}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs border-2 border-stone-900 shadow-neo-sm neo-btn transition-colors"
            >
              <span>Ver Todo o Marketplace</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Explanatory Banner */}
        <div className="mt-6 border-2 border-stone-900 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-neo-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 border border-stone-900 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-stone-900" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900">
                Garantia "Resolveu ou Devolvemos"
              </h4>
              <p className="text-[11px] text-stone-500">
                Se a peça recomendada não for compatível com a sua instalação, você tem 30 dias para devolução gratuita.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenFullMarketplace}
            className="text-xs font-bold text-stone-900 hover:text-orange-700 underline shrink-0"
          >
            Pesquisar outras opções no catálogo →
          </button>
        </div>
      </div>
    </section>
  )
})

export default Marketplace
