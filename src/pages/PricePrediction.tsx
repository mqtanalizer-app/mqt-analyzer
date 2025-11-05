import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, TrendingDown, Brain, Target,
  AlertTriangle, CheckCircle2, XCircle, BarChart3, Zap, Clock
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, ComposedChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { pricePredictionService, type PricePrediction } from '../services/pricePrediction'
import { priceService } from '../services/priceService'

export default function PricePrediction() {
  const navigate = useNavigate()
  const [prediction, setPrediction] = useState<PricePrediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const priceData = await priceService.getAggregatedPrice()
        const history = await priceService.getPriceHistory(100)
        const prices = history.map(h => h.price)
        
        const pred = await pricePredictionService.getPricePrediction(
          priceData.price,
          prices,
          0.65, // sentiment score
          0.60  // technical score
        )
        setPrediction(pred)
      } catch (error) {
        console.error('Error fetching prediction:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Generando predicciones...</p>
        </div>
      </div>
    )
  }

  const predictionsData = [
    {
      timeframe: prediction.predictions.shortTerm.timeframe,
      current: prediction.currentPrice,
      predicted: prediction.predictions.shortTerm.price,
      change: prediction.predictions.shortTerm.changePercent,
      confidence: prediction.predictions.shortTerm.confidence
    },
    {
      timeframe: prediction.predictions.mediumTerm.timeframe,
      current: prediction.currentPrice,
      predicted: prediction.predictions.mediumTerm.price,
      change: prediction.predictions.mediumTerm.changePercent,
      confidence: prediction.predictions.mediumTerm.confidence
    },
    {
      timeframe: prediction.predictions.longTerm.timeframe,
      current: prediction.currentPrice,
      predicted: prediction.predictions.longTerm.price,
      change: prediction.predictions.longTerm.changePercent,
      confidence: prediction.predictions.longTerm.confidence
    }
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
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gradient">Predicciones de Precio</span>
              </h1>
              <p className="text-gray-400">Machine Learning-powered price predictions</p>
            </div>
          </div>
        </motion.div>

        {/* Model Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8 border-l-4 border-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{prediction.model.name}</h2>
              <p className="text-gray-400">Versión {prediction.model.version}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{Math.round(prediction.model.accuracy * 100)}%</div>
              <div className="text-sm text-gray-400">Precisión del Modelo</div>
            </div>
          </div>
        </motion.div>

        {/* Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold">Corto Plazo</h3>
                <p className="text-sm text-gray-400">{prediction.predictions.shortTerm.timeframe}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">
                ${prediction.predictions.shortTerm.price.toFixed(6)}
              </div>
              <div className={`text-lg font-semibold ${
                prediction.predictions.shortTerm.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {prediction.predictions.shortTerm.changePercent >= 0 ? '+' : ''}
                {prediction.predictions.shortTerm.changePercent.toFixed(2)}%
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Confianza</span>
              <span className="font-semibold text-primary">
                {(prediction.predictions.shortTerm.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold">Medio Plazo</h3>
                <p className="text-sm text-gray-400">{prediction.predictions.mediumTerm.timeframe}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">
                ${prediction.predictions.mediumTerm.price.toFixed(6)}
              </div>
              <div className={`text-lg font-semibold ${
                prediction.predictions.mediumTerm.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {prediction.predictions.mediumTerm.changePercent >= 0 ? '+' : ''}
                {prediction.predictions.mediumTerm.changePercent.toFixed(2)}%
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Confianza</span>
              <span className="font-semibold text-primary">
                {(prediction.predictions.mediumTerm.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold">Largo Plazo</h3>
                <p className="text-sm text-gray-400">{prediction.predictions.longTerm.timeframe}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">
                ${prediction.predictions.longTerm.price.toFixed(6)}
              </div>
              <div className={`text-lg font-semibold ${
                prediction.predictions.longTerm.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {prediction.predictions.longTerm.changePercent >= 0 ? '+' : ''}
                {prediction.predictions.longTerm.changePercent.toFixed(2)}%
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Confianza</span>
              <span className="font-semibold text-primary">
                {(prediction.predictions.longTerm.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Escenarios de Precio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-400">Escenario Alcista</h3>
              </div>
              <div className="text-3xl font-bold mb-4">
                ${prediction.scenarios.bullish.price.toFixed(6)}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Probabilidad</span>
                  <span className="font-bold text-green-400">
                    {(prediction.scenarios.bullish.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${prediction.scenarios.bullish.probability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {prediction.scenarios.bullish.conditions.map((condition, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {condition}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-yellow-400">Escenario Neutral</h3>
              </div>
              <div className="text-3xl font-bold mb-4">
                ${prediction.scenarios.neutral.price.toFixed(6)}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Probabilidad</span>
                  <span className="font-bold text-yellow-400">
                    {(prediction.scenarios.neutral.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${prediction.scenarios.neutral.probability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {prediction.scenarios.neutral.conditions.map((condition, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    {condition}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-red-500/10 rounded-xl border border-red-500/30">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-400">Escenario Bajista</h3>
              </div>
              <div className="text-3xl font-bold mb-4">
                ${prediction.scenarios.bearish.price.toFixed(6)}
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Probabilidad</span>
                  <span className="font-bold text-red-400">
                    {(prediction.scenarios.bearish.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${prediction.scenarios.bearish.probability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {prediction.scenarios.bearish.conditions.map((condition, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <XCircle className="w-4 h-4 text-red-400" />
                    {condition}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Prediction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Predicciones Visualizadas</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={predictionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timeframe" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151', 
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <ReferenceLine 
                y={prediction.currentPrice} 
                stroke="#00C4CC" 
                strokeDasharray="3 3" 
                label={{ value: "Precio Actual", position: "right" }}
              />
              <Area 
                type="monotone" 
                dataKey="current" 
                fill="#00C4CC" 
                fillOpacity={0.3}
                stroke="#00C4CC" 
                strokeWidth={2}
                name="Precio Actual"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ fill: '#4CAF50', r: 6 }}
                name="Precio Predicho"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

