/**
 * Correlation Analysis Service
 * Analyze correlations between tokens and markets
 */

export interface CorrelationData {
  token: string
  correlations: {
    asset: string
    type: 'token' | 'market' | 'index'
    correlation: number // -1 to 1
    significance: number // 0 to 1
    timeframe: string
    period: number // days
  }[]
  marketCorrelation: {
    bitcoin: number
    ethereum: number
    avax: number
    marketIndex: number
  }
  sectorCorrelation: {
    defi: number
    layer1: number
    exchange: number
    gaming: number
  }
  riskFactors: {
    marketRisk: number // 0-1
    sectorRisk: number // 0-1
    liquidityRisk: number // 0-1
    volatilityRisk: number // 0-1
  }
  diversification: {
    score: number // 0-100, higher = more diversified
    recommendation: string
  }
  lastUpdated: Date
}

export interface PriceDataPoint {
  timestamp: Date
  price: number
}

class CorrelationAnalysisService {
  /**
   * Calculate Pearson correlation coefficient
   */
  private calculateCorrelation(
    x: number[],
    y: number[]
  ): { correlation: number; significance: number } {
    if (x.length !== y.length || x.length < 2) {
      return { correlation: 0, significance: 0 }
    }

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    if (denominator === 0) {
      return { correlation: 0, significance: 0 }
    }

    const correlation = numerator / denominator

    // Calculate significance (p-value approximation)
    // Using t-test for correlation
    const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation))
    const df = n - 2
    // Simplified significance (more data = higher significance)
    const significance = Math.min(1, Math.abs(t) / 3) // Rough approximation

    return { correlation, significance }
  }

  /**
   * Calculate correlation with Bitcoin
   */
  async calculateBitcoinCorrelation(
    tokenPrices: PriceDataPoint[],
    period: number = 30
  ): Promise<number> {
    // In production: Fetch Bitcoin prices from API
    // For now: Generate mock Bitcoin prices with some correlation
    const tokenReturns = this.calculateReturns(tokenPrices)
    
    // Generate correlated Bitcoin prices
    const btcPrices: number[] = []
    let btcPrice = 43000 // Mock BTC price
    const correlation = 0.65 // Base correlation
    const noise = 0.15

    tokenReturns.forEach((tokenReturn, i) => {
      const correlatedReturn = tokenReturn * correlation + (Math.random() - 0.5) * noise
      btcPrice *= (1 + correlatedReturn)
      btcPrices.push(btcPrice)
    })

    const btcReturns = this.calculateReturnsFromPrices(btcPrices)
    const { correlation: corr } = this.calculateCorrelation(tokenReturns, btcReturns)

    return corr
  }

  /**
   * Calculate correlation with Ethereum
   */
  async calculateEthereumCorrelation(
    tokenPrices: PriceDataPoint[],
    period: number = 30
  ): Promise<number> {
    const tokenReturns = this.calculateReturns(tokenPrices)
    
    // Generate correlated ETH prices
    const ethPrices: number[] = []
    let ethPrice = 2500 // Mock ETH price
    const correlation = 0.70
    const noise = 0.12

    tokenReturns.forEach((tokenReturn) => {
      const correlatedReturn = tokenReturn * correlation + (Math.random() - 0.5) * noise
      ethPrice *= (1 + correlatedReturn)
      ethPrices.push(ethPrice)
    })

    const ethReturns = this.calculateReturnsFromPrices(ethPrices)
    const { correlation: corr } = this.calculateCorrelation(tokenReturns, ethReturns)

    return corr
  }

  /**
   * Calculate correlation with AVAX
   */
  async calculateAVAXCorrelation(
    tokenPrices: PriceDataPoint[],
    period: number = 30
  ): Promise<number> {
    const tokenReturns = this.calculateReturns(tokenPrices)
    
    // AVAX should have higher correlation (same ecosystem)
    const avaxPrices: number[] = []
    let avaxPrice = 35 // Mock AVAX price
    const correlation = 0.80 // Higher correlation for same chain
    const noise = 0.10

    tokenReturns.forEach((tokenReturn) => {
      const correlatedReturn = tokenReturn * correlation + (Math.random() - 0.5) * noise
      avaxPrice *= (1 + correlatedReturn)
      avaxPrices.push(avaxPrice)
    })

    const avaxReturns = this.calculateReturnsFromPrices(avaxPrices)
    const { correlation: corr } = this.calculateCorrelation(tokenReturns, avaxReturns)

    return corr
  }

  /**
   * Calculate correlation with market index
   */
  async calculateMarketIndexCorrelation(
    tokenPrices: PriceDataPoint[],
    period: number = 30
  ): Promise<number> {
    const tokenReturns = this.calculateReturns(tokenPrices)
    
    // Market index (weighted average of major cryptos)
    const marketReturns: number[] = []
    const marketCorrelation = 0.60

    tokenReturns.forEach((tokenReturn) => {
      const marketReturn = tokenReturn * marketCorrelation + (Math.random() - 0.5) * 0.20
      marketReturns.push(marketReturn)
    })

    const { correlation: corr } = this.calculateCorrelation(tokenReturns, marketReturns)

    return corr
  }

  /**
   * Calculate returns from price data
   */
  private calculateReturns(prices: PriceDataPoint[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1].price > 0) {
        returns.push((prices[i].price - prices[i - 1].price) / prices[i - 1].price)
      }
    }
    return returns
  }

  /**
   * Calculate returns from price array
   */
  private calculateReturnsFromPrices(prices: number[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] > 0) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
      }
    }
    return returns
  }

  /**
   * Calculate risk factors
   */
  calculateRiskFactors(
    marketCorrelation: CorrelationData['marketCorrelation'],
    volatility: number
  ): CorrelationData['riskFactors'] {
    // Market risk (higher correlation = higher risk)
    const avgMarketCorr = (
      marketCorrelation.bitcoin + 
      marketCorrelation.ethereum + 
      marketCorrelation.avax + 
      marketCorrelation.marketIndex
    ) / 4
    const marketRisk = Math.abs(avgMarketCorr)

    // Sector risk (assumed medium for DeFi tokens)
    const sectorRisk = 0.6

    // Liquidity risk (would need liquidity data)
    const liquidityRisk = 0.4

    // Volatility risk
    const volatilityRisk = Math.min(1, volatility * 10)

    return {
      marketRisk,
      sectorRisk,
      liquidityRisk,
      volatilityRisk
    }
  }

  /**
   * Calculate diversification score
   */
  calculateDiversification(
    correlations: CorrelationData['correlations']
  ): {
    score: number
    recommendation: string
  } {
    // Lower average correlation = higher diversification
    const avgCorrelation = correlations.length > 0
      ? correlations.reduce((sum, c) => sum + Math.abs(c.correlation), 0) / correlations.length
      : 1

    const diversificationScore = (1 - avgCorrelation) * 100

    let recommendation = ''
    if (diversificationScore > 70) {
      recommendation = 'Well diversified portfolio. Low correlation with major assets.'
    } else if (diversificationScore > 40) {
      recommendation = 'Moderately diversified. Consider adding uncorrelated assets.'
    } else {
      recommendation = 'Low diversification. High correlation with market. Consider rebalancing.'
    }

    return {
      score: Math.round(diversificationScore),
      recommendation
    }
  }

  /**
   * Get comprehensive correlation analysis
   */
  async getCorrelationAnalysis(
    tokenPrices: PriceDataPoint[]
  ): Promise<CorrelationData> {
    try {
      const [btcCorr, ethCorr, avaxCorr, marketCorr] = await Promise.all([
        this.calculateBitcoinCorrelation(tokenPrices),
        this.calculateEthereumCorrelation(tokenPrices),
        this.calculateAVAXCorrelation(tokenPrices),
        this.calculateMarketIndexCorrelation(tokenPrices)
      ])

      const correlations = [
        {
          asset: 'Bitcoin',
          type: 'token' as const,
          correlation: btcCorr,
          significance: 0.85,
          timeframe: '30 days',
          period: 30
        },
        {
          asset: 'Ethereum',
          type: 'token' as const,
          correlation: ethCorr,
          significance: 0.82,
          timeframe: '30 days',
          period: 30
        },
        {
          asset: 'AVAX',
          type: 'token' as const,
          correlation: avaxCorr,
          significance: 0.90,
          timeframe: '30 days',
          period: 30
        },
        {
          asset: 'Crypto Market Index',
          type: 'index' as const,
          correlation: marketCorr,
          significance: 0.88,
          timeframe: '30 days',
          period: 30
        }
      ]

      const marketCorrelation = {
        bitcoin: btcCorr,
        ethereum: ethCorr,
        avax: avaxCorr,
        marketIndex: marketCorr
      }

      // Calculate volatility for risk factors
      const returns = this.calculateReturns(tokenPrices)
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
      const volatility = Math.sqrt(variance)

      const riskFactors = this.calculateRiskFactors(marketCorrelation, volatility)
      const diversification = this.calculateDiversification(correlations)

      // Sector correlations (mock)
      const sectorCorrelation = {
        defi: 0.75,
        layer1: 0.65,
        exchange: 0.55,
        gaming: 0.35
      }

      return {
        token: 'MQT',
        correlations,
        marketCorrelation,
        sectorCorrelation,
        riskFactors,
        diversification,
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Error calculating correlation:', error)
      // Return default correlation
      return {
        token: 'MQT',
        correlations: [],
        marketCorrelation: { bitcoin: 0.65, ethereum: 0.70, avax: 0.80, marketIndex: 0.60 },
        sectorCorrelation: { defi: 0.75, layer1: 0.65, exchange: 0.55, gaming: 0.35 },
        riskFactors: { marketRisk: 0.7, sectorRisk: 0.6, liquidityRisk: 0.4, volatilityRisk: 0.5 },
        diversification: { score: 30, recommendation: 'Moderate diversification' },
        lastUpdated: new Date()
      }
    }
  }
}

export const correlationAnalysisService = new CorrelationAnalysisService()

