import { useEffect } from 'react'
import { X, Star, ShieldCheck, Truck, Sparkles, ExternalLink, Wrench, Droplet, Zap, DoorClosed, Paintbrush, AlertTriangle } from 'lucide-react'
import { getProductMercadoLivreUrl } from '../data/diagnosticData.js'

export default function ProductDetailModal({ product, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!product) return null

  const mlUrl = getProductMercadoLivreUrl(product)

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'eletrica': return <Zap className="text-amber-500" size={32} />
      case 'hidraulica': return <Droplet className="text-blue-500" size={32} />
      case 'portas': return <DoorClosed className="text-stone-700 dark:text-stone-300" size={32} />
      case 'pintura': return <Paintbrush className="text-rose-500" size={32} />
      default: return <Wrench className="text-orange-500" size={32} />
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm">
              {product.categoryLabel || 'Produto'}
            </span>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline">
              REF: {product.id}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-white hover:bg-stone-800 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {/* Main Info Header */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Visual Icon Box */}
            <div className="sm:w-44 h-44 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center p-4 relative shrink-0">
              {product.badge && (
                <span className="absolute top-2.5 left-2.5 bg-amber-400 text-stone-950 font-black text-[10px] tracking-wide px-2 py-0.5 rounded shadow-sm uppercase">
                  {product.badge}
                </span>
              )}
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center mb-2 shadow-sm">
                {getCategoryIcon(product.category)}
              </div>
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300 text-center">
                Dificuldade: <span className="text-stone-900 dark:text-white font-black">{product.diyDifficulty || 'Fácil'}</span>
              </span>
            </div>

            {/* Title, rating, price */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-stone-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={15} 
                        fill={i < Math.floor(product.stars || 5) ? 'currentColor' : 'none'} 
                        strokeWidth={1.5} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-stone-900 dark:text-white">{product.stars || 4.8}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">({product.reviewsCount || 120} avaliações)</span>
                </div>

                <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                  {product.fullDesc || product.desc}
                </p>
              </div>

              {/* Price & Installments */}
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-stone-900 dark:text-white">
                    {product.priceFormatted || `R$ ${product.price?.toFixed(2)}`}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 dark:text-stone-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {product.discount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {product.installments || 'em até 3x sem juros no cartão ou à vista no Pix'}
                </div>
              </div>
            </div>
          </div>

          {/* Practical DIY Guide / Tips */}
          {product.diyTip && (
            <div className="mb-5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 p-4">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-black text-sm mb-1.5">
                <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
                <span>Como usar no seu conserto em casa:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {product.diyTip}
              </p>
            </div>
          )}

          {/* Security Alert */}
          {product.securityTip && (
            <div className="mb-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 p-3.5 flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                <span className="font-bold text-stone-900 dark:text-white">Aviso de Segurança: </span>
                {product.securityTip}
              </p>
            </div>
          )}

          {/* Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5">
                Especificações Técnicas
              </h4>
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="flex text-xs py-2.5 px-3.5">
                    <span className="font-bold text-stone-500 dark:text-stone-400 w-1/3 shrink-0">{s.label}</span>
                    <span className="text-stone-900 dark:text-stone-200 font-medium">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping & Delivery perks */}
          <div className="flex flex-wrap gap-4 text-xs text-stone-600 dark:text-stone-400 mb-6 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-1.5">
              <Truck size={15} className="text-amber-500" />
              <span>{product.freeShipping ? 'Frete Grátis com envio FULL' : 'Entrega rápida e rastreada'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-amber-500" />
              <span>Compra Garantida pelo Mercado Livre</span>
            </div>
          </div>

          {/* Mercado Livre CTA Button */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={mlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex-1 h-13 bg-[#FFE600] hover:bg-yellow-300 active:scale-95 text-stone-950 font-black text-sm sm:text-base rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ExternalLink size={18} />
              <span>Comprar no Mercado Livre</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 h-13 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
