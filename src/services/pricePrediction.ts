/**
 * Price Prediction Service
 * Machine Learning-based price predictions
 */

export interface PricePrediction {
  currentPrice: number
  predictions: {
    shortTerm: {
      price: number
      change: number
      changePercent: number
      confidence: number
      timeframe: string // e.g., "1 hour", "4 hours"
    }
    mediumTerm: {
      price: number
      change: number
      changePercent: number
      confidence: number
      timeframe: string
    }
    longTerm: {
      price: number
      change: number
      changePercent: number
      confidence: number
      timeframe: string
    }
  }
  scenarios: {
    bullish: {
      price: number
      probability: number
      conditions: string[]
    }
    bearish: {
      price: number
      probability: number
      conditions: string[]
    }
    neutral: {
      price: number
      probability: number
      conditions: string[]
    }
  }
  factors: {
    technical: number // 0-1, weight of technical indicators
    sentiment: number // 0-1, weight of sentiment
    volume: number // 0-1, weight of volume
    onChain: number // 0-1, weight of on-chain metrics
  }
  model: {
    name: string
    version: string
    accuracy: number
    lastTraining: Date
  }
  lastUpdated: Date
}

export interface PredictionHistory {
  timestamp: Date
  predicted: number
  actual: number | null
  error: number | null
}

class PricePredictionService {
  private predictionCache: PricePrediction | null = null
  private cacheExpiry: number = 60000 // 1 minute
  private lastFetch: number = 0

  /**
   * Simple Linear Regression (for demonstration)
   * In production, use TensorFlow.js or similar ML library
   */
  private simpleLinearRegression(
    prices: number[],
    periods: number
  ): number {
    if (prices.length < 2) return prices[prices.length - 1] || 0

    const n = prices.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumX2 = 0

    for (let i = 0; i < n; i++) {
      const x = i
      const y = prices[i]
      sumX += x
      sumY += y
      sumXY += x * y
      sumX2 += x * x
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Predict future price
    const futureX = n + periods - 1
    return slope * futureX + intercept
  }

  /**
   * Exponential Moving Average Prediction
   */
  private emaPrediction(prices: number[], periods: number): number {
    if (prices.length < periods) return prices[prices.length - 1] || 0

    const multiplier = 2 / (periods + 1)
    let ema = prices.slice(0, periods).reduce((a, b) => a + b, 0) / periods

    for (let i = periods; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier))
    }

    // Extrapolate based on trend
    const trend = ema - (prices[prices.length - 1] || 0)
    return ema + trend
  }

  /**
   * Weighted Average Prediction (combines multiple methods)
   */
  private weightedPrediction(
    prices: number[],
    periods: number,
    weights: { linear: number; ema: number; momentum: number }
  ): number {
    const linearPred = this.simpleLinearRegression(prices, periods)
    const emaPred = this.emaPrediction(prices, periods)
    
    // Momentum-based prediction
    const recentChange = prices.length >= 2 
      ? prices[prices.length - 1] - prices[prices.length - 2]
      : 0
    const momentumPred = prices[prices.length - 1] + (recentChange * periods)

    const totalWeight = weights.linear + weights.ema + weights.momentum
    const weighted = 
      (linearPred * weights.linear + 
       emaPred * weights.ema + 
       momentumPred * weights.momentum) / totalWeight

    return weighted
  }

  /**
   * Calculate prediction confidence
   */
  private calculateConfidence(
    prices: number[],
    volatility: number,
    trendStrength: number
  ): number {
    // Higher confidence with:
    // - More data points
    // - Lower volatility
    // - Stronger trend

    const dataConfidence = Math.min(1, prices.length / 100)
    const volatilityConfidence = Math.max(0, 1 - volatility)
    const trendConfidence = Math.abs(trendStrength)

    return (dataConfidence * 0.3 + volatilityConfidence * 0.4 + trendConfidence * 0.3)
  }

  /**
   * Generate price scenarios
   */
  private generateScenarios(
    currentPrice: number,
    sentimentScore: number,
    technicalScore: number
  ): {
    bullish: { price: number; probability: number; conditions: string[] }
    bearish: { price: number; probability: number; conditions: string[] }
    neutral: { price: number; probability: number; conditions: string[] }
  } {
    const combinedScore = (sentimentScore + technicalScore) / 2

    // Bullish scenario
    const bullishProbability = Math.max(0, Math.min(1, (combinedScore + 0.5) / 1.5))
    const bullishPrice = currentPrice * (1 + 0.15 * bullishProbability)

    // Bearish scenario
    const bearishProbability = Math.max(0, Math.min(1, (1 - combinedScore + 0.5) / 1.5))
    const bearishPrice = currentPrice * (1 - 0.15 * bearishProbability)

    // Neutral scenario
    const neutralProbability = 1 - bullishProbability - bearishProbability
    const neutralPrice = currentPrice

    return {
      bullish: {
        price: bullishPrice,
        probability: bullishProbability,
        conditions: ['Strong buying pressure', 'Positive sentiment', 'Technical indicators bullish']
      },
      bearish: {
        price: bearishPrice,
        probability: bearishProbability,
        conditions: ['Selling pressure', 'Negative sentiment', 'Technical indicators bearish']
      },
      neutral: {
        price: neutralPrice,
        probability: Math.max(0, neutralProbability),
        conditions: ['Balanced market', 'Mixed signals', 'Consolidation phase']
      }
    }
  }

  /**
   * Get price prediction
   */
  async getPricePrediction(
    currentPrice: number,
    priceHistory: number[],
    sentimentScore: number = 0.65,
    technicalScore: number = 0.60
  ): Promise<PricePrediction> {
    // Check cache
    const now = Date.now()
    if (this.predictionCache && (now - this.lastFetch) < this.cacheExpiry) {
      return this.predictionCache
    }

    try {
      // Calculate volatility
      const returns = priceHistory.slice(1).map((p, i) => 
        priceHistory[i] > 0 ? (p - priceHistory[i]) / priceHistory[i] : 0
      )
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
      const volatility = Math.sqrt(variance)

      // Calculate trend strength
      const trend = priceHistory.length >= 2 
        ? (priceHistory[priceHistory.length - 1] - priceHistory[0]) / priceHistory[0]
        : 0
      const trendStrength = Math.abs(trend)

      // Short-term prediction (1 hour = 1 period)
      const shortTermPred = this.weightedPrediction(
        priceHistory,
        1,
        { linear: 0.3, ema: 0.4, momentum: 0.3 }
      )
      const shortTermChange = shortTermPred - currentPrice
      const shortTermConfidence = this.calculateConfidence(priceHistory, volatility, trendStrength)

      // Medium-term prediction (4 hours = 4 periods)
      const mediumTermPred = this.weightedPrediction(
        priceHistory,
        4,
        { linear: 0.4, ema: 0.4, momentum: 0.2 }
      )
      const mediumTermChange = mediumTermPred - currentPrice
      const mediumTermConfidence = this.calculateConfidence(priceHistory, volatility, trendStrength) * 0.9

      // Long-term prediction (24 hours = 24 periods)
      const longTermPred = this.weightedPrediction(
        priceHistory,
        24,
        { linear: 0.5, ema: 0.3, momentum: 0.2 }
      )
      const longTermChange = longTermPred - currentPrice
      const longTermConfidence = this.calculateConfidence(priceHistory, volatility, trendStrength) * 0.7

      const scenarios = this.generateScenarios(currentPrice, sentimentScore, technicalScore)

      const prediction: PricePrediction = {
        currentPrice,
        predictions: {
          shortTerm: {
            price: shortTermPred,
            change: shortTermChange,
            changePercent: (shortTermChange / currentPrice) * 100,
            confidence: shortTermConfidence,
            timeframe: '1 hour'
          },
          mediumTerm: {
            price: mediumTermPred,
            change: mediumTermChange,
            changePercent: (mediumTermChange / currentPrice) * 100,
            confidence: mediumTermConfidence,
            timeframe: '4 hours'
          },
          longTerm: {
            price: longTermPred,
            change: longTermChange,
            changePercent: (longTermChange / currentPrice) * 100,
            confidence: longTermConfidence,
            timeframe: '24 hours'
          }
        },
        scenarios,
        factors: {
          technical: 0.4,
          sentiment: 0.3,
          volume: 0.2,
          onChain: 0.1
        },
        model: {
          name: 'ML-Predictor v1.0',
          version: '1.0.0',
          accuracy: 0.72, // 72% accuracy (mock)
          lastTraining: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        lastUpdated: new Date()
      }

      // Update cache
      this.predictionCache = prediction
      this.lastFetch = now

      return prediction
    } catch (error) {
      console.error('Error generating prediction:', error)
      // Return default prediction
      return {
        currentPrice,
        predictions: {
          shortTerm: {
            price: currentPrice,
            change: 0,
            changePercent: 0,
            confidence: 0.5,
            timeframe: '1 hour'
          },
          mediumTerm: {
            price: currentPrice,
            change: 0,
            changePercent: 0,
            confidence: 0.5,
            timeframe: '4 hours'
          },
          longTerm: {
            price: currentPrice,
            change: 0,
            changePercent: 0,
            confidence: 0.5,
            timeframe: '24 hours'
          }
        },
        scenarios: {
          bullish: { price: currentPrice * 1.1, probability: 0.33, conditions: [] },
          bearish: { price: currentPrice * 0.9, probability: 0.33, conditions: [] },
          neutral: { price: currentPrice, probability: 0.34, conditions: [] }
        },
        factors: { technical: 0.4, sentiment: 0.3, volume: 0.2, onChain: 0.1 },
        model: {
          name: 'ML-Predictor v1.0',
          version: '1.0.0',
          accuracy: 0.72,
          lastTraining: new Date()
        },
        lastUpdated: new Date()
      }
    }
  }
}

export const pricePredictionService = new PricePredictionService()

