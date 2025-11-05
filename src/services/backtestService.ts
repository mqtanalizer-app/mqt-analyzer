/**
 * Backtesting Engine
 * Test trading strategies on historical data
 */

export interface Strategy {
  id: string
  name: string
  entryConditions: {
    rsi?: { below?: number; above?: number }
    macd?: { bullish?: boolean; bearish?: boolean }
    price?: { above?: number; below?: number }
    volume?: { above?: number }
  }
  exitConditions: {
    takeProfit?: number // percentage
    stopLoss?: number // percentage
    rsi?: { above?: number; below?: number }
    time?: number // hours
  }
  positionSize: number // percentage of capital
  maxPositions: number
}

export interface Trade {
  id: string
  entryPrice: number
  exitPrice?: number
  entryTime: Date
  exitTime?: Date
  amount: number
  type: 'long' | 'short'
  profit?: number
  profitPercent?: number
  status: 'open' | 'closed' | 'stopped'
  reason?: string
}

export interface BacktestResult {
  strategy: Strategy
  startDate: Date
  endDate: Date
  initialCapital: number
  finalCapital: number
  totalReturn: number
  totalReturnPercent: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  averageProfit: number
  averageLoss: number
  profitFactor: number
  maxDrawdown: number
  maxDrawdownPercent: number
  sharpeRatio: number
  trades: Trade[]
}

export interface PriceData {
  timestamp: number
  price: number
  volume: number
  high: number
  low: number
  open: number
  close: number
  indicators?: {
    rsi?: number
    macd?: { macd: number; signal: number; histogram: number }
  }
}

class BacktestService {
  /**
   * Run Backtest
   */
  runBacktest(
    strategy: Strategy,
    data: PriceData[],
    initialCapital: number = 10000
  ): BacktestResult {
    const trades: Trade[] = []
    let capital = initialCapital
    let openPositions: Trade[] = []
    let maxCapital = initialCapital
    let maxDrawdown = 0
    let maxDrawdownPercent = 0

    for (let i = 1; i < data.length; i++) {
      const current = data[i]
      const previous = data[i - 1]

      // Check entry conditions
      if (this.checkEntryConditions(strategy, current, previous, openPositions.length < strategy.maxPositions)) {
        const positionSize = capital * (strategy.positionSize / 100)
        const amount = positionSize / current.price

        const trade: Trade = {
          id: `trade-${i}-${Date.now()}`,
          entryPrice: current.price,
          entryTime: new Date(current.timestamp),
          amount,
          type: 'long',
          status: 'open'
        }

        openPositions.push(trade)
        trades.push(trade)
        capital -= positionSize
      }

      // Check exit conditions for open positions
      for (let j = openPositions.length - 1; j >= 0; j--) {
        const trade = openPositions[j]
        const exitReason = this.checkExitConditions(strategy, current, trade, i)

        if (exitReason) {
          trade.exitPrice = current.price
          trade.exitTime = new Date(current.timestamp)
          trade.status = exitReason.includes('Stop Loss') ? 'stopped' : 'closed'
          trade.reason = exitReason

          const profit = trade.amount * (current.price - trade.entryPrice)
          trade.profit = profit
          trade.profitPercent = ((current.price - trade.entryPrice) / trade.entryPrice) * 100

          capital += trade.amount * current.price
          openPositions.splice(j, 1)

          // Update max drawdown
          if (capital > maxCapital) {
            maxCapital = capital
          } else {
            const drawdown = maxCapital - capital
            const drawdownPercent = ((maxCapital - capital) / maxCapital) * 100
            if (drawdown > maxDrawdown) {
              maxDrawdown = drawdown
            }
            if (drawdownPercent > maxDrawdownPercent) {
              maxDrawdownPercent = drawdownPercent
            }
          }
        }
      }
    }

    // Close remaining positions
    for (const trade of openPositions) {
      const lastPrice = data[data.length - 1]
      trade.exitPrice = lastPrice.price
      trade.exitTime = new Date(lastPrice.timestamp)
      trade.status = 'closed'
      trade.reason = 'End of backtest'

      const profit = trade.amount * (lastPrice.price - trade.entryPrice)
      trade.profit = profit
      trade.profitPercent = ((lastPrice.price - trade.entryPrice) / trade.entryPrice) * 100

      capital += trade.amount * lastPrice.price
    }

    // Calculate statistics
    const closedTrades = trades.filter(t => t.status !== 'open')
    const winningTrades = closedTrades.filter(t => (t.profit || 0) > 0)
    const losingTrades = closedTrades.filter(t => (t.profit || 0) <= 0)

    const totalReturn = capital - initialCapital
    const totalReturnPercent = (totalReturn / initialCapital) * 100
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0

    const totalProfit = winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0)
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0))
    const averageProfit = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0
    const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0

    // Calculate Sharpe Ratio (simplified)
    const returns = closedTrades.map(t => (t.profitPercent || 0) / 100)
    const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0
    const variance = returns.length > 0 
      ? returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length 
      : 0
    const stdDev = Math.sqrt(variance)
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0

    return {
      strategy,
      startDate: new Date(data[0].timestamp),
      endDate: new Date(data[data.length - 1].timestamp),
      initialCapital,
      finalCapital: capital,
      totalReturn,
      totalReturnPercent,
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      averageProfit,
      averageLoss,
      profitFactor,
      maxDrawdown,
      maxDrawdownPercent,
      sharpeRatio,
      trades
    }
  }

  /**
   * Check Entry Conditions
   */
  private checkEntryConditions(
    strategy: Strategy,
    current: PriceData,
    previous: PriceData,
    canEnter: boolean
  ): boolean {
    if (!canEnter) return false

    const conditions = strategy.entryConditions

    // RSI conditions
    if (conditions.rsi) {
      if (conditions.rsi.below && (!current.indicators?.rsi || current.indicators.rsi >= conditions.rsi.below)) {
        return false
      }
      if (conditions.rsi.above && (!current.indicators?.rsi || current.indicators.rsi <= conditions.rsi.above)) {
        return false
      }
    }

    // MACD conditions
    if (conditions.macd) {
      if (conditions.macd.bullish && 
          (!current.indicators?.macd || 
           current.indicators.macd.macd <= current.indicators.macd.signal ||
           !previous.indicators?.macd ||
           previous.indicators.macd.macd >= previous.indicators.macd.signal)) {
        return false
      }
      if (conditions.macd.bearish && 
          (!current.indicators?.macd || 
           current.indicators.macd.macd >= current.indicators.macd.signal)) {
        return false
      }
    }

    // Price conditions
    if (conditions.price) {
      if (conditions.price.above && current.price <= conditions.price.above) {
        return false
      }
      if (conditions.price.below && current.price >= conditions.price.below) {
        return false
      }
    }

    // Volume conditions
    if (conditions.volume?.above && current.volume < conditions.volume.above) {
      return false
    }

    return true
  }

  /**
   * Check Exit Conditions
   */
  private checkExitConditions(
    strategy: Strategy,
    current: PriceData,
    trade: Trade,
    index: number
  ): string | null {
    const exit = strategy.exitConditions
    const priceChange = ((current.price - trade.entryPrice) / trade.entryPrice) * 100

    // Take Profit
    if (exit.takeProfit && priceChange >= exit.takeProfit) {
      return `Take Profit (${priceChange.toFixed(2)}%)`
    }

    // Stop Loss
    if (exit.stopLoss && priceChange <= -exit.stopLoss) {
      return `Stop Loss (${priceChange.toFixed(2)}%)`
    }

    // RSI Exit
    if (exit.rsi) {
      if (exit.rsi.above && current.indicators?.rsi && current.indicators.rsi >= exit.rsi.above) {
        return `RSI Exit (RSI: ${current.indicators.rsi.toFixed(2)})`
      }
      if (exit.rsi.below && current.indicators?.rsi && current.indicators.rsi <= exit.rsi.below) {
        return `RSI Exit (RSI: ${current.indicators.rsi.toFixed(2)})`
      }
    }

    // Time Exit
    if (exit.time) {
      const hoursHeld = (current.timestamp - trade.entryTime.getTime()) / (1000 * 60 * 60)
      if (hoursHeld >= exit.time) {
        return `Time Exit (${hoursHeld.toFixed(1)}h)`
      }
    }

    return null
  }

  /**
   * Optimize Strategy Parameters
   */
  optimizeStrategy(
    baseStrategy: Omit<Strategy, 'id'>,
    data: PriceData[],
    parameterRanges: {
      rsi?: { min: number; max: number; step: number }
      takeProfit?: { min: number; max: number; step: number }
      stopLoss?: { min: number; max: number; step: number }
    }
  ): Strategy {
    let bestStrategy: Strategy | null = null
    let bestReturn = -Infinity

    // Simple grid search (in production, use more sophisticated optimization)
    const rsiRange = parameterRanges.rsi
      ? Array.from({ length: Math.floor((parameterRanges.rsi.max - parameterRanges.rsi.min) / parameterRanges.rsi.step) + 1 }, 
          (_, i) => parameterRanges.rsi!.min + i * parameterRanges.rsi!.step)
      : [30]

    const takeProfitRange = parameterRanges.takeProfit
      ? Array.from({ length: Math.floor((parameterRanges.takeProfit.max - parameterRanges.takeProfit.min) / parameterRanges.takeProfit.step) + 1 },
          (_, i) => parameterRanges.takeProfit!.min + i * parameterRanges.takeProfit!.step)
      : [10]

    const stopLossRange = parameterRanges.stopLoss
      ? Array.from({ length: Math.floor((parameterRanges.stopLoss.max - parameterRanges.stopLoss.min) / parameterRanges.stopLoss.step) + 1 },
          (_, i) => parameterRanges.stopLoss!.min + i * parameterRanges.stopLoss!.step)
      : [5]

    for (const rsi of rsiRange) {
      for (const tp of takeProfitRange) {
        for (const sl of stopLossRange) {
          const testStrategy: Strategy = {
            ...baseStrategy,
            id: `test-${Date.now()}`,
            entryConditions: {
              ...baseStrategy.entryConditions,
              rsi: parameterRanges.rsi ? { below: rsi } : baseStrategy.entryConditions.rsi
            },
            exitConditions: {
              ...baseStrategy.exitConditions,
              takeProfit: tp,
              stopLoss: sl
            }
          }

          const result = this.runBacktest(testStrategy, data, 10000)
          
          if (result.totalReturnPercent > bestReturn) {
            bestReturn = result.totalReturnPercent
            bestStrategy = testStrategy
          }
        }
      }
    }

    return bestStrategy || { ...baseStrategy, id: `optimized-${Date.now()}` }
  }
}

export const backtestService = new BacktestService()

