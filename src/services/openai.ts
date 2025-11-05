// OpenAI Service
// Integración con OpenAI GPT API

import { AIMessage, AIResponse, AIService } from './ai-service'

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

const SYSTEM_PROMPT = `Eres un experto asesor financiero especializado en criptomonedas y análisis técnico.
Tu especialidad es el token MQT (Market Quantum Tool).

INSTRUCCIONES:
- Proporciona respuestas detalladas y fundamentadas
- Incluye análisis técnico cuando sea relevante
- Menciona riesgos y advertencias cuando sea apropiado
- Sé honesto sobre limitaciones y riesgos
- Usa datos actuales cuando sea posible
- Proporciona recomendaciones claras y accionables
- Responde siempre en español de manera profesional y clara
- Si no tienes información específica, dilo honestamente

CONTEXTO ACTUAL DE MQT (Market Quantum Tool):
Token: MQT (Market Quantum Tool)
Precio Actual: $0.001234
Market Cap: $1.25M
Liquidez: $125K
Holders: 1,250
Volumen 24h: $450K
Security Score: 85/100 (Excelente)
Top 10 Holders: 15% del supply
Sentiment: +0.75 (Muy Positivo)
Liquidez Bloqueada: Hasta 2026
Ownership: Renounceable
Reentrancy: Protegido
Mint Function: Deshabilitada`

export class OpenAIService implements AIService {
  private apiKey: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('openai_api_key') || 
                    import.meta.env.VITE_OPENAI_API_KEY || 
                    null
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', apiKey)
    }
  }

  getApiKey(): string | null {
    return this.apiKey
  }

  async askQuestion(
    question: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        content: '',
        error: 'OpenAI API key no configurada. Por favor, configura tu API key en la configuración.'
      }
    }

    try {
      // Construir mensajes para OpenAI
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        } as OpenAIMessage)),
        {
          role: 'user',
          content: question
        }
      ]

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Extraer el contenido de la respuesta
      const content = data.choices?.[0]?.message?.content || ''
      
      return {
        content
      }
    } catch (error: any) {
      console.error('OpenAI API Error:', error)
      
      let errorMessage = 'Error al comunicarse con OpenAI.'
      
      if (error.message?.includes('401') || error.message?.includes('invalid_api_key')) {
        errorMessage = 'API key inválida. Por favor, verifica tu API key de OpenAI.'
      } else if (error.message?.includes('429') || error.message?.includes('rate_limit')) {
        errorMessage = 'Límite de solicitudes excedido. Por favor, intenta más tarde.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        content: '',
        error: errorMessage
      }
    }
  }
}

export const openaiService = new OpenAIService()

