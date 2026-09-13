import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import DiagnosticChat from './components/DiagnosticChat.jsx'
import ProductSuggestionSection from './components/ProductSuggestionSection.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import HistoryCalendarScreen from './components/HistoryCalendarScreen.jsx'
import MarketplaceScreen from './components/MarketplaceScreen.jsx'
import ProductDetailModal from './components/ProductDetailModal.jsx'
import Footer from './components/Footer.jsx'
import AuthModal from './components/AuthModal.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { useDiagnosis } from './hooks/useDiagnosis.js'

function AppContent() {
  const [activeTab, setActiveTab] = useState('diagnosis') // 'diagnosis' | 'products' | 'history'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { user, isAuthModalOpen, setIsAuthModalOpen, authModalMode, openLoginModal } = useAuth()

  const {
    messages,
    typing,
    chipsVisible,
    productCategories,
    marketVisible,
    marketRef,
    runDiagnosis,
    handleFreeText,
    handleSendWithImage,
    resetDiagnosis,
  } = useDiagnosis()

  function scrollToChat() {
    if (!user) {
      openLoginModal()
      return
    }
    setActiveTab('diagnosis')
    setTimeout(() => {
      const el = document.getElementById('diagnostico-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col justify-between pb-16 sm:pb-0 transition-colors duration-200">
      <div>
        {/* Universal Header with 3 Tabs & Auth */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartDiagnosis={scrollToChat}
        />

        {/* Tab 1: Diagnóstico Inteligente com IA Investigativa & Visão */}
        {activeTab === 'diagnosis' && (
          <main>
            <Hero onStartDiagnosis={scrollToChat} />

            <div id="diagnostico-section">
              <DiagnosticChat
                messages={messages}
                typing={typing}
                chipsVisible={chipsVisible}
                onSelectChip={runDiagnosis}
                onFreeText={handleFreeText}
                onSendWithImage={handleSendWithImage}
                onReset={resetDiagnosis}
                marketVisible={marketVisible}
              />
            </div>

            {marketVisible && (
              <ProductSuggestionSection
                ref={marketRef}
                categories={productCategories}
                onExploreProducts={() => setActiveTab('products')}
              />
            )}

            <HowItWorks />
          </main>
        )}

        {/* Tab 2: Catálogo Completo de Produtos & Mercado Livre */}
        {activeTab === 'products' && (
          <main>
            <MarketplaceScreen
              onSelectProduct={(p) => setSelectedProduct(p)}
              onSwitchToDiagnosis={scrollToChat}
            />
          </main>
        )}

        {/* Tab 3: Histórico de Consertos & Calendário Mensal */}
        {activeTab === 'history' && (
          <main>
            <HistoryCalendarScreen
              onSwitchToDiagnosis={scrollToChat}
            />
          </main>
        )}
      </div>

      {/* Universal Footer */}
      <Footer onScrollToChat={scrollToChat} />

      {/* Modal de Detalhes do Produto com Link Direto Mercado Livre */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
