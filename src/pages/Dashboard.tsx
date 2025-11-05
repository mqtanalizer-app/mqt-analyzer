import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, Activity, Shield, BarChart3, Users, Zap,
  DollarSign, AlertCircle, CheckCircle2, 
  ArrowRight, Sparkles, LineChart, QrCode, Download, Copy, Globe, ExternalLink, Wallet
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import QRCodeModal from '../components/QRCodeModal'
import { getNetworkURL } from '../utils/networkUtils'
import { priceService, type TokenPriceData } from '../services/priceService'

export default function Dashboard() {
  const navigate = useNavigate()
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [priceData, setPriceData] = useState<TokenPriceData | null>(null)
  const [priceHistory, setPriceHistory] = useState<Array<{ time: string; price: number }>>([])
  
  // Auto-detect network URL for QR
  useEffect(() => {
    const networkUrl = getNetworkURL()
    // This will be used by QRCodeModal automatically
  }, [])

  // Cargar precio en tiempo real
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await priceService.getAggregatedPrice()
        setPriceData(data)
      } catch (error) {
        console.error('Error fetching price:', error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Actualizar cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  // Cargar historial de precios
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await priceService.getPriceHistory(24)
        setPriceHistory(history)
      } catch (error) {
        console.error('Error fetching price history:', error)
      }
    }

    fetchHistory()
    const interval = setInterval(fetchHistory, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [])

  // Datos de mercado en tiempo real (usando datos reales si están disponibles)
  const marketData = {
    totalMarketCap: priceData?.marketCap || 1250000,
    totalVolume: priceData?.volume24h || 450000,
    priceChange24h: priceData?.priceChange24h || 12.5,
    activeHolders: priceData?.holders || 1250,
    securityScore: 85,
    liquidity: priceData?.liquidity || 125000
  }

  // Usar historial real o fallback
  const priceChartData = priceHistory.length > 0 ? priceHistory : [
    { time: '00:00', price: 0.0011 },
    { time: '04:00', price: 0.0012 },
    { time: '08:00', price: 0.00115 },
    { time: '12:00', price: 0.0013 },
    { time: '16:00', price: 0.00125 },
    { time: '20:00', price: priceData?.price || 0.001234 },
  ]

  const modules = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Token Analysis",
      description: "Advanced on-chain analysis with real-time metrics",
      link: "/token/0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810",
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      stats: "1,250+ tokens analyzed"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Smart Contract Analyzer",
      description: "Comprehensive security audit and vulnerability detection",
      link: "/contract-analyzer",
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      stats: "85/100 avg score"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Whale Tracker",
      description: "Real-time tracking of large wallet movements",
      link: "/whale-tracker",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      stats: "45 whales tracked"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Social Sentiment",
      description: "AI-powered sentiment analysis from social media",
      link: "/social-sentiment",
      gradient: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
      stats: "+0.75 sentiment"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Strategy Builder",
      description: "Build and backtest trading strategies",
      link: "/strategy-builder",
      gradient: "from-indigo-500/20 to-blue-500/20",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      stats: "12 strategies"
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Technical Analysis",
      description: "Advanced technical indicators and trading signals",
      link: "/technical-analysis",
      gradient: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      stats: "RSI, MACD, Bollinger Bands"
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Portfolio Tracker",
      description: "Track multiple wallets and calculate portfolio value",
      link: "/portfolio",
      gradient: "from-cyan-500/20 to-teal-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      stats: "Multi-wallet tracking"
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/30 glow-effect">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">
                  <span className="text-gradient">MQT Analyzer</span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Professional Crypto Analysis Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/download')}
                className="glass-card text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all border border-primary/30 hover:border-primary/50"
                title="Descargar aplicación"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Descargar App</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQR(true)}
                className="glass-card text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all border border-primary/30 hover:border-primary/50"
                title="Mostrar código QR"
              >
                <QrCode className="w-5 h-5" />
                <span className="hidden sm:inline">QR Code</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/token/0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810')}
                className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all glow-effect"
              >
                <Zap className="w-5 h-5" />
                Quick Analyze
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl p-6 border-l-4 border-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{marketData.priceChange24h}%</span>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Market Cap</h3>
              <p className="text-2xl font-bold">${(marketData.totalMarketCap / 1000).toFixed(1)}K</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <LineChart className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">24h Volume</h3>
              <p className="text-2xl font-bold">${(marketData.totalVolume / 1000).toFixed(1)}K</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Active Holders</h3>
              <p className="text-2xl font-bold">{marketData.activeHolders.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-6 border-l-4 border-yellow-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Security Score</h3>
              <p className="text-2xl font-bold">{marketData.securityScore}/100</p>
            </motion.div>
          </div>

          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">MQT Price Chart (24h)</h2>
                <p className="text-gray-400">Real-time price tracking</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                  +{marketData.priceChange24h}%
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priceChartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C4CC" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C4CC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                  labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00C4CC" 
                  strokeWidth={3}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Premium Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => navigate(module.link)}
              className={`glass-card rounded-xl p-6 cursor-pointer transition-all border ${module.borderColor} hover:border-opacity-60 group`}
            >
              <div className={`mb-4 ${module.iconColor}`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {module.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{module.stats}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download Section - PROMINENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative glass-card rounded-2xl p-8 mb-8 border-2 border-primary/50 overflow-hidden"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 animate-pulse"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex justify-center mb-6"
              >
                <div className="p-6 bg-gradient-to-br from-primary/30 to-blue-500/30 rounded-3xl border-2 border-primary/50 shadow-2xl glow-effect">
                  <Download className="w-16 h-16 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-4xl font-bold mb-3">
                <span className="text-gradient">📥 DESCARGAR APP</span>
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Instala MQT Analyzer en tu dispositivo móvil o desktop
              </p>
              
              {/* Big Download Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/download')}
                  className="gradient-primary text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-4 shadow-2xl hover:shadow-primary/50 transition-all glow-effect min-w-[280px] justify-center"
                >
                  <Download className="w-8 h-8" />
                  DESCARGAR AHORA
                  <ArrowRight className="w-8 h-8" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQR(true)}
                  className="glass-card text-white px-8 py-6 rounded-2xl font-bold text-lg flex items-center gap-3 border-2 border-primary/50 hover:border-primary transition-all min-w-[200px] justify-center"
                >
                  <QrCode className="w-6 h-6" />
                  Ver QR Code
                </motion.button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-gray-800/70 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-300 font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    URL de Descarga:
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    title="Copiar URL"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-sm font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-primary font-mono text-base break-all bg-gray-900/50 px-3 py-2 rounded-lg block">
                  {window.location.origin}
                </code>
              </div>

              <div className="p-5 bg-gray-800/70 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-300 font-semibold flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Página de Descarga Completa:
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/download`)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    title="Copiar URL"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-sm font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-primary font-mono text-base break-all bg-gray-900/50 px-3 py-2 rounded-lg block">
                  {window.location.origin}/download
                </code>
              </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/30 text-center cursor-pointer"
                onClick={() => navigate('/download')}
              >
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Página Completa</p>
                <p className="text-xs text-gray-400">Instrucciones detalladas</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 text-center cursor-pointer"
                onClick={() => setShowQR(true)}
              >
                <QrCode className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">QR Code</p>
                <p className="text-xs text-gray-400">Escanear para móvil</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 text-center cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
              >
                <Copy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Copiar Link</p>
                <p className="text-xs text-gray-400">Compartir URL</p>
              </motion.div>
            </div>

            {/* Render Link Section - PROMINENT */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border-2 border-blue-500/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/30 rounded-xl border border-blue-500/50">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl">🔗 Link de Render</h3>
                    <p className="text-sm text-gray-300">Tu URL pública de producción</p>
                  </div>
                </div>
                <motion.a
                  href="https://render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ir a Render.com
                </motion.a>
              </div>
              
              <div className="p-5 bg-gray-900/70 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">URL de Producción:</p>
                    <code className="text-blue-400 font-mono text-base break-all block bg-gray-800/50 px-4 py-3 rounded-lg">
                      {window.location.hostname.includes('onrender.com') 
                        ? window.location.origin 
                        : 'https://mqt-analyzer.onrender.com'}
                    </code>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const renderUrl = window.location.hostname.includes('onrender.com') 
                        ? window.location.origin 
                        : 'https://mqt-analyzer.onrender.com'
                      navigator.clipboard.writeText(renderUrl)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 flex-shrink-0 shadow-lg"
                    title="Copiar URL de Render"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </motion.button>
                </div>
                
                {!window.location.hostname.includes('onrender.com') && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400 font-semibold mb-2">📝 ¿No tienes tu link de Render?</p>
                    <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside ml-2">
                      <li>Ve a <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">render.com</a> e inicia sesión</li>
                      <li>Busca tu servicio "mqt-analyzer" en el Dashboard</li>
                      <li>Copia la URL que aparece en la parte superior</li>
                      <li>O crea un nuevo Static Site si aún no lo has desplegado</li>
                    </ol>
                  </div>
                )}
                
                {window.location.hostname.includes('onrender.com') && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      ¡Estás usando tu link de Render!
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Esta es tu URL pública de producción
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-3">
                <motion.a
                  href="https://render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2 border border-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Dashboard de Render
                </motion.a>
                <motion.button
                  onClick={() => {
                    const renderUrl = window.location.hostname.includes('onrender.com') 
                      ? window.location.origin 
                      : 'https://mqt-analyzer.onrender.com'
                    window.open(renderUrl, '_blank')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Abrir Link de Render
                </motion.button>
              </div>
            </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Copyright © 2025 LELC & JTH Tecnology. Todos los derechos reservados.</p>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </div>
  )
}
