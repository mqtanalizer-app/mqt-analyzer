import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, CheckCircle2, Smartphone, Zap } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function AutoInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = (window.navigator as any).standalone || 
                         window.matchMedia('(display-mode: standalone)').matches
    
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if dismissed today
    const dismissedToday = localStorage.getItem('pwa-install-dismissed-date') === new Date().toDateString()
    if (dismissedToday && !deferredPrompt) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    
    try {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowPrompt(false)
        // Show success message
        setTimeout(() => {
          setIsInstalled(false) // Reset after showing success
        }, 3000)
      } else {
        setIsInstalling(false)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing app:', error)
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed-date', new Date().toDateString())
  }

  if (isInstalled) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-green-500/30 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <p className="text-white font-semibold">
                ¡App instalada exitosamente! Abre la app desde tu pantalla de inicio.
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (!showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/30 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/30 animate-pulse">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Instalación Disponible</h3>
                  <p className="text-sm text-gray-400">
                    Instala MQT Analyzer para acceso rápido y funcionamiento offline
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="gradient-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all glow-effect disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Instalando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Instalar Ahora
                    </>
                  )}
                </motion.button>
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


