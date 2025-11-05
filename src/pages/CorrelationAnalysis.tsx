import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, TrendingDown, Link2, Shield,
  AlertTriangle, BarChart3, Activity, Target
} from 'lucide-react'
import { 
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { correlationAnalysisService, type CorrelationData } from '../services/correlationAnalysis'
import { priceService } from '../services/priceService'

export default function CorrelationAnalysis() {
  const navigate = useNavigate()
  const [correlation, setCorrelation] = useState<CorrelationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const priceData = await priceService.getAggregatedPrice()
        const history = await priceService.getPriceHistory(100)
        const pricePoints = history.map((h, i) => ({
          timestamp: new Date(Date.now() - (history.length - i) * 60000),
          price: h.price
        }))
        
        const corr = await correlationAnalysisService.getCorrelationAnalysis(pricePoints)
        setCorrelation(corr)
      } catch (error) {
        console.error('Error fetching correlation:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !correlation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Analizando correlaciones...</p>
        </div>
      </div>
    )
  }

  const correlationsData = correlation.correlations.map(c => ({
    name: c.asset,
    correlation: c.correlation * 100,
    significance: c.significance * 100
  }))

  const marketData = [
    { name: 'Bitcoin', correlation: correlation.marketCorrelation.bitcoin * 100 },
    { name: 'Ethereum', correlation: correlation.marketCorrelation.ethereum * 100 },
    { name: 'AVAX', correlation: correlation.marketCorrelation.avax * 100 },
    { name: 'Market Index', correlation: correlation.marketCorrelation.marketIndex * 100 }
  ]

  const sectorData = [
    { name: 'DeFi', correlation: correlation.sectorCorrelation.defi * 100 },
    { name: 'Layer 1', correlation: correlation.sectorCorrelation.layer1 * 100 },
    { name: 'Exchange', correlation: correlation.sectorCorrelation.exchange * 100 },
    { name: 'Gaming', correlation: correlation.sectorCorrelation.gaming * 100 }
  ]

  const riskData = [
    { name: 'Market Risk', value: correlation.riskFactors.marketRisk * 100 },
    { name: 'Sector Risk', value: correlation.riskFactors.sectorRisk * 100 },
    { name: 'Liquidity Risk', value: correlation.riskFactors.liquidityRisk * 100 },
    { name: 'Volatility Risk', value: correlation.riskFactors.volatilityRisk * 100 }
  ]

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

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gradient">Análisis de Correlación</span>
              </h1>
              <p className="text-gray-400">Correlación con tokens, mercados e índices</p>
            </div>
          </div>
        </motion.div>

        {/* Diversification Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8 border-l-4 border-primary"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Score de Diversificación</h2>
              <p className="text-gray-400">{correlation.diversification.recommendation}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-primary">{correlation.diversification.score}/100</div>
              <div className="text-sm text-gray-400">Diversificación</div>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-primary to-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${correlation.diversification.score}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Market Correlations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Correlación con Mercados</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis domain={[-100, 100]} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Bar 
                  dataKey="correlation" 
                  fill="#00C4CC" 
                  radius={[8, 8, 0, 0]}
                  name="Correlación (%)"
                />
                <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Correlación por Sector</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Bar 
                  dataKey="correlation" 
                  fill="#4CAF50" 
                  radius={[8, 8, 0, 0]}
                  name="Correlación (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Factores de Riesgo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {riskData.map((risk, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">{risk.name}</div>
                <div className="text-3xl font-bold mb-2">
                  {risk.value.toFixed(0)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      risk.value < 30 ? 'bg-green-500' :
                      risk.value < 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${risk.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Correlations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Correlaciones Detalladas</h2>
          <div className="space-y-4">
            {correlation.correlations.map((corr, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{corr.asset}</h3>
                    <p className="text-sm text-gray-400">{corr.type} • {corr.timeframe}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      corr.correlation > 0.5 ? 'text-green-400' :
                      corr.correlation < -0.5 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {(corr.correlation * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Significancia: {(corr.significance * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      corr.correlation > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.abs(corr.correlation) * 100}%`,
                      marginLeft: corr.correlation < 0 ? 'auto' : '0'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

