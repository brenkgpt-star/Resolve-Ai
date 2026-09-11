import { Wrench } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex gap-2.5 max-w-[80%] self-start items-center">
      <div className="w-7 h-7 shrink-0 border border-stone-900 bg-stone-900 text-amber-400 flex items-center justify-center">
        <Wrench size={13} />
      </div>
      <div className="flex items-center gap-1.5 border-2 border-stone-900 bg-white px-4 py-3 rounded-tr-xl rounded-br-xl rounded-bl-xl w-fit shadow-neo-sm">
        <span className="text-xs font-mono text-stone-500 mr-1">Analisando</span>
        <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-bounce [animation-delay:-0.2s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-bounce [animation-delay:-0.1s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-bounce" />
      </div>
    </div>
  )
}
