import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, X, Plus, Trash2, Edit2, CheckCircle2, 
  AlertTriangle, DollarSign, TrendingUp, Activity, Zap
} from 'lucide-react'
import { alertService, type Alert, type AlertNotification } from '../services/alertService'
import { priceService } from '../services/priceService'

export default function AlertManager() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [notifications, setNotifications] = useState<AlertNotification[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [newAlert, setNewAlert] = useState({
    name: '',
    type: 'price' as 'price' | 'volume' | 'rsi' | 'macd',
    condition: 'above' as 'above' | 'below' | 'change' | 'cross',
    value: 0,
    description: '',
    enabled: true
  })

  useEffect(() => {
    alertService.initialize()
    loadAlerts()
    loadNotifications()

    // Subscribe to notifications
    const unsubscribe = alertService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev])
      // Show browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.message, {
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png'
        })
      }
    })

    // Check alerts every 30 seconds
    const interval = setInterval(async () => {
      try {
        const priceData = await priceService.getAggregatedPrice()
        const newNotifications = await alertService.checkAlerts({
          price: priceData.price,
          priceChange24h: priceData.priceChange24h,
          volume24h: priceData.volume24h
        })
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev])
        }
      } catch (error) {
        console.error('Error checking alerts:', error)
      }
    }, 30000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const loadAlerts = () => {
    setAlerts(alertService.getAlerts())
  }

  const loadNotifications = () => {
    setNotifications(alertService.getNotifications(50))
  }

  const handleAddAlert = () => {
    if (!newAlert.name || newAlert.value <= 0) return

    alertService.addAlert(newAlert)
    loadAlerts()
    setShowModal(false)
    setNewAlert({
      name: '',
      type: 'price',
      condition: 'above',
      value: 0,
      description: '',
      enabled: true
    })
  }

  const handleDeleteAlert = (id: string) => {
    alertService.removeAlert(id)
    loadAlerts()
  }

  const handleMarkAsRead = (id: string) => {
    alertService.markAsRead(id)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    alertService.markAllAsRead()
    loadNotifications()
  }

  const handleClearNotifications = () => {
    alertService.clearNotifications()
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-4 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full border border-primary/30 shadow-lg hover:shadow-xl transition-all glow-effect"
        >
          <Bell className="w-6 h-6 text-primary" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900"
            >
              <span className="text-xs font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] overflow-y-auto glass-card rounded-2xl p-6 border border-primary/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Notificaciones</h2>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="Marcar todas como leídas"
                  >
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                <button
                  onClick={handleClearNotifications}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                  title="Limpiar notificaciones"
                >
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      !notification.read 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-gray-800/50 border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-500/20' :
                        notification.type === 'warning' ? 'bg-yellow-500/20' :
                        notification.type === 'error' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {notification.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : notification.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <Bell className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-semibold text-white' : 'text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => setShowModal(true)}
                className="w-full gradient-primary text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Crear Nueva Alerta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Alert Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Crear Nueva Alerta</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Nombre de la Alerta
                  </label>
                  <input
                    type="text"
                    value={newAlert.name}
                    onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                    placeholder="Ej: Precio alcanza $0.002"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Tipo
                  </label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as any })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="price">Precio</option>
                    <option value="volume">Volumen</option>
                    <option value="rsi">RSI</option>
                    <option value="macd">MACD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Condición
                  </label>
                  <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as any })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="above">Por encima de</option>
                    <option value="below">Por debajo de</option>
                    <option value="change">Cambio de</option>
                    <option value="cross">Cruce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newAlert.value}
                    onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) || 0 })}
                    placeholder="0.001234"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={newAlert.description}
                    onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                    placeholder="Descripción de la alerta..."
                    rows={3}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-800/50 text-gray-400 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddAlert}
                  className="flex-1 gradient-primary text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transition-all glow-effect"
                >
                  Crear Alerta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

