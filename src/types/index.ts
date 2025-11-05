// Token Types
export interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  circulatingSupply: string
  price: number
  marketCap: number
  volume24h: number
  liquidity: number
  chain: string
}

// Smart Contract Types
export interface ContractAnalysis {
  address: string
  securityScore: number // 0-100
  verified: boolean
  vulnerabilities: Vulnerability[]
  functions: ContractFunction[]
  owner: string
  renounced: boolean
}

export interface Vulnerability {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  recommendation: string
}

export interface ContractFunction {
  name: string
  visibility: 'public' | 'private' | 'internal' | 'external'
  payable: boolean
  stateMutability: string
}

// Whale Types
export interface Whale {
  address: string
  balance: string
  percentage: number
  type: 'exchange' | 'institution' | 'individual' | 'unknown'
  movements: WhaleMovement[]
}

export interface WhaleMovement {
  timestamp: number
  type: 'buy' | 'sell' | 'transfer'
  amount: string
  price: number
}

// Sentiment Types
export interface SentimentData {
  token: string
  overall: number // -1 to 1
  sources: SentimentSource[]
  trends: SentimentTrend[]
}

export interface SentimentSource {
  platform: 'twitter' | 'telegram' | 'discord' | 'reddit' | 'youtube'
  sentiment: number
  volume: number
  influencers: Influencer[]
}

export interface Influencer {
  username: string
  followers: number
  influence: number
  sentiment: number
}

export interface SentimentTrend {
  timestamp: number
  sentiment: number
  volume: number
}

