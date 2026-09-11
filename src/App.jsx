import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import DiagnosticChat from './components/DiagnosticChat.jsx'
import Marketplace from './components/Marketplace.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import MarketplaceScreen from './components/MarketplaceScreen.jsx'
import ProductDetailModal from './components/ProductDetailModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { useDiagnosis } from './hooks/useDiagnosis.js'

export default function App() {
  const [activeTab, setActiveTab] = useState('diagnosis') // 'diagnosis' | 'marketplace'
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const {
    messages,
    typing,
    chipsVisible,
    products,
    marketVisible,
    marketNote,
    marketRef,
    runDiagnosis,
    handleFreeText,
    resetDiagnosis,
  } = useDiagnosis()

  // Cart Handlers
  function handleAddToCart(product, qty = 1) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        )
      }
      return [...prev, { product, qty }]
    })
  }

  function handleUpdateQty(productId, newQty) {
    if (newQty <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, qty: newQty } : item
      )
    )
  }

  function handleRemoveFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function handleClearCart() {
    setCartItems([])
  }

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)

  function scrollToChat() {
    const el = document.getElementById('diagnostico-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col justify-between">
      <div>
        {/* Universal Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Tab 1: Diagnostic Assistant Screen */}
        {activeTab === 'diagnosis' ? (
          <main>
            <Hero
              onStartDiagnosis={scrollToChat}
              onExploreMarketplace={() => setActiveTab('marketplace')}
            />

            <div id="diagnostico-section">
              <DiagnosticChat
                messages={messages}
                typing={typing}
                chipsVisible={chipsVisible}
                onSelectChip={runDiagnosis}
                onFreeText={handleFreeText}
                onReset={resetDiagnosis}
                onExploreMarketplace={() => setActiveTab('marketplace')}
                marketVisible={marketVisible}
              />
            </div>

            {marketVisible && (
              <Marketplace
                ref={marketRef}
                products={products}
                note={marketNote}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                onAddToCart={handleAddToCart}
                onOpenFullMarketplace={() => setActiveTab('marketplace')}
              />
            )}

            <HowItWorks />
          </main>
        ) : (
          /* Tab 2: Full Marketplace & Product Search Screen */
          <main>
            <MarketplaceScreen
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onAddToCart={handleAddToCart}
              onSwitchToDiagnosis={() => setActiveTab('diagnosis')}
            />
          </main>
        )}
      </div>

      {/* Footer */}
      <Footer onSwitchTab={(tab) => setActiveTab(tab)} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart & Kit Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenMarketplace={() => setActiveTab('marketplace')}
      />
    </div>
  )
}
