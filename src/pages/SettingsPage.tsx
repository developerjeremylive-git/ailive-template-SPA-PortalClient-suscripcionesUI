import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiSave, FiGlobe, FiMoon, FiSun, FiToggleLeft, FiToggleRight, FiBell, FiKey, FiCreditCard, FiBarChart2, FiExternalLink } from 'react-icons/fi';
import { WiSnow } from 'react-icons/wi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useApi } from '../context/ApiContext';
import Header from '../components/Header';
import AnimatedFooter from '../components/AnimatedFooter';
import ApiKeyManager from '../components/ApiKeyManager';
import UsageMetrics from '../components/UsageMetrics';
import { Link, useSearchParams } from 'react-router-dom';
import ExploreModelsPopup from '../components/ExploreModelsPopup';

export default function SettingsPage() {
  const { user, userSubscription, availablePlans } = useAuth();
  const { t, currentLanguage: language, setLanguage } = useLanguage();
  const { isGraphEnabled, toggleGraph, isDarkTheme: isDarkMode, toggleTheme: toggleDarkMode, isSnowEnabled, toggleSnow } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'appearance');
  const [isExploreModelsOpen, setIsExploreModelsOpen] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Sample language options
  const languages = [
    { code: 'en', name: t('english'), available: true },
    { code: 'es', name: t('spanish'), available: true },
    { code: 'fr', name: `${t('french')} (${t('coming_soon')})`, available: false },
    { code: 'de', name: `${t('german')} (${t('coming_soon')})`, available: false },
    { code: 'zh', name: `${t('chinese')} (${t('coming_soon')})`, available: false },
    { code: 'ja', name: `${t('japanese')} (${t('coming_soon')})`, available: false }
  ];

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    setShowSuccess(true);
    setLoading(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (!user) return null;

  // Get current plan details
  const currentPlan = availablePlans.length > 0 && userSubscription
    ? availablePlans.find(plan => plan.id === userSubscription.plan_id) || {
      name: t('free_plan'),
      price_monthly: 0
    }
    : {
      name: t('free_plan'),
      price_monthly: 0
    };

  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header variant="default" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t('settings')}
            </h1>
            <p className="text-violet-200 mb-8">
              {t('settings_description')}
            </p>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                className="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-xl border border-green-500 border-opacity-30 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {t('settings_saved_successfully')}
              </motion.div>
            )}

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto mb-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => handleTabChange('appearance')}
                className={`px-4 py-2 rounded-lg mr-2 transition-colors ${activeTab === 'appearance'
                    ? 'bg-purple-500 bg-opacity-30 text-white'
                    : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <FiSettings className="inline mr-2" />
                {t('appearance')}
              </button>
              <button
                onClick={() => handleTabChange('language')}
                className={`px-4 py-2 rounded-lg mr-2 transition-colors ${activeTab === 'language'
                    ? 'bg-purple-500 bg-opacity-30 text-white'
                    : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <FiGlobe className="inline mr-2" />
                {t('language')}
              </button>
              <button
                onClick={() => handleTabChange('notifications')}
                className={`px-4 py-2 rounded-lg mr-2 transition-colors ${activeTab === 'notifications'
                    ? 'bg-purple-500 bg-opacity-30 text-white'
                    : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <FiBell className="inline mr-2" />
                {t('notifications')}
              </button>
              <button
                onClick={() => handleTabChange('subscription')}
                className={`px-4 py-2 rounded-lg mr-2 transition-colors ${activeTab === 'subscription'
                    ? 'bg-purple-500 bg-opacity-30 text-white'
                    : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <FiCreditCard className="inline mr-2" />
                {t('subscription')}
              </button>
              <button
                onClick={() => handleTabChange('api_keys')}
                className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'api_keys'
                    ? 'bg-purple-500 bg-opacity-30 text-white'
                    : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <FiKey className="inline mr-2" />
                {t('api_keys')}
              </button>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-6">
                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 overflow-hidden">
                    <div className="p-5 border-b border-white border-opacity-10 flex items-center">
                      <FiSettings className="w-5 h-5 text-purple-400 mr-3" />
                      <h2 className="text-xl font-semibold text-white">{t('appearance')}</h2>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Dark Mode Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {isDarkMode ? (
                            <FiMoon className="w-5 h-5 text-purple-400 mr-3" />
                          ) : (
                            <FiSun className="w-5 h-5 text-yellow-400 mr-3" />
                          )}
                          <div>
                            <p className="text-white">{t('dark_mode')}</p>
                            <p className="text-sm text-violet-300">{t('dark_mode_description')}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={toggleDarkMode}
                          className="relative rounded-full p-1 w-12 h-6 transition-colors duration-200 ease-in-out"
                          style={{
                            backgroundColor: isDarkMode ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 rounded-full bg-white h-5 w-5 transform transition-transform duration-200 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
                              }`}
                          />
                        </button>
                      </div>

                      {/* Neural Network Background Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {isGraphEnabled ? (
                            <FiToggleRight className="w-5 h-5 text-purple-400 mr-3" />
                          ) : (
                            <FiToggleLeft className="w-5 h-5 text-violet-400 mr-3" />
                          )}
                          <div>
                            <p className="text-white">{t('neural_network_background')}</p>
                            <p className="text-sm text-violet-300">{t('neural_network_description')}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={toggleGraph}
                          className="relative rounded-full p-1 w-12 h-6 transition-colors duration-200 ease-in-out"
                          style={{
                            backgroundColor: isGraphEnabled ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 rounded-full bg-white h-5 w-5 transform transition-transform duration-200 ease-in-out ${isGraphEnabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                          />
                        </button>
                      </div>
                      {/* Snow Effect Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {isSnowEnabled ? (
                            <WiSnow className="w-5 h-5 text-blue-400 mr-3" />
                          ) : (
                            <WiSnow className="w-5 h-5 text-violet-400 mr-3" />
                          )}
                          <div>
                            <p className="text-white">{t('snow_effect')}</p>
                            <p className="text-sm text-violet-300">{t('snow_effect_description')}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={toggleSnow}
                          className="relative rounded-full p-1 w-12 h-6 transition-colors duration-200 ease-in-out"
                          style={{
                            backgroundColor: isSnowEnabled ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 rounded-full bg-white h-5 w-5 transform transition-transform duration-200 ease-in-out ${isSnowEnabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Settings */}
                {activeTab === 'language' && (
                  <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 overflow-hidden">
                    <div className="p-5 border-b border-white border-opacity-10 flex items-center">
                      <FiGlobe className="w-5 h-5 text-purple-400 mr-3" />
                      <h2 className="text-xl font-semibold text-white">{t('language')}</h2>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => lang.available ? setLanguage(lang.code as 'en' | 'es') : null}
                            className={`p-3 rounded-lg text-center transition-all ${language === lang.code
                              ? 'bg-purple-500 bg-opacity-30 border border-purple-500 text-white'
                              : lang.available
                                ? 'bg-white bg-opacity-5 border border-white border-opacity-10 text-violet-200 hover:bg-opacity-10 cursor-pointer'
                                : 'bg-white bg-opacity-5 border border-white border-opacity-10 text-violet-400 opacity-50 cursor-not-allowed'}`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 overflow-hidden">
                    <div className="p-5 border-b border-white border-opacity-10 flex items-center">
                      <FiBell className="w-5 h-5 text-purple-400 mr-3" />
                      <h2 className="text-xl font-semibold text-white">{t('notifications')}</h2>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Notifications Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">{t('email_notifications')}</p>
                          <p className="text-sm text-violet-300">{t('email_notifications_description')}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className="relative rounded-full p-1 w-12 h-6 transition-colors duration-200 ease-in-out"
                          style={{
                            backgroundColor: notificationsEnabled ? 'rgba(124, 58, 237, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 rounded-full bg-white h-5 w-5 transform transition-transform duration-200 ease-in-out ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscription Settings */}
                {activeTab === 'subscription' && (
                  <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 overflow-hidden">
                    <div className="p-5 border-b border-white border-opacity-10 flex items-center">
                      <FiCreditCard className="w-5 h-5 text-purple-400 mr-3" />
                      <h2 className="text-xl font-semibold text-white">{t('subscription')}</h2>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="bg-white bg-opacity-10 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-2">
                          {t('current_plan')}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-white">{currentPlan.name}</p>
                            <p className="text-violet-300">{currentPlan.price_monthly
                              ? `$${currentPlan.price_monthly}/month`
                              : t('free_plan')}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to="/pricing"
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                            >
                              {t('upgrade_plan')}
                            </Link>
                            <Link
                              to="/plan-management"
                              className="px-4 py-2 bg-white bg-opacity-10 text-white rounded-lg hover:bg-opacity-20 transition-all flex items-center"
                            >
                              {t('manage')} <FiExternalLink className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Usage Metrics Component */}
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                          <FiBarChart2 className="mr-2" /> {t('usage_metrics')}
                        </h3>
                        <UsageMetrics />
                      </div>

                      <div className="mt-6">
                        <div className="bg-indigo-900 bg-opacity-30 rounded-lg p-4 border border-indigo-500 border-opacity-20">
                          <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                            {t('ai_tools_hub')}
                          </h3>
                          <p className="text-violet-200 mb-3">
                            {t('explore_available_tools')}
                          </p>
                          <button
                            onClick={() => setIsExploreModelsOpen(true)}
                            className="inline-block px-4 py-2 bg-indigo-500 bg-opacity-30 text-white rounded-lg hover:bg-opacity-50 transition-all"
                          >
                            {t('explore_models')}
                          </button>
                          <ExploreModelsPopup
                            isOpen={isExploreModelsOpen}
                            onClose={() => setIsExploreModelsOpen(false)}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-white mb-2">
                          {t('billing_management')}
                        </h3>
                        <Link
                          to="/plan-management"
                          className="flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-all"
                        >
                          <div>
                            <p className="text-white font-medium">{t('view_billing_history')}</p>
                            <p className="text-sm text-violet-300">{t('manage_payment_methods')}</p>
                          </div>
                          <FiExternalLink className="text-violet-300" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Keys Settings */}
                {activeTab === 'api_keys' && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-violet-800/40 backdrop-blur-lg rounded-xl border border-purple-500/50 overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                    <div className="p-6 border-b border-purple-500/30 flex items-center justify-between bg-white/10">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-500/30 rounded-lg mr-4 shadow-inner">
                          <FiKey className="w-6 h-6 text-purple-200" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-violet-100">
                            {t('api_keys')}
                          </h2>
                          <p className="text-violet-200 text-sm mt-1">{t('api_keys_description')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                      {/* Usage Metrics with enhanced styling */}
                      <div className="bg-white/10 rounded-xl p-6 border border-purple-500/30 shadow-inner hover:bg-white/15 transition-colors duration-300">
                        <UsageMetrics compact={true} showRefresh={false} />
                      </div>

                      {/* API Key Managers with enhanced styling */}
                      <div className="space-y-6">
                        <ApiKeyManager
                          serviceType="custom"
                          title={<span className="text-white">{t('custom_api_key')}</span>}
                          description={t('custom_api_description')}
                          requiredPlan="1"
                        />
                        
                        <ApiKeyManager
                          serviceType="openai"
                          title={t('openai_api_key')}
                          description={t('openai_api_description')}
                          requiredPlan="2"
                        />

                        <ApiKeyManager
                          serviceType="huggingface"
                          title={t('huggingface_api_key')}
                          description={t('huggingface_api_description')}
                          requiredPlan="2"
                        />

                        <ApiKeyManager
                          serviceType="anthropic"
                          title={t('anthropic_api_key')}
                          description={t('anthropic_api_description')}
                          requiredPlan="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button (only visible for tabs that need saving) */}
                {/* {(activeTab === 'appearance' || activeTab === 'notifications') && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('saving')}
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          {t('save_settings')}
                        </>
                      )}
                    </button>
                  </div>
                )} */}
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}
