import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Plus, Wallet as WalletIcon, TrendingUp, TrendingDown, 
  DollarSign, PieChart, BarChart3, Activity, Trash2, Edit2
} from 'lucide-react'
import { 
  PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { portfolioService, type Portfolio, type Wallet } from '../services/portfolioService'
import { priceService } from '../services/priceService'

export default function PortfolioTracker() {
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newWallet, setNewWallet] = useState({ address: '', name: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portfolioService.initialize()
    loadData()

    // Update portfolio every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const currentPrice = await priceService.getAggregatedPrice()
      const portfolioData = portfolioService.getPortfolio(currentPrice.price)
      setPortfolio(portfolioData)
      setWallets(portfolioService.getWallets())
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWallet = () => {
    if (!newWallet.address || !newWallet.name) return

    portfolioService.addWallet(newWallet.address, newWallet.name)
    loadData()
    setShowAddModal(false)
    setNewWallet({ address: '', name: '' })
  }

  const handleDeleteWallet = (id: string) => {
    portfolioService.removeWallet(id)
    loadData()
  }

  if (loading || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando portafolio...</p>
        </div>
      </div>
    )
  }

  const walletData = wallets.map(w => ({
    name: w.name,
    value: w.valueUSD,
    tokens: w.tokens
  }))

  const COLORS = ['#00C4CC', '#4CAF50', '#FFA500', '#EF4444', '#8B5CF6', '#F59E0B']

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
                <span className="text-gradient">Portfolio Tracker</span>
              </h1>
              <p className="text-gray-400">Rastrea múltiples wallets y calcula tu portafolio</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all glow-effect"
            >
              <Plus className="w-5 h-5" />
              Agregar Wallet
            </motion.button>
          </div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className={`text-right ${portfolio.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolio.profitLoss >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Valor Total</h3>
            <p className="text-3xl font-bold">${portfolio.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={`text-sm mt-2 ${portfolio.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolio.profitLoss >= 0 ? '+' : ''}{portfolio.profitLossPercent.toFixed(2)}%
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-green-500">
            <div className="p-3 bg-green-500/20 rounded-xl mb-4">
              <WalletIcon className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Total Tokens</h3>
            <p className="text-3xl font-bold">{portfolio.totalTokens.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-gray-400 mt-2">MQT</p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-purple-500">
            <div className="p-3 bg-purple-500/20 rounded-xl mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Precio Promedio</h3>
            <p className="text-3xl font-bold">${portfolio.averageEntryPrice.toFixed(6)}</p>
            <p className="text-sm text-gray-400 mt-2">Precio de entrada</p>
          </div>

          <div className="glass-card rounded-xl p-6 border-l-4 border-orange-500">
            <div className="p-3 bg-orange-500/20 rounded-xl mb-4">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-2">Wallets</h3>
            <p className="text-3xl font-bold">{wallets.length}</p>
            <p className="text-sm text-gray-400 mt-2">Activas</p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Distribución del Portafolio</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={walletData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {walletData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Wallet Value Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Valor por Wallet</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={walletData}>
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
                <Bar dataKey="value" fill="#00C4CC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Wallets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Wallets</h2>
          {wallets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <WalletIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">No hay wallets agregadas</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-xl transition-all glow-effect"
              >
                <Plus className="w-5 h-5" />
                Agregar Primera Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <WalletIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{wallet.name}</h3>
                          <p className="text-sm text-gray-400 font-mono">{wallet.address}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Tokens</p>
                          <p className="font-bold">{wallet.tokens.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Valor USD</p>
                          <p className="font-bold">${wallet.valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Red</p>
                          <p className="font-bold text-sm">{wallet.network}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors ml-4"
                      title="Eliminar wallet"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Wallet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Agregar Wallet</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                  placeholder="Mi Wallet Principal"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={newWallet.address}
                  onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                  placeholder="0x..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800/50 text-gray-400 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddWallet}
                className="flex-1 gradient-primary text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transition-all glow-effect"
              >
                Agregar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

