import ChatMessage from './ChatMessage.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChipList from './ChipList.jsx'
import FreeformInput from './FreeformInput.jsx'
import { RotateCcw, Sparkles } from 'lucide-react'

export default function DiagnosticChat({ 
  messages, 
  typing, 
  chipsVisible, 
  onSelectChip, 
  onFreeText,
  onReset,
  marketVisible
}) {
  return (
    <section className="border-b-2 border-stone-900 px-4 sm:px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase mb-1">
              <Sparkles size={14} />
              <span>Passo 1 de 2: Diagnóstico Inteligente</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
              Conta o que quebrou
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-xl mt-1">
              Escolha uma situação comum abaixo ou descreva com suas palavras. O Resolve Aí descobre o defeito e monta a lista exata do que comprar.
            </p>
          </div>

          {!chipsVisible && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold border-2 border-stone-900 shadow-neo-sm neo-btn shrink-0 w-fit transition-all"
            >
              <RotateCcw size={13} />
              <span>Fazer Novo Diagnóstico</span>
            </button>
          )}
        </div>

        <div className="border-2 border-stone-900 bg-white shadow-neo">
          {/* Terminal-like Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-stone-900 bg-stone-900 text-white">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono tracking-wider font-semibold">
                ASSISTENTE_RESOLVE_AI // MODO_DIAGNOSTICO
              </span>
            </div>
            <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
              ONLINE
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex flex-col gap-3.5 px-5 pt-6 pb-4 min-h-[140px] max-h-[380px] overflow-y-auto bg-stone-50/50">
            {messages.map((m, i) => (
              <ChatMessage key={i} who={m.who} text={m.text} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Quick Problem Chips */}
          {chipsVisible && (
            <div className="bg-white border-t border-stone-200">
              <div className="px-5 pt-3 pb-1 text-xs font-bold text-stone-500 uppercase tracking-wider">
                Problemas frequentes em casa:
              </div>
              <ChipList onSelect={onSelectChip} />
            </div>
          )}

          {/* Post-Diagnosis Actions */}
          {marketVisible && !typing && (
            <div className="bg-amber-50 border-t-2 border-stone-900 p-3.5 flex items-center justify-between gap-3">
              <div className="text-xs text-stone-800 font-bold flex items-center gap-2">
                <span>💡</span>
                <span>Diagnóstico pronto! Veja abaixo os itens recomendados e escolha o tamanho ideal.</span>
              </div>
            </div>
          )}

          {/* Freeform Input */}
          <FreeformInput onSend={onFreeText} disabled={typing} />
        </div>
      </div>
    </section>
  )
}
