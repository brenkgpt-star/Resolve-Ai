import { useState, useMemo } from 'react'
import { 
  Search, 
  X, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Truck, 
  Check, 
  LayoutGrid, 
  List,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Wrench
} from 'lucide-react'
import { ALL_PRODUCTS, CATEGORIES, getProductMercadoLivreUrl } from '../data/diagnosticData.js'
import ProductCard from './ProductCard.jsx'

export default function MarketplaceScreen({ 
  onSelectProduct, 
  onSwitchToDiagnosis,
  initialCategory = 'todos',
  initialSearch = ''
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('relevancia')
  const [priceFilter, setPriceFilter] = useState('todos')
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false)
  const [onlyTopRated, setOnlyTopRated] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const popularSearches = [
    'Resistência 220V',
    'Fita Veda-Rosca',
    'Silicone Anti-Fungo',
    'Chave Teste',
    'Conector Wago',
    'Chave Inglesa',
    'Desengripante',
    'Sifão Universal',
    'Caixa Acoplada',
  ]

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = product.name.toLowerCase().includes(query)
        const matchDesc = product.desc.toLowerCase().includes(query)
        const matchCat = product.categoryLabel.toLowerCase().includes(query)
        const matchTip = product.diyTip ? product.diyTip.toLowerCase().includes(query) : false
        if (!matchName && !matchDesc && !matchCat && !matchTip) {
          return false
        }
      }

      // Price filter
      if (priceFilter === 'ate-25' && product.price > 25) return false
      if (priceFilter === '25-60' && (product.price <= 25 || product.price > 60)) return false
      if (priceFilter === 'acima-60' && product.price <= 60) return false

      // Checkbox filters
      if (onlyFreeShipping && !product.freeShipping) return false
      if (onlyTopRated && (product.stars || 0) < 4.8) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'menor-preco') return a.price - b.price
      if (sortBy === 'maior-preco') return b.price - a.price
      if (sortBy === 'melhor-avaliacao') return (b.stars || 0) - (a.stars || 0)
      if (sortBy === 'mais-vendidos') return (b.reviewsCount || 0) - (a.reviewsCount || 0)
      return 0 // 'relevancia' maintains default priority
    })
  }, [selectedCategory, searchQuery, priceFilter, onlyFreeShipping, onlyTopRated, sortBy])

  function clearAllFilters() {
    setSearchQuery('')
    setSelectedCategory('todos')
    setSortBy('relevancia')
    setPriceFilter('todos')
    setOnlyFreeShipping(false)
    setOnlyTopRated(false)
  }

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'todos' || 
    priceFilter !== 'todos' || 
    onlyFreeShipping || 
    onlyTopRated

  function getCategoryCount(catId) {
    if (catId === 'todos') return ALL_PRODUCTS.length
    return ALL_PRODUCTS.filter(p => p.category === catId).length
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pb-20 transition-colors duration-200">
      {/* Banner / Header for Marketplace */}
      <section className="bg-stone-900 dark:bg-stone-950 text-white border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 pt-10 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black px-3 py-1 rounded-full">
              <ShoppingBag size={14} />
              <span>Catálogo Integrado ao Mercado Livre</span>
              <span className="text-stone-400 font-mono text-[11px]">
                ({ALL_PRODUCTS.length} produtos disponíveis)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Peças, Ferramentas & Mercado Livre
            </h1>
            <p className="text-stone-300 dark:text-stone-400 text-sm sm:text-base max-w-xl">
              Pesquise ferramentas e peças originais para seu conserto, compare especificações técnicas e compre com 1 clique diretamente no Mercado Livre.
            </p>
          </div>

          {/* Quick shortcut to AI Diagnostic */}
          <div className="bg-stone-800/90 dark:bg-stone-900 border border-stone-700/80 p-5 max-w-sm rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase mb-1.5">
              <Sparkles size={15} />
              <span>Dúvida no que comprar?</span>
            </div>
            <p className="text-xs text-stone-300 mb-4 leading-relaxed">
              Nossa inteligência artificial analisa fotos e textos do defeito e entrega a lista exata do que você precisa.
            </p>
            <button
              onClick={onSwitchToDiagnosis}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Fazer Diagnóstico com IA</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Search & Catalog Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Mercado Livre Trust Banner */}
        <div className="rounded-2xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE600] flex items-center justify-center text-stone-950 font-black text-xs shrink-0 shadow-sm">
              ML
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-stone-900 dark:text-white">
                Compre com Segurança e Rapidez no Mercado Livre
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                Todos os itens recomendados possuem links diretos de busca no Mercado Livre Brasil com opção de envio FULL e Compra Garantida.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0">
            <span className="flex items-center gap-1"><Truck size={14} className="text-amber-500" /> Entrega Rápida</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> Compra Garantida</span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 mb-6 shadow-sm">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-stone-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por produto ou defeito (ex: chuveiro, torneira vazando, resistência, disjuntor, silicone, wago)..."
              className="w-full pl-12 pr-10 py-3 text-sm sm:text-base rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-800 dark:hover:text-white p-1 cursor-pointer"
                title="Limpar busca"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Popular Search Suggestions */}
          <div className="flex items-center gap-2 mt-3.5 overflow-x-auto pb-1 text-xs text-stone-600 dark:text-stone-400">
            <span className="font-bold text-stone-900 dark:text-stone-200 shrink-0">Mais buscados:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="shrink-0 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-stone-950 text-amber-400' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}>
                  {getCategoryCount(cat.id)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filters and View Controls Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-stone-600 dark:text-stone-400">Preço:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1.5 font-bold text-xs outline-none"
              >
                <option value="todos">Todos os preços</option>
                <option value="ate-25">Até R$ 25,00</option>
                <option value="25-60">De R$ 25 a R$ 60</option>
                <option value="acima-60">Acima de R$ 60,00</option>
              </select>
            </div>

            {/* Quick Checkbox Chips */}
            <button
              onClick={() => setOnlyFreeShipping(!onlyFreeShipping)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                onlyFreeShipping 
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <Truck size={13} />
              <span>Frete Grátis</span>
              {onlyFreeShipping && <Check size={12} />}
            </button>

            <button
              onClick={() => setOnlyTopRated(!onlyTopRated)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                onlyTopRated 
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700' 
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>4.8+ Estrelas</span>
              {onlyTopRated && <Check size={12} />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort by */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-stone-600 dark:text-stone-400">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1.5 font-bold text-xs outline-none"
              >
                <option value="relevancia">Mais Relevantes</option>
                <option value="mais-vendidos">Mais Vendidos</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="melhor-avaliacao">Melhor Avaliação</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="hidden sm:flex items-center rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-amber-400 text-stone-950' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'}`}
                title="Grade"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-amber-400 text-stone-950' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'}`}
                title="Lista"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info & Active Filters Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs text-stone-600 dark:text-stone-400">
          <div>
            Mostrando <strong className="text-stone-900 dark:text-white">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            {searchQuery && (
              <span> para "<strong className="text-stone-900 dark:text-white">{searchQuery}</strong>"</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Limpar todos os filtros</span>
            </button>
          )}
        </div>

        {/* Products Display (Grid or List) */}
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-12 text-center shadow-sm my-6">
            <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto mb-6">
              Não encontramos nenhum produto com os filtros selecionados. Tente buscar por outros termos como "chuveiro", "fita", "torneira", "silicone" ou limpe os filtros.
            </p>
            <button
              onClick={clearAllFilters}
              className="py-3 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl shadow-sm inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Ver Todos os Produtos</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-3.5">
            {filteredProducts.map((product) => {
              const mlUrl = getProductMercadoLivreUrl(product)
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/60 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center shrink-0">
                      <Wrench size={22} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                          {product.categoryLabel}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-black uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl line-clamp-1 mt-0.5">
                        {product.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 dark:border-stone-800">
                    <div className="text-right">
                      <div className="text-lg font-black text-stone-900 dark:text-white">
                        {product.priceFormatted}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {product.installments}
                      </div>
                    </div>
                    <a
                      href={mlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-2 px-4 bg-[#FFE600] hover:bg-yellow-300 text-stone-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>Mercado Livre</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
