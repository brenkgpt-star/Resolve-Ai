import { useState } from 'react'
import { Send } from 'lucide-react'

export default function FreeformInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  function submit(e) {
    if (e) e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={submit} className="flex border-t-2 border-stone-900 bg-white">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={disabled ? "Analisando problema..." : "ou descreve aqui o que aconteceu..."}
        disabled={disabled}
        className="flex-1 px-4 py-4 sm:py-3.5 text-base sm:text-sm outline-none bg-white text-stone-900 placeholder:text-stone-400 disabled:bg-stone-50 disabled:text-stone-400 min-h-[56px] sm:min-h-0"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex items-center gap-1.5 border-l-2 border-stone-900 bg-stone-900 hover:bg-orange-700 disabled:bg-stone-400 disabled:hover:bg-stone-400 text-white px-5 text-base sm:text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed min-h-[56px] sm:min-h-0"
      >
        <Send size={16} />
        <span className="hidden sm:inline">Enviar</span>
      </button>
    </form>
  )
}
