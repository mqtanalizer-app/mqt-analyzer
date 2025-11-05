import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, ExternalLink } from 'lucide-react'
import { AIProvider, aiServiceManager } from '../services/ai-service'

interface Props {
  isOpen: boolean
  provider: AIProvider | null
  onClose: () => void
  onSave: () => void
}

export default function AIApiKeyModal({ isOpen, provider, onClose, onSave }: Props) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [testing, setTesting] = useState(false)

  if (!provider) return null

  const providerInfo = aiServiceManager.getProviderInfo(provider)
  const currentKey = aiServiceManager.getApiKey(provider)

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Por favor, ingresa tu API key')
      return
    }

    setTesting(true)
    setError('')

    // Guardar API key
    aiServiceManager.setApiKey(provider, apiKey.trim())

    // Probar la API key con una pregunta simple
    try {
      const response = await aiServiceManager.askQuestion(provider, 'Hola')
      
      if (response.error) {
        setError(response.error)
        setTesting(false)
        return
      }

      // Si funciona, cerrar modal
      onSave()
      onClose()
      setApiKey('')
    } catch (err: any) {
      setError(err.message || 'Error al verificar la API key')
    } finally {
      setTesting(false)
    }
  }

  const handleGetKey = () => {
    window.open(providerInfo.link, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${providerInfo.bgColor} rounded-lg`}>
                  <span className="text-2xl">{providerInfo.icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Configurar {providerInfo.name}</h2>
                  {providerInfo.free && (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      GRATIS
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {providerInfo.description}
              <br />
              Para usar {providerInfo.name}, necesitas una API key.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-400/20 border border-red-400/30 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {currentKey && (
              <div className="mb-4 p-3 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Ya tienes una API key configurada. Ingresa una nueva para reemplazarla.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                {providerInfo.name} API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setError('')
                }}
                placeholder={
                  provider === 'claude' ? 'sk-ant-api03-...' :
                  provider === 'gemini' ? 'AIza...' :
                  'sk-...'
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="mb-6">
              <button
                onClick={handleGetKey}
                className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm underline"
              >
                ¿No tienes una API key? Obtén una aquí
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={testing || !apiKey.trim()}
                className={`flex-1 px-4 py-3 ${providerInfo.bgColor} ${providerInfo.color} rounded-lg font-semibold hover:opacity-80 transition-colors disabled:opacity-50`}
              >
                {testing ? 'Verificando...' : 'Guardar'}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Tu API key se guarda localmente en tu navegador y nunca se comparte con terceros.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

