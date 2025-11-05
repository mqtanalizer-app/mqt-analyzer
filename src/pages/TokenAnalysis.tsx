import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Search, TrendingUp, TrendingDown, 
  DollarSign, Users, Activity, Shield, Copy, ExternalLink,
  CheckCircle2, AlertTriangle, Zap, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts'

export default function TokenAnalysis() {
  const { address } = useParams<{ address: string }>()
  const navigate = useNavigate()
  const [tokenAddress, setTokenAddress] = useState(address || '0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mock data - En producción vendría de APIs
  const tokenData = {
    name: 'MQT',
    symbol: 'MQT',
    price: 0.001234,
    priceChange24h: 12.5,
    marketCap: 1250000,
    volume24h: 450000,
    liquidity: 125000,
    holders: 1250,
    securityScore: 85,
    supply: {
      total: '1,000,000,000',
      circulating: '950,000,000',
      burned: '50,000,000'
    },
    contractAddress: '0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810',
    network: 'Avalanche C-Chain',
    explorer: 'https://snowtrace.io/address/0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810'
  }

  const priceData = [
    { time: '00:00', price: 0.0011, volume: 45000 },
    { time: '04:00', price: 0.0012, volume: 52000 },
    { time: '08:00', price: 0.00115, volume: 48000 },
    { time: '12:00', price: 0.0013, volume: 65000 },
    { time: '16:00', price: 0.00125, volume: 58000 },
    { time: '20:00', price: 0.001234, volume: 62000 },
  ]

  const whales = [
    { address: '0x1234...5678', balance: '1,200,000', percentage: 2.5, type: 'Exchange', risk: 'Low' },
    { address: '0xabcd...efgh', balance: '890,000', percentage: 1.8, type: 'Institution', risk: 'Low' },
    { address: '0x9876...5432', balance: '650,000', percentage: 1.3, type: 'Individual', risk: 'Medium' },
    { address: '0xfedc...ba98', balance: '450,000', percentage: 0.9, type: 'Exchange', risk: 'Low' },
    { address: '0x2468...1357', balance: '320,000', percentage: 0.6, type: 'Individual', risk: 'Low' },
  ]

  const holderDistribution = [
    { name: 'Top 10', value: 15, color: '#00C4CC' },
    { name: 'Top 50', value: 25, color: '#4CAF50' },
    { name: 'Top 100', value: 20, color: '#FFA500' },
    { name: 'Rest', value: 40, color: '#9CA3AF' }
  ]

  const securityMetrics = [
    { name: 'Ownership', score: 100, status: 'Safe' },
    { name: 'Reentrancy', score: 95, status: 'Safe' },
    { name: 'Liquidity', score: 90, status: 'Safe' },
    { name: 'Mint Function', score: 100, status: 'Safe' },
    { name: 'Pause Function', score: 70, status: 'Medium' },
  ]

  const handleSearch = () => {
    if (tokenAddress) {
      navigate(`/token/${tokenAddress}`)
      setLoading(true)
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(tokenData.contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-primary mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="text-gradient">Token Analysis</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Advanced on-chain analysis with real-time metrics
              </p>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token contract address (0x...)"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={loading}
                  className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all glow-effect disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  {loading ? 'Analyzing...' : 'Analyze'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Token Header Card Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 mb-8 border-l-4 border-primary"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl border border-primary/30 glow-effect">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-2">{tokenData.name} ({tokenData.symbol})</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400 text-sm font-mono">{tokenData.contractAddress.substring(0, 10)}...{tokenData.contractAddress.substring(34)}</span>
                    <button
                      onClick={copyAddress}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <a
                      href={tokenData.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold border border-blue-500/30">
                    {tokenData.network}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-gradient mb-2">
                ${tokenData.price.toFixed(6)}
              </div>
              <div className={`flex items-center justify-end gap-2 text-lg font-semibold ${tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tokenData.priceChange24h >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span>+{Math.abs(tokenData.priceChange24h)}% (24h)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+5.2%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Market Cap</h3>
            <p className="text-3xl font-bold">${(tokenData.marketCap / 1000000).toFixed(2)}M</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+15.1%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">24h Volume</h3>
            <p className="text-3xl font-bold">${(tokenData.volume24h / 1000).toFixed(0)}K</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+2.3%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Liquidity</h3>
            <p className="text-3xl font-bold">${(tokenData.liquidity / 1000).toFixed(0)}K</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+8.5%</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Holders</h3>
            <p className="text-3xl font-bold">{tokenData.holders.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Charts Row Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price Chart Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <LineChart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Price Chart (24h)</h3>
                  <p className="text-gray-400 text-sm">Real-time price tracking</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={priceData}>
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
                  dot={{ fill: '#00C4CC', r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Holder Distribution Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <PieChartIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Holder Distribution</h3>
                  <p className="text-gray-400 text-sm">Token distribution analysis</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={holderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {holderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Security Score & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Security Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Security Score</h3>
                <p className="text-gray-400 text-sm">Contract security analysis</p>
              </div>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="90%" 
                    data={[{ name: 'Score', value: tokenData.securityScore, fill: '#00C4CC' }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">{tokenData.securityScore}</div>
                    <div className="text-gray-400 text-sm">/ 100</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {securityMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">{metric.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.score >= 90 ? 'bg-green-500' :
                          metric.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{metric.score}%</span>
                    {metric.status === 'Safe' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Supply Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Token Supply</h3>
                <p className="text-gray-400 text-sm">Supply distribution</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-xl font-bold">{tokenData.supply.total}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Circulating Supply</span>
                  <span className="text-xl font-bold">{tokenData.supply.circulating}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '95%' }}
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Burned</span>
                  <span className="text-xl font-bold text-red-400">{tokenData.supply.burned}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: '5%' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Whales Table Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Top Whale Wallets</h3>
              <p className="text-gray-400 text-sm">Large wallet holders analysis</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-semibold border border-primary/30 hover:bg-primary/30 transition-colors">Top 10</button>
              <button className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Top 50</button>
              <button className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Top 100</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Rank</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Address</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Balance</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">% of Supply</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Type</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {whales.map((whale, index) => (
                  <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">{whale.address}</td>
                    <td className="text-right py-4 px-4 font-semibold">{whale.balance}</td>
                    <td className="text-right py-4 px-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-semibold">
                        {whale.percentage}%
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="px-3 py-1 bg-gray-800/50 rounded-lg text-sm">
                        {whale.type}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      {whale.risk === 'Low' ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                          Low
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold">
                          Medium
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
