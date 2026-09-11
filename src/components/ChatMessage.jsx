import { Wrench, User } from 'lucide-react'

export default function ChatMessage({ who, text }) {
  const isBot = who === 'bot'

  return (
    <div className={`flex gap-2.5 max-w-[88%] sm:max-w-[80%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
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
        className={`border-2 border-stone-900 px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-neo-sm ${
          isBot
            ? 'bg-white text-stone-900 rounded-tr-xl rounded-br-xl rounded-bl-xl'
            : 'bg-amber-400 text-stone-900 font-semibold rounded-tl-xl rounded-br-xl rounded-bl-xl'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
