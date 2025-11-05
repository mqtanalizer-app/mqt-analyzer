import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Smartphone, Download, Copy, CheckCircle2, X, 
  Apple, Chrome, Share2, ExternalLink,
  QrCode, Globe, Smartphone as AndroidIcon, AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DownloadPage() {
  const navigate = useNavigate()
  const [appUrl, setAppUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [manualIP, setManualIP] = useState('')
  const [isLocalhost, setIsLocalhost] = useState(false)

  useEffect(() => {
    // Obtener URL actual
    const currentUrl = window.location.origin
    const isLocal = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')
    setIsLocalhost(isLocal)
    
    // Cargar IP manual si existe
    const savedIP = localStorage.getItem('mqt-manual-ip')
    if (savedIP) {
      setManualIP(savedIP)
    }
    
    // Si hay IP manual y es localhost, usarla
    let finalUrl = currentUrl
    if (isLocal && savedIP && savedIP.trim()) {
      const port = window.location.port || '3002'
      finalUrl = `http://${savedIP.trim()}:${port}`
    }
    
    setAppUrl(finalUrl)

    // Detectar dispositivo
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    setIsAndroid(/android/i.test(userAgent))
    
    // Detectar si ya está instalada como PWA
    const isStandaloneMode = (window.navigator as any).standalone || 
                             window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(isStandaloneMode)
  }, [])

  useEffect(() => {
    // Actualizar URL cuando cambia la IP manual
    if (isLocalhost && manualIP && manualIP.trim()) {
      const port = window.location.port || '3002'
      const newUrl = `http://${manualIP.trim()}:${port}`
      setAppUrl(newUrl)
      localStorage.setItem('mqt-manual-ip', manualIP.trim())
    } else if (!manualIP && isLocalhost) {
      setAppUrl(window.location.origin)
    }
  }, [manualIP, isLocalhost])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MQT Analyzer',
          text: 'Descarga MQT Analyzer - Advanced Crypto Token Analysis Platform',
          url: appUrl
        })
      } catch (error) {
        // Usuario canceló o error
        console.log('Share cancelled')
      }
    } else {
      copyToClipboard()
    }
  }

  const installInstructions = () => {
    if (isIOS) {
      return {
        title: 'Instalar en iOS (Safari)',
        steps: [
          '1️⃣ Abre Safari en tu iPhone/iPad (IMPORTANTE: usa Safari, no Chrome)',
          '2️⃣ Accede a la app escribiendo la URL o escaneando el QR code',
          '3️⃣ Toca el botón de COMPARTIR en la parte inferior de Safari (cuadrado con flecha hacia arriba)',
          '4️⃣ Desplázate HACIA ABAJO en el menú que aparece',
          '5️⃣ Toca "Agregar a pantalla de inicio" (tiene un icono de + con cuadrado)',
          '6️⃣ Toca "Agregar" en la esquina superior derecha',
          '7️⃣ ¡Listo! Busca el icono de "MQT Analyzer" en tu pantalla de inicio'
        ]
      }
    } else if (isAndroid) {
      return {
        title: 'Instalar en Android (Chrome)',
        steps: [
          '1️⃣ Abre Chrome en tu dispositivo Android',
          '2️⃣ Accede a la app escribiendo la URL o escaneando el QR code',
          '3️⃣ Toca el MENÚ (3 puntos verticales) en la esquina superior derecha',
          '4️⃣ Busca y toca "Agregar a pantalla de inicio" o "Instalar app"',
          '5️⃣ Confirma la instalación',
          '6️⃣ ¡Listo! Busca el icono de "MQT Analyzer" en tu pantalla de inicio'
        ]
      }
    } else {
      return {
        title: 'Instalar en Desktop (Chrome/Edge)',
        steps: [
          '1️⃣ Abre Chrome o Edge en tu escritorio',
          '2️⃣ Accede a la app escribiendo la URL',
          '3️⃣ Busca el ICONO DE INSTALACIÓN en la barra de direcciones (monitor con flecha)',
          '4️⃣ Haz clic en el icono o ve al menú (3 puntos) → "Instalar aplicación"',
          '5️⃣ Confirma la instalación',
          '6️⃣ ¡Listo! La app se abrirá como una ventana independiente'
        ]
      }
    }
  }

  const instructions = installInstructions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-primary mb-6 transition-colors group"
          >
            <X className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </button>

          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl border border-primary/30 glow-effect">
              <Download className="w-16 h-16 text-primary" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Descargar MQT Analyzer</span>
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Accede a la aplicación desde cualquier dispositivo
          </p>

          {isStandalone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 mb-4"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Aplicación instalada</span>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Código QR</h2>
              <p className="text-gray-400">Escanea para acceder desde tu móvil</p>
            </div>

            {/* Warning for Localhost on iOS */}
            {isLocalhost && (
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Para iOS: Usa la IP de Red</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      El QR con localhost no funciona en iOS. Ingresa la IP de tu red local:
                    </p>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={manualIP}
                        onChange={(e) => setManualIP(e.target.value)}
                        placeholder="Ej: 192.168.1.97"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm font-mono"
                      />
                      <button
                        onClick={() => {
                          if (manualIP.trim()) {
                            const port = window.location.port || '3002'
                            setAppUrl(`http://${manualIP.trim()}:${port}`)
                          }
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition-colors text-sm whitespace-nowrap"
                      >
                        Usar IP
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Busca "Network: http://XXX.XXX.XXX.XXX:3002" en la consola donde ejecutaste <code className="bg-gray-800 px-1 py-0.5 rounded">npm run dev</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white rounded-2xl shadow-2xl">
                <QRCodeSVG
                  value={appUrl}
                  size={280}
                  level="H"
                  includeMargin={true}
                  fgColor="#00C4CC"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <Globe className="w-5 h-5 text-primary flex-shrink-0" />
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
                  className="text-green-400 text-sm text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  URL copiada al portapapeles
                </motion.p>
              )}

              <button
                onClick={shareUrl}
                className="w-full gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-all glow-effect"
              >
                <Share2 className="w-5 h-5" />
                Compartir URL
              </button>
            </div>
          </motion.div>

          {/* Installation Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Instrucciones de Instalación</h2>
              <p className="text-gray-400">Sigue estos pasos para instalar la app</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                {isIOS ? (
                  <Apple className="w-8 h-8 text-primary" />
                ) : isAndroid ? (
                  <AndroidIcon className="w-8 h-8 text-green-400" />
                ) : (
                  <Chrome className="w-8 h-8 text-blue-400" />
                )}
                <div>
                  <h3 className="font-semibold text-white">{instructions.title}</h3>
                  <p className="text-sm text-gray-400">
                    {isIOS ? 'iOS (Safari)' : isAndroid ? 'Android (Chrome)' : 'Desktop'}
                  </p>
                </div>
              </div>

              <ol className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 flex-1 pt-1">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <p className="text-sm text-gray-300">
                <strong className="text-blue-400">💡 Consejo:</strong> Una vez instalada, la aplicación funcionará como una app nativa, con acceso rápido desde tu pantalla de inicio.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Características de la App</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Download className="w-6 h-6" />,
                title: 'Instalación Rápida',
                description: 'Instala en segundos desde tu navegador'
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'Acceso Rápido',
                description: 'Accede desde tu pantalla de inicio'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Funciona Offline',
                description: 'Funciona sin conexión (PWA)'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/50"
              >
                <div className="text-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Copyright © 2025 LELC & JTH Tecnology. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </div>
  )
}

