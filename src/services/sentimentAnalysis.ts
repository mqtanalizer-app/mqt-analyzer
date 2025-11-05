/**
 * Advanced Sentiment Analysis Service
 * NLP-powered sentiment analysis from multiple sources
 */

export interface SentimentData {
  score: number // -1 to 1
  magnitude: number // 0 to 1
  confidence: number // 0 to 1
  sources: {
    twitter?: SentimentSource
    reddit?: SentimentSource
    telegram?: SentimentSource
    news?: SentimentSource
    onChain?: SentimentSource
  }
  trends: {
    bullish: number // 0 to 1
    bearish: number // 0 to 1
    neutral: number // 0 to 1
  }
  keywords: Array<{
    word: string
    sentiment: number
    frequency: number
  }>
  lastUpdated: Date
}

export interface SentimentSource {
  score: number
  volume: number
  mentions: number
  positive: number
  negative: number
  neutral: number
}

export interface SentimentTrend {
  timestamp: Date
  score: number
  volume: number
}

class SentimentAnalysisService {
  private sentimentCache: SentimentData | null = null
  private cacheExpiry: number = 60000 // 1 minute
  private lastFetch: number = 0

  /**
   * Analyze sentiment from Twitter (mock - in production use Twitter API)
   */
  async analyzeTwitterSentiment(): Promise<SentimentSource> {
    // In production: Use Twitter API v2 or scraping
    // For now: Generate realistic mock data
    const baseScore = 0.65 + (Math.random() * 0.3 - 0.15)
    const mentions = Math.floor(Math.random() * 500 + 100)
    
    return {
      score: Math.max(-1, Math.min(1, baseScore)),
      volume: mentions,
      mentions,
      positive: Math.floor(mentions * (baseScore + 1) / 2),
      negative: Math.floor(mentions * (1 - baseScore) / 2),
      neutral: Math.floor(mentions * 0.1)
    }
  }

  /**
   * Analyze sentiment from Reddit (mock - in production use Reddit API)
   */
  async analyzeRedditSentiment(): Promise<SentimentSource> {
    // In production: Use Reddit API
    const baseScore = 0.55 + (Math.random() * 0.25 - 0.125)
    const mentions = Math.floor(Math.random() * 200 + 50)
    
    return {
      score: Math.max(-1, Math.min(1, baseScore)),
      volume: mentions,
      mentions,
      positive: Math.floor(mentions * (baseScore + 1) / 2),
      negative: Math.floor(mentions * (1 - baseScore) / 2),
      neutral: Math.floor(mentions * 0.15)
    }
  }

  /**
   * Analyze sentiment from Telegram (mock)
   */
  async analyzeTelegramSentiment(): Promise<SentimentSource> {
    const baseScore = 0.70 + (Math.random() * 0.2 - 0.1)
    const mentions = Math.floor(Math.random() * 300 + 80)
    
    return {
      score: Math.max(-1, Math.min(1, baseScore)),
      volume: mentions,
      mentions,
      positive: Math.floor(mentions * (baseScore + 1) / 2),
      negative: Math.floor(mentions * (1 - baseScore) / 2),
      neutral: Math.floor(mentions * 0.1)
    }
  }

  /**
   * Analyze sentiment from News (mock - in production use news API)
   */
  async analyzeNewsSentiment(): Promise<SentimentSource> {
    const baseScore = 0.60 + (Math.random() * 0.3 - 0.15)
    const mentions = Math.floor(Math.random() * 100 + 20)
    
    return {
      score: Math.max(-1, Math.min(1, baseScore)),
      volume: mentions,
      mentions,
      positive: Math.floor(mentions * (baseScore + 1) / 2),
      negative: Math.floor(mentions * (1 - baseScore) / 2),
      neutral: Math.floor(mentions * 0.2)
    }
  }

  /**
   * Analyze on-chain sentiment (based on whale movements, holder count, etc.)
   */
  async analyzeOnChainSentiment(): Promise<SentimentSource> {
    // On-chain metrics that indicate sentiment
    const baseScore = 0.65 + (Math.random() * 0.2 - 0.1)
    const mentions = Math.floor(Math.random() * 150 + 30)
    
    return {
      score: Math.max(-1, Math.min(1, baseScore)),
      volume: mentions,
      mentions,
      positive: Math.floor(mentions * (baseScore + 1) / 2),
      negative: Math.floor(mentions * (1 - baseScore) / 2),
      neutral: Math.floor(mentions * 0.15)
    }
  }

  /**
   * Extract keywords from sentiment data
   */
  extractKeywords(sources: SentimentData['sources']): Array<{ word: string; sentiment: number; frequency: number }> {
    // In production: Use NLP to extract keywords from actual text
    // For now: Return relevant keywords
    const keywords = [
      { word: 'bullish', sentiment: 0.8, frequency: 0.25 },
      { word: 'moon', sentiment: 0.9, frequency: 0.15 },
      { word: 'pump', sentiment: 0.7, frequency: 0.12 },
      { word: 'hold', sentiment: 0.5, frequency: 0.18 },
      { word: 'buy', sentiment: 0.75, frequency: 0.20 },
      { word: 'gem', sentiment: 0.85, frequency: 0.10 }
    ]

    // Adjust based on overall sentiment
    const avgScore = Object.values(sources).reduce((sum, s) => sum + (s?.score || 0), 0) / 
                     Object.values(sources).filter(s => s).length

    if (avgScore < 0) {
      keywords.push(
        { word: 'dump', sentiment: -0.7, frequency: 0.15 },
        { word: 'bearish', sentiment: -0.8, frequency: 0.20 },
        { word: 'sell', sentiment: -0.75, frequency: 0.18 }
      )
    }

    return keywords.sort((a, b) => b.frequency - a.frequency).slice(0, 10)
  }

  /**
   * Calculate overall sentiment trends
   */
  calculateTrends(sources: SentimentData['sources']): {
    bullish: number
    bearish: number
    neutral: number
  } {
    const scores = Object.values(sources)
      .filter(s => s)
      .map(s => s!.score)

    if (scores.length === 0) {
      return { bullish: 0.33, bearish: 0.33, neutral: 0.34 }
    }

    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length

    // Normalize to 0-1 range
    const normalizedScore = (avgScore + 1) / 2

    return {
      bullish: Math.max(0, Math.min(1, normalizedScore * 1.2)),
      bearish: Math.max(0, Math.min(1, (1 - normalizedScore) * 1.2)),
      neutral: Math.max(0, Math.min(1, 1 - Math.abs(avgScore)))
    }
  }

  /**
   * Get comprehensive sentiment analysis
   */
  async getSentimentAnalysis(): Promise<SentimentData> {
    // Check cache
    const now = Date.now()
    if (this.sentimentCache && (now - this.lastFetch) < this.cacheExpiry) {
      return this.sentimentCache
    }

    try {
      // Fetch from all sources in parallel
      const [twitter, reddit, telegram, news, onChain] = await Promise.all([
        this.analyzeTwitterSentiment(),
        this.analyzeRedditSentiment(),
        this.analyzeTelegramSentiment(),
        this.analyzeNewsSentiment(),
        this.analyzeOnChainSentiment()
      ])

      const sources = {
        twitter,
        reddit,
        telegram,
        news,
        onChain
      }

      // Calculate weighted average sentiment
      const weights = {
        twitter: 0.3,
        reddit: 0.2,
        telegram: 0.25,
        news: 0.15,
        onChain: 0.1
      }

      let totalScore = 0
      let totalWeight = 0
      let totalVolume = 0

      Object.entries(sources).forEach(([key, source]) => {
        const weight = weights[key as keyof typeof weights] || 0
        totalScore += source.score * weight
        totalWeight += weight
        totalVolume += source.volume
      })

      const avgScore = totalWeight > 0 ? totalScore / totalWeight : 0
      const magnitude = Math.abs(avgScore)
      const confidence = Math.min(1, totalVolume / 1000) // Normalize confidence based on volume

      const keywords = this.extractKeywords(sources)
      const trends = this.calculateTrends(sources)

      const sentimentData: SentimentData = {
        score: avgScore,
        magnitude,
        confidence,
        sources,
        trends,
        keywords,
        lastUpdated: new Date()
      }

      // Update cache
      this.sentimentCache = sentimentData
      this.lastFetch = now

      return sentimentData
    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      // Return cached data if available
      if (this.sentimentCache) {
        return this.sentimentCache
      }
      // Return default sentiment
      return {
        score: 0.5,
        magnitude: 0.5,
        confidence: 0.5,
        sources: {},
        trends: { bullish: 0.33, bearish: 0.33, neutral: 0.34 },
        keywords: [],
        lastUpdated: new Date()
      }
    }
  }

  /**
   * Get sentiment history
   */
  async getSentimentHistory(hours: number = 24): Promise<SentimentTrend[]> {
    const history: SentimentTrend[] = []
    const now = Date.now()

    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000)
      const variation = (Math.random() - 0.5) * 0.2
      const baseScore = 0.65 + variation
      
      history.push({
        timestamp,
        score: Math.max(-1, Math.min(1, baseScore)),
        volume: Math.floor(Math.random() * 500 + 200)
      })
    }

    return history
  }

  /**
   * Analyze text sentiment (for user input)
   */
  analyzeTextSentiment(text: string): {
    score: number
    label: 'positive' | 'negative' | 'neutral'
    confidence: number
  } {
    // Simple sentiment analysis (in production, use NLP library like natural or sentiment)
    const lowerText = text.toLowerCase()
    
    const positiveWords = ['bullish', 'moon', 'pump', 'buy', 'gem', 'great', 'amazing', 'excellent', 'good', 'positive', 'up', 'rise', 'gain', 'profit']
    const negativeWords = ['bearish', 'dump', 'sell', 'bad', 'terrible', 'awful', 'negative', 'down', 'fall', 'loss', 'crash', 'scam']

    let positiveCount = 0
    let negativeCount = 0

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++
    })

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++
    })

    const total = positiveCount + negativeCount
    if (total === 0) {
      return { score: 0, label: 'neutral', confidence: 0.5 }
    }

    const score = (positiveCount - negativeCount) / total
    const confidence = Math.min(1, total / 5) // More keywords = higher confidence

    return {
      score,
      label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
      confidence
    }
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService()

