import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, CheckCircle2, Smartphone, Apple, Chrome } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar si ya está instalada
    const standaloneMode = (window.navigator as any).standalone || 
                           window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standaloneMode)

    if (standaloneMode) {
      setIsInstalled(true)
      return
    }

    // Detectar dispositivo
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
    const isAndroidDevice = /android/i.test(userAgent)
    
    setIsIOS(isIOSDevice)
    setIsAndroid(isAndroidDevice)

    // Solo mostrar banner si no está instalada y es compatible
    if (!standaloneMode && (isIOSDevice || isAndroidDevice || (window as any).navigator.userAgent.includes('Chrome'))) {
      // Esperar un poco antes de mostrar el banner
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }

    // Escuchar el evento beforeinstallprompt (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Mostrar el prompt de instalación
      deferredPrompt.prompt()
      
      // Esperar a que el usuario responda
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowBanner(false)
      }
      
      setDeferredPrompt(null)
    } else {
      // Si no hay prompt, mostrar instrucciones
      setShowBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    // Guardar en localStorage para no mostrar de nuevo hoy
    localStorage.setItem('pwa-install-dismissed', new Date().toDateString())
  }

  // No mostrar si ya está instalada o fue descartada hoy
  if (isInstalled || isStandalone) {
    return null
  }

  const dismissedToday = localStorage.getItem('pwa-install-dismissed') === new Date().toDateString()
  if (dismissedToday && !deferredPrompt) {
    return null
  }

  if (!showBanner) {
    return null
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/30 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/30">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Instalar MQT Analyzer</h3>
                  <p className="text-sm text-gray-400">
                    {isIOS ? (
                      <>Instala la app para acceso rápido desde tu pantalla de inicio. Usa Safari y toca el botón de compartir.</>
                    ) : isAndroid ? (
                      <>Instala la app para acceso rápido y funcionamiento offline</>
                    ) : (
                      <>Instala la app para acceso rápido y mejores características</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {deferredPrompt ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstall}
                    className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all glow-effect"
                  >
                    <Download className="w-5 h-5" />
                    Instalar
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/download'}
                    className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all glow-effect"
                  >
                    {isIOS ? (
                      <>
                        <Apple className="w-5 h-5" />
                        Ver Instrucciones
                      </>
                    ) : (
                      <>
                        <Chrome className="w-5 h-5" />
                        Ver Instrucciones
                      </>
                    )}
                  </motion.button>
                )}
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

