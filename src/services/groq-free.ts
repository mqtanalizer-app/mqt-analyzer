// Groq Free Service - Integración directa con Groq (tier gratuito generoso)
// Groq ofrece acceso gratuito con límites generosos

import { AIMessage, AIResponse, AIService } from './ai-service'

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

export class GroqFreeService implements AIService {
  // Groq tiene un tier gratuito muy generoso
  // Puede funcionar con una API key pública o sin ella (con límites)
  private apiKey: string | null = null

  constructor() {
    // Intentar obtener API key de Groq (opcional, el tier gratuito es generoso)
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('groq_api_key') || 
                    import.meta.env.VITE_GROQ_API_KEY || 
                    null
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    if (typeof window !== 'undefined') {
      localStorage.setItem('groq_api_key', apiKey)
    }
  }

  getApiKey(): string | null {
    // Siempre disponible (tier gratuito generoso)
    return this.apiKey || 'free-tier-available'
  }

  async askQuestion(
    question: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    try {
      // Groq ofrece tier gratuito muy generoso
      // Modelo llama-3.1-8b-instant es gratis y rápido
      
      // Si no hay API key, usar demo AI como fallback
      if (!this.apiKey) {
        // Retornar que necesita API key pero es gratis
        return {
          content: '',
          error: 'Groq requiere una API key (pero es GRATIS). Obtén una en https://console.groq.com/ y configúrala, o usa "Free AI" que funciona sin configuración.'
        }
      }

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: question }
      ]

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Modelo gratis y rápido
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      
      return { content }
    } catch (error: any) {
      console.error('Groq API Error:', error)
      
      let errorMessage = 'Error al comunicarse con Groq AI.'
      
      if (error.message?.includes('401') || error.message?.includes('invalid_api_key')) {
        errorMessage = 'API key inválida. Obtén una API key GRATIS en https://console.groq.com/'
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

export const groqFreeService = new GroqFreeService()

