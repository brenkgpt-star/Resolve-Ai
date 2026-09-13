import { ArrowLeft, Tag, ExternalLink } from 'lucide-react'

export default function ProductVariantPanel({ category, onBack }) {
  return (
    <div className="animate-fadeIn">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Ver todos os itens do diagnóstico</span>
      </button>

      {/* Category hero */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 mb-6 flex items-center gap-5 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-3xl shrink-0 shadow-sm">
          {category.emoji}
        </div>
        <div>
          <h3 className="font-black text-xl sm:text-2xl text-stone-900 dark:text-white leading-tight mb-1">{category.name}</h3>
          <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{category.description}</p>
        </div>
      </div>

      {/* Variants label */}
      <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
        Escolha o tamanho ideal para o seu caso:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.variants.map((variant) => (
          <div
            key={variant.id}
            className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Header strip */}
            <div className="bg-stone-900 dark:bg-stone-950 text-white px-5 py-3.5 border-b border-stone-800">
              <span className="font-black text-sm block leading-snug">{variant.size}</span>
              <span className="text-stone-400 text-[11px] font-mono">{variant.spec}</span>
            </div>

            <div className="p-5 flex flex-col gap-3.5 flex-1">
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
        Os preços são estimativas — o valor exato varia por vendedor e região.
      </p>
    </div>
  )
}
