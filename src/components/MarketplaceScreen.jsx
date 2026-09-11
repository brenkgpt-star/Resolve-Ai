import { useState, useMemo } from 'react'
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Wrench, 
  Zap, 
  Droplet, 
  DoorClosed, 
  Paintbrush, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Truck, 
  Check, 
  LayoutGrid, 
  List,
  RotateCcw
} from 'lucide-react'
import { ALL_PRODUCTS, CATEGORIES } from '../data/diagnosticData.js'
import ProductCard from './ProductCard.jsx'

export default function MarketplaceScreen({ 
  onSelectProduct, 
  onAddToCart, 
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
    'Chave Teste',
    'Multímetro',
    'Chave Inglesa',
    'Óleo Desengripante',
    'Disjuntor',
    'Sifão',
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
    <div className="min-h-screen bg-stone-100 pb-20">
      {/* Banner / Hero for Marketplace */}
      <section className="bg-stone-900 text-white border-b-2 border-stone-900 px-6 pt-10 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-stone-900 text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
                Marketplace Especializado
              </span>
              <span className="text-stone-400 text-xs font-mono">
                {ALL_PRODUCTS.length} itens testados para DIY
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Pesquisar Peças & Ferramentas
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-xl">
              Encontre a peça exata para o seu conserto com instruções de instalação, garantia e compatibilidade garantida.
            </p>
          </div>

          {/* Quick shortcut to Assistant */}
          <div className="bg-stone-800 border border-stone-700 p-4 max-w-sm rounded-xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
              <Sparkles size={14} />
              <span>Dúvida no que comprar?</span>
            </div>
            <p className="text-xs text-stone-300 mb-3">
              Deixe nossa inteligência artificial diagnosticar o defeito e listar só o que você precisa.
            </p>
            <button
              onClick={onSwitchToDiagnosis}
              className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs border border-stone-900 shadow-neo-sm neo-btn flex items-center justify-center gap-1.5"
            >
              <span>Fazer Diagnóstico em 30s</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Search & Catalog Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Search Bar Input */}
        <div className="bg-white border-2 border-stone-900 p-4 mb-6 shadow-neo">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-stone-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por produto, problema (ex: chuveiro, torneira vazando, resistência, disjuntor)..."
              className="w-full pl-12 pr-10 py-3 text-sm sm:text-base border-2 border-stone-900 outline-none focus:bg-amber-50/40 transition-colors font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-800 p-1"
                title="Limpar busca"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Popular Search Suggestions */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs text-stone-600">
            <span className="font-bold text-stone-900 shrink-0">Mais buscados:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="shrink-0 bg-stone-100 hover:bg-amber-200 border border-stone-300 text-stone-800 px-2.5 py-1 transition-colors"
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
                className={`shrink-0 flex items-center gap-2 border-2 border-stone-900 px-4 py-2 text-xs sm:text-sm font-bold transition-all shadow-neo-sm ${
                  isActive
                    ? 'bg-amber-400 text-stone-900 translate-y-0.5'
                    : 'bg-white hover:bg-stone-50 text-stone-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full border border-stone-900 ${
                  isActive ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  {getCategoryCount(cat.id)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filters and View Controls Bar */}
        <div className="bg-white border-2 border-stone-900 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-stone-700">Preço:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="border-2 border-stone-900 bg-stone-50 text-stone-800 px-2 py-1 font-semibold text-xs outline-none"
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
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 border-2 border-stone-900 font-semibold transition-colors ${
                onlyFreeShipping ? 'bg-emerald-100 text-emerald-800 border-emerald-700' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Truck size={13} />
              <span>Frete Grátis</span>
              {onlyFreeShipping && <Check size={12} />}
            </button>

            <button
              onClick={() => setOnlyTopRated(!onlyTopRated)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 border-2 border-stone-900 font-semibold transition-colors ${
                onlyTopRated ? 'bg-amber-100 text-amber-900 border-amber-600' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
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
              <span className="font-bold text-stone-700">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-stone-900 bg-stone-50 text-stone-800 px-2 py-1 font-semibold text-xs outline-none"
              >
                <option value="relevancia">Mais Relevantes</option>
                <option value="mais-vendidos">Mais Vendidos</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="melhor-avaliacao">Melhor Avaliação</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="hidden sm:flex items-center border-2 border-stone-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                title="Grade"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 border-l-2 border-stone-900 ${viewMode === 'list' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'}`}
                title="Lista"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info & Active Filters Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs text-stone-600">
          <div>
            Mostrando <strong className="text-stone-900">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            {searchQuery && (
              <span> para "<strong className="text-stone-900">{searchQuery}</strong>"</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-orange-700 hover:text-orange-800 font-bold hover:underline"
            >
              <RotateCcw size={12} />
              <span>Limpar todos os filtros</span>
            </button>
          )}
        </div>

        {/* Products Display (Grid or List) */}
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white border-2 border-stone-900 p-12 text-center shadow-neo my-6">
            <div className="w-16 h-16 bg-stone-100 border-2 border-stone-900 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
              Não encontramos nenhum produto correspondente aos filtros selecionados. Tente buscar por outros termos como "chuveiro", "fita", "torneira" ou limpe os filtros.
            </p>
            <button
              onClick={clearAllFilters}
              className="py-2.5 px-6 bg-stone-900 hover:bg-orange-700 text-white font-bold text-sm border-2 border-stone-900 shadow-neo neo-btn inline-flex items-center gap-2"
            >
              <RotateCcw size={14} />
              <span>Ver Todos os Produtos</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white border-2 border-stone-900 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-neo-sm hover:shadow-neo transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-amber-50 border-2 border-stone-900 flex items-center justify-center shrink-0">
                    <Wrench size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 border border-stone-300">
                        {product.categoryLabel}
                      </span>
                      {product.badge && (
                        <span className="text-[10px] font-bold uppercase bg-amber-400 text-stone-900 px-2 py-0.5 border border-stone-900">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 hover:text-orange-700">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-xl line-clamp-1">
                      {product.desc}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
                  <div className="text-right">
                    <div className="text-lg font-black text-stone-900">
                      {product.priceFormatted}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {product.installments}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToCart(product)
                    }}
                    className="py-1.5 px-4 bg-stone-900 hover:bg-orange-700 text-white font-bold text-xs border-2 border-stone-900 shadow-neo-sm"
                  >
                    Adicionar ao Kit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
