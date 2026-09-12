import { Wrench, User, Image as ImageIcon } from 'lucide-react'

export default function ChatMessage({ who, text, image, visualFinding }) {
  const isBot = who === 'bot'

  return (
    <div className={`flex gap-2.5 max-w-[92%] sm:max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
      {/* Avatar */}
      <div 
        className={`w-7 h-7 shrink-0 border border-stone-900 flex items-center justify-center text-xs font-bold ${
          isBot ? 'bg-stone-900 text-amber-400' : 'bg-amber-400 text-stone-900'
        }`}
      >
        {isBot ? <Wrench size={13} /> : <User size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`border-2 border-stone-900 px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-neo-sm flex flex-col gap-2 ${
          isBot
            ? 'bg-white text-stone-900 rounded-tr-xl rounded-br-xl rounded-bl-xl'
            : 'bg-amber-400 text-stone-900 font-semibold rounded-tl-xl rounded-br-xl rounded-bl-xl'
        }`}
      >
        {/* Imagem anexada pelo usuário (se houver) */}
        {image && (
          <div className="border border-stone-900 overflow-hidden rounded-sm bg-stone-900/10">
            <img
              src={image}
              alt="Foto enviada pelo usuário"
              className="max-h-52 w-auto max-w-full object-cover rounded-sm"
            />
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-stone-800 bg-amber-300/80 border-t border-stone-900">
              <ImageIcon size={12} />
              <span>Foto enviada para análise visual</span>
            </div>
          </div>
        )}

        {/* Texto da Mensagem (com quebra de linha preservada) */}
        <div className="whitespace-pre-line">
          {text}
        </div>

        {/* Detalhe visual detectado pela IA */}
        {visualFinding && (
          <div className="mt-1 p-2.5 bg-amber-50 border border-amber-300 rounded-sm text-stone-800 text-xs">
            <span className="font-bold block text-amber-900 mb-0.5">👁️ Detalhe visual detectado na foto:</span>
            <span>{visualFinding}</span>
          </div>
        )}
      </div>
    </div>
  )
}
