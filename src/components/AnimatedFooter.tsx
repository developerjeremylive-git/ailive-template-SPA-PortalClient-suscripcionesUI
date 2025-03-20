import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { FiCheck, FiMail } from 'react-icons/fi'
import AuthButton from './AuthButton'
import newsletterService from '../api/newsletter-service'

export default function AnimatedFooter() {
  const { t } = useLanguage()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Determine if we're on a dashboard page
  const isDashboard = ['/starter-dashboard', '/pro-dashboard', '/enterprise-dashboard'].includes(location.pathname)

  return (
    <>
      <footer className={`${isDashboard ? 'bg-[var(--theme-background-secondary)] border-t border-[var(--theme-border)]' : 'bg-black bg-opacity-30 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[var(--theme-background)] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                        className="fill-purple-400"
                      />
                      <path
                        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                        className="fill-pink-600"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold text-[var(--theme-text-primary)]">AILive</span>
              </Link>
              <p className="text-[var(--theme-text-secondary)]">{t('footer_description')}</p>
              <div className="pt-2">
                <AuthButton variant="footer" />
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
                {t('footer_resources')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/docs"
                    className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                  >
                    {t('docs')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/models"
                    className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                  >
                    {t('explore_models')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/interactive-demo"
                    className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                  >
                    {t('try_demo')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
                {t('footer_subscribe')}
              </h3>
              <p className="text-[var(--theme-text-secondary)]">{t('subscribe_desc')}</p>
              <div className="relative">
                <div className="flex flex-col space-y-3">
                  <div className="relative w-full">
                    <FiMail className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('enter_email')}
                      className="text-white w-full pl-10 pr-4 py-2 bg-purple-500/5 border border-purple-500/20 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                  <motion.button
                    onClick={async () => {
                      if (!email) return;
                      setIsLoading(true);
                      setError('');
                      
                      try {
                        const { error } = await newsletterService.subscribe(email);
                        if (error) {
                          setError(error);
                        } else {
                          setShowSuccess(true);
                          setEmail('');
                          setTimeout(() => setShowSuccess(false), 3000);
                        }
                      } catch (err) {
                        setError('Subscription failed');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className={`w-full px-6 py-2 rounded-xl font-medium text-white shadow-lg shadow-purple-500/30
                      ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transform hover:scale-[1.02] transition-all duration-300'}
                    `}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing')}
                      </span>
                    ) : t('subscribe_button')}
                  </motion.button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
                {t('form_company')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                  >
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                  >
                    {t('pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                  >
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-12 pt-8 border-t border-[var(--theme-border)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[var(--theme-text-secondary)]">
                &copy; 2024 AILive. {t('all_rights_reserved')}
              </div>
              <div className="flex gap-6">
                <Link
                  to="/privacy"
                  className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  {t('privacy')}
                </Link>
                <Link
                  to="/terms"
                  className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  {t('terms')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-green-500 p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 360],
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                    times: [0, 0.6, 1]
                  }
                }}
                className="p-4 bg-white bg-opacity-20 rounded-full"
              >
                <FiCheck className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}