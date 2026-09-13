import ChatMessage from './ChatMessage.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChipList from './ChipList.jsx'
import FreeformInput from './FreeformInput.jsx'
import { RotateCcw, Sparkles, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function DiagnosticChat({ 
  messages, 
  typing, 
  chipsVisible, 
  onSelectChip, 
  onFreeText,
  onSendWithImage,
  onReset,
  marketVisible
}) {
  const { user, openLoginModal } = useAuth()

  function handleChipSelect(key) {
    if (!user) {
      openLoginModal()
      return
    }
    onSelectChip(key)
  }

  function handleSendFreeText(text) {
    if (!user) {
      openLoginModal()
      return
    }
    onFreeText(text)
  }

  function handleSendImage(text, img) {
    if (!user) {
      openLoginModal()
      return
    }
    onSendWithImage(text, img)
  }

  return (
    <section className="border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-12 bg-stone-100/60 dark:bg-stone-950 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={14} />
              <span>Passo 1 de 2: Diagnóstico Inteligente & Análise Visual</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
              Conta o que quebrou
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-xl mt-1.5">
              Escolha uma situação comum, descreva com suas palavras ou envie uma foto. Nossa IA analisa o defeito e monta a lista exata do que comprar.
            </p>
          </div>

          {!chipsVisible && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 shadow-sm shrink-0 w-fit transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Novo Diagnóstico</span>
            </button>
          )}
        </div>

        {/* Chat Terminal Container */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-200">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-white">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono tracking-wider font-semibold text-stone-200">
                ASSISTENTE_RESOLVE_AI // MODO_DIAGNOSTICO_VISUAL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-stone-300 font-mono hidden sm:inline">
                {user ? 'IA ONLINE' : 'LOGIN NECESSÁRIO'}
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex flex-col gap-4 px-5 pt-6 pb-5 min-h-[180px] max-h-[460px] overflow-y-auto bg-stone-50/50 dark:bg-stone-950/40">
            {messages.map((m, i) => (
              <ChatMessage
                key={i}
                who={m.who}
                text={m.text}
                image={m.image}
                visualFinding={m.visualFinding}
              />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Quick Problem Chips */}
          {chipsVisible && (
            <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
              <div className="px-5 pt-3.5 pb-1 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Problemas frequentes em casa:
                </span>
                {!user && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Lock size={12} />
                    <span>Requer login</span>
                  </span>
                )}
              </div>
              <ChipList onSelect={handleChipSelect} />
            </div>
          )}

          {/* Post-Diagnosis Actions Banner */}
          {marketVisible && !typing && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border-t border-amber-200 dark:border-amber-800/60 p-4 flex items-center justify-between gap-3">
              <div className="text-xs text-amber-950 dark:text-amber-200 font-bold flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>Diagnóstico pronto! Veja abaixo os itens recomendados e escolha o tamanho ideal.</span>
              </div>
            </div>
          )}

          {/* Gate: Se não estiver logado, exibe banner chamativo para fazer login; se logado, exibe input completo */}
          {!user ? (
            <div className="border-t border-amber-300/80 dark:border-amber-800/70 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-stone-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow-sm">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">
                    Faça login para utilizar o Diagnóstico com IA
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    O diagnóstico por IA e a análise de fotos são 100% gratuitos. Entre na sua conta para conversar e salvar seu histórico.
                  </p>
                </div>
              </div>

              <button
                onClick={openLoginModal}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer shrink-0"
              >
                <LogIn size={16} />
                <span>Entrar ou Criar Conta Gratuita</span>
              </button>
            </div>
          ) : (
            <FreeformInput
              onSend={handleSendFreeText}
              onSendWithImage={handleSendImage}
              disabled={typing}
            />
          )}
        </div>
      </div>
    </section>
  )
}
