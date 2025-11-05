import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TokenAnalysis from './pages/TokenAnalysis'
import SmartContractAnalyzer from './pages/SmartContractAnalyzer'
import WhaleTracker from './pages/WhaleTracker'
import SocialSentiment from './pages/SocialSentiment'
import StrategyBuilder from './pages/StrategyBuilder'
import DownloadPage from './pages/DownloadPage'
import GoogleTranslate from './components/GoogleTranslate'
import PWAInstallBanner from './components/PWAInstallBanner'

function App() {
  return (
    <div className="min-h-screen bg-dark">
      {/* PWA Install Banner - Visible on all pages */}
      <PWAInstallBanner />
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/token/:address" element={<TokenAnalysis />} />
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
    </div>
  )
}

export default App

