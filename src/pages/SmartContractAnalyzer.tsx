import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Search, Shield, AlertTriangle, CheckCircle, 
  XCircle, FileCode, TrendingUp, Lock, Users, Zap 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
// ProgressBar component removed - using inline progress bar

export default function SmartContractAnalyzer() {
  const navigate = useNavigate()
  const [contractAddress, setContractAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // Mock data - En producción vendría del análisis del contrato
  const securityAnalysis = {
    score: 85,
    checks: [
      { name: 'Ownership', passed: true, severity: 'high', description: 'Ownership is renounceable' },
      { name: 'Reentrancy', passed: true, severity: 'critical', description: 'ReentrancyGuard implemented' },
      { name: 'Integer Overflow', passed: true, severity: 'high', description: 'Using Solidity 0.8+' },
      { name: 'Access Control', passed: true, severity: 'high', description: 'Functions properly protected' },
      { name: 'Pausable', passed: false, severity: 'medium', description: 'No pause mechanism found' },
      { name: 'Blacklist', passed: true, severity: 'medium', description: 'Blacklist is reversible' },
      { name: 'Taxes', passed: true, severity: 'low', description: 'Taxes are configurable' },
      { name: 'Liquidity', passed: true, severity: 'critical', description: 'Liquidity is locked' },
      { name: 'Burn Mechanism', passed: true, severity: 'low', description: 'Burn function exists' },
      { name: 'Mint Function', passed: true, severity: 'critical', description: 'Mint is disabled' },
    ],
    vulnerabilities: [
      {
        type: 'Medium',
        title: 'No Pause Mechanism',
        description: 'Contract does not have a pause mechanism. This could be a problem if a vulnerability is discovered.',
        recommendation: 'Consider adding a pause mechanism for emergency situations.',
        severity: 'medium'
      }
    ],
    functions: [
      { name: 'transfer', visibility: 'public', payable: false, stateMutability: 'nonpayable' },
      { name: 'approve', visibility: 'public', payable: false, stateMutability: 'nonpayable' },
      { name: 'transferFrom', visibility: 'public', payable: false, stateMutability: 'nonpayable' },
      { name: 'burn', visibility: 'public', payable: false, stateMutability: 'nonpayable' },
      { name: 'setTax', visibility: 'public', payable: false, stateMutability: 'nonpayable', adminOnly: true },
      { name: 'renounceOwnership', visibility: 'public', payable: false, stateMutability: 'nonpayable', adminOnly: true },
    ],
    events: [
      { name: 'Transfer', params: ['address indexed from', 'address indexed to', 'uint256 value'] },
      { name: 'Approval', params: ['address indexed owner', 'address indexed spender', 'uint256 value'] },
      { name: 'Burn', params: ['address indexed from', 'uint256 amount'] },
      { name: 'OwnershipTransferred', params: ['address indexed previousOwner', 'address indexed newOwner'] },
    ],
    owner: '0x1234567890123456789012345678901234567890',
    renounced: false,
    liquidityLocked: true,
    lockUntil: '2026-12-31',
  }

  const handleAnalyze = async () => {
    if (!contractAddress) return
    
    setAnalyzing(true)
    setLoading(true)
    
    // Simular análisis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    setAnalyzing(true)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/20'
      case 'high': return 'text-orange-400 bg-orange-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'low': return 'text-blue-400 bg-blue-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Smart Contract Analyzer
              </h1>
              <p className="text-gray-400">
                Analyze smart contracts for security vulnerabilities and best practices
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="Enter contract address (0x...)"
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !contractAddress}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </motion.div>

        {analyzing && (
          <>
            {/* Security Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Shield className="w-12 h-12 text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold">Security Score</h2>
                    <p className="text-gray-400 text-sm">Contract security analysis</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-5xl font-bold ${getScoreColor(securityAnalysis.score)}`}>
                    {securityAnalysis.score}/100
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {securityAnalysis.score >= 80 ? 'Good' : securityAnalysis.score >= 60 ? 'Fair' : 'Poor'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${securityAnalysis.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-4 rounded-full ${
                    securityAnalysis.score >= 80 ? 'bg-green-400' :
                    securityAnalysis.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </motion.div>

            {/* Security Checks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
            >
              <h3 className="text-xl font-bold mb-4">Security Checks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityAnalysis.checks.map((check, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      check.passed ? 'bg-green-400/10 border-green-400/30' : 'bg-red-400/10 border-red-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">{check.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(check.severity)}`}>
                        {check.severity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{check.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Vulnerabilities */}
            {securityAnalysis.vulnerabilities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900 rounded-lg p-6 mb-6 border border-red-400/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold">Vulnerabilities Detected</h3>
                </div>
                <div className="space-y-4">
                  {securityAnalysis.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="p-4 bg-red-400/10 rounded-lg border border-red-400/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(vuln.severity)}`}>
                          {vuln.type}
                        </span>
                        <span className="font-semibold">{vuln.title}</span>
                      </div>
                      <p className="text-gray-300 mb-2">{vuln.description}</p>
                      <p className="text-gray-400 text-sm">
                        <strong>Recommendation:</strong> {vuln.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contract Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Functions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileCode className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Functions</h3>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {securityAnalysis.functions.map((func, index) => (
                    <div key={index} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-primary font-mono text-sm">{func.name}</code>
                        {func.adminOnly && (
                          <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">Admin Only</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 space-x-2">
                        <span>Visibility: {func.visibility}</span>
                        <span>•</span>
                        <span>State: {func.stateMutability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Events</h3>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {securityAnalysis.events.map((event, index) => (
                    <div key={index} className="p-3 bg-gray-800 rounded-lg">
                      <code className="text-primary font-mono text-sm">{event.name}</code>
                      <div className="text-xs text-gray-400 mt-1">
                        {event.params.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contract Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <h3 className="text-xl font-bold mb-4">Contract Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Owner</span>
                  </div>
                  <code className="text-sm text-gray-300 font-mono">{securityAnalysis.owner}</code>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Ownership Renounced</span>
                  </div>
                  <span className={`text-sm ${securityAnalysis.renounced ? 'text-green-400' : 'text-red-400'}`}>
                    {securityAnalysis.renounced ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Liquidity Locked</span>
                  </div>
                  <span className={`text-sm ${securityAnalysis.liquidityLocked ? 'text-green-400' : 'text-red-400'}`}>
                    {securityAnalysis.liquidityLocked ? `Yes (Until ${securityAnalysis.lockUntil})` : 'No'}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {!analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center"
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Analyze</h3>
            <p className="text-gray-400 mb-6">
              Enter a contract address above to start analyzing the smart contract for security vulnerabilities.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
