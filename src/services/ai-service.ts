// AI Service - Abstracción para múltiples servicios de IA
import { claudeService } from './claude'
import { geminiService } from './gemini'
import { openaiService } from './openai'
import { demoAIService } from './demo-ai'
import { freeAIService } from './free-ai'

export type AIProvider = 'claude' | 'gemini' | 'openai' | 'demo' | 'free'

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  error?: string
}

export interface AIService {
  setApiKey(apiKey: string): void
  getApiKey(): string | null
  askQuestion(question: string, conversationHistory: AIMessage[]): Promise<AIResponse>
}

export class AIServiceManager {
  private services: Map<AIProvider, AIService> = new Map()

  constructor() {
    this.services.set('claude', claudeService)
    this.services.set('gemini', geminiService)
    this.services.set('openai', openaiService)
    this.services.set('demo', demoAIService)
    this.services.set('free', freeAIService)
  }

  getService(provider: AIProvider): AIService {
    const service = this.services.get(provider)
    if (!service) {
      throw new Error(`AI service ${provider} not found`)
    }
    return service
  }

  async askQuestion(
    provider: AIProvider,
    question: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    const service = this.getService(provider)
    return service.askQuestion(question, conversationHistory)
  }

  setApiKey(provider: AIProvider, apiKey: string): void {
    const service = this.getService(provider)
    service.setApiKey(apiKey)
  }

  getApiKey(provider: AIProvider): string | null {
    const service = this.getService(provider)
    return service.getApiKey()
  }

  getAllProviders(): AIProvider[] {
    return ['free', 'demo', 'gemini', 'claude', 'openai']
  }

  getProviderInfo(provider: AIProvider) {
    const info = {
      free: {
        name: 'Free AI',
        description: 'IA Gratuita - Funciona sin configuración, acceso automático a servicios gratuitos',
        icon: '🆓',
        color: 'text-green-400',
        bgColor: 'bg-green-400/20',
        borderColor: 'border-green-400/30',
        free: true,
        link: '#'
      },
      demo: {
        name: 'Demo AI',
        description: 'Modo Demo - Funciona sin API key, respuestas inteligentes predefinidas',
        icon: '🎯',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/20',
        borderColor: 'border-yellow-400/30',
        free: true,
        link: '#'
      },
      gemini: {
        name: 'Google Gemini',
        description: 'Google Gemini Pro - Gratis con límites',
        icon: '⭐',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/20',
        borderColor: 'border-blue-400/30',
        free: true,
        link: 'https://makersuite.google.com/app/apikey'
      },
      claude: {
        name: 'Claude AI',
        description: 'Anthropic Claude 3.5 Sonnet - Análisis avanzado y preciso',
        icon: '🤖',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/20',
        borderColor: 'border-purple-400/30',
        free: false,
        link: 'https://console.anthropic.com/'
      },
      openai: {
        name: 'OpenAI GPT',
        description: 'OpenAI GPT-4 - Potente y versátil',
        icon: '🧠',
        color: 'text-green-400',
        bgColor: 'bg-green-400/20',
        borderColor: 'border-green-400/30',
        free: false,
        link: 'https://platform.openai.com/api-keys'
      }
    }
    return info[provider]
  }
}

export const aiServiceManager = new AIServiceManager()

