import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Plus, X, Save, Play, Shield, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Condition {
  id: string
  type: 'technical' | 'sentiment' | 'price' | 'volume' | 'onchain'
  indicator?: string
  operator: '>' | '<' | '>=' | '<=' | '=='
  value: string
  logicalOperator?: 'AND' | 'OR'
}

interface Strategy {
  id: string
  name: string
  entryConditions: Condition[]
  exitConditions: Condition[]
  actions: {
    buyPercentage: number
    stopLoss: number
    takeProfit: number[]
  }
  riskScore: number
  backtestResults?: {
    totalTrades: number
    winRate: number
    profitFactor: number
    sharpeRatio: number
    maxDrawdown: number
  }
  shielded: boolean
}

export default function StrategyBuilder() {
  const navigate = useNavigate()
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'RSI + Sentiment Strategy',
      entryConditions: [
        { id: '1', type: 'technical', indicator: 'RSI', operator: '<', value: '30' },
        { id: '2', type: 'sentiment', operator: '>', value: '0.7', logicalOperator: 'AND' },
      ],
      exitConditions: [
        { id: '3', type: 'technical', indicator: 'RSI', operator: '>', value: '70' },
      ],
      actions: {
        buyPercentage: 2,
        stopLoss: 5,
        takeProfit: [15, 30, 50],
      },
      riskScore: 75,
      backtestResults: {
        totalTrades: 45,
        winRate: 68,
        profitFactor: 1.85,
        sharpeRatio: 1.42,
        maxDrawdown: 12.5,
      },
      shielded: false,
    }
  ])
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [strategyName, setStrategyName] = useState('')
  const [entryConditions, setEntryConditions] = useState<Condition[]>([])
  const [exitConditions, setExitConditions] = useState<Condition[]>([])
  const [buyPercentage, setBuyPercentage] = useState(2)
  const [stopLoss, setStopLoss] = useState(5)
  const [takeProfit, setTakeProfit] = useState([15, 30, 50])
  const [backtesting, setBacktesting] = useState(false)

  const technicalIndicators = ['RSI', 'MACD', 'EMA', 'Bollinger Bands', 'Volume']
  const operators = ['>', '<', '>=', '<=', '==']
  const logicalOperators = ['AND', 'OR']

  const addEntryCondition = () => {
    setEntryConditions([
      ...entryConditions,
      {
        id: Date.now().toString(),
        type: 'technical',
        indicator: 'RSI',
        operator: '<',
        value: '30',
        logicalOperator: entryConditions.length > 0 ? 'AND' : undefined,
      }
    ])
  }

  const removeEntryCondition = (id: string) => {
    setEntryConditions(entryConditions.filter(c => c.id !== id))
  }

  const addExitCondition = () => {
    setExitConditions([
      ...exitConditions,
      {
        id: Date.now().toString(),
        type: 'technical',
        indicator: 'RSI',
        operator: '>',
        value: '70',
      }
    ])
  }

  const removeExitCondition = (id: string) => {
    setExitConditions(exitConditions.filter(c => c.id !== id))
  }

  const runBacktest = async () => {
    setBacktesting(true)
    // Simular backtesting
    await new Promise(resolve => setTimeout(resolve, 2000))
    setBacktesting(false)
  }

  const saveStrategy = () => {
    if (!strategyName || entryConditions.length === 0) return

    const newStrategy: Strategy = {
      id: Date.now().toString(),
      name: strategyName,
      entryConditions,
      exitConditions,
      actions: {
        buyPercentage,
        stopLoss,
        takeProfit,
      },
      riskScore: 75, // Calculado basado en condiciones
      shielded: false,
    }

    setStrategies([...strategies, newStrategy])
    setShowBuilder(false)
    resetForm()
  }

  const resetForm = () => {
    setStrategyName('')
    setEntryConditions([])
    setExitConditions([])
    setBuyPercentage(2)
    setStopLoss(5)
    setTakeProfit([15, 30, 50])
  }

  const toggleShielded = (id: string) => {
    setStrategies(strategies.map(s => 
      s.id === id ? { ...s, shielded: !s.shielded } : s
    ))
  }

  const backtestData = [
    { date: '2024-01', profit: 1250 },
    { date: '2024-02', profit: 1800 },
    { date: '2024-03', profit: 2200 },
    { date: '2024-04', profit: 1950 },
    { date: '2024-05', profit: 2800 },
    { date: '2024-06', profit: 3200 },
  ]

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
                Strategy Builder
              </h1>
              <p className="text-gray-400">
                Build and test trading strategies with technical indicators and sentiment analysis
              </p>
            </div>
            <button
              onClick={() => setShowBuilder(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Strategy
            </button>
          </div>
        </motion.div>

        {/* Strategies List */}
        <div className="space-y-6 mb-6">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{strategy.name}</h3>
                    <p className="text-gray-400 text-sm">Risk Score: {strategy.riskScore}/100</p>
                  </div>
                  {strategy.shielded && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-lg">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs font-semibold">SHIELDED</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleShielded(strategy.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      strategy.shielded
                        ? 'bg-red-400/20 text-red-400 hover:bg-red-400/30'
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    {strategy.shielded ? 'Unshield' : 'Shield'}
                  </button>
                  <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                    Edit
                  </button>
                </div>
              </div>

              {/* Entry Conditions */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">ENTRY CONDITIONS</h4>
                <div className="flex flex-wrap gap-2">
                  {strategy.entryConditions.map((condition, index) => (
                    <div key={condition.id} className="flex items-center gap-2">
                      {index > 0 && (
                        <span className="text-gray-500 font-semibold">{condition.logicalOperator || 'AND'}</span>
                      )}
                      <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
                        {condition.indicator} {condition.operator} {condition.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit Conditions */}
              {strategy.exitConditions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">EXIT CONDITIONS</h4>
                  <div className="flex flex-wrap gap-2">
                    {strategy.exitConditions.map((condition) => (
                      <span key={condition.id} className="px-3 py-1 bg-gray-800 rounded-lg text-sm">
                        {condition.indicator} {condition.operator} {condition.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Buy %</p>
                  <p className="font-semibold">{strategy.actions.buyPercentage}%</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Stop Loss</p>
                  <p className="font-semibold">-{strategy.actions.stopLoss}%</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Take Profit</p>
                  <p className="font-semibold">{strategy.actions.takeProfit.join(', ')}%</p>
                </div>
              </div>

              {/* Backtest Results */}
              {strategy.backtestResults && (
                <div className="border-t border-gray-800 pt-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">BACKTEST RESULTS</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Total Trades</p>
                      <p className="font-semibold">{strategy.backtestResults.totalTrades}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Win Rate</p>
                      <p className="font-semibold text-green-400">{strategy.backtestResults.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Profit Factor</p>
                      <p className="font-semibold">{strategy.backtestResults.profitFactor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Sharpe Ratio</p>
                      <p className="font-semibold">{strategy.backtestResults.sharpeRatio}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Max Drawdown</p>
                      <p className="font-semibold text-red-400">-{strategy.backtestResults.maxDrawdown}%</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Strategy Builder Modal */}
        <AnimatePresence>
          {showBuilder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowBuilder(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Build New Strategy</h2>
                  <button
                    onClick={() => setShowBuilder(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Strategy Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Strategy Name</label>
                  <input
                    type="text"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    placeholder="e.g., RSI + Sentiment Strategy"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Entry Conditions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold">Entry Conditions</label>
                    <button
                      onClick={addEntryCondition}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {entryConditions.map((condition, index) => (
                      <div key={condition.id} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                        {index > 0 && (
                          <select
                            value={condition.logicalOperator || 'AND'}
                            onChange={(e) => {
                              const updated = [...entryConditions]
                              updated[index].logicalOperator = e.target.value as 'AND' | 'OR'
                              setEntryConditions(updated)
                            }}
                            className="px-2 py-1 bg-gray-700 rounded text-sm text-white"
                          >
                            {logicalOperators.map(op => (
                              <option key={op} value={op}>{op}</option>
                            ))}
                          </select>
                        )}
                        <select
                          value={condition.type}
                          onChange={(e) => {
                            const updated = [...entryConditions]
                            updated[index].type = e.target.value as any
                            setEntryConditions(updated)
                          }}
                          className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                        >
                          <option value="technical">Technical</option>
                          <option value="sentiment">Sentiment</option>
                          <option value="price">Price</option>
                          <option value="volume">Volume</option>
                          <option value="onchain">On-Chain</option>
                        </select>
                        {condition.type === 'technical' && (
                          <select
                            value={condition.indicator || 'RSI'}
                            onChange={(e) => {
                              const updated = [...entryConditions]
                              updated[index].indicator = e.target.value
                              setEntryConditions(updated)
                            }}
                            className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                          >
                            {technicalIndicators.map(ind => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                        )}
                        <select
                          value={condition.operator}
                          onChange={(e) => {
                            const updated = [...entryConditions]
                            updated[index].operator = e.target.value as any
                            setEntryConditions(updated)
                          }}
                          className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                        >
                          {operators.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => {
                            const updated = [...entryConditions]
                            updated[index].value = e.target.value
                            setEntryConditions(updated)
                          }}
                          placeholder="Value"
                          className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm text-white placeholder-gray-500"
                        />
                        <button
                          onClick={() => removeEntryCondition(condition.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exit Conditions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold">Exit Conditions</label>
                    <button
                      onClick={addExitCondition}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {exitConditions.map((condition) => (
                      <div key={condition.id} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                        <select
                          value={condition.type}
                          onChange={(e) => {
                            const updated = [...exitConditions]
                            const index = updated.findIndex(c => c.id === condition.id)
                            updated[index].type = e.target.value as any
                            setExitConditions(updated)
                          }}
                          className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                        >
                          <option value="technical">Technical</option>
                          <option value="sentiment">Sentiment</option>
                          <option value="price">Price</option>
                        </select>
                        {condition.type === 'technical' && (
                          <select
                            value={condition.indicator || 'RSI'}
                            onChange={(e) => {
                              const updated = [...exitConditions]
                              const index = updated.findIndex(c => c.id === condition.id)
                              updated[index].indicator = e.target.value
                              setExitConditions(updated)
                            }}
                            className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                          >
                            {technicalIndicators.map(ind => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                        )}
                        <select
                          value={condition.operator}
                          onChange={(e) => {
                            const updated = [...exitConditions]
                            const index = updated.findIndex(c => c.id === condition.id)
                            updated[index].operator = e.target.value as any
                            setExitConditions(updated)
                          }}
                          className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                        >
                          {operators.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => {
                            const updated = [...exitConditions]
                            const index = updated.findIndex(c => c.id === condition.id)
                            updated[index].value = e.target.value
                            setExitConditions(updated)
                          }}
                          placeholder="Value"
                          className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm text-white placeholder-gray-500"
                        />
                        <button
                          onClick={() => removeExitCondition(condition.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">Actions</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Buy Percentage (%)</label>
                      <input
                        type="number"
                        value={buyPercentage}
                        onChange={(e) => setBuyPercentage(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Stop Loss (%)</label>
                      <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Take Profit (%)</label>
                      <input
                        type="text"
                        value={takeProfit.join(', ')}
                        onChange={(e) => setTakeProfit(e.target.value.split(',').map(v => Number(v.trim())))}
                        placeholder="15, 30, 50"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={runBacktest}
                    disabled={backtesting || entryConditions.length === 0}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-5 h-5" />
                    {backtesting ? 'Running Backtest...' : 'Run Backtest'}
                  </button>
                  <button
                    onClick={saveStrategy}
                    disabled={!strategyName || entryConditions.length === 0}
                    className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    Save Strategy
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
