/**
 * Portfolio Tracking Service
 * Track multiple wallets and calculate portfolio value
 */

export interface Wallet {
  id: string
  address: string
  name: string
  balance: number
  tokens: number
  valueUSD: number
  addedAt: Date
  network: string
}

export interface Portfolio {
  wallets: Wallet[]
  totalValue: number
  totalTokens: number
  averageEntryPrice: number
  currentValue: number
  profitLoss: number
  profitLossPercent: number
  lastUpdated: Date
}

export interface Transaction {
  id: string
  walletId: string
  type: 'buy' | 'sell' | 'transfer'
  amount: number
  price: number
  value: number
  timestamp: Date
  txHash?: string
}

class PortfolioService {
  private wallets: Wallet[] = []
  private transactions: Transaction[] = []

  /**
   * Add Wallet
   */
  addWallet(address: string, name: string, network: string = 'Avalanche C-Chain'): string {
    const id = `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const wallet: Wallet = {
      id,
      address,
      name,
      balance: 0,
      tokens: 0,
      valueUSD: 0,
      addedAt: new Date(),
      network
    }

    this.wallets.push(wallet)
    this.saveWallets()
    return id
  }

  /**
   * Remove Wallet
   */
  removeWallet(id: string): boolean {
    const index = this.wallets.findIndex(w => w.id === id)
    if (index === -1) return false

    this.wallets.splice(index, 1)
    this.saveWallets()
    return true
  }

  /**
   * Update Wallet Balance
   */
  async updateWalletBalance(id: string, currentPrice: number): Promise<boolean> {
    const wallet = this.wallets.find(w => w.id === id)
    if (!wallet) return false

    try {
      // In production, fetch from blockchain API
      // For now, use mock data or stored values
      const balance = await this.fetchWalletBalance(wallet.address)
      wallet.tokens = balance
      wallet.balance = balance * currentPrice
      wallet.valueUSD = wallet.balance

      this.saveWallets()
      return true
    } catch (error) {
      console.error('Error updating wallet balance:', error)
      return false
    }
  }

  /**
   * Fetch Wallet Balance (Mock - replace with real API)
   */
  private async fetchWalletBalance(address: string): Promise<number> {
    // In production: Use ethers.js or web3 to fetch balance
    // For now, return stored value or mock
    const stored = localStorage.getItem(`wallet-balance-${address}`)
    if (stored) {
      return parseFloat(stored)
    }
    return 0
  }

  /**
   * Get Portfolio Summary
   */
  getPortfolio(currentPrice: number): Portfolio {
    const totalTokens = this.wallets.reduce((sum, w) => sum + w.tokens, 0)
    const totalValue = this.wallets.reduce((sum, w) => sum + w.valueUSD, 0)
    const currentValue = totalTokens * currentPrice

    // Calculate average entry price from transactions
    const buyTransactions = this.transactions.filter(t => t.type === 'buy')
    const totalCost = buyTransactions.reduce((sum, t) => sum + t.value, 0)
    const totalBought = buyTransactions.reduce((sum, t) => sum + t.amount, 0)
    const averageEntryPrice = totalBought > 0 ? totalCost / totalBought : 0

    const profitLoss = currentValue - totalCost
    const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0

    return {
      wallets: [...this.wallets],
      totalValue,
      totalTokens,
      averageEntryPrice,
      currentValue,
      profitLoss,
      profitLossPercent,
      lastUpdated: new Date()
    }
  }

  /**
   * Add Transaction
   */
  addTransaction(
    walletId: string,
    type: 'buy' | 'sell' | 'transfer',
    amount: number,
    price: number,
    txHash?: string
  ): string {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const transaction: Transaction = {
      id,
      walletId,
      type,
      amount,
      price,
      value: amount * price,
      timestamp: new Date(),
      txHash
    }

    this.transactions.push(transaction)
    
    // Update wallet
    const wallet = this.wallets.find(w => w.id === walletId)
    if (wallet) {
      if (type === 'buy') {
        wallet.tokens += amount
        wallet.balance += amount * price
      } else if (type === 'sell') {
        wallet.tokens = Math.max(0, wallet.tokens - amount)
        wallet.balance = wallet.tokens * price
      }
    }

    this.saveTransactions()
    this.saveWallets()
    return id
  }

  /**
   * Get Transactions
   */
  getTransactions(walletId?: string): Transaction[] {
    if (walletId) {
      return this.transactions.filter(t => t.walletId === walletId)
    }
    return [...this.transactions].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )
  }

  /**
   * Get Wallets
   */
  getWallets(): Wallet[] {
    return [...this.wallets]
  }

  /**
   * Save Wallets to LocalStorage
   */
  private saveWallets(): void {
    try {
      localStorage.setItem('mqt-wallets', JSON.stringify(this.wallets))
    } catch (error) {
      console.error('Error saving wallets:', error)
    }
  }

  /**
   * Load Wallets from LocalStorage
   */
  loadWallets(): void {
    try {
      const saved = localStorage.getItem('mqt-wallets')
      if (saved) {
        this.wallets = JSON.parse(saved).map((wallet: any) => ({
          ...wallet,
          addedAt: new Date(wallet.addedAt)
        }))
      }
    } catch (error) {
      console.error('Error loading wallets:', error)
    }
  }

  /**
   * Save Transactions to LocalStorage
   */
  private saveTransactions(): void {
    try {
      localStorage.setItem('mqt-transactions', JSON.stringify(this.transactions))
    } catch (error) {
      console.error('Error saving transactions:', error)
    }
  }

  /**
   * Load Transactions from LocalStorage
   */
  loadTransactions(): void {
    try {
      const saved = localStorage.getItem('mqt-transactions')
      if (saved) {
        this.transactions = JSON.parse(saved).map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        }))
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.loadWallets()
    this.loadTransactions()
  }
}

export const portfolioService = new PortfolioService()

