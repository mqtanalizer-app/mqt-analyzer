import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, 
  AlertTriangle, CheckCircle2, Zap, Target, Gauge, LineChart,
  Shield, DollarSign, Volume2, Layers
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, Line, AreaChart, Area, 
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { priceService, type TokenPriceData } from '../services/priceService'
import { technicalAnalysisService, type TechnicalIndicators } from '../services/technicalAnalysis'
import { alertService, type Alert } from '../services/alertService'

export default function AdvancedTechnicalAnalysis() {
  const navigate = useNavigate()
  const [priceData, setPriceData] = useState<TokenPriceData | null>(null)
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null)
  const [signals, setSignals] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'1h' | '4h' | '24h' | '7d'>('24h')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const price = await priceService.getAggregatedPrice()
        setPriceData(price)

        // Generate mock price history for technical analysis
        const history = await priceService.getPriceHistory(100)
        const priceDataPoints = history.map((item, index) => ({
          timestamp: Date.now() - (history.length - index) * 60000,
          price: item.price,
          volume: Math.random() * 100000 + 50000,
          high: item.price * 1.02,
          low: item.price * 0.98,
          open: index > 0 ? history[index - 1].price : item.price,
          close: item.price
        }))

        const techAnalysis = technicalAnalysisService.getCompleteAnalysis(priceDataPoints)
        setIndicators(techAnalysis)

        const tradingSignals = technicalAnalysisService.generateSignals(techAnalysis)
        setSignals(tradingSignals)

        // Check alerts
        if (price) {
          await alertService.checkAlerts({
            price: price.price,
            priceChange24h: price.priceChange24h,
            volume24h: price.volume24h,
            rsi: techAnalysis.rsi,
            macd: techAnalysis.macd
          })
        }
      } catch (error) {
        console.error('Error fetching technical analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [timeframe])

  if (loading || !indicators || !priceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando análisis técnico avanzado...</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = Array.from({ length: 50 }, (_, i) => {
    const basePrice = priceData.price
    const variation = (Math.sin(i / 5) * 0.05) + (Math.random() * 0.02 - 0.01)
    return {
      time: `${i}:00`,
      price: basePrice * (1 + variation),
      upper: indicators.bollingerBands.upper,
      middle: indicators.bollingerBands.middle,
      lower: indicators.bollingerBands.lower,
      ema9: indicators.ema.ema9,
      ema21: indicators.ema.ema21
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gradient">Análisis Técnico Avanzado</span>
              </h1>
              <p className="text-gray-400">Indicadores profesionales y señales de trading</p>
            </div>
            <div className="flex gap-2">
              {(['1h', '4h', '24h', '7d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    timeframe === tf
                      ? 'gradient-primary text-white'
                      : 'glass-card text-gray-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trading Signals */}
        {signals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-8 border-l-4 border-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Señales de Trading</h2>
                <p className="text-gray-400">Análisis automático basado en indicadores técnicos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className={`p-4 rounded-xl border-2 ${
                signals.buy 
                  ? 'bg-green-500/20 border-green-500/50' 
                  : 'bg-gray-800/50 border-gray-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Señal</span>
                  {signals.buy && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {signals.buy ? 'COMPRAR' : signals.sell ? 'VENDER' : 'MANTENER'}
                </div>
                <div className="text-sm text-gray-400">
                  Confianza: {signals.confidence}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="text-gray-400 mb-2">Tendencia</div>
                <div className={`text-2xl font-bold mb-1 ${
                  indicators.trend === 'bullish' ? 'text-green-400' : 
                  indicators.trend === 'bearish' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {indicators.trend === 'bullish' ? 'ALCISTA' : 
                   indicators.trend === 'bearish' ? 'BAJISTA' : 'NEUTRAL'}
                </div>
                <div className="text-sm text-gray-400">
                  Fuerza: {indicators.strength}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="text-gray-400 mb-2">RSI</div>
                <div className={`text-2xl font-bold mb-1 ${
                  indicators.rsi < 30 ? 'text-green-400' :
                  indicators.rsi > 70 ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {indicators.rsi.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">
                  {indicators.rsi < 30 ? 'Oversold' : 
                   indicators.rsi > 70 ? 'Overbought' : 'Neutral'}
                </div>
              </div>
            </div>

            {signals.signals.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-400 mb-2">Señales Detectadas:</div>
                {signals.signals.map((signal: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">{signal}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Advanced Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Gráfico Avanzado con Indicadores</h2>
              <p className="text-gray-400">Precio, Bollinger Bands, y EMAs</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C4CC" stopOpacity={0.4}/>
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
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="price" 
                fill="url(#priceGradient)" 
                stroke="#00C4CC" 
                strokeWidth={2}
                name="Precio"
              />
              <Line 
                type="monotone" 
                dataKey="upper" 
                stroke="#EF4444" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                name="Bollinger Superior"
              />
              <Line 
                type="monotone" 
                dataKey="middle" 
                stroke="#9CA3AF" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                name="SMA 20"
              />
              <Line 
                type="monotone" 
                dataKey="lower" 
                stroke="#22C55E" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                name="Bollinger Inferior"
              />
              <Line 
                type="monotone" 
                dataKey="ema9" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
                name="EMA 9"
              />
              <Line 
                type="monotone" 
                dataKey="ema21" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
                name="EMA 21"
              />
              <ReferenceLine 
                y={priceData.price} 
                stroke="#00C4CC" 
                strokeDasharray="3 3" 
                label={{ value: "Precio Actual", position: "right" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Technical Indicators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* RSI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">RSI (14)</h3>
                <p className="text-sm text-gray-400">Relative Strength Index</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-32 bg-gray-800 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-4xl font-bold ${
                    indicators.rsi < 30 ? 'text-green-400' :
                    indicators.rsi > 70 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {indicators.rsi.toFixed(1)}
                  </div>
                </div>
                <div 
                  className={`absolute bottom-0 left-0 h-full transition-all ${
                    indicators.rsi < 30 ? 'bg-green-500/30' :
                    indicators.rsi > 70 ? 'bg-red-500/30' : 'bg-yellow-500/30'
                  }`}
                  style={{ width: `${indicators.rsi}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>0 (Oversold)</span>
                <span>50</span>
                <span>100 (Overbought)</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">
                {indicators.rsi < 30 && 'Señal de compra: RSI en zona de sobreventa'}
                {indicators.rsi > 70 && 'Señal de venta: RSI en zona de sobrecompra'}
                {indicators.rsi >= 30 && indicators.rsi <= 70 && 'RSI en zona neutra'}
              </div>
            </div>
          </motion.div>

          {/* MACD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">MACD</h3>
                <p className="text-sm text-gray-400">Moving Average Convergence Divergence</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">MACD</span>
                <span className={`font-bold ${
                  indicators.macd.macd > indicators.macd.signal ? 'text-green-400' : 'text-red-400'
                }`}>
                  {indicators.macd.macd.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Signal</span>
                <span className="font-bold text-gray-300">
                  {indicators.macd.signal.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Histogram</span>
                <span className={`font-bold ${
                  indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {indicators.macd.histogram > 0 ? '+' : ''}{indicators.macd.histogram.toFixed(6)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">
                {indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal
                  ? 'Cruce alcista detectado - Señal de compra'
                  : 'Cruce bajista o neutral'}
              </div>
            </div>
          </motion.div>

          {/* Bollinger Bands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Bollinger Bands</h3>
                <p className="text-sm text-gray-400">Volatility Indicator</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <span className="text-gray-400">Banda Superior</span>
                <span className="font-bold text-red-400">
                  ${indicators.bollingerBands.upper.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/30">
                <span className="text-gray-400">Media (SMA 20)</span>
                <span className="font-bold text-gray-300">
                  ${indicators.bollingerBands.middle.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <span className="text-gray-400">Banda Inferior</span>
                <span className="font-bold text-green-400">
                  ${indicators.bollingerBands.lower.toFixed(6)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">
                Precio actual: ${priceData.price.toFixed(6)}
                {priceData.price > indicators.bollingerBands.upper && ' - Por encima de banda superior'}
                {priceData.price < indicators.bollingerBands.lower && ' - Por debajo de banda inferior'}
                {priceData.price >= indicators.bollingerBands.lower && priceData.price <= indicators.bollingerBands.upper && ' - Dentro de las bandas'}
              </div>
            </div>
          </motion.div>

          {/* Support & Resistance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Target className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Soporte y Resistencia</h3>
                <p className="text-sm text-gray-400">Niveles clave de precio</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <span className="text-gray-400">Nivel de Resistencia</span>
                <span className="font-bold text-green-400">
                  ${indicators.resistance.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/30">
                <span className="text-gray-400">Precio Actual</span>
                <span className="font-bold text-gray-300">
                  ${priceData.price.toFixed(6)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <span className="text-gray-400">Nivel de Soporte</span>
                <span className="font-bold text-red-400">
                  ${indicators.support.toFixed(6)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-300">
                Distancia a resistencia: {(((priceData.price - indicators.resistance) / indicators.resistance) * 100).toFixed(2)}%
                <br />
                Distancia a soporte: {(((priceData.price - indicators.support) / indicators.support) * 100).toFixed(2)}%
              </div>
            </div>
          </motion.div>
        </div>

        {/* Moving Averages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Medias Móviles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">EMA 9</div>
              <div className="text-2xl font-bold text-yellow-400">
                ${indicators.ema.ema9.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">EMA 21</div>
              <div className="text-2xl font-bold text-purple-400">
                ${indicators.ema.ema21.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">EMA 50</div>
              <div className="text-2xl font-bold text-blue-400">
                ${indicators.ema.ema50.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">EMA 200</div>
              <div className="text-2xl font-bold text-cyan-400">
                ${indicators.ema.ema200.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">SMA 20</div>
              <div className="text-2xl font-bold text-orange-400">
                ${indicators.sma.sma20.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">SMA 50</div>
              <div className="text-2xl font-bold text-pink-400">
                ${indicators.sma.sma50.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">SMA 200</div>
              <div className="text-2xl font-bold text-indigo-400">
                ${indicators.sma.sma200.toFixed(6)}
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Precio Actual</div>
              <div className="text-2xl font-bold text-primary">
                ${priceData.price.toFixed(6)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

