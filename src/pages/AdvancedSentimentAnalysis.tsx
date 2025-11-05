import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, TrendingDown, MessageSquare, 
  Twitter, MessageCircle, Newspaper, Activity, BarChart3,
  AlertCircle, CheckCircle2, XCircle
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine
} from 'recharts'
import { sentimentAnalysisService, type SentimentData } from '../services/sentimentAnalysis'

export default function AdvancedSentimentAnalysis() {
  const navigate = useNavigate()
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [history, setHistory] = useState<Array<{ timestamp: Date; score: number; volume: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await sentimentAnalysisService.getSentimentAnalysis()
        setSentiment(data)

        const hist = await sentimentAnalysisService.getSentimentHistory(24)
        setHistory(hist)
      } catch (error) {
        console.error('Error fetching sentiment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  if (loading || !sentiment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Analizando sentimiento...</p>
        </div>
      </div>
    )
  }

  const sentimentScore = sentiment.score
  const sentimentLabel = sentimentScore > 0.3 ? 'Positivo' : sentimentScore < -0.3 ? 'Negativo' : 'Neutral'
  const sentimentColor = sentimentScore > 0.3 ? 'text-green-400' : sentimentScore < -0.3 ? 'text-red-400' : 'text-yellow-400'

  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: h.score,
    volume: h.volume
  }))

  const trendsData = [
    { name: 'Alcista', value: sentiment.trends.bullish * 100, color: '#22C55E' },
    { name: 'Neutral', value: sentiment.trends.neutral * 100, color: '#F59E0B' },
    { name: 'Bajista', value: sentiment.trends.bearish * 100, color: '#EF4444' }
  ]

  const sourcesData = sentiment.sources.twitter ? [
    { name: 'Twitter', score: sentiment.sources.twitter.score, mentions: sentiment.sources.twitter.mentions },
    { name: 'Reddit', score: sentiment.sources.reddit?.score || 0, mentions: sentiment.sources.reddit?.mentions || 0 },
    { name: 'Telegram', score: sentiment.sources.telegram?.score || 0, mentions: sentiment.sources.telegram?.mentions || 0 },
    { name: 'News', score: sentiment.sources.news?.score || 0, mentions: sentiment.sources.news?.mentions || 0 },
    { name: 'On-Chain', score: sentiment.sources.onChain?.score || 0, mentions: sentiment.sources.onChain?.mentions || 0 }
  ] : []

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

          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Análisis de Sentimiento Avanzado</span>
            </h1>
            <p className="text-gray-400">NLP-powered sentiment analysis from multiple sources</p>
          </div>
        </motion.div>

        {/* Overall Sentiment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 mb-8 border-l-4 border-primary"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Sentimiento General</h2>
              <p className="text-gray-400">Análisis agregado de múltiples fuentes</p>
            </div>
            <div className={`text-6xl font-bold ${sentimentColor}`}>
              {sentimentScore > 0 ? '+' : ''}{(sentimentScore * 100).toFixed(1)}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Score</div>
              <div className={`text-3xl font-bold ${sentimentColor}`}>
                {sentimentScore.toFixed(3)}
              </div>
              <div className="text-sm text-gray-500 mt-2">{sentimentLabel}</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Magnitud</div>
              <div className="text-3xl font-bold text-blue-400">
                {(sentiment.magnitude * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-2">Intensidad</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Confianza</div>
              <div className="text-3xl font-bold text-purple-400">
                {(sentiment.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-2">Basado en volumen</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Fuentes</div>
              <div className="text-3xl font-bold text-cyan-400">
                {Object.values(sentiment.sources).filter(s => s).length}
              </div>
              <div className="text-sm text-gray-500 mt-2">Activas</div>
            </div>
          </div>
        </motion.div>

        {/* Sentiment Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Distribución de Sentimiento</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trendsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trendsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Historial de Sentimiento (24h)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C4CC" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00C4CC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis domain={[-1, 1]} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#00C4CC" 
                  fill="url(#sentimentGradient)" 
                  strokeWidth={2}
                />
                <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Sentiment by Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Sentimiento por Fuente</h2>
          <div className="space-y-4">
            {sentiment.sources.twitter && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Twitter</h3>
                      <p className="text-sm text-gray-400">{sentiment.sources.twitter.mentions} menciones</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    sentiment.sources.twitter.score > 0 ? 'text-green-400' : 
                    sentiment.sources.twitter.score < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {sentiment.sources.twitter.score > 0 ? '+' : ''}{(sentiment.sources.twitter.score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">✅ {sentiment.sources.twitter.positive} positivos</span>
                  <span className="text-red-400">❌ {sentiment.sources.twitter.negative} negativos</span>
                  <span className="text-gray-400">⚪ {sentiment.sources.twitter.neutral} neutrales</span>
                </div>
              </div>
            )}

            {sentiment.sources.reddit && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Reddit</h3>
                      <p className="text-sm text-gray-400">{sentiment.sources.reddit.mentions} menciones</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    sentiment.sources.reddit.score > 0 ? 'text-green-400' : 
                    sentiment.sources.reddit.score < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {sentiment.sources.reddit.score > 0 ? '+' : ''}{(sentiment.sources.reddit.score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">✅ {sentiment.sources.reddit.positive} positivos</span>
                  <span className="text-red-400">❌ {sentiment.sources.reddit.negative} negativos</span>
                  <span className="text-gray-400">⚪ {sentiment.sources.reddit.neutral} neutrales</span>
                </div>
              </div>
            )}

            {sentiment.sources.telegram && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Telegram</h3>
                      <p className="text-sm text-gray-400">{sentiment.sources.telegram.mentions} menciones</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    sentiment.sources.telegram.score > 0 ? 'text-green-400' : 
                    sentiment.sources.telegram.score < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {sentiment.sources.telegram.score > 0 ? '+' : ''}{(sentiment.sources.telegram.score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">✅ {sentiment.sources.telegram.positive} positivos</span>
                  <span className="text-red-400">❌ {sentiment.sources.telegram.negative} negativos</span>
                  <span className="text-gray-400">⚪ {sentiment.sources.telegram.neutral} neutrales</span>
                </div>
              </div>
            )}

            {sentiment.sources.news && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Newspaper className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">News</h3>
                      <p className="text-sm text-gray-400">{sentiment.sources.news.mentions} artículos</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    sentiment.sources.news.score > 0 ? 'text-green-400' : 
                    sentiment.sources.news.score < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {sentiment.sources.news.score > 0 ? '+' : ''}{(sentiment.sources.news.score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">✅ {sentiment.sources.news.positive} positivos</span>
                  <span className="text-red-400">❌ {sentiment.sources.news.negative} negativos</span>
                  <span className="text-gray-400">⚪ {sentiment.sources.news.neutral} neutrales</span>
                </div>
              </div>
            )}

            {sentiment.sources.onChain && (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">On-Chain</h3>
                      <p className="text-sm text-gray-400">{sentiment.sources.onChain.mentions} métricas</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    sentiment.sources.onChain.score > 0 ? 'text-green-400' : 
                    sentiment.sources.onChain.score < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {sentiment.sources.onChain.score > 0 ? '+' : ''}{(sentiment.sources.onChain.score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">✅ {sentiment.sources.onChain.positive} positivos</span>
                  <span className="text-red-400">❌ {sentiment.sources.onChain.negative} negativos</span>
                  <span className="text-gray-400">⚪ {sentiment.sources.onChain.neutral} neutrales</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Keywords */}
        {sentiment.keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Palabras Clave</h2>
            <div className="flex flex-wrap gap-3">
              {sentiment.keywords.map((keyword, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    keyword.sentiment > 0.3 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : keyword.sentiment < -0.3
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {keyword.word} ({keyword.sentiment > 0 ? '+' : ''}{(keyword.sentiment * 100).toFixed(0)}%)
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

