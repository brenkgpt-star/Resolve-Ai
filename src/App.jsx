import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import DiagnosticChat from './components/DiagnosticChat.jsx'
import ProductSuggestionSection from './components/ProductSuggestionSection.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import HistoryCalendarScreen from './components/HistoryCalendarScreen.jsx'
import Footer from './components/Footer.jsx'
import AuthModal from './components/AuthModal.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { useDiagnosis } from './hooks/useDiagnosis.js'

function AppContent() {
  const [activeTab, setActiveTab] = useState('diagnosis') // 'diagnosis' | 'history'
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode } = useAuth()

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
    setActiveTab('diagnosis')
    setTimeout(() => {
      const el = document.getElementById('diagnostico-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col justify-between pb-16 sm:pb-0">
      <div>
        {/* Universal Header with Navigation & Auth */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartDiagnosis={scrollToChat}
        />

        {/* Tab 1: Diagnóstico Inteligente com IA Investigativa & Visão */}
        {activeTab === 'diagnosis' ? (
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
              />
            )}

            <HowItWorks />
          </main>
        ) : (
          /* Tab 2: Histórico de Consertos & Calendário Mensal Quadriculado */
          <main>
            <HistoryCalendarScreen
              onSwitchToDiagnosis={() => {
                setActiveTab('diagnosis')
                scrollToChat()
              }}
            />
          </main>
        )}
      </div>

      {/* Universal Footer */}
      <Footer onScrollToChat={scrollToChat} />

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
