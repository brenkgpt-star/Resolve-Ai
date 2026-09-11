import { useState, useRef } from 'react'
import { DIAGNOSIS_DATA, getProductsForDiagnosis, matchFreeText } from '../data/diagnosticData.js'

export function useDiagnosis() {
  const [messages, setMessages] = useState([
    { who: 'bot', text: 'Oi! Me conta rapidinho: o que parou de funcionar na tua casa?' },
  ])
  const [typing, setTyping] = useState(false)
  const [chipsVisible, setChipsVisible] = useState(true)
  const [products, setProducts] = useState([])
  const [marketVisible, setMarketVisible] = useState(false)
  const [marketNote, setMarketNote] = useState('')
  const [currentKey, setCurrentKey] = useState(null)
  const marketRef = useRef(null)

  function runDiagnosis(key, customUserMsg) {
    if (typing) return // Prevent duplicate overlapping submissions

    const entry = DIAGNOSIS_DATA[key] || DIAGNOSIS_DATA.outro
    const userMsg = customUserMsg || entry.userMsg

    setChipsVisible(false)
    setCurrentKey(key)
    setMessages((prev) => [...prev, { who: 'user', text: userMsg }])
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { who: 'bot', text: entry.diagnosis }])
      
      const loadedProducts = getProductsForDiagnosis(key)
      setProducts(loadedProducts)
      setMarketNote('Baseado no diagnóstico — kit recomendado para resolver sozinho sem pagar visita técnica.')
      setMarketVisible(true)

      setTimeout(() => {
        if (marketRef.current) {
          marketRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    }, 750)
  }

  function handleFreeText(text) {
    if (!text || !text.trim() || typing) return
    const key = matchFreeText(text)
    runDiagnosis(key, text.trim())
  }

  function resetDiagnosis() {
    setMessages([
      { who: 'bot', text: 'Oi! Me conta rapidinho: o que parou de funcionar na tua casa?' },
    ])
    setTyping(false)
    setChipsVisible(true)
    setProducts([])
    setMarketVisible(false)
    setMarketNote('')
    setCurrentKey(null)
  }

  return {
    messages,
    typing,
    chipsVisible,
    products,
    marketVisible,
    marketNote,
    marketRef,
    currentKey,
    runDiagnosis,
    handleFreeText,
    resetDiagnosis,
  }
}
