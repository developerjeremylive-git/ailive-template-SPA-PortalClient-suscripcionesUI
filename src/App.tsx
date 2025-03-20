import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/AppContext'
import { useLanguage } from './context/LanguageContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ApiProvider } from './context/ApiContext'
import Header from './components/Header'
import AnimatedFooter from './components/AnimatedFooter'
import TestimonialsSection from './components/TestimonialsSection'
import NeuralNetworkBackground from './components/NeuralNetworkBackground'
import ScrollToTop from './components/ScrollToTop'
import AuthPopup from './components/AuthPopup'
import DocsPage from './pages/DocsPage'
import ModelsPage from './pages/ModelsPage'
import ModelDetailPage from './pages/ModelDetailPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import InteractiveDemoPage from './pages/InteractiveDemoPage'
import StarterDashboard from './pages/StarterDashboard'
import ProDashboard from './pages/ProDashboard'
import EnterpriseDashboard from './pages/EnterpriseDashboard'
import SubscriptionPage from './pages/SubscriptionPage'
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import PlanManagementPage from './pages/PlanManagementPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AiToolsPage from './pages/AiToolsPage'
import DashboardPreview from './components/DashboardPreview'
import ExploreModelsPopup from './components/ExploreModelsPopup'
import LearnMorePopup from './components/LearnMorePopup'
import SubscriptionPopup from './components/SubscriptionPopup'
import { useState } from 'react'
import React from 'react'
import { LanguageProvider } from './context/LanguageContext'

// Protected route component for user account and settings pages
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // Only protect user-specific pages after loading completes
  if (!isLoading && !user && (window.location.pathname.includes('/profile') || 
      window.location.pathname.includes('/settings') || 
      window.location.pathname.includes('/plan-management'))) {
    return <Navigate to="/pricing" />;
  }
  
  return children;
};

// Dashboard redirect based on user subscription
function DashboardRoute() {
  const { user, userSubscription } = useAuth();
  
  // If not logged in, default to interactive demo
  if (!user) {
    return <Navigate to="/interactive-demo" />;
  }
  
  // Redirect based on subscription plan
  switch (userSubscription?.plan_id) {
    case '2':
      return <Navigate to="/starter-dashboard" />;
    case '3':
      return <Navigate to="/pro-dashboard" />;
    case '4':
      return <Navigate to="/enterprise-dashboard" />;
    default:
      return <Navigate to="/interactive-demo" />;
  }
}

function AppContent() {
  const { isGraphEnabled } = useApp()
  const { t } = useLanguage()
  const [isExploreModelsOpen, setIsExploreModelsOpen] = useState(false)
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false)
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false)

  return (
    <>
      {isGraphEnabled && <NeuralNetworkBackground />}
      <ScrollToTop />
      <AuthPopup />
      <Routes>
        {/* Public Routes */}
        <Route path="/reset-password" element={<AuthPopup triggerReason="manual" />} />
        <Route path="/" element={
          <div className="min-h-screen bg-theme-gradient">
            <Header variant="default" />
            <div className="pt-32 pb-20">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-violet-200">
                    {t('hero_title')}
                  </h1>
                  <p className="text-lg md:text-xl text-violet-200 mb-12">
                    {t('hero_subtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => setIsExploreModelsOpen(true)}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all"
                    >
                      {t('get_started_button')}
                    </button>
                    <button
                      onClick={() => setIsLearnMoreOpen(true)}
                      className="px-8 py-4 rounded-full bg-white bg-opacity-10 text-white font-semibold hover:bg-opacity-20 transition-all"
                    >
                      {t('learn_more')}
                    </button>
                    <button
                      onClick={() => setIsSubscriptionOpen(true)}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold hover:from-purple-500 hover:to-pink-600 transition-all"
                    >
                      {t('subscriptions')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Preview Section */}
            <section className="py-20 bg-black/20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {t('dashboard_title')}
                  </h2>
                  <p className="text-violet-200 text-lg max-w-2xl mx-auto">
                    {t('dashboard_subtitle')}
                  </p>
                </div>
                <div className="max-w-5xl mx-auto">
                  <div className="bg-gradient-to-br from-purple-900/50 to-violet-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-700/30">
                    <DashboardPreview type="analytics" />
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Language Models */}
                  <Link
                    to="/models?category=language"
                    className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 cursor-pointer transform transition-all hover:scale-105"
                  >
                    <div className="text-4xl mb-6">🤖</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {t('language_models_title')}
                    </h3>
                    <p className="text-violet-200 mb-6">
                      {t('language_models_desc')}
                    </p>
                    <span className="text-purple-300 hover:text-white transition-colors">
                      {t('try_it_now')} →
                    </span>
                  </Link>

                  {/* Image Generation */}
                  <Link
                    to="/models?category=image"
                    className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 cursor-pointer transform transition-all hover:scale-105"
                  >
                    <div className="text-4xl mb-6">🎨</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {t('image_generation_title')}
                    </h3>
                    <p className="text-violet-200 mb-6">
                      {t('demo_image_generation_desc')}
                    </p>
                    <span className="text-purple-300 hover:text-white transition-colors">
                      {t('try_it_now')} →
                    </span>
                  </Link>

                  {/* Speech Recognition */}
                  <Link
                    to="/models?category=speech"
                    className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 cursor-pointer transform transition-all hover:scale-105"
                  >
                    <div className="text-4xl mb-6">🎤</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {t('speech_recognition_title')}
                    </h3>
                    <p className="text-violet-200 mb-6">
                      {t('demo_speech_recognition_desc')}
                    </p>
                    <span className="text-purple-300 hover:text-white transition-colors">
                      {t('try_it_now')} →
                    </span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Footer */}
            <AnimatedFooter />
          </div>
        } />

        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/models/:modelId" element={<ModelDetailPage />} />
        <Route path="/ai-tools" element={<AiToolsPage />} />
        
        {/* Dashboard Routes - Now public but features require auth */}
        <Route path="/interactive-demo" element={<InteractiveDemoPage />} />
        <Route path="/starter-dashboard" element={<StarterDashboard />} />
        <Route path="/pro-dashboard" element={<ProDashboard />} />
        <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
        
        {/* Protected User Account Routes */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
        <Route path="/plan-management" element={<ProtectedRoute><PlanManagementPage /></ProtectedRoute>} />
        <Route path="/subscription/success" element={<ProtectedRoute><SubscriptionSuccessPage /></ProtectedRoute>} />
        
        {/* Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRoute />} />
      </Routes>

      {/* Popups */}
      <ExploreModelsPopup 
        isOpen={isExploreModelsOpen} 
        onClose={() => setIsExploreModelsOpen(false)} 
      />
      <LearnMorePopup 
        isOpen={isLearnMoreOpen} 
        onClose={() => setIsLearnMoreOpen(false)} 
      />
      <SubscriptionPopup 
        isOpen={isSubscriptionOpen} 
        onClose={() => setIsSubscriptionOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppProvider>
          <AuthProvider>
            <ApiProvider>
              <AppContent />
            </ApiProvider>
          </AuthProvider>
        </AppProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;