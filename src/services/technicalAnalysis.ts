/**
 * Advanced Technical Analysis Service
 * Implements professional-grade technical indicators
 */

export interface TechnicalIndicators {
  rsi: number
  macd: {
    macd: number
    signal: number
    histogram: number
  }
  bollingerBands: {
    upper: number
    middle: number
    lower: number
  }
  ema: {
    ema9: number
    ema21: number
    ema50: number
    ema200: number
  }
  sma: {
    sma20: number
    sma50: number
    sma200: number
  }
  volume: {
    volumeMA: number
    volumeRatio: number
  }
  support: number
  resistance: number
  trend: 'bullish' | 'bearish' | 'neutral'
  strength: number // 0-100
}

export interface PriceDataPoint {
  timestamp: number
  price: number
  volume: number
  high: number
  low: number
  open: number
  close: number
}

class TechnicalAnalysisService {
  /**
   * Calculate RSI (Relative Strength Index)
   */
  calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50

    const gains: number[] = []
    const losses: number[] = []

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }

    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

    for (let i = period; i < gains.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period
    }

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26

    // Calculate signal line (EMA of MACD with period 9)
    const macdValues = prices.map((_, i) => {
      if (i < 26) return 0
      const ema12Val = this.calculateEMA(prices.slice(0, i + 1), 12)
      const ema26Val = this.calculateEMA(prices.slice(0, i + 1), 26)
      return ema12Val - ema26Val
    }).filter(v => v !== 0)

    const signal = macdValues.length > 0 
      ? this.calculateEMA(macdValues, 9)
      : macd

    return {
      macd,
      signal,
      histogram: macd - signal
    }
  }

  /**
   * Calculate Bollinger Bands
   */
  calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2): {
    upper: number
    middle: number
    lower: number
  } {
    if (prices.length < period) {
      const currentPrice = prices[prices.length - 1]
      return {
        upper: currentPrice * 1.1,
        middle: currentPrice,
        lower: currentPrice * 0.9
      }
    }

    const sma = this.calculateSMA(prices, period)
    const slice = prices.slice(-period)
    
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period
    const standardDeviation = Math.sqrt(variance)

    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    }
  }

  /**
   * Calculate EMA (Exponential Moving Average)
   */
  calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) {
      return prices.reduce((a, b) => a + b, 0) / prices.length
    }

    const multiplier = 2 / (period + 1)
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier))
    }

    return ema
  }

  /**
   * Calculate SMA (Simple Moving Average)
   */
  calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) {
      return prices.reduce((a, b) => a + b, 0) / prices.length
    }
    const slice = prices.slice(-period)
    return slice.reduce((a, b) => a + b, 0) / period
  }

  /**
   * Calculate Support and Resistance levels
   */
  calculateSupportResistance(prices: number[]): { support: number; resistance: number } {
    if (prices.length < 20) {
      const currentPrice = prices[prices.length - 1]
      return {
        support: currentPrice * 0.95,
        resistance: currentPrice * 1.05
      }
    }

    const sorted = [...prices].sort((a, b) => a - b)
    const support = sorted[Math.floor(sorted.length * 0.1)]
    const resistance = sorted[Math.floor(sorted.length * 0.9)]

    return { support, resistance }
  }

  /**
   * Calculate Volume Analysis
   */
  calculateVolumeAnalysis(volumes: number[], prices: number[]): {
    volumeMA: number
    volumeRatio: number
  } {
    if (volumes.length === 0) {
      return { volumeMA: 0, volumeRatio: 1 }
    }

    const volumeMA = this.calculateSMA(volumes, 20)
    const currentVolume = volumes[volumes.length - 1] || 0
    const volumeRatio = volumeMA > 0 ? currentVolume / volumeMA : 1

    return { volumeMA, volumeRatio }
  }

  /**
   * Determine Trend and Strength
   */
  determineTrend(prices: number[], indicators: Partial<TechnicalIndicators>): {
    trend: 'bullish' | 'bearish' | 'neutral'
    strength: number
  } {
    if (prices.length < 20) {
      return { trend: 'neutral', strength: 50 }
    }

    const currentPrice = prices[prices.length - 1]
    const sma20 = indicators.sma?.sma20 || currentPrice
    const sma50 = indicators.sma?.sma50 || currentPrice
    const ema21 = indicators.ema?.ema21 || currentPrice
    const rsi = indicators.rsi || 50

    let bullishSignals = 0
    let bearishSignals = 0

    // Price above/below SMAs
    if (currentPrice > sma20) bullishSignals++
    else bearishSignals++

    if (currentPrice > sma50) bullishSignals++
    else bearishSignals++

    if (currentPrice > ema21) bullishSignals++
    else bearishSignals++

    // RSI signals
    if (rsi > 50) bullishSignals++
    else bearishSignals++

    if (rsi > 70) bearishSignals++ // Overbought
    if (rsi < 30) bullishSignals++ // Oversold

    // MACD signals
    if (indicators.macd && indicators.macd.histogram > 0) bullishSignals++
    else if (indicators.macd) bearishSignals++

    const totalSignals = bullishSignals + bearishSignals
    const strength = totalSignals > 0 
      ? Math.round((Math.max(bullishSignals, bearishSignals) / totalSignals) * 100)
      : 50

    let trend: 'bullish' | 'bearish' | 'neutral'
    if (bullishSignals > bearishSignals) trend = 'bullish'
    else if (bearishSignals > bullishSignals) trend = 'bearish'
    else trend = 'neutral'

    return { trend, strength }
  }

  /**
   * Get Complete Technical Analysis
   */
  getCompleteAnalysis(data: PriceDataPoint[]): TechnicalIndicators {
    const prices = data.map(d => d.close || d.price)
    const volumes = data.map(d => d.volume)

    const rsi = this.calculateRSI(prices)
    const macd = this.calculateMACD(prices)
    const bollingerBands = this.calculateBollingerBands(prices)
    const { support, resistance } = this.calculateSupportResistance(prices)
    const volumeAnalysis = this.calculateVolumeAnalysis(volumes, prices)

    const ema = {
      ema9: this.calculateEMA(prices, 9),
      ema21: this.calculateEMA(prices, 21),
      ema50: this.calculateEMA(prices, 50),
      ema200: this.calculateEMA(prices, 200)
    }

    const sma = {
      sma20: this.calculateSMA(prices, 20),
      sma50: this.calculateSMA(prices, 50),
      sma200: this.calculateSMA(prices, 200)
    }

    const indicators: Partial<TechnicalIndicators> = {
      rsi,
      macd,
      bollingerBands,
      ema,
      sma,
      volume: volumeAnalysis,
      support,
      resistance
    }

    const { trend, strength } = this.determineTrend(prices, indicators)

    return {
      rsi,
      macd,
      bollingerBands,
      ema,
      sma,
      volume: volumeAnalysis,
      support,
      resistance,
      trend,
      strength
    }
  }

  /**
   * Generate Trading Signals
   */
  generateSignals(indicators: TechnicalIndicators): {
    buy: boolean
    sell: boolean
    hold: boolean
    confidence: number
    signals: string[]
  } {
    const signals: string[] = []
    let buyScore = 0
    let sellScore = 0

    // RSI signals
    if (indicators.rsi < 30) {
      signals.push('RSI Oversold - Potential Buy')
      buyScore += 2
    } else if (indicators.rsi > 70) {
      signals.push('RSI Overbought - Potential Sell')
      sellScore += 2
    }

    // MACD signals
    if (indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal) {
      signals.push('MACD Bullish Crossover')
      buyScore += 2
    } else if (indicators.macd.histogram < 0 && indicators.macd.macd < indicators.macd.signal) {
      signals.push('MACD Bearish Crossover')
      sellScore += 1
    }

    // Bollinger Bands signals
    const currentPrice = (indicators.bollingerBands.upper + indicators.bollingerBands.lower) / 2
    if (currentPrice < indicators.bollingerBands.lower) {
      signals.push('Price Below Lower Bollinger Band - Potential Buy')
      buyScore += 1
    } else if (currentPrice > indicators.bollingerBands.upper) {
      signals.push('Price Above Upper Bollinger Band - Potential Sell')
      sellScore += 1
    }

    // EMA signals
    if (indicators.ema.ema9 > indicators.ema.ema21 && indicators.ema.ema21 > indicators.ema.ema50) {
      signals.push('EMA Bullish Alignment')
      buyScore += 1
    } else if (indicators.ema.ema9 < indicators.ema.ema21 && indicators.ema.ema21 < indicators.ema.ema50) {
      signals.push('EMA Bearish Alignment')
      sellScore += 1
    }

    // Trend signals
    if (indicators.trend === 'bullish' && indicators.strength > 70) {
      signals.push(`Strong ${indicators.trend} Trend`)
      buyScore += 1
    } else if (indicators.trend === 'bearish' && indicators.strength > 70) {
      signals.push(`Strong ${indicators.trend} Trend`)
      sellScore += 1
    }

    const buy = buyScore > sellScore && buyScore >= 3
    const sell = sellScore > buyScore && sellScore >= 2
    const hold = !buy && !sell

    const confidence = Math.min(Math.max(buyScore + sellScore, 0), 100)

    return {
      buy,
      sell,
      hold,
      confidence,
      signals
    }
  }
}

export const technicalAnalysisService = new TechnicalAnalysisService()
