import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Download, Share2, Copy, Check, Smartphone, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

interface QRCodeGeneratorProps {
  url?: string
  title?: string
}

export default function QRCodeGenerator({ 
  url, 
  title = 'MQT Analyzer' 
}: QRCodeGeneratorProps) {
  const [currentUrl, setCurrentUrl] = useState(url || window.location.href)
  const [copied, setCopied] = useState(false)
  const [size, setSize] = useState(256)

  useEffect(() => {
    if (!url) {
      setCurrentUrl(window.location.href)
    }
  }, [url])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    toast.success('URL copiada al portapapeles')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Descarga MQT Analyzer',
          url: currentUrl,
        })
        toast.success('Compartido exitosamente')
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = size
    canvas.height = size

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `mqt-analyzer-qr-${Date.now()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
      toast.success('QR descargado')
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-8"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/20 rounded-xl border border-primary/30">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gradient">Código QR</h2>
        </div>
        <p className="text-gray-400">
          Escanea este código con tu dispositivo móvil para acceder a MQT Analyzer
        </p>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center gap-6 mb-6">
        <div className="p-6 bg-white rounded-2xl shadow-2xl">
          <QRCodeSVG
            id="qr-code-svg"
            value={currentUrl}
            size={size}
            level="H"
            includeMargin={true}
            fgColor="#00C4CC"
            bgColor="#FFFFFF"
          />
        </div>

        {/* URL Display */}
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <code className="flex-1 text-sm text-gray-300 font-mono break-all">
              {currentUrl}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copiar URL"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadQR}
          className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all glow-effect"
        >
          <Download className="w-5 h-5" />
          Descargar QR
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareUrl}
          className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 border border-gray-700 hover:bg-gray-700 transition-all"
        >
          <Share2 className="w-5 h-5" />
          Compartir
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
        <div className="flex items-start gap-3 mb-4">
          <Smartphone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold mb-2">Cómo usar el código QR:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Abre la cámara de tu dispositivo móvil</li>
              <li>Apunta hacia el código QR</li>
              <li>Toca la notificación que aparece</li>
              <li>Se abrirá MQT Analyzer en tu navegador</li>
              <li>En iOS, toca "Compartir" y luego "Agregar a pantalla de inicio" para instalar la app</li>
              <li>En Android, aparecerá un banner para instalar la app</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Size Control */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <label className="block text-sm font-semibold text-gray-400 mb-3">
          Tamaño del QR: {size}px
        </label>
        <input
          type="range"
          min="200"
          max="400"
          step="20"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>200px</span>
          <span>400px</span>
        </div>
      </div>
    </motion.div>
  )
}

