import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Send, Brain, Loader2, User, Bot,
  TrendingUp, Shield, AlertTriangle, Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AIProvider, aiServiceManager } from '../services/ai-service'
import AISelector from '../components/AISelector'
import AIApiKeyModal from '../components/AIApiKeyModal'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ClaudeAssistant() {
  const navigate = useNavigate()
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('free') // Por defecto Free AI (sin configuración)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de IA especializado en análisis de tokens cripto. Puedo ayudarte con:\n\n• Análisis de estrategias de inversión\n• Explicación de métricas on-chain\n• Interpretación de smart contracts\n• Análisis de sentimiento\n• Recomendaciones de trading\n• Respuestas a dudas técnicas\n\nSelecciona una IA en el menú arriba. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [providerToConfigure, setProviderToConfigure] = useState<AIProvider | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const providerInfo = aiServiceManager.getProviderInfo(selectedProvider)
  const apiKeyConfigured = !!aiServiceManager.getApiKey(selectedProvider)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    // Verificar si hay API key configurada (demo y free no necesitan API key)
    if (selectedProvider !== 'demo' && selectedProvider !== 'free' && !aiServiceManager.getApiKey(selectedProvider)) {
      setProviderToConfigure(selectedProvider)
      setShowApiKeyModal(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = input
    setInput('')
    setLoading(true)

    try {
      // Construir historial de conversación
      const conversationHistory = messages
        .filter(m => m.id !== '1') // Excluir mensaje inicial
        .map(m => ({
          role: m.role,
          content: m.content
        }))

      // Llamar a la IA seleccionada
      const response = await aiServiceManager.askQuestion(selectedProvider, userInput, conversationHistory)

      if (response.error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Error: ${response.error}\n\nPor favor, verifica tu API key en la configuración.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content || `No se recibió respuesta de ${providerInfo.name}.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Error al comunicarse con ${providerInfo.name}: ${error.message || 'Error desconocido'}\n\nPor favor, verifica tu conexión e intenta nuevamente.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleApiKeySave = () => {
    setShowApiKeyModal(false)
    setProviderToConfigure(null)
  }

  const handleConfigure = (provider: AIProvider) => {
    setProviderToConfigure(provider)
    setShowApiKeyModal(true)
  }

  const quickQuestions = [
    { icon: TrendingUp, text: '¿Qué estrategia recomiendas para MQT?', question: '¿Qué estrategia recomiendas para invertir en MQT?' },
    { icon: Shield, text: '¿Es seguro el contrato?', question: '¿Es seguro el smart contract de MQT?' },
    { icon: AlertTriangle, text: '¿Qué riesgos tiene?', question: '¿Qué riesgos tiene invertir en MQT?' },
    { icon: Zap, text: 'Análisis de whales', question: '¿Cómo están los whales en MQT?' },
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary mb-1">
                  AI Assistant
                </h1>
                <p className="text-gray-400">
                  Tu asesor personal especializado en análisis de tokens cripto
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Seleccionar IA:</span>
              <AISelector
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                onConfigure={handleConfigure}
              />
            </div>
          </div>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map((q, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickQuestion(q.question)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm hover:border-primary/50 transition-colors"
              >
                <q.icon className="w-4 h-4 text-primary" />
                {q.text}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  <div className={`p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-900 border border-gray-800 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="p-2 bg-gray-800 rounded-lg order-1">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="p-2 bg-primary/20 rounded-lg">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* API Key Modal */}
        <AIApiKeyModal
          isOpen={showApiKeyModal}
          provider={providerToConfigure}
          onClose={() => {
            setShowApiKeyModal(false)
            setProviderToConfigure(null)
          }}
          onSave={handleApiKeySave}
        />

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Escribe tu pregunta sobre MQT, análisis de tokens, estrategias..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
