import { useState, useRef } from 'react'
import { Send, Camera, X } from 'lucide-react'

function optimizeImage(file, maxDim = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => resolve(e.target.result)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

export default function FreeformInput({ onSend, onSendWithImage, disabled }) {
  const [value, setValue] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const optimized = await optimizeImage(file)
      if (optimized) {
        setSelectedImage({
          dataUrl: optimized,
          name: file.name,
        })
      }
    } catch (err) {
      console.warn('Erro ao processar imagem:', err)
    }
  }

  function clearImage() {
    setSelectedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function submit(e) {
    if (e) e.preventDefault()
    if (disabled) return

    const text = value.trim()
    if (!text && !selectedImage) return

    if (selectedImage && onSendWithImage) {
      onSendWithImage(text || 'Enviei esta foto para você dar uma olhada no problema.', selectedImage.dataUrl)
      setSelectedImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } else {
      onSend(text)
    }

    setValue('')
  }

  return (
    <div className="flex flex-col border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors duration-200">
      {/* Miniatura da foto antes de enviar */}
      {selectedImage && (
        <div className="px-4 py-2.5 bg-amber-50 dark:bg-stone-800/90 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage.dataUrl}
              alt="Preview"
              className="w-11 h-11 object-cover border border-stone-300 dark:border-stone-600 rounded-lg shadow-sm"
            />
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-white block leading-tight">
                Foto pronta para análise
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                {selectedImage.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            title="Remover foto"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={submit} className="flex items-center">
        {/* Input oculto para selecionar foto ou abrir câmera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Botão de Enviar Foto / Câmera */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-50 dark:hover:bg-stone-850 disabled:opacity-40 p-3 sm:p-3.5 border-r border-stone-200 dark:border-stone-800 transition-colors cursor-pointer shrink-0 min-h-[56px] sm:min-h-0"
          title="Tirar foto ou enviar imagem do problema"
        >
          <Camera size={20} className={selectedImage ? 'text-amber-500' : 'currentColor'} />
        </button>

        {/* Campo de Texto */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            disabled
              ? "A IA está analisando..."
              : selectedImage
              ? "Adicione algum comentário sobre a foto ou clique Enviar..."
              : "Responda a IA, tire dúvidas ou descreva o problema..."
          }
          disabled={disabled}
          className="flex-1 px-4 py-4 sm:py-3.5 text-base sm:text-sm outline-none bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 disabled:bg-stone-50 dark:disabled:bg-stone-950 disabled:text-stone-400 min-h-[56px] sm:min-h-0 transition-colors"
        />

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={disabled || (!value.trim() && !selectedImage)}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 disabled:bg-stone-200 dark:disabled:bg-stone-800 text-stone-950 disabled:text-stone-400 dark:disabled:text-stone-600 px-5 text-base sm:text-sm font-bold transition-all cursor-pointer disabled:cursor-not-allowed min-h-[56px] sm:min-h-0 shrink-0 shadow-sm active:scale-95"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  )
}
