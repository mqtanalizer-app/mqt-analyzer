// Google Gemini Service
// Integración con Google Gemini API (GRATIS)

import { AIMessage, AIResponse, AIService } from './ai-service'

interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

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

export class GeminiService implements AIService {
  private apiKey: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('gemini_api_key') || 
                    import.meta.env.VITE_GEMINI_API_KEY || 
                    null
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', apiKey)
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
        error: 'Gemini API key no configurada. Por favor, configura tu API key en la configuración.'
      }
    }

    try {
      // Construir mensajes para Gemini
      const contents: GeminiMessage[] = [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        } as GeminiMessage)),
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ]

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Extraer el contenido de la respuesta
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      return {
        content
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error)
      
      let errorMessage = 'Error al comunicarse con Gemini AI.'
      
      if (error.message?.includes('401') || error.message?.includes('API_KEY_INVALID')) {
        errorMessage = 'API key inválida. Por favor, verifica tu API key de Gemini.'
      } else if (error.message?.includes('429') || error.message?.includes('QUOTA')) {
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

export const geminiService = new GeminiService()

