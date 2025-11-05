import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Settings } from 'lucide-react'
import { AIProvider, aiServiceManager } from '../services/ai-service'

interface Props {
  selectedProvider: AIProvider
  onProviderChange: (provider: AIProvider) => void
  onConfigure: (provider: AIProvider) => void
}

export default function AISelector({ selectedProvider, onProviderChange, onConfigure }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const providers = aiServiceManager.getAllProviders()

  const selectedInfo = aiServiceManager.getProviderInfo(selectedProvider)
  const isConfigured = !!aiServiceManager.getApiKey(selectedProvider)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border ${
          isConfigured
            ? `${selectedInfo.bgColor} ${selectedInfo.borderColor} ${selectedInfo.color}`
            : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
        }`}
      >
        <span className="text-lg">{selectedInfo.icon}</span>
        <span>{selectedInfo.name}</span>
        {!isConfigured && (
          <span className="text-xs px-2 py-0.5 bg-yellow-500/30 rounded">Sin configurar</span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-20 min-w-[280px]"
            >
              <div className="p-2">
                {providers.map((provider) => {
                  const info = aiServiceManager.getProviderInfo(provider)
                  const configured = provider === 'demo' || provider === 'free' || !!aiServiceManager.getApiKey(provider)
                  const isSelected = provider === selectedProvider

                  return (
                    <button
                      key={provider}
                      onClick={() => {
                        onProviderChange(provider)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                        isSelected ? 'bg-gray-800' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{info.icon}</span>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{info.name}</span>
                            {info.free && (
                              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                                GRATIS
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{info.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {configured ? (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                            ✓
                          </span>
                        ) : (provider === 'claude' || provider === 'gemini' || provider === 'openai') ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onConfigure(provider)
                              setIsOpen(false)
                            }}
                            className="p-1 hover:bg-gray-700 rounded"
                            title="Configurar API Key"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                          </button>
                        ) : null}
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

