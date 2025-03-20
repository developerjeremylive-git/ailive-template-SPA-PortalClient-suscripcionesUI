import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiZap, FiAward, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { PLAN_IDS } from '../utils/subscriptionConstants';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: PLAN_IDS.FREE,
    name: 'free_plan',
    price_monthly: '$0',
    price_yearly: '$0',
    icon: '🎯',
    description: 'plan_free_description',
    features: [
      'Basic AI Chat',
      '5 API calls/day',
      'Community Support',
      'Standard Response Time'
    ],
    color: 'from-violet-500 to-purple-500',
    route: '/interactive-demo'
  },
  {
    id: PLAN_IDS.STARTER,
    name: 'starter_plan',
    price_monthly: '$9.99',
    price_yearly: '$99.99',
    icon: '🚀',
    description: 'plan_starter_description',
    popular: true,
    features: [
      'Hugging Face API Access',
      'Browser Agent',
      'Advanced Chat with 25 API calls/day',
      'Priority Support'
    ],
    color: 'from-purple-500 to-pink-500',
    route: '/starter-dashboard'
  },
  {
    id: PLAN_IDS.PRO,
    name: 'pro_plan',
    price_monthly: '$19.99',
    price_yearly: '$199.99',
    icon: '⚡',
    description: 'plan_pro_description',
    features: [
      'All Starter Features',
      'Scraping Agent',
      'Deep Research',
      'AI Assistant with 100 API calls/day',
      'Premium Support'
    ],
    color: 'from-emerald-500 to-teal-500',
    route: '/pro-dashboard'
  },
  {
    id: PLAN_IDS.ENTERPRISE,
    name: 'enterprise_plan',
    price_monthly: '$99.99',
    price_yearly: '$999.99',
    icon: '✨',
    description: 'plan_enterprise_description',
    features: [
      'All Pro Features',
      'Custom Models',
      'Model Fine-tuning',
      'Unlimited API Calls',
      '24/7 Dedicated Support',
      'Custom Integrations'
    ],
    color: 'from-amber-500 to-orange-500',
    route: '/enterprise-dashboard'
  }
];

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, currentLanguage } = useLanguage();
  const { isDarkTheme } = useApp();
  const navigate = useNavigate();
  const { user, userSubscription, redirectToCheckout, setIsLoginOpen } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const handlePlanSelect = (planId: string, route: string) => {
    // Navigate directly to the dashboard route regardless of login status
    navigate(route);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black bg-opacity-70 overflow-y-auto min-h-screen pt-16 sm:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative w-full max-w-7xl mt-8 sm:mt-8 ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-900 to-violet-900'} rounded-2xl overflow-hidden shadow-xl p-6 md:p-8`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
                <FiStar className="w-full h-full text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute bottom-10 left-10 w-24 h-24 opacity-10">
                <FiStar className="w-full h-full text-yellow-300 animate-pulse" />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('pricing_title')}
              </h2>
              <p className="text-lg text-violet-200">
                {t('pricing_subtitle')}
              </p>
            </div>

            {/* Billing cycle toggle */}
            <div className="flex items-center justify-center mt-8 mb-8">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-white' : 'text-violet-200'}`}>
                {currentLanguage === 'es' ? 'Facturación Mensual' : 'Monthly Billing'}
              </span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="flex items-center"
                aria-label={currentLanguage === 'es' ? 
                  `Cambiar a facturación ${billingCycle === 'monthly' ? 'anual' : 'mensual'}` : 
                  `Switch to ${billingCycle === 'monthly' ? 'yearly' : 'monthly'} billing`}
              >
                {billingCycle === 'monthly' ? (
                  <FiToggleLeft className="w-10 h-10 text-violet-200" />
                ) : (
                  <FiToggleRight className="w-10 h-10 text-white" />
                )}
              </button>
              <span className={`ml-3 flex items-center ${billingCycle === 'yearly' ? 'text-white' : 'text-violet-200'}`}>
                {currentLanguage === 'es' ? 'Facturación Anual' : 'Yearly Billing'}
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800 text-white">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  {currentLanguage === 'es' ? 'Ahorra' : 'Save'} 17%
                </span>
              </span>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className={`relative bg-white bg-opacity-5 rounded-xl p-6 border-2 border-transparent hover:border-${plan.color.split(' ')[1]} transition-all`}
                  whileHover={{ scale: 1.02 }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        {t('popular')}
                      </div>
                    </div>
                  )}

                  <div className="text-4xl mb-4">{plan.icon}</div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t(plan.name)}
                  </h3>
                  
                  <p className="text-violet-200 text-sm mb-4">
                    {t(plan.description)}
                  </p>

                  <div className="text-2xl font-bold text-white mb-6 flex items-end">
                    {billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly}
                    <span className="text-sm text-violet-200 ml-1">/{t(billingCycle === 'monthly' ? 'monthly' : 'yearly')}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-violet-200">{t(feature)}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id, plan.route)}
                    className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${plan.color} text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                  >
                    {t('get_started_button')}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionPopup;
