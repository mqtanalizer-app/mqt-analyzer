import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, Activity, Shield, BarChart3, Users, Zap,
  DollarSign, AlertCircle, CheckCircle2, 
  ArrowRight, Sparkles, LineChart, QrCode
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import QRCodeModal from '../components/QRCodeModal'

export default function Dashboard() {
  const navigate = useNavigate()
  const [showQR, setShowQR] = useState(false)

  // Datos de mercado en tiempo real
  const marketData = {
    totalMarketCap: 1250000,
    totalVolume: 450000,
    priceChange24h: 12.5,
    activeHolders: 1250,
    securityScore: 85,
    liquidity: 125000
  }

  const priceChartData = [
    { time: '00:00', price: 0.0011 },
    { time: '04:00', price: 0.0012 },
    { time: '08:00', price: 0.00115 },
    { time: '12:00', price: 0.0013 },
    { time: '16:00', price: 0.00125 },
    { time: '20:00', price: 0.001234 },
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
