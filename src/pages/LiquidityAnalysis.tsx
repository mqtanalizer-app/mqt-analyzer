import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Waves, TrendingUp, TrendingDown, DollarSign,
  BarChart3, Activity, Target, AlertTriangle, CheckCircle2
} from 'lucide-react'
import { 
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { liquidityAnalysisService, type LiquidityData } from '../services/liquidityAnalysis'
import { priceService } from '../services/priceService'

export default function LiquidityAnalysis() {
  const navigate = useNavigate()
  const [liquidity, setLiquidity] = useState<LiquidityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const priceData = await priceService.getAggregatedPrice()
        const supply = 1000000000 // 1 billion MQT
        const data = await liquidityAnalysisService.getLiquidityAnalysis(priceData.price, supply)
        setLiquidity(data)
      } catch (error) {
        console.error('Error fetching liquidity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !liquidity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Analizando liquidez...</p>
        </div>
      </div>
    )
  }

  const depthBuyData = liquidity.depth.buy.slice(0, 10).map(level => ({
    price: level.price.toFixed(6),
    amount: level.amount,
    cumulative: level.cumulative
  }))

  const depthSellData = liquidity.depth.sell.slice(0, 10).map(level => ({
    price: level.price.toFixed(6),
    amount: level.amount,
    cumulative: level.cumulative
  }))

  const poolsData = liquidity.liquidityBreakdown.map(pool => ({
    name: pool.dex,
    liquidity: pool.liquidityUSD,
    volume: pool.volume24h,
    apr: pool.apr
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Análisis de Liquidez</span>
            </h1>
            <p className="text-gray-400">Profundidad de mercado y análisis de liquidez</p>
          </div>
        </motion.div>

        {/* Liquidity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card rounded-xl p-6 border-l-4 border-blue-500">
            <div className="p-3 bg-blue-500/20 rounded-xl mb-4">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Liquidez Total</h3>
            <p className="text-3xl font-bold">${(liquidity.liquidityUSD / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-400 mt-2">USD</p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-green-500">
            <div className="p-3 bg-green-500/20 rounded-xl mb-4">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Estabilidad</h3>
            <p className="text-3xl font-bold">{liquidity.stability.score}/100</p>
            <p className="text-sm text-gray-400 mt-2">Score</p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-purple-500">
            <div className="p-3 bg-purple-500/20 rounded-xl mb-4">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Distribución</h3>
            <p className="text-3xl font-bold">{(liquidity.concentration.distribution * 100).toFixed(0)}%</p>
            <p className="text-sm text-gray-400 mt-2">Concentración</p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-orange-500">
            <div className="p-3 bg-orange-500/20 rounded-xl mb-4">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Pools</h3>
            <p className="text-3xl font-bold">{liquidity.liquidityBreakdown.length}</p>
            <p className="text-sm text-gray-400 mt-2">Activos</p>
          </div>
        </motion.div>

        {/* Price Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Impacto de Precio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Compras</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">1% del supply</span>
                  <span className="font-bold text-green-400">
                    +{liquidity.impact.buy1Percent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">5% del supply</span>
                  <span className="font-bold text-green-400">
                    +{liquidity.impact.buy5Percent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">10% del supply</span>
                  <span className="font-bold text-green-400">
                    +{liquidity.impact.buy10Percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400">Ventas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">1% del supply</span>
                  <span className="font-bold text-red-400">
                    {liquidity.impact.sell1Percent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">5% del supply</span>
                  <span className="font-bold text-red-400">
                    {liquidity.impact.sell5Percent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">10% del supply</span>
                  <span className="font-bold text-red-400">
                    {liquidity.impact.sell10Percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liquidity Pools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Liquidez por DEX</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={poolsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151', 
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="liquidity" fill="#00C4CC" radius={[8, 8, 0, 0]} name="Liquidez (USD)" />
              <Bar dataKey="volume" fill="#4CAF50" radius={[8, 8, 0, 0]} name="Volumen 24h" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {liquidity.liquidityBreakdown.map((pool, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{pool.dex}</h3>
                    <p className="text-sm text-gray-400">Fee: {pool.fee}% | APR: {pool.apr}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${(pool.liquidityUSD / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-400">Liquidez</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-400">Volumen 24h: <span className="text-white font-semibold">${(pool.volume24h / 1000).toFixed(0)}K</span></span>
                  <span className="text-gray-400">APR: <span className="text-green-400 font-semibold">{pool.apr}%</span></span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stability Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Factores de Estabilidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Profundidad</div>
              <div className="text-3xl font-bold text-blue-400">{liquidity.stability.factors.depth}%</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Distribución</div>
              <div className="text-3xl font-bold text-green-400">{liquidity.stability.factors.distribution}%</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Volumen</div>
              <div className="text-3xl font-bold text-purple-400">{liquidity.stability.factors.volume}%</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Concentración</div>
              <div className="text-3xl font-bold text-orange-400">{liquidity.stability.factors.concentration}%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

