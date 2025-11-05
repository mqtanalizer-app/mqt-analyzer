// Claude AI Service
// Integración con Anthropic Claude API

import Anthropic from '@anthropic-ai/sdk'
import { AIMessage, AIResponse, AIService } from './ai-service'

// Contexto de MQT para el prompt
const MQT_CONTEXT = `
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
Mint Function: Deshabilitada

Características:
- Smart contract seguro (score 85/100)
- Distribución de holders saludable
- Liquidez bloqueada a largo plazo
- Sin vulnerabilidades críticas detectadas
- Actividad de whales moderada
- Sentimiento positivo en redes sociales
`

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

${MQT_CONTEXT}`

export class ClaudeService implements AIService {
  private apiKey: string | null = null
  private anthropic: Anthropic | null = null

  constructor() {
    // Intentar obtener API key del localStorage o environment
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('claude_api_key') || 
                    import.meta.env.VITE_CLAUDE_API_KEY || 
                    null
      
      if (this.apiKey) {
        this.anthropic = new Anthropic({ apiKey: this.apiKey })
      }
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
    if (typeof window !== 'undefined') {
      localStorage.setItem('claude_api_key', apiKey)
    }
    this.anthropic = new Anthropic({ apiKey })
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
        error: 'Claude API key no configurada. Por favor, configura tu API key en la configuración.'
      }
    }

    try {
      // Intentar usar el backend proxy primero
      const proxyURL = import.meta.env.VITE_CLAUDE_PROXY_URL || 'http://localhost:3003'
      
      const response = await fetch(`${proxyURL}/api/claude/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history: conversationHistory,
          apiKey: this.apiKey
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      return {
        content: data.content || ''
      }
    } catch (error: any) {
      console.error('Claude API Error:', error)
      
      // Si el proxy falla, intentar directamente (puede fallar por CORS)
      if (this.anthropic) {
        try {
          const messages = [
            ...conversationHistory.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            } as { role: 'user' | 'assistant', content: string })),
            {
              role: 'user' as const,
              content: question
            }
          ]

          const directResponse = await this.anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: messages as any
          })

          const content = directResponse.content[0]?.type === 'text' 
            ? directResponse.content[0].text 
            : ''
          
          return { content }
        } catch (directError: any) {
          // Si falla por CORS, dar instrucciones claras
          if (directError.message?.includes('CORS') || directError.message?.includes('cors')) {
            return {
              content: '',
              error: 'Error de CORS. Necesitas iniciar el backend proxy. Ejecuta: npm run server en la carpeta del proyecto.'
            }
          }
        }
      }
      
      // Manejar errores específicos
      let errorMessage = 'Error al comunicarse con Claude AI.'
      
      if (error.message?.includes('CORS')) {
        errorMessage = 'Error de CORS. Necesitas iniciar el backend proxy. Ejecuta: npm run server'
      } else if (error.message?.includes('401')) {
        errorMessage = 'API key inválida. Por favor, verifica tu API key.'
      } else if (error.message?.includes('429')) {
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

export const claudeService = new ClaudeService()

