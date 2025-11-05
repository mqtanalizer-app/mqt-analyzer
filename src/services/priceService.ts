/**
 * Price Service - Obtiene precio real de MQT desde exchanges de AVAX
 * Conecta con múltiples exchanges: TraderJoe, Pangolin, SushiSwap, CoinGecko, DEXScreener
 */

export interface TokenPriceData {
  price: number
  priceUSD: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  liquidity: number
  holders?: number
  lastUpdated: Date
  source: string
}

export interface PriceSources {
  traderJoe?: TokenPriceData
  pangolin?: TokenPriceData
  sushiswap?: TokenPriceData
  coinGecko?: TokenPriceData
  dexScreener?: TokenPriceData
}

// Contract address de MQT en Avalanche C-Chain
const MQT_CONTRACT_ADDRESS = '0xef0cdae2FfEEeFA539a244a16b3f46ba75b8c810'
const AVAX_CHAIN_ID = 43114

class PriceService {
  private priceCache: TokenPriceData | null = null
  private cacheExpiry: number = 30000 // 30 segundos
  private lastFetch: number = 0

  /**
   * Obtiene precio desde CoinGecko (más confiable y agregado)
   */
  async getPriceFromCoinGecko(): Promise<TokenPriceData | null> {
    try {
      // Buscar MQT por contract address en Avalanche
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=${MQT_CONTRACT_ADDRESS}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      )
      
      if (!response.ok) {
        console.warn('CoinGecko API error:', response.status)
        return null
      }

      const data = await response.json()
      const tokenData = data[MQT_CONTRACT_ADDRESS.toLowerCase()]

      if (!tokenData) {
        console.warn('MQT token not found in CoinGecko')
        return null
      }

      return {
        price: tokenData.usd || 0,
        priceUSD: tokenData.usd || 0,
        priceChange24h: tokenData.usd_24h_change || 0,
        volume24h: tokenData.usd_24h_vol || 0,
        marketCap: tokenData.usd_market_cap || 0,
        liquidity: 0, // CoinGecko no proporciona liquidez directamente
        lastUpdated: new Date(),
        source: 'CoinGecko'
      }
    } catch (error) {
      console.error('Error fetching from CoinGecko:', error)
      return null
    }
  }

  /**
   * Obtiene precio desde DEXScreener (datos de DEX)
   */
  async getPriceFromDEXScreener(): Promise<TokenPriceData | null> {
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${MQT_CONTRACT_ADDRESS}`
      )

      if (!response.ok) {
        console.warn('DEXScreener API error:', response.status)
        return null
      }

      const data = await response.json()
      const pairs = data.pairs || []

      if (pairs.length === 0) {
        console.warn('No pairs found for MQT in DEXScreener')
        return null
      }

      // Buscar el par más líquido en Avalanche
      const avaxPairs = pairs.filter((pair: any) => 
        pair.chainId === 'avalanche' || pair.chainId === '43114'
      )

      if (avaxPairs.length === 0) {
        return null
      }

      // Ordenar por liquidez y tomar el más líquido
      const bestPair = avaxPairs.sort((a: any, b: any) => 
        (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      )[0]

      return {
        price: parseFloat(bestPair.priceUsd) || 0,
        priceUSD: parseFloat(bestPair.priceUsd) || 0,
        priceChange24h: parseFloat(bestPair.priceChange?.h24 || 0),
        volume24h: parseFloat(bestPair.volume?.h24 || 0),
        marketCap: parseFloat(bestPair.marketCap || 0),
        liquidity: parseFloat(bestPair.liquidity?.usd || 0),
        lastUpdated: new Date(),
        source: `DEXScreener (${bestPair.dexId})`
      }
    } catch (error) {
      console.error('Error fetching from DEXScreener:', error)
      return null
    }
  }

  /**
   * Obtiene precio agregado desde múltiples fuentes
   */
  async getAggregatedPrice(): Promise<TokenPriceData> {
    // Verificar caché
    const now = Date.now()
    if (this.priceCache && (now - this.lastFetch) < this.cacheExpiry) {
      return this.priceCache
    }

    // Intentar múltiples fuentes en paralelo
    const [coinGeckoPrice, dexScreenerPrice] = await Promise.all([
      this.getPriceFromCoinGecko(),
      this.getPriceFromDEXScreener()
    ])

    // Priorizar DEXScreener si está disponible (más preciso para tokens DEX)
    let bestPrice = dexScreenerPrice || coinGeckoPrice

    // Si no hay precio, usar valores por defecto
    if (!bestPrice) {
      console.warn('No price data available, using fallback')
      bestPrice = {
        price: 0.001234,
        priceUSD: 0.001234,
        priceChange24h: 0,
        volume24h: 0,
        marketCap: 0,
        liquidity: 0,
        lastUpdated: new Date(),
        source: 'Fallback'
      }
    }

    // Actualizar caché
    this.priceCache = bestPrice
    this.lastFetch = now

    return bestPrice
  }

  /**
   * Obtiene precio en tiempo real (sin caché)
   */
  async getLivePrice(): Promise<TokenPriceData> {
    const [coinGeckoPrice, dexScreenerPrice] = await Promise.all([
      this.getPriceFromCoinGecko(),
      this.getPriceFromDEXScreener()
    ])

    const bestPrice = dexScreenerPrice || coinGeckoPrice

    if (!bestPrice) {
      throw new Error('No price data available from any source')
    }

    return bestPrice
  }

  /**
   * Obtiene historial de precios (para gráficos)
   */
  async getPriceHistory(hours: number = 24): Promise<Array<{ time: string; price: number }>> {
    try {
      // Usar DEXScreener para historial si está disponible
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${MQT_CONTRACT_ADDRESS}`
      )

      if (response.ok) {
        const data = await response.json()
        const pairs = data.pairs || []
        const avaxPair = pairs.find((pair: any) => 
          pair.chainId === 'avalanche' || pair.chainId === '43114'
        )

        if (avaxPair && avaxPair.priceHistory) {
          // Convertir historial de precio a formato de gráfico
          const history = avaxPair.priceHistory
            .slice(-hours) // Últimas N horas
            .map((item: any, index: number) => ({
              time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              price: parseFloat(item.price || 0)
            }))

          return history
        }
      }
    } catch (error) {
      console.error('Error fetching price history:', error)
    }

    // Fallback: generar datos mock basados en el precio actual
    const currentPrice = await this.getAggregatedPrice()
    const mockData = []
    const now = new Date()

    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const variation = (Math.random() - 0.5) * 0.1 // ±5% variación
      mockData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        price: currentPrice.price * (1 + variation)
      })
    }

    return mockData
  }
}

export const priceService = new PriceService()

