import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, TrendingDown, Twitter, 
  MessageCircle, Users, BarChart3, AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SocialSentiment() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  // Mock data - En producción vendría de APIs de redes sociales
  const sentimentData = {
    overall: 0.75,
    change24h: 0.12,
    sources: [
      { platform: 'Twitter', sentiment: 0.82, volume: 1250, influencers: 15 },
      { platform: 'Telegram', sentiment: 0.78, volume: 890, influencers: 8 },
      { platform: 'Discord', sentiment: 0.71, volume: 450, influencers: 5 },
      { platform: 'Reddit', sentiment: 0.68, volume: 320, influencers: 12 },
      { platform: 'YouTube', sentiment: 0.73, volume: 180, influencers: 3 },
    ],
    trends: [
      { date: '2025-01-20', sentiment: 0.65, volume: 850 },
      { date: '2025-01-21', sentiment: 0.68, volume: 920 },
      { date: '2025-01-22', sentiment: 0.72, volume: 1100 },
      { date: '2025-01-23', sentiment: 0.74, volume: 1250 },
      { date: '2025-01-24', sentiment: 0.75, volume: 1350 },
      { date: '2025-01-25', sentiment: 0.76, volume: 1400 },
      { date: '2025-01-26', sentiment: 0.75, volume: 1380 },
    ],
    topInfluencers: [
      { name: '@CryptoWhale', followers: 125000, influence: 0.92, sentiment: 0.85, recentPosts: 3 },
      { name: '@TokenAnalyst', followers: 89000, influence: 0.88, sentiment: 0.78, recentPosts: 2 },
      { name: '@DeFiExpert', followers: 67000, influence: 0.85, sentiment: 0.82, recentPosts: 5 },
      { name: '@BlockchainPro', followers: 45000, influence: 0.79, sentiment: 0.71, recentPosts: 1 },
      { name: '@CryptoNews', followers: 32000, influence: 0.75, sentiment: 0.68, recentPosts: 4 },
    ],
    wordCloud: [
      { word: 'Moon', count: 450, sentiment: 0.9 },
      { word: 'Buy', count: 380, sentiment: 0.85 },
      { word: 'Bullish', count: 320, sentiment: 0.88 },
      { word: 'Hold', count: 280, sentiment: 0.7 },
      { word: 'Pump', count: 250, sentiment: 0.92 },
      { word: 'Diamond', count: 220, sentiment: 0.8 },
      { word: 'Gem', count: 200, sentiment: 0.75 },
      { word: 'Rocket', count: 180, sentiment: 0.9 },
    ],
    alerts: [
      { type: 'positive', message: 'Sentiment spike detected: +0.15 in last 2 hours', timestamp: '2h ago' },
      { type: 'influencer', message: '@CryptoWhale posted positive content about MQT', timestamp: '3h ago' },
      { type: 'volume', message: 'Social volume increased 25% in last 24h', timestamp: '5h ago' },
    ]
  }

  const COLORS = ['#00C4CC', '#FF6B6B', '#4CAF50', '#FFA500', '#9C27B0']

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return 'text-green-400'
    if (sentiment >= 0.3) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.7) return 'Very Positive'
    if (sentiment >= 0.3) return 'Neutral'
    return 'Negative'
  }

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Social Sentiment Analysis
              </h1>
              <p className="text-gray-400">
                Analyze sentiment across Twitter, Telegram, Discord, Reddit, and YouTube
              </p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    timeRange === range
                      ? 'bg-primary text-white'
                      : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-primary/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Overall Sentiment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Sentiment</h2>
              <p className="text-gray-400 text-sm">Aggregated sentiment across all platforms</p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getSentimentColor(sentimentData.overall)}`}>
                {sentimentData.overall > 0 ? '+' : ''}{(sentimentData.overall * 100).toFixed(0)}%
              </div>
              <div className="flex items-center gap-1 mt-2">
                {sentimentData.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${sentimentData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(sentimentData.change24h * 100).toFixed(1)}% (24h)
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{getSentimentLabel(sentimentData.overall)}</p>
            </div>
          </div>

          {/* Sentiment Gauge */}
          <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(sentimentData.overall + 1) * 50}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-4 rounded-full ${
                sentimentData.overall >= 0.7 ? 'bg-green-400' :
                sentimentData.overall >= 0.3 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
            />
          </div>
        </motion.div>

        {/* Sentiment Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-4">Sentiment Trend ({timeRange})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentData.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis domain={[-1, 1]} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#00C4CC" 
                strokeWidth={2}
                dot={{ fill: '#00C4CC', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sentiment by Platform */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-4">Sentiment by Platform</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentData.sources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9CA3AF" />
                <YAxis domain={[-1, 1]} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="sentiment" fill="#00C4CC" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-4">Volume by Platform</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData.sources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ platform, volume }) => `${platform}: ${volume}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="volume"
                >
                  {sentimentData.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Influencers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Top Influencers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400">Influencer</th>
                  <th className="text-right py-3 px-4 text-gray-400">Followers</th>
                  <th className="text-right py-3 px-4 text-gray-400">Influence</th>
                  <th className="text-right py-3 px-4 text-gray-400">Sentiment</th>
                  <th className="text-right py-3 px-4 text-gray-400">Recent Posts</th>
                </tr>
              </thead>
              <tbody>
                {sentimentData.topInfluencers.map((influencer, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-semibold">{influencer.name}</td>
                    <td className="text-right py-3 px-4">{influencer.followers.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                        {(influencer.influence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={getSentimentColor(influencer.sentiment)}>
                        {(influencer.sentiment * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">{influencer.recentPosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Word Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-4">Word Cloud</h3>
          <div className="flex flex-wrap gap-3">
            {sentimentData.wordCloud.map((word, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  word.sentiment >= 0.7 ? 'bg-green-400/20 text-green-400' :
                  word.sentiment >= 0.3 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'
                }`}
                style={{ fontSize: `${12 + (word.count / 50)}px` }}
              >
                {word.word} ({word.count})
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        {sentimentData.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Recent Alerts</h3>
            </div>
            <div className="space-y-3">
              {sentimentData.alerts.map((alert, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      alert.type === 'positive' ? 'bg-green-400/20 text-green-400' :
                      alert.type === 'influencer' ? 'bg-blue-400/20 text-blue-400' :
                      'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-xs">{alert.timestamp}</span>
                  </div>
                  <p className="text-gray-300">{alert.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
