import { ArrowLeft, Tag, ExternalLink } from 'lucide-react'

export default function ProductVariantPanel({ category, onBack }) {
  return (
    <div className="animate-fadeIn">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-900 mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Ver todos os itens do diagnóstico</span>
      </button>

      {/* Category hero */}
      <div className={`border-2 border-stone-900 p-4 sm:p-5 mb-5 flex items-center gap-4 ${category.colorClass}`}>
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-stone-900 flex items-center justify-center text-3xl shrink-0 ${category.iconBg}`}>
          {category.emoji}
        </div>
        <div>
          <h3 className="font-black text-xl text-stone-900 leading-tight mb-0.5">{category.name}</h3>
          <p className="text-stone-600 text-sm leading-relaxed">{category.description}</p>
        </div>
      </div>

      {/* Variants label */}
      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
        Escolha o tamanho ideal para o seu caso:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.variants.map((variant) => (
          <div
            key={variant.id}
            className="border-2 border-stone-900 bg-white flex flex-col shadow-neo-sm overflow-hidden"
          >
            {/* Header strip */}
            <div className="bg-stone-900 text-white px-4 py-3">
              <span className="font-black text-sm block leading-snug">{variant.size}</span>
              <span className="text-stone-400 text-[11px] font-mono">{variant.spec}</span>
            </div>

            <div className="px-4 pt-3 pb-4 flex flex-col gap-3 flex-1">
              {/* Price range */}
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-amber-600 shrink-0" />
                <span className="text-2xl font-black text-stone-900">{variant.priceRange}</span>
              </div>

              {/* Tip */}
              <p className="text-xs text-stone-600 leading-relaxed border-l-[3px] border-amber-400 pl-3 flex-1">
                {variant.tip}
              </p>

              {/* Mercado Livre Button */}
              <a
                href={variant.mercadoLivreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#FFE600] hover:bg-yellow-300 active:scale-95 border-2 border-stone-900 text-stone-900 font-black text-sm py-3.5 sm:py-3 transition-all neo-btn min-h-[52px] sm:min-h-0"
              >
                <ExternalLink size={15} />
                <span>Buscar no Mercado Livre</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-stone-400 mt-4 text-center">
        Os preços são estimativas — o valor exato varia por vendedor e região.
      </p>
    </div>
  )
}
