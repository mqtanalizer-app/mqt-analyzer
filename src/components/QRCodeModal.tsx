import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, CheckCircle2, Smartphone, Download, Wifi, CheckCircle } from 'lucide-react'
import { getNetworkURL, getLocalIPAddress, saveNetworkIP, getNetworkIP } from '../utils/networkUtils'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [appUrl, setAppUrl] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [isLocalhost, setIsLocalhost] = useState(false)
  const [networkIP, setNetworkIP] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const currentUrl = window.location.origin
    const isLocal = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')
    setIsLocalhost(isLocal)
    
    // Try to get saved IP first
    const savedIP = getNetworkIP()
    if (savedIP) {
      setNetworkIP(savedIP)
      const port = window.location.port || '3002'
      setAppUrl(`http://${savedIP}:${port}`)
      return
    }

    if (isLocal) {
      // Try to detect IP automatically
      setIsDetecting(true)
      detectNetworkIP()
    } else {
      setAppUrl(currentUrl)
    }
  }, [isOpen])

  const detectNetworkIP = async () => {
    try {
      const ip = await getLocalIPAddress()
      if (ip) {
        setNetworkIP(ip)
        saveNetworkIP(ip)
        const port = window.location.port || '3002'
        setAppUrl(`http://${ip}:${port}`)
      } else {
        // Fallback: try to get from Vite's network info
        // In development, Vite shows network URL in console
        // For now, use localhost and show manual input
        setAppUrl(window.location.origin)
      }
    } catch (error) {
      console.error('Error detecting IP:', error)
      setAppUrl(window.location.origin)
    } finally {
      setIsDetecting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleManualIP = (ip: string) => {
    if (ip.trim()) {
      setNetworkIP(ip.trim())
      saveNetworkIP(ip.trim())
      const port = window.location.port || '3002'
      setAppUrl(`http://${ip.trim()}:${port}`)
    }
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
              className="glass-card rounded-2xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto scrollbar-hide"
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
                  <span className="text-gradient">Instalación Rápida</span>
                </h2>
                <p className="text-gray-400">
                  Escanea el código QR para instalar automáticamente
                </p>
              </div>

              {/* Auto-detection Status */}
              {isLocalhost && (
                <div className="mb-6">
                  {isDetecting ? (
                    <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-300">
                          Detectando IP de red automáticamente...
                        </p>
                      </div>
                    </div>
                  ) : networkIP ? (
                    <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-400 mb-1">
                            IP detectada automáticamente
                          </p>
                          <code className="text-xs text-gray-300 font-mono">
                            {networkIP}
                          </code>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      <div className="flex items-start gap-3">
                        <Wifi className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-yellow-400 mb-2">
                            Ingresa tu IP de red manualmente
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Ej: 192.168.1.97"
                              onBlur={(e) => handleManualIP(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleManualIP((e.target as HTMLInputElement).value)
                                }
                              }}
                              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Busca "Network: http://XXX.XXX.XXX.XXX:3002" en la consola
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-white rounded-2xl shadow-2xl">
                  <QRCodeSVG
                    value={appUrl}
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
                    {appUrl}
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
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Download className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-1">Instrucciones:</p>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                      <li>Escanea el QR con tu dispositivo móvil</li>
                      <li>Se abrirá la app en tu navegador</li>
                      <li>El banner de instalación aparecerá automáticamente</li>
                      <li>Toca "Instalar" para agregar a tu pantalla de inicio</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Network Info */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-center">
                  {isLocalhost ? (
                    <>Asegúrate de usar la IP de red para dispositivos móviles</>
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
