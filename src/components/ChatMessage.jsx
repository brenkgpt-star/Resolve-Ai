import { Wrench, User, Image as ImageIcon } from 'lucide-react'

export default function ChatMessage({ who, text, image, visualFinding }) {
  const isBot = who === 'bot'

  return (
    <div className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
      {/* Avatar */}
      <div 
        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${
          isBot 
            ? 'bg-stone-900 dark:bg-amber-400 text-amber-400 dark:text-stone-950 border border-stone-800 dark:border-amber-300' 
            : 'bg-amber-400 text-stone-950 border border-amber-500/40'
        }`}
      >
        {isBot ? <Wrench size={15} /> : <User size={15} />}
      </div>

      {/* Bubble */}
      <div
        className={`px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm flex flex-col gap-2.5 transition-colors ${
          isBot
            ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700/80 rounded-2xl rounded-tl-sm'
            : 'bg-amber-400 text-stone-950 font-medium rounded-2xl rounded-tr-sm shadow-sm'
        }`}
      >
        {/* Imagem anexada pelo usuário (se houver) */}
        {image && (
          <div className="border border-stone-200 dark:border-stone-700 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900">
            <img
              src={image}
              alt="Foto enviada pelo usuário"
              className="max-h-56 w-auto max-w-full object-cover rounded-t-xl"
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-stone-700 dark:text-stone-300 bg-amber-200/60 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
              <ImageIcon size={13} className="text-amber-600 dark:text-amber-400" />
              <span>Foto enviada para análise visual</span>
            </div>
          </div>
        )}

        {/* Texto da Mensagem */}
        <div className="whitespace-pre-line">
          {text}
        </div>

        {/* Detalhe visual detectado pela IA */}
        {visualFinding && (
          <div className="mt-1 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl text-stone-800 dark:text-stone-200 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-400 mb-1">
              <span>👁️</span> Detalhe visual detectado na foto:
            </span>
            <span className="leading-relaxed">{visualFinding}</span>
          </div>
        )}
      </div>
    </div>
  )
}
