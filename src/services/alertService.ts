/**
 * Real-time Alert System
 * Monitors price changes and triggers alerts
 */

export interface Alert {
  id: string
  type: 'price' | 'volume' | 'rsi' | 'macd' | 'custom'
  condition: 'above' | 'below' | 'change' | 'cross'
  value: number
  currentValue?: number
  triggered: boolean
  triggeredAt?: Date
  enabled: boolean
  name: string
  description: string
}

export interface AlertNotification {
  id: string
  alertId: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
}

class AlertService {
  private alerts: Alert[] = []
  private notifications: AlertNotification[] = []
  private listeners: Set<(notification: AlertNotification) => void> = new Set()
  private checkInterval: number | null = null

  /**
   * Add Alert
   */
  addAlert(alert: Omit<Alert, 'id' | 'triggered' | 'triggeredAt'>): string {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newAlert: Alert = {
      ...alert,
      id,
      triggered: false,
      enabled: true
    }

    this.alerts.push(newAlert)
    this.saveAlerts()
    this.startMonitoring()

    return id
  }

  /**
   * Remove Alert
   */
  removeAlert(id: string): boolean {
    const index = this.alerts.findIndex(a => a.id === id)
    if (index === -1) return false

    this.alerts.splice(index, 1)
    this.saveAlerts()
    return true
  }

  /**
   * Update Alert
   */
  updateAlert(id: string, updates: Partial<Alert>): boolean {
    const alert = this.alerts.find(a => a.id === id)
    if (!alert) return false

    Object.assign(alert, updates)
    this.saveAlerts()
    return true
  }

  /**
   * Get All Alerts
   */
  getAlerts(): Alert[] {
    return [...this.alerts]
  }

  /**
   * Get Active Alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => a.enabled && !a.triggered)
  }

  /**
   * Check Alerts
   */
  async checkAlerts(priceData: {
    price: number
    priceChange24h: number
    volume24h: number
    rsi?: number
    macd?: { macd: number; signal: number }
  }): Promise<AlertNotification[]> {
    const newNotifications: AlertNotification[] = []

    for (const alert of this.getActiveAlerts()) {
      let shouldTrigger = false
      let message = ''

      switch (alert.type) {
        case 'price':
          if (alert.condition === 'above' && priceData.price >= alert.value) {
            shouldTrigger = true
            message = `${alert.name}: Price reached $${alert.value.toFixed(6)} (Current: $${priceData.price.toFixed(6)})`
          } else if (alert.condition === 'below' && priceData.price <= alert.value) {
            shouldTrigger = true
            message = `${alert.name}: Price dropped to $${alert.value.toFixed(6)} (Current: $${priceData.price.toFixed(6)})`
          } else if (alert.condition === 'change' && Math.abs(priceData.priceChange24h) >= alert.value) {
            shouldTrigger = true
            const direction = priceData.priceChange24h >= 0 ? 'increased' : 'decreased'
            message = `${alert.name}: Price ${direction} by ${Math.abs(priceData.priceChange24h).toFixed(2)}%`
          }
          break

        case 'volume':
          if (alert.condition === 'above' && priceData.volume24h >= alert.value) {
            shouldTrigger = true
            message = `${alert.name}: Volume exceeded $${(alert.value / 1000).toFixed(0)}K (Current: $${(priceData.volume24h / 1000).toFixed(0)}K)`
          }
          break

        case 'rsi':
          if (priceData.rsi !== undefined) {
            if (alert.condition === 'above' && priceData.rsi >= alert.value) {
              shouldTrigger = true
              message = `${alert.name}: RSI reached ${alert.value} (Current: ${priceData.rsi.toFixed(2)})`
            } else if (alert.condition === 'below' && priceData.rsi <= alert.value) {
              shouldTrigger = true
              message = `${alert.name}: RSI dropped to ${alert.value} (Current: ${priceData.rsi.toFixed(2)})`
            }
          }
          break

        case 'macd':
          if (priceData.macd) {
            if (alert.condition === 'cross' && 
                ((alert.value > 0 && priceData.macd.macd > priceData.macd.signal && 
                  priceData.macd.macd - priceData.macd.signal >= Math.abs(alert.value)) ||
                 (alert.value < 0 && priceData.macd.macd < priceData.macd.signal && 
                  priceData.macd.macd - priceData.macd.signal <= alert.value))) {
              shouldTrigger = true
              message = `${alert.name}: MACD ${alert.value > 0 ? 'bullish' : 'bearish'} crossover detected`
            }
          }
          break
      }

      if (shouldTrigger) {
        alert.triggered = true
        alert.triggeredAt = new Date()
        alert.currentValue = priceData.price

        const notification: AlertNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          alertId: alert.id,
          message,
          type: alert.type === 'price' && alert.condition === 'above' ? 'success' : 
                alert.type === 'price' && alert.condition === 'below' ? 'warning' : 'info',
          timestamp: new Date(),
          read: false
        }

        newNotifications.push(notification)
        this.notifications.push(notification)
        this.notifyListeners(notification)
      }
    }

    this.saveAlerts()
    this.saveNotifications()

    return newNotifications
  }

  /**
   * Get Notifications
   */
  getNotifications(limit: number = 50): AlertNotification[] {
    return this.notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get Unread Notifications
   */
  getUnreadNotifications(): AlertNotification[] {
    return this.notifications.filter(n => !n.read)
  }

  /**
   * Mark Notification as Read
   */
  markAsRead(id: string): boolean {
    const notification = this.notifications.find(n => n.id === id)
    if (!notification) return false

    notification.read = true
    this.saveNotifications()
    return true
  }

  /**
   * Mark All as Read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.saveNotifications()
  }

  /**
   * Clear Notifications
   */
  clearNotifications(): void {
    this.notifications = []
    this.saveNotifications()
  }

  /**
   * Subscribe to Notifications
   */
  onNotification(callback: (notification: AlertNotification) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * Notify Listeners
   */
  private notifyListeners(notification: AlertNotification): void {
    this.listeners.forEach(listener => {
      try {
        listener(notification)
      } catch (error) {
        console.error('Error in alert listener:', error)
      }
    })
  }

  /**
   * Start Monitoring
   */
  private startMonitoring(): void {
    if (this.checkInterval !== null) return

    // Check alerts every 30 seconds
    this.checkInterval = window.setInterval(() => {
      // This will be called from the component that has price data
    }, 30000)
  }

  /**
   * Stop Monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  /**
   * Save Alerts to LocalStorage
   */
  private saveAlerts(): void {
    try {
      localStorage.setItem('mqt-alerts', JSON.stringify(this.alerts))
    } catch (error) {
      console.error('Error saving alerts:', error)
    }
  }

  /**
   * Load Alerts from LocalStorage
   */
  loadAlerts(): void {
    try {
      const saved = localStorage.getItem('mqt-alerts')
      if (saved) {
        this.alerts = JSON.parse(saved).map((alert: any) => ({
          ...alert,
          triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined
        }))
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  /**
   * Save Notifications to LocalStorage
   */
  private saveNotifications(): void {
    try {
      const notifications = this.notifications.slice(-100) // Keep last 100
      localStorage.setItem('mqt-notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('Error saving notifications:', error)
    }
  }

  /**
   * Load Notifications from LocalStorage
   */
  loadNotifications(): void {
    try {
      const saved = localStorage.getItem('mqt-notifications')
      if (saved) {
        this.notifications = JSON.parse(saved).map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }))
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.loadAlerts()
    this.loadNotifications()
    this.startMonitoring()
  }
}

export const alertService = new AlertService()

