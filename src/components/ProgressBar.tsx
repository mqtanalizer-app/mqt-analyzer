import { motion } from 'framer-motion'

export function ProgressBar({ value, max = 100, color = 'primary' }: {
  value: number
  max?: number
  color?: string
}) {
  const percentage = (value / max) * 100
  
  const colorClasses = {
    primary: 'bg-primary',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
  }

  return (
    <div className="w-full bg-gray-800 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}
      />
    </div>
  )
}

export function ProgressBarContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>
}

