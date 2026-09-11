import { useState, useEffect } from 'react'
import { X, Star, ShieldCheck, Truck, Sparkles, Check, Wrench, Droplet, Zap, DoorClosed, Paintbrush, AlertTriangle, Plus, Minus } from 'lucide-react'

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!product) return null

  function handleAdd() {
    onAddToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'eletrica': return <Zap className="text-amber-500" size={32} />
      case 'hidraulica': return <Droplet className="text-blue-500" size={32} />
      case 'portas': return <DoorClosed className="text-stone-700" size={32} />
      case 'pintura': return <Paintbrush className="text-rose-500" size={32} />
      default: return <Wrench className="text-orange-500" size={32} />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative bg-white border-2 border-stone-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-neo-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-stone-900 bg-stone-900 text-white px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-stone-900 text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-stone-900">
              {product.categoryLabel || 'Produto'}
            </span>
            <span className="text-xs font-mono text-stone-300 hidden sm:inline">
              REF: {product.id}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-300 hover:text-white hover:bg-stone-800 p-1 transition-colors border border-transparent hover:border-stone-700"
            title="Fechar (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Main Info Header */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Visual Icon Box */}
            <div className="sm:w-44 h-44 bg-gradient-to-br from-stone-100 to-stone-200 border-2 border-stone-900 flex flex-col items-center justify-center p-4 relative shrink-0">
              {product.badge && (
                <span className="absolute top-2 left-2 bg-amber-400 text-stone-900 font-bold text-[10px] tracking-wide px-1.5 py-0.5 border border-stone-900 uppercase -rotate-2">
                  {product.badge}
                </span>
              )}
              <div className="w-16 h-16 rounded-full bg-white border-2 border-stone-900 flex items-center justify-center mb-2 shadow-neo-sm">
                {getCategoryIcon(product.category)}
              </div>
              <span className="text-xs font-semibold text-stone-600 text-center">
                Dificuldade: <span className="text-stone-900 font-bold">{product.diyDifficulty || 'Fácil'}</span>
              </span>
            </div>

            {/* Title, rating, price */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-stone-900 mb-2">
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
                  <span className="text-xs font-bold text-stone-800">{product.stars || 4.8}</span>
                  <span className="text-xs text-stone-500">({product.reviewsCount || 120} avaliações)</span>
                </div>

                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  {product.fullDesc || product.desc}
                </p>
              </div>

              {/* Price & Installments */}
              <div className="border-t-2 border-dashed border-stone-300 pt-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-stone-900">
                    {product.priceFormatted || `R$ ${product.price?.toFixed(2)}`}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                      {product.discount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {product.installments || 'em até 3x sem juros no cartão ou à vista no Pix'}
                </div>
              </div>
            </div>
          </div>

          {/* Practical DIY Guide / Tips */}
          {product.diyTip && (
            <div className="mb-5 border-2 border-stone-900 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-1.5">
                <Sparkles size={16} className="text-amber-600" />
                <span>Como usar no seu conserto em casa:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {product.diyTip}
              </p>
            </div>
          )}

          {/* Security Alert */}
          {product.securityTip && (
            <div className="mb-5 border-2 border-stone-900 bg-stone-100 p-3.5 flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 font-medium">
                <span className="font-bold text-stone-900">Aviso de Segurança: </span>
                {product.securityTip}
              </p>
            </div>
          )}

          {/* Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2">
                Especificações Técnicas
              </h4>
              <div className="border-2 border-stone-900 divide-y-2 divide-stone-900 bg-white">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="flex text-xs py-2 px-3">
                    <span className="font-semibold text-stone-600 w-1/3 shrink-0">{s.label}</span>
                    <span className="text-stone-900 font-medium">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping & Delivery perks */}
          <div className="flex flex-wrap gap-4 text-xs text-stone-600 mb-6 bg-stone-50 p-3 border border-stone-200">
            <div className="flex items-center gap-1.5">
              <Truck size={15} className="text-stone-900" />
              <span>{product.freeShipping ? 'Frete Grátis para todo Brasil' : 'Entrega rápida e rastreada'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-stone-900" />
              <span>Garantia de 90 dias com troca fácil</span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-3 pt-4 border-t-2 border-stone-900">
            {/* Quantity control */}
            <div className="flex items-center border-2 border-stone-900 bg-white h-11">
              <button 
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 hover:bg-stone-100 transition-colors h-full flex items-center justify-center border-r-2 border-stone-900"
                title="Diminuir"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold px-3 text-sm min-w-[36px] text-center">{qty}</span>
              <button 
                onClick={() => setQty((q) => q + 1)}
                className="px-3 hover:bg-stone-100 transition-colors h-full flex items-center justify-center border-l-2 border-stone-900"
                title="Aumentar"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAdd}
              className={`flex-1 h-11 border-2 border-stone-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-neo neo-btn ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-stone-900 hover:bg-orange-700 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>Item Adicionado ao Kit!</span>
                </>
              ) : (
                <>
                  <Wrench size={16} />
                  <span>Adicionar ao Kit de Reparo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
