import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TokenAnalysis from './pages/TokenAnalysis'
import AdvancedTechnicalAnalysis from './pages/AdvancedTechnicalAnalysis'
import AdvancedSentimentAnalysis from './pages/AdvancedSentimentAnalysis'
import LiquidityAnalysis from './pages/LiquidityAnalysis'
import PortfolioTracker from './pages/PortfolioTracker'
import SmartContractAnalyzer from './pages/SmartContractAnalyzer'
import WhaleTracker from './pages/WhaleTracker'
import SocialSentiment from './pages/SocialSentiment'
import StrategyBuilder from './pages/StrategyBuilder'
import DownloadPage from './pages/DownloadPage'
import GoogleTranslate from './components/GoogleTranslate'
import AutoInstallPrompt from './components/AutoInstallPrompt'
import AlertManager from './components/AlertManager'

function App() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Auto Install Prompt - Professional automatic installation */}
      <AutoInstallPrompt />
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/token/:address" element={<TokenAnalysis />} />
        <Route path="/technical-analysis" element={<AdvancedTechnicalAnalysis />} />
        <Route path="/sentiment-analysis" element={<AdvancedSentimentAnalysis />} />
        <Route path="/liquidity-analysis" element={<LiquidityAnalysis />} />
        <Route path="/portfolio" element={<PortfolioTracker />} />
        <Route path="/contract-analyzer" element={<SmartContractAnalyzer />} />
        <Route path="/whale-tracker" element={<WhaleTracker />} />
        <Route path="/social-sentiment" element={<SocialSentiment />} />
        <Route path="/strategy-builder" element={<StrategyBuilder />} />
        <Route path="/download" element={<DownloadPage />} />
        {/* Redirect old AI assistant route to dashboard */}
        <Route path="/claude-assistant" element={<Navigate to="/" replace />} />
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Google Translate Button - Available on all pages */}
      <GoogleTranslate />
      {/* Alert Manager - Available on all pages */}
      <AlertManager />
    </div>
  )
}

export default App

