import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, CheckCircle2, Smartphone, Download, Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [appUrl, setAppUrl] = useState('')
  const [isLocalhost, setIsLocalhost] = useState(false)
  const [networkUrl, setNetworkUrl] = useState('')
  const [showNetworkWarning, setShowNetworkWarning] = useState(false)

  useEffect(() => {
    // Obtener la URL actual
    const currentUrl = window.location.origin
    setAppUrl(currentUrl)
    
    // Detectar si es localhost
    const isLocal = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')
    setIsLocalhost(isLocal)
    
    if (isLocal) {
      // Intentar obtener la IP de la red local
      // En desarrollo, necesitamos la IP de la red, no localhost
      const hostname = window.location.hostname
      const port = window.location.port || '3002'
      
      // Si es localhost, intentar obtener la IP real
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Usar la IP de la red si está disponible
        // En Vite, esto se muestra en la consola cuando inicia el servidor
        setShowNetworkWarning(true)
        
        // Intentar obtener la IP de la red
        // Nota: No podemos obtener la IP directamente desde el navegador por seguridad
        // El usuario debe usar la IP que muestra Vite en la consola
        setNetworkUrl('http://TU_IP_LOCAL:3002') // Placeholder
      } else {
        setNetworkUrl(currentUrl)
      }
    } else {
      setNetworkUrl(currentUrl)
    }
  }, [])

  const copyToClipboard = () => {
    const urlToCopy = isLocalhost && networkUrl !== 'http://TU_IP_LOCAL:3002' ? networkUrl : appUrl
    navigator.clipboard.writeText(urlToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getQRUrl = () => {
    if (isLocalhost) {
      // Si tenemos una URL de red, usarla, sino mostrar advertencia
      if (networkUrl && networkUrl !== 'http://TU_IP_LOCAL:3002') {
        return networkUrl
      }
      // Si no, usar la URL actual pero mostrar advertencia
      return appUrl
    }
    return appUrl
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-800/50 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl border border-primary/30">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  <span className="text-gradient">Escanear para Acceder</span>
                </h2>
                <p className="text-gray-400">
                  Escanea este código QR con tu dispositivo móvil
                </p>
              </div>

              {/* Network Warning for Localhost */}
              {isLocalhost && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Importante para iOS</h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Para que funcione en iOS, necesitas usar la IP de tu red local, no localhost.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          <strong>1.</strong> Busca en la consola donde ejecutaste <code className="bg-gray-800 px-2 py-1 rounded">npm run dev</code>
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>2.</strong> Verás algo como: <code className="bg-gray-800 px-2 py-1 rounded">Network: http://192.168.1.XXX:3002</code>
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>3.</strong> Usa esa URL en el QR code (no localhost)
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-white rounded-2xl shadow-2xl">
                  <QRCodeSVG
                    value={getQRUrl()}
                    size={256}
                    level="H"
                    includeMargin={true}
                    fgColor="#00C4CC"
                  />
                </div>
              </div>

              {/* URL Display */}
              <div className="mb-6">
                <div className="flex items-center gap-2 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <code className="flex-1 text-sm text-gray-300 font-mono break-all">
                    {getQRUrl()}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                    title="Copiar URL"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm text-center mt-2 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    URL copiada al portapapeles
                  </motion.p>
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Download className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-1">Instrucciones:</p>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                      <li>Asegúrate de que tu dispositivo móvil esté en la misma red Wi-Fi</li>
                      <li>Abre la cámara de tu dispositivo móvil</li>
                      <li>Escanea el código QR mostrado arriba</li>
                      <li>Se abrirá la aplicación en tu navegador</li>
                      <li>Puedes agregarla a tu pantalla de inicio</li>
                    </ol>
                  </div>
                </div>

                {isLocalhost && (
                  <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Wifi className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-200 mb-1">Para iOS:</p>
                      <p className="text-sm text-gray-400">
                        Si el QR no funciona, busca la IP de red en la consola donde ejecutaste <code className="bg-gray-800 px-1 py-0.5 rounded">npm run dev</code> y úsala manualmente.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="mb-6">
                <a
                  href="/download"
                  className="block w-full text-center gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all glow-effect"
                >
                  Ver Instrucciones Completas de Descarga
                </a>
              </div>

              {/* Network Info */}
              <div className="pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-center">
                  {isLocalhost ? (
                    <>Asegúrate de usar la IP de red local (no localhost) para iOS</>
                  ) : (
                    <>Puedes acceder desde cualquier dispositivo conectado a internet</>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
