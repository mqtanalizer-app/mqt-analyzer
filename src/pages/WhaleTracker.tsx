import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Search, TrendingUp, TrendingDown, 
  AlertTriangle, Activity, Users, DollarSign, 
  Clock, ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Whale {
  address: string
  balance: string
  percentage: number
  size: 'MEGA_WHALE' | 'WHALE' | 'MINI_WHALE' | 'DOLPHIN'
  type: 'exchange' | 'institution' | 'individual' | 'unknown'
  firstSeen: string
  lastMovement: string
  movements: {
    timestamp: string
    type: 'buy' | 'sell' | 'transfer'
    amount: string
    price: number
  }[]
  totalMovements: number
  averageHoldTime: number
  suspiciousScore: number
}

export default function WhaleTracker() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'MEGA_WHALE' | 'WHALE' | 'MINI_WHALE' | 'DOLPHIN'>('all')
  const [sortBy, setSortBy] = useState<'balance' | 'percentage' | 'movements'>('balance')

  // Mock data - En producción vendría de APIs on-chain
  const whales: Whale[] = [
    {
      address: '0x1234567890123456789012345678901234567890',
      balance: '2,500,000',
      percentage: 5.2,
      size: 'MEGA_WHALE',
      type: 'exchange',
      firstSeen: '2024-01-15',
      lastMovement: '2h ago',
      movements: [
        { timestamp: '2025-01-26 10:00', type: 'buy', amount: '50,000', price: 0.0012 },
        { timestamp: '2025-01-25 15:30', type: 'sell', amount: '25,000', price: 0.0013 },
        { timestamp: '2025-01-24 08:00', type: 'buy', amount: '100,000', price: 0.0011 },
      ],
      totalMovements: 45,
      averageHoldTime: 72,
      suspiciousScore: 15,
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      balance: '1,200,000',
      percentage: 2.5,
      size: 'WHALE',
      type: 'institution',
      firstSeen: '2024-02-10',
      lastMovement: '5h ago',
      movements: [
        { timestamp: '2025-01-26 08:00', type: 'buy', amount: '30,000', price: 0.0012 },
        { timestamp: '2025-01-25 12:00', type: 'buy', amount: '20,000', price: 0.00115 },
      ],
      totalMovements: 12,
      averageHoldTime: 168,
      suspiciousScore: 5,
    },
    {
      address: '0x9876543210987654321098765432109876543210',
      balance: '890,000',
      percentage: 1.8,
      size: 'WHALE',
      type: 'individual',
      firstSeen: '2024-03-05',
      lastMovement: '1d ago',
      movements: [
        { timestamp: '2025-01-25 14:00', type: 'sell', amount: '15,000', price: 0.0013 },
        { timestamp: '2025-01-24 10:00', type: 'buy', amount: '25,000', price: 0.0011 },
      ],
      totalMovements: 8,
      averageHoldTime: 240,
      suspiciousScore: 8,
    },
    {
      address: '0xfedcba9876543210fedcba9876543210fedcba98',
      balance: '650,000',
      percentage: 1.3,
      size: 'MINI_WHALE',
      type: 'exchange',
      firstSeen: '2024-04-12',
      lastMovement: '3h ago',
      movements: [
        { timestamp: '2025-01-26 11:00', type: 'buy', amount: '10,000', price: 0.0012 },
        { timestamp: '2025-01-25 16:00', type: 'sell', amount: '5,000', price: 0.00125 },
        { timestamp: '2025-01-24 09:00', type: 'buy', amount: '20,000', price: 0.0011 },
      ],
      totalMovements: 28,
      averageHoldTime: 48,
      suspiciousScore: 35,
    },
    {
      address: '0x2468135790246813579024681357902468135790',
      balance: '450,000',
      percentage: 0.9,
      size: 'MINI_WHALE',
      type: 'individual',
      firstSeen: '2024-05-20',
      lastMovement: '12h ago',
      movements: [
        { timestamp: '2025-01-25 18:00', type: 'buy', amount: '8,000', price: 0.0012 },
      ],
      totalMovements: 5,
      averageHoldTime: 360,
      suspiciousScore: 3,
    },
  ]

  const movementData = [
    { date: '2025-01-20', buys: 125000, sells: 85000 },
    { date: '2025-01-21', buys: 145000, sells: 95000 },
    { date: '2025-01-22', buys: 165000, sells: 110000 },
    { date: '2025-01-23', buys: 180000, sells: 120000 },
    { date: '2025-01-24', buys: 195000, sells: 135000 },
    { date: '2025-01-25', buys: 210000, sells: 150000 },
    { date: '2025-01-26', buys: 225000, sells: 165000 },
  ]

  const filteredWhales = filter === 'all' 
    ? whales 
    : whales.filter(w => w.size === filter)

  const sortedWhales = [...filteredWhales].sort((a, b) => {
    switch (sortBy) {
      case 'balance':
        return parseFloat(b.balance.replace(/,/g, '')) - parseFloat(a.balance.replace(/,/g, ''))
      case 'percentage':
        return b.percentage - a.percentage
      case 'movements':
        return b.totalMovements - a.totalMovements
      default:
        return 0
    }
  })

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'MEGA_WHALE': return 'bg-red-400/20 text-red-400'
      case 'WHALE': return 'bg-orange-400/20 text-orange-400'
      case 'MINI_WHALE': return 'bg-yellow-400/20 text-yellow-400'
      case 'DOLPHIN': return 'bg-blue-400/20 text-blue-400'
      default: return 'bg-gray-400/20 text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exchange': return '🏦'
      case 'institution': return '🏢'
      case 'individual': return '👤'
      default: return '❓'
    }
  }

  const totalHoldings = whales.reduce((sum, w) => sum + parseFloat(w.balance.replace(/,/g, '')), 0)
  const totalPercentage = whales.reduce((sum, w) => sum + w.percentage, 0)
  const totalMovements = whales.reduce((sum, w) => sum + w.totalMovements, 0)

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
                Whale Tracker
              </h1>
              <p className="text-gray-400">
                Track large wallet movements and detect suspicious activity
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-gray-400 text-sm">Total Whales</span>
            </div>
            <p className="text-2xl font-bold">{whales.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-gray-400 text-sm">Total Holdings</span>
            </div>
            <p className="text-2xl font-bold">{(totalHoldings / 1000000).toFixed(2)}M</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-gray-400 text-sm">% of Supply</span>
            </div>
            <p className="text-2xl font-bold">{totalPercentage.toFixed(1)}%</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-gray-400 text-sm">Total Movements</span>
            </div>
            <p className="text-2xl font-bold">{totalMovements}</p>
          </motion.div>
        </div>

        {/* Movement Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-4">Whale Movements (7d)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="buys" fill="#00C4CC" name="Buys" />
              <Bar dataKey="sells" fill="#FF6B6B" name="Sells" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-semibold">Filter:</span>
            </div>
            {(['all', 'MEGA_WHALE', 'WHALE', 'MINI_WHALE', 'DOLPHIN'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-semibold text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="balance">Balance</option>
                <option value="percentage">% of Supply</option>
                <option value="movements">Movements</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Whales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-4">Top Whale Wallets</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400">Address</th>
                  <th className="text-right py-3 px-4 text-gray-400">Balance</th>
                  <th className="text-right py-3 px-4 text-gray-400">% of Supply</th>
                  <th className="text-center py-3 px-4 text-gray-400">Size</th>
                  <th className="text-center py-3 px-4 text-gray-400">Type</th>
                  <th className="text-right py-3 px-4 text-gray-400">Movements</th>
                  <th className="text-right py-3 px-4 text-gray-400">Avg Hold Time</th>
                  <th className="text-right py-3 px-4 text-gray-400">Suspicious</th>
                  <th className="text-left py-3 px-4 text-gray-400">Last Movement</th>
                </tr>
              </thead>
              <tbody>
                {sortedWhales.map((whale, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-mono text-sm">{whale.address.substring(0, 10)}...{whale.address.substring(38)}</td>
                    <td className="text-right py-3 px-4 font-semibold">{whale.balance}</td>
                    <td className="text-right py-3 px-4">{whale.percentage}%</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getSizeColor(whale.size)}`}>
                        {whale.size.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-lg">{getTypeIcon(whale.type)}</span>
                      <span className="ml-2 text-xs text-gray-400">{whale.type}</span>
                    </td>
                    <td className="text-right py-3 px-4">{whale.totalMovements}</td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{whale.averageHoldTime}h</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      {whale.suspiciousScore > 30 ? (
                        <div className="flex items-center justify-end gap-1 text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{whale.suspiciousScore}%</span>
                        </div>
                      ) : (
                        <span className="text-green-400">{whale.suspiciousScore}%</span>
                      )}
                    </td>
                    <td className="text-left py-3 px-4 text-gray-400 text-sm">{whale.lastMovement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Movements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900 rounded-lg p-6 mt-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-4">Recent Movements</h3>
          <div className="space-y-3">
            {whales.flatMap(whale => 
              whale.movements.map((movement, index) => (
                <div key={`${whale.address}-${index}`} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      movement.type === 'buy' ? 'bg-green-400/20' : 'bg-red-400/20'
                    }`}>
                      {movement.type === 'buy' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{movement.type.toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{whale.address.substring(0, 10)}...{whale.address.substring(38)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{movement.amount} MQT</p>
                    <p className="text-xs text-gray-400">${movement.price.toFixed(6)}</p>
                    <p className="text-xs text-gray-500">{movement.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
