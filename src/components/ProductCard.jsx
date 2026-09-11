import { useState } from 'react'
import { Star, Zap, Droplet, DoorClosed, Wrench, Paintbrush, ShoppingBag, Check, Eye } from 'lucide-react'

export default function ProductCard({ product, onSelectProduct, onAddToCart }) {
  const [added, setAdded] = useState(false)

  if (!product) return null

  function getCategoryVisual(cat) {
    switch (cat) {
      case 'eletrica':
        return {
          icon: <Zap size={28} className="text-amber-500" />,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        }
      case 'hidraulica':
        return {
          icon: <Droplet size={28} className="text-blue-500" />,
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        }
      case 'portas':
        return {
          icon: <DoorClosed size={28} className="text-stone-700" />,
          bg: 'bg-stone-100',
          border: 'border-stone-200',
        }
      case 'pintura':
        return {
          icon: <Paintbrush size={28} className="text-rose-500" />,
          bg: 'bg-rose-50',
          border: 'border-rose-200',
        }
      default:
        return {
          icon: <Wrench size={28} className="text-orange-500" />,
          bg: 'bg-orange-50',
          border: 'border-orange-200',
        }
    }
  }

  const visual = getCategoryVisual(product.category)

  function handleAdd(e) {
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  function handleOpenDetails() {
    if (onSelectProduct) {
      onSelectProduct(product)
    }
  }

  return (
    <div 
      onClick={handleOpenDetails}
      className="group bg-white p-4 flex flex-col justify-between border-2 border-stone-900 transition-all duration-150 hover:-translate-y-1 hover:shadow-neo cursor-pointer relative"
    >
      {/* Top badges */}
      <div className="flex justify-between items-start mb-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 border border-stone-300">
          {product.categoryLabel || 'Ferramentas'}
        </span>
        {product.badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-900 px-2 py-0.5 border border-stone-900">
            {product.badge}
          </span>
        )}
      </div>

      {/* Visual Product Box - Clean, stylized and rich (No placeholders) */}
      <div className={`h-28 rounded-xs ${visual.bg} border-2 border-stone-900 flex flex-col items-center justify-center p-2 mb-3 relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
        <div className="w-12 h-12 rounded-full bg-white border border-stone-900 flex items-center justify-center shadow-neo-sm mb-1">
          {visual.icon}
        </div>
        <span className="text-[11px] font-bold text-stone-700">
          DIY {product.diyDifficulty || 'Fácil'}
        </span>
        {product.freeShipping && (
          <span className="absolute bottom-1 right-2 text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 border border-emerald-300">
            FRETE GRÁTIS
          </span>
        )}
      </div>

      {/* Title & Desc */}
      <div className="flex-1 flex flex-col mb-3">
        <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-2 mb-1 group-hover:text-orange-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
          {product.desc}
        </p>
      </div>

      {/* Stars and Ratings */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <div className="flex items-center text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              fill={i < Math.floor(product.stars || 5) ? 'currentColor' : 'none'} 
              strokeWidth={1.5} 
            />
          ))}
        </div>
        <span className="text-xs font-bold text-stone-800">{product.stars || 4.8}</span>
        <span className="text-[11px] text-stone-400">({product.reviewsCount || 80})</span>
      </div>

      {/* Price & Installments */}
      <div className="border-t border-stone-200 pt-2.5 mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-stone-900">
            {product.priceFormatted || `R$ ${product.price?.toFixed(2)}`}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
        <div className="text-[11px] text-stone-500 truncate">
          {product.installments || 'em até 3x sem juros'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={handleOpenDetails}
          className="border-2 border-stone-900 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold py-2 px-2 flex items-center justify-center gap-1 transition-colors"
          title="Ver detalhes e como instalar"
        >
          <Eye size={13} />
          <span>Detalhes</span>
        </button>

        <button 
          onClick={handleAdd}
          className={`border-2 border-stone-900 text-xs font-bold py-2 px-2 flex items-center justify-center gap-1 transition-all ${
            added 
              ? 'bg-emerald-500 text-white border-emerald-600' 
              : 'bg-stone-900 hover:bg-orange-700 text-white'
          }`}
          title="Adicionar ao Kit de Reparo"
        >
          {added ? (
            <>
              <Check size={13} />
              <span>Pronto!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={13} />
              <span>Adicionar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
