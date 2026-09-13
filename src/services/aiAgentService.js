import { DIAGNOSIS_DATA, getProductCategoriesForDiagnosis, matchFreeText } from '../data/diagnosticData.js'

// ---------------------------------------------------------------------------
// Groq API — gratuita e sem restrições no Brasil
// Modelo com suporte completo a texto e visão multimodal: qwen/qwen3.8-27b
// ---------------------------------------------------------------------------

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const CHAT_MODEL = 'qwen/qwen3.8-27b'

// ---------------------------------------------------------------------------
// Helper: chamada geral de texto ao Groq
// ---------------------------------------------------------------------------

async function groqRequest(messages, { temperature = 0.7, max_tokens = 600 } = {}) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      temperature,
      max_tokens,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

// ---------------------------------------------------------------------------
// Análise de Visão Real: inspeciona a imagem usando a capacidade multimodal do Qwen
// ---------------------------------------------------------------------------

async function analyzeImageWithGroq(imageDataUrl, problemContext) {
  if (!GROQ_API_KEY || !imageDataUrl) return null

  const prompt = `Você é um técnico especialista em diagnósticos e reparos residenciais brasileiros chamado "Resolve Ai".
O morador relatou um problema relacionado a: "${problemContext}" e enviou esta foto para você inspecionar.

Analise a imagem minuciosamente com olhar técnico profissional:
1. Identifique exatamente o que aparece na foto (equipamento, peça, encanamento, fiação, conexões ou acabamento).
2. Aponte defeitos, sinais de desgaste ou anormalidades visíveis: vazamentos, gotas, umidade, oxidação, ferrugem, trincas, queimados, folga, posição incorreta ou peças desgastadas.
3. Se a imagem não for de um problema residencial ou estiver muito escura/ilegível, aponte isso educadamente.

Responda em português do Brasil de forma direta, técnica e acessível em 2 a 3 frases.`

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: imageDataUrl },
              },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.warn('Groq Vision falhou:', res.status, errText)
      return null
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    return content || null
  } catch (err) {
    console.warn('Erro na análise de visão com Groq:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Agente de IA para Diagnóstico (100% autônomo e multimodal)
// ---------------------------------------------------------------------------

export class DiagnosisAIAgent {
  constructor(problemKey, initialText) {
    this.key = problemKey || matchFreeText(initialText || '')
    this.data = DIAGNOSIS_DATA[this.key] || DIAGNOSIS_DATA.outro
    this.hasImage = false
    this.lastVisualFinding = null

    // Histórico de mensagens do chat
    this.messages = [
      {
        role: 'system',
        content: `Você é um técnico expert em reparos residenciais brasileiros chamado "Resolve Ai".
Sua missão é diagnosticar o problema do morador através de uma conversa natural, técnica e empática.

Regras fundamentais:
- Faça sempre UMA pergunta por vez, curta, específica e relevante ao que o usuário acabou de falar ou enviar.
- Adapte cada pergunta com base nas informações anteriores — nunca repita o que já foi respondido.
- Se o usuário enviou uma foto, use os detalhes visuais detectados para orientar sua pergunta ou diagnóstico.
- Use linguagem acessível, prática e informal brasileira (como um profissional experiente conversando no WhatsApp).
- Quando tiver informações técnicas suficientes para cravar a causa raiz (geralmente entre 2 a 4 interações, especialmente se houver foto), conclua escrevendo EXATAMENTE a expressão "DIAGNOSTICO CONCLUIDO:" seguido da explicação da causa raiz e solução em texto corrido (2-3 frases, sem listas).
- Nunca diga que você é uma IA, robô ou modelo de linguagem.
- Contexto do problema: "${this.data.label}".`,
      },
    ]
  }

  async nextMessage({ userReply, image }) {
    const replyText = (userReply || '').trim()
    let visualFinding = null

    // 1. Se o usuário enviou uma imagem, executa análise de visão real
    if (image) {
      this.hasImage = true
      visualFinding = await analyzeImageWithGroq(image, this.data.label)
      if (visualFinding) {
        this.lastVisualFinding = visualFinding
      }
    }

    // 2. Prepara a mensagem do usuário para o histórico do chat
    const userContent = replyText || (image ? 'Enviei esta foto do problema para você analisar.' : '')
    
    if (image && visualFinding) {
      this.messages.push({
        role: 'user',
        content: `[O morador enviou uma foto do local do problema. Análise visual técnica realizada pela IA na imagem: "${visualFinding}"]. Comentário do morador: "${userContent}"`,
      })
    } else if (userContent) {
      this.messages.push({ role: 'user', content: userContent })
    }

    // Pequena pausa natural
    await new Promise((r) => setTimeout(r, 300))

    // 3. Obtém a resposta da IA no chat
    let aiResponse = ''
    try {
      aiResponse = await groqRequest(this.messages)
    } catch (err) {
      console.error('Groq Chat falhou:', err.message)
      return {
        done: false,
        visualFinding,
        text: 'Tive uma oscilação na conexão com o servidor. Poderia repetir ou enviar novamente?',
      }
    }

    // 4. Salva a resposta do assistente no histórico
    this.messages.push({ role: 'assistant', content: aiResponse })

    // 5. Verifica se a IA concluiu o diagnóstico
    if (aiResponse.includes('DIAGNOSTICO CONCLUIDO:')) {
      return await this._buildConclusion(aiResponse, visualFinding || this.lastVisualFinding)
    }

    return { done: false, visualFinding, text: aiResponse }
  }

  async _buildConclusion(aiResponse, visualFinding) {
    let categories = getProductCategoriesForDiagnosis(this.key)

    // Extrai o texto após "DIAGNOSTICO CONCLUIDO:"
    const rawDiagnosis = aiResponse.replace('DIAGNOSTICO CONCLUIDO:', '').trim()

    // 1. Polimento do texto de diagnóstico
    let diagnosisText = rawDiagnosis
    try {
      const polished = await groqRequest(
        [
          {
            role: 'system',
            content: 'Você é um técnico especialista em reparos residenciais. Reescreva o diagnóstico em 2 a 3 frases claras, técnicas e diretas em português brasileiro. Sem listas, apenas texto corrido.',
          },
          { role: 'user', content: rawDiagnosis },
        ],
        { temperature: 0.3, max_tokens: 250 }
      )
      if (polished && polished.length > 20) diagnosisText = polished
    } catch {
      // mantém rawDiagnosis se falhar
    }

    // 2. Calibração dinâmica do ranking de necessidade (%) pela IA com base nas mensagens reais do usuário
    try {
      const rankingPrompt = `Você é o engenheiro especialista do Resolve Aí.
Com base no diagnóstico do problema: "${this.data.label}"
Relato recente: "${rawDiagnosis}"
${visualFinding ? `Inspeção visual da foto: "${visualFinding}"` : ''}

Abaixo estão os produtos candidatos para este reparo:
${categories.map((c) => `- id: "${c.id}", nome: "${c.name}"`).join('\n')}

Avalie a urgência e necessidade de cada item no momento atual para este caso específico.
Retorne APENAS um array JSON válido sem markdown adicional:
[
  {
    "id": "string com o id do produto",
    "necessityPercent": numero inteiro entre 60 e 98 (o item mais crítico/causa raiz deve ter a maior porcentagem, ex: 95-98),
    "whyNeeded": "1 frase curta e direta explicando exatamente por que este item é o mais ou menos necessário agora no caso deste usuário",
    "priorityLabel": "termo curto: Causa Raiz Mais Provável (#1), Ferramenta Crítica (#2), ou Suporte & Segurança (#3)"
  }
]`

      const dynamicRankingRaw = await groqRequest(
        [
          {
            role: 'system',
            content: 'Você é um assistente técnico residencial. Responda exclusivamente com array JSON válido, sem texto introdutório ou markdown adicional.',
          },
          { role: 'user', content: rankingPrompt },
        ],
        { temperature: 0.2, max_tokens: 400 }
      )

      const cleanJson = dynamicRankingRaw.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleanJson)

      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ordena pela maior porcentagem de necessidade
        parsed.sort((a, b) => (b.necessityPercent || 0) - (a.necessityPercent || 0))

        const updatedCategories = parsed.map((item, idx) => {
          const original = categories.find((c) => c.id === item.id)
          if (!original) return null
          return {
            ...original,
            rank: idx + 1,
            necessityPercent: item.necessityPercent || original.necessityPercent,
            priorityLabel: item.priorityLabel || original.priorityLabel,
            whyNeeded: item.whyNeeded || original.whyNeeded,
          }
        }).filter(Boolean)

        if (updatedCategories.length > 0) {
          categories = updatedCategories
        }
      }
    } catch (e) {
      console.warn('Usando ranking pré-calibrado padrão:', e.message)
    }

    const intro = this.hasImage
      ? 'Analisando a foto enviada junto com o que você me descreveu, identifiquei a causa raiz:'
      : 'Com base em tudo que você me descreveu, a causa raiz ficou bem clara:'

    return {
      done: true,
      key: this.key,
      categories,
      visualFinding,
      text: `${intro} 🎯\n\n${diagnosisText}\n\n📊 Montei abaixo um **Ranking de Necessidade (%)** para você ver exatamente qual peça ou ferramenta é a mais urgente no momento para resolver sem gastar com visita técnica!`,
    }
  }
}
