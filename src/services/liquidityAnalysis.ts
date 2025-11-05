/**
 * Advanced Liquidity Analysis Service
 * Deep market depth and liquidity analysis
 */

export interface LiquidityData {
  totalLiquidity: number
  liquidityUSD: number
  liquidityBreakdown: {
    dex: string
    liquidity: number
    liquidityUSD: number
    volume24h: number
    fee: number
    apr: number
  }[]
  depth: {
    buy: Array<{ price: number; amount: number; cumulative: number }>
    sell: Array<{ price: number; amount: number; cumulative: number }>
  }
  impact: {
    buy1Percent: number // Price impact for buying 1% of supply
    buy5Percent: number
    buy10Percent: number
    sell1Percent: number
    sell5Percent: number
    sell10Percent: number
  }
  concentration: {
    top10Pools: number // Percentage of liquidity in top 10 pools
    largestPool: number
    distribution: number // 0-1, higher = more distributed
  }
  stability: {
    score: number // 0-100
    factors: {
      depth: number
      distribution: number
      volume: number
      concentration: number
    }
  }
  lastUpdated: Date
}

export interface OrderBookLevel {
  price: number
  amount: number
  cumulative: number
  percentage: number
}

class LiquidityAnalysisService {
  /**
   * Calculate market depth from order book
   */
  calculateMarketDepth(
    buyOrders: Array<{ price: number; amount: number }>,
    sellOrders: Array<{ price: number; amount: number }>
  ): {
    buy: OrderBookLevel[]
    sell: OrderBookLevel[]
  } {
    // Sort buy orders descending (highest price first)
    const sortedBuy = [...buyOrders].sort((a, b) => b.price - a.price)
    // Sort sell orders ascending (lowest price first)
    const sortedSell = [...sellOrders].sort((a, b) => a.price - b.price)

    let buyCumulative = 0
    const buyDepth: OrderBookLevel[] = sortedBuy.map(order => {
      buyCumulative += order.amount
      return {
        price: order.price,
        amount: order.amount,
        cumulative: buyCumulative,
        percentage: 0 // Will be calculated after
      }
    })

    let sellCumulative = 0
    const sellDepth: OrderBookLevel[] = sortedSell.map(order => {
      sellCumulative += order.amount
      return {
        price: order.price,
        amount: order.amount,
        cumulative: sellCumulative,
        percentage: 0
      }
    })

    // Calculate percentages
    const maxBuyCumulative = buyDepth[buyDepth.length - 1]?.cumulative || 1
    const maxSellCumulative = sellDepth[sellDepth.length - 1]?.cumulative || 1

    buyDepth.forEach(level => {
      level.percentage = (level.cumulative / maxBuyCumulative) * 100
    })

    sellDepth.forEach(level => {
      level.percentage = (level.cumulative / maxSellCumulative) * 100
    })

    return { buy: buyDepth, sell: sellDepth }
  }

  /**
   * Calculate price impact for large orders
   */
  calculatePriceImpact(
    orderBook: { buy: OrderBookLevel[]; sell: OrderBookLevel[] },
    currentPrice: number,
    supply: number,
    percentages: number[] = [1, 5, 10]
  ): {
    buy1Percent: number
    buy5Percent: number
    buy10Percent: number
    sell1Percent: number
    sell5Percent: number
    sell10Percent: number
  } {
    const impact: any = {}

    percentages.forEach(percent => {
      const amount = supply * (percent / 100)
      
      // Buy impact (using sell side of order book)
      let buyRemaining = amount
      let buyPriceSum = 0
      let buyAmountSum = 0
      
      for (const level of orderBook.sell) {
        if (buyRemaining <= 0) break
        const take = Math.min(buyRemaining, level.amount)
        buyPriceSum += level.price * take
        buyAmountSum += take
        buyRemaining -= take
      }
      
      const avgBuyPrice = buyAmountSum > 0 ? buyPriceSum / buyAmountSum : currentPrice
      const buyImpact = ((avgBuyPrice - currentPrice) / currentPrice) * 100
      
      // Sell impact (using buy side of order book)
      let sellRemaining = amount
      let sellPriceSum = 0
      let sellAmountSum = 0
      
      for (const level of orderBook.buy) {
        if (sellRemaining <= 0) break
        const take = Math.min(sellRemaining, level.amount)
        sellPriceSum += level.price * take
        sellAmountSum += take
        sellRemaining -= take
      }
      
      const avgSellPrice = sellAmountSum > 0 ? sellPriceSum / sellAmountSum : currentPrice
      const sellImpact = ((currentPrice - avgSellPrice) / currentPrice) * 100

      impact[`buy${percent}Percent`] = buyImpact
      impact[`sell${percent}Percent`] = sellImpact
    })

    return impact as {
      buy1Percent: number
      buy5Percent: number
      buy10Percent: number
      sell1Percent: number
      sell5Percent: number
      sell10Percent: number
    }
  }

  /**
   * Analyze liquidity concentration
   */
  analyzeConcentration(
    pools: Array<{ dex: string; liquidity: number }>
  ): {
    top10Pools: number
    largestPool: number
    distribution: number
  } {
    if (pools.length === 0) {
      return { top10Pools: 0, largestPool: 0, distribution: 0 }
    }

    const totalLiquidity = pools.reduce((sum, p) => sum + p.liquidity, 0)
    const sortedPools = [...pools].sort((a, b) => b.liquidity - a.liquidity)

    const top10Liquidity = sortedPools.slice(0, 10).reduce((sum, p) => sum + p.liquidity, 0)
    const top10Pools = (top10Liquidity / totalLiquidity) * 100

    const largestPool = (sortedPools[0]?.liquidity || 0) / totalLiquidity * 100

    // Calculate distribution (Herfindahl-Hirschman Index)
    // Lower = more distributed, Higher = more concentrated
    let hhi = 0
    pools.forEach(pool => {
      const share = pool.liquidity / totalLiquidity
      hhi += share * share
    })

    // Normalize to 0-1 (invert so higher = more distributed)
    const distribution = 1 - Math.min(1, hhi * 10) // Multiply by 10 to scale

    return {
      top10Pools,
      largestPool,
      distribution
    }
  }

  /**
   * Calculate liquidity stability score
   */
  calculateStabilityScore(
    depth: { buy: OrderBookLevel[]; sell: OrderBookLevel[] },
    concentration: { distribution: number; top10Pools: number },
    volume24h: number,
    liquidityUSD: number
  ): {
    score: number
    factors: {
      depth: number
      distribution: number
      volume: number
      concentration: number
    }
  } {
    // Depth score (0-100)
    const buyDepth = depth.buy.length > 0 ? depth.buy[depth.buy.length - 1]?.cumulative || 0 : 0
    const sellDepth = depth.sell.length > 0 ? depth.sell[depth.sell.length - 1]?.cumulative || 0 : 0
    const avgDepth = (buyDepth + sellDepth) / 2
    const depthScore = Math.min(100, (avgDepth / liquidityUSD) * 100 * 10) // Normalize

    // Distribution score (0-100)
    const distributionScore = concentration.distribution * 100

    // Volume score (0-100)
    const volumeRatio = liquidityUSD > 0 ? volume24h / liquidityUSD : 0
    const volumeScore = Math.min(100, volumeRatio * 100)

    // Concentration score (0-100, inverted - lower concentration = higher score)
    const concentrationScore = (1 - concentration.top10Pools / 100) * 100

    // Weighted average
    const weights = {
      depth: 0.3,
      distribution: 0.3,
      volume: 0.2,
      concentration: 0.2
    }

    const totalScore = 
      depthScore * weights.depth +
      distributionScore * weights.distribution +
      volumeScore * weights.volume +
      concentrationScore * weights.concentration

    return {
      score: Math.round(totalScore),
      factors: {
        depth: Math.round(depthScore),
        distribution: Math.round(distributionScore),
        volume: Math.round(volumeScore),
        concentration: Math.round(concentrationScore)
      }
    }
  }

  /**
   * Get comprehensive liquidity analysis
   */
  async getLiquidityAnalysis(
    currentPrice: number,
    supply: number
  ): Promise<LiquidityData> {
    // Generate mock order book (in production, fetch from DEX API)
    const buyOrders: Array<{ price: number; amount: number }> = []
    const sellOrders: Array<{ price: number; amount: number }> = []

    // Generate buy orders (below current price)
    for (let i = 0; i < 20; i++) {
      const price = currentPrice * (1 - (i + 1) * 0.01)
      const amount = Math.random() * 100000 + 50000
      buyOrders.push({ price, amount })
    }

    // Generate sell orders (above current price)
    for (let i = 0; i < 20; i++) {
      const price = currentPrice * (1 + (i + 1) * 0.01)
      const amount = Math.random() * 100000 + 50000
      sellOrders.push({ price, amount })
    }

    const depth = this.calculateMarketDepth(buyOrders, sellOrders)

    // Mock liquidity pools
    const pools = [
      { dex: 'TraderJoe', liquidity: 85000, liquidityUSD: 85000, volume24h: 320000, fee: 0.3, apr: 45 },
      { dex: 'Pangolin', liquidity: 35000, liquidityUSD: 35000, volume24h: 120000, fee: 0.3, apr: 42 },
      { dex: 'SushiSwap', liquidity: 5000, liquidityUSD: 5000, volume24h: 15000, fee: 0.3, apr: 38 }
    ]

    const totalLiquidity = pools.reduce((sum, p) => sum + p.liquidity, 0)
    const liquidityUSD = pools.reduce((sum, p) => sum + p.liquidityUSD, 0)

    const impact = this.calculatePriceImpact(depth, currentPrice, supply)
    const concentration = this.analyzeConcentration(pools)
    const volume24h = pools.reduce((sum, p) => sum + p.volume24h, 0)
    const stability = this.calculateStabilityScore(depth, concentration, volume24h, liquidityUSD)

    return {
      totalLiquidity,
      liquidityUSD,
      liquidityBreakdown: pools,
      depth,
      impact,
      concentration,
      stability,
      lastUpdated: new Date()
    }
  }
}

export const liquidityAnalysisService = new LiquidityAnalysisService()

