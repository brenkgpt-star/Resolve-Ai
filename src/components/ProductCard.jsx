import { Star, Zap, Droplet, DoorClosed, Wrench, Paintbrush, ExternalLink, Info } from 'lucide-react'
import { getProductMercadoLivreUrl } from '../data/diagnosticData.js'

export default function ProductCard({ product, onSelectProduct }) {
  if (!product) return null

  function getCategoryVisual(cat) {
    switch (cat) {
      case 'eletrica':
        return {
          icon: <Zap size={26} className="text-amber-500" />,
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-800/60',
        }
      case 'hidraulica':
        return {
          icon: <Droplet size={26} className="text-blue-500" />,
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-800/60',
        }
      case 'portas':
        return {
          icon: <DoorClosed size={26} className="text-stone-700 dark:text-stone-300" />,
          bg: 'bg-stone-100 dark:bg-stone-800',
          border: 'border-stone-200 dark:border-stone-700',
        }
      case 'pintura':
        return {
          icon: <Paintbrush size={26} className="text-rose-500" />,
          bg: 'bg-rose-50 dark:bg-rose-950/30',
          border: 'border-rose-200 dark:border-rose-800/60',
        }
      default:
        return {
          icon: <Wrench size={26} className="text-orange-500" />,
          bg: 'bg-orange-50 dark:bg-orange-950/30',
          border: 'border-orange-200 dark:border-orange-800/60',
        }
    }
  }

  const visual = getCategoryVisual(product.category)
  const mlUrl = getProductMercadoLivreUrl(product)

  function handleOpenDetails(e) {
    e.stopPropagation()
    if (onSelectProduct) {
      onSelectProduct(product)
    }
  }

  function handleBuyML(e) {
    e.stopPropagation()
    window.open(mlUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      onClick={handleOpenDetails}
      className="group bg-white dark:bg-stone-900 p-4 sm:p-5 flex flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-500/60 cursor-pointer relative"
    >
      {/* Top badges */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
          {product.categoryLabel || 'Ferramentas'}
        </span>
        {product.badge && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 px-2 py-0.5 rounded-md shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Visual Product Box with Category Icon & DIY Difficulty */}
      <div className={`h-28 rounded-xl ${visual.bg} border ${visual.border} flex flex-col items-center justify-center p-2 mb-3.5 relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-sm mb-1.5">
          {visual.icon}
        </div>
        <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
          DIY {product.diyDifficulty || 'Fácil'}
        </span>
        {product.freeShipping && (
          <span className="absolute bottom-1.5 right-2 text-[9px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/60">
            FRETE GRÁTIS
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="flex-1 flex flex-col mb-3">
        <h3 className="font-black text-sm text-stone-900 dark:text-white leading-snug line-clamp-2 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-stone-600 dark:text-stone-400 text-xs line-clamp-2 leading-relaxed">
          {product.desc}
        </p>
      </div>

      {/* Stars & Reviews */}
      <div className="flex items-center gap-1.5 mb-3">
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
        <span className="text-xs font-black text-stone-800 dark:text-stone-200">{product.stars || 4.8}</span>
        <span className="text-[11px] text-stone-400 dark:text-stone-500">({product.reviewsCount || 80})</span>
      </div>

      {/* Price & Installments */}
      <div className="border-t border-stone-100 dark:border-stone-800 pt-2.5 mb-3.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-stone-900 dark:text-white">
            {product.priceFormatted || `R$ ${product.price?.toFixed(2)}`}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 dark:text-stone-500 line-through">
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
              {product.discount}
            </span>
          )}
        </div>
        <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
          {product.installments || 'em até 3x sem juros'}
        </div>
      </div>

      {/* Action Buttons: Mercado Livre Direct CTA + Detalhes */}
      <div className="grid grid-cols-5 gap-2">
        <button 
          onClick={handleOpenDetails}
          className="col-span-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold py-2.5 px-2 flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[42px]"
          title="Ver especificações e passo a passo"
        >
          <Info size={14} />
          <span>Detalhes</span>
        </button>

        <a 
          href={mlUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBuyML}
          className="col-span-3 rounded-xl bg-[#FFE600] hover:bg-yellow-300 active:scale-95 text-stone-950 text-xs font-black py-2.5 px-2 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[42px]"
          title="Comprar pelo melhor preço no Mercado Livre"
        >
          <ExternalLink size={13} className="shrink-0" />
          <span className="truncate">Mercado Livre</span>
        </a>
      </div>
    </div>
  )
}
