import { useState, useRef } from 'react'
import { DIAGNOSIS_DATA, getProductsForDiagnosis, getProductCategoriesForDiagnosis, matchFreeText } from '../data/diagnosticData.js'
import { DiagnosisAIAgent } from '../services/aiAgentService.js'
import { historyService } from '../services/historyService.js'

export function useDiagnosis() {
  const [messages, setMessages] = useState([
    { who: 'bot', text: 'Oi! Me conta o que quebrou ou parou de funcionar na tua casa. Você também pode enviar uma foto pelo botão de câmera para eu analisar visualmente o defeito!' },
  ])
  const [typing, setTyping] = useState(false)
  const [chipsVisible, setChipsVisible] = useState(true)
  const [products, setProducts] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [marketVisible, setMarketVisible] = useState(false)
  const [marketNote, setMarketNote] = useState('')
  const [currentKey, setCurrentKey] = useState(null)
  
  const aiAgentRef = useRef(null)
  const marketRef = useRef(null)

  // Inicia ou avança a conversa com o agente de IA (com suporte a texto e imagem)
  async function runDiagnosis(key, customUserMsg, image = null) {
    if (typing) return

    const selectedKey = key || matchFreeText(customUserMsg || '')
    const entry = DIAGNOSIS_DATA[selectedKey] || DIAGNOSIS_DATA.outro
    const userMsg = customUserMsg || entry.userMsg

    // Se é a primeira mensagem, inicializa o Agente de IA
    if (!aiAgentRef.current) {
      aiAgentRef.current = new DiagnosisAIAgent(selectedKey, userMsg)
      setChipsVisible(false)
      setCurrentKey(selectedKey)
    }

    setMessages((prev) => [...prev, { who: 'user', text: userMsg, image }])
    setTyping(true)

    try {
      const response = await aiAgentRef.current.nextMessage({ userReply: userMsg, image })
      setTyping(false)
      
      setMessages((prev) => [
        ...prev,
        {
          who: 'bot',
          text: response.text,
          visualFinding: response.visualFinding,
        },
      ])

      // Se a IA concluiu as análises técnicas, libera as sugestões
      if (response.done) {
        const loadedProducts = getProductsForDiagnosis(response.key)
        const loadedCategories = response.categories || getProductCategoriesForDiagnosis(response.key)
        
        setProducts(loadedProducts)
        setProductCategories(loadedCategories)
        setMarketNote('Baseado no diagnóstico — kit recomendado para resolver sozinho sem pagar visita técnica.')
        setMarketVisible(true)

        // Salva no histórico de diagnósticos automaticamente (com texto real da IA)
        historyService.saveDiagnosis({
          label: entry.label,
          diagnosis: response.text,
          problemKey: response.key,
          hasPhoto: Boolean(image || aiAgentRef.current.hasImage),
        })

        setTimeout(() => {
          if (marketRef.current) {
            marketRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 150)
      }
    } catch (err) {
      setTyping(false)
      console.error('Erro na conversa com a IA:', err)
      setMessages((prev) => [...prev, { who: 'bot', text: entry.diagnosis }])
      setMarketVisible(true)
    }
  }

  function handleFreeText(text) {
    if (!text || !text.trim() || typing) return
    const clean = text.trim()
    
    if (aiAgentRef.current) {
      runDiagnosis(aiAgentRef.current.key, clean)
    } else {
      const key = matchFreeText(clean)
      runDiagnosis(key, clean)
    }
  }

  function handleSendWithImage(text, imageDataUrl) {
    if (typing) return
    const clean = (text || '').trim()

    if (aiAgentRef.current) {
      runDiagnosis(aiAgentRef.current.key, clean, imageDataUrl)
    } else {
      const key = matchFreeText(clean)
      runDiagnosis(key, clean, imageDataUrl)
    }
  }

  function resetDiagnosis() {
    aiAgentRef.current = null
    setMessages([
      { who: 'bot', text: 'Oi! Me conta o que quebrou ou parou de funcionar na tua casa. Você também pode enviar uma foto pelo botão de câmera para eu analisar visualmente o defeito!' },
    ])
    setTyping(false)
    setChipsVisible(true)
    setProducts([])
    setProductCategories([])
    setMarketVisible(false)
    setMarketNote('')
    setCurrentKey(null)
  }

  return {
    messages,
    typing,
    chipsVisible,
    products,
    productCategories,
    marketVisible,
    marketNote,
    marketRef,
    currentKey,
    runDiagnosis,
    handleFreeText,
    handleSendWithImage,
    resetDiagnosis,
  }
}
