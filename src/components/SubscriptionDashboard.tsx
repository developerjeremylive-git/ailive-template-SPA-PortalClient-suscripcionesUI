import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatStorageSize, getFeatureLimit } from '../utils/subscriptionHelpers';
import { PLAN_IDS, PLAN_NAMES, PLAN_PRICING } from '../utils/subscriptionConstants';
import {
  FiCreditCard,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiStar,
  FiTrello,
  FiActivity,
  FiEdit,
  FiArrowUpRight,
  FiCheck,
  FiX
} from 'react-icons/fi';

const SubscriptionDashboard: React.FC = () => {
  const { t } = useLanguage();
  const {
    user,
    profile,
    userSubscription,
    usageStats,
    availablePlans,
    redirectToCheckout,
    redirectToCustomerPortal,
    stripeCustomerId
  } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return null;
  }

  const currentPlanId = userSubscription?.plan_id || PLAN_IDS.FREE;
  const currentPlanName = PLAN_NAMES[currentPlanId as keyof typeof PLAN_NAMES] || 'Free';
  
  // Calculate usage percentages
  const calculatePercentage = (used: number, total: number) => {
    if (!total) return 0;
    const percentage = (used / total) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  const apiCallsLimit = getFeatureLimit(currentPlanId, 'apiCalls') as number;
  const storageLimit = getFeatureLimit(currentPlanId, 'storage') as number;
  const modelLimit = getFeatureLimit(currentPlanId, 'modelLimit') as number;
  
  const apiUsage = usageStats?.api_calls || 0;
  const storageUsage = usageStats?.storage_used || 0;
  const modelsUsed = usageStats?.models_used || 0;
  
  const apiPercentage = calculatePercentage(apiUsage, apiCallsLimit);
  const storagePercentage = calculatePercentage(storageUsage, storageLimit);
  const modelPercentage = calculatePercentage(modelsUsed, modelLimit);

  // Handle subscription management
  const handleManageSubscription = async () => {
    try {
      setIsUpdating(true);
      
      if (stripeCustomerId) {
        // If the user has a Stripe customer ID, redirect to Stripe portal
        await redirectToCustomerPortal();
      } else {
        // Otherwise, show an error or redirect to plans page
        console.error('No Stripe customer ID found');
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    try {
      setIsUpdating(true);
      await redirectToCheckout(planId);
    } catch (error) {
      console.error('Error changing plan:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Current Subscription */}
      <motion.div 
        className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('current_subscription')}</h2>
            <p className="text-violet-200">{t('subscription_details')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            {stripeCustomerId && (
              <button
                onClick={handleManageSubscription}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-70"
              >
                <FiCreditCard className="w-4 h-4" />
                {t('manage_subscription')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="p-4 bg-gradient-to-r from-purple-800 to-violet-900 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{t('plan')}</h3>
              <FiStar className="text-yellow-300 w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentPlanName}</div>
            {userSubscription?.status === 'active' ? (
              <div className="inline-flex items-center px-3 py-1 bg-green-500 bg-opacity-20 rounded-full text-green-300 text-sm">
                <FiCheck className="w-3 h-3 mr-1" />
                {t('active')}
              </div>
            ) : userSubscription?.status === 'canceled' ? (
              <div className="inline-flex items-center px-3 py-1 bg-red-500 bg-opacity-20 rounded-full text-red-300 text-sm">
                <FiX className="w-3 h-3 mr-1" />
                {t('canceled')}
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 bg-purple-500 bg-opacity-20 rounded-full text-purple-300 text-sm">
                {t('free_plan')}
              </div>
            )}
            
            {userSubscription?.current_period_end && (
              <div className="mt-3 text-sm text-white">
                {userSubscription.status === 'canceled' 
                  ? t('access_until') 
                  : t('renews_on')}: {new Date(userSubscription.current_period_end).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* API Usage */}
          <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{t('api_usage')}</h3>
              <FiActivity className="text-blue-300 w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {apiUsage} <span className="text-lg text-violet-300">/ {apiCallsLimit}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${apiPercentage}%` }}
              />
            </div>
            <div className="text-sm text-violet-300">
              {apiPercentage.toFixed(1)}% {t('used')}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{t('storage')}</h3>
              <div className="flex">
                <FiDownload className="text-green-300 w-5 h-5 mr-1" />
                <FiUpload className="text-red-300 w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatStorageSize(storageUsage)} <span className="text-lg text-violet-300">/ {formatStorageSize(storageLimit)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <div className="text-sm text-violet-300">
              {storagePercentage.toFixed(1)}% {t('used')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upgrade Options */}
      <motion.div 
        className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{t('upgrade_options')}</h2>
          <p className="text-violet-200">{t('choose_plan')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(PLAN_IDS).map((planId) => {
            const isPro = planId === PLAN_IDS.PRO;
            const isCurrentPlan = planId === currentPlanId;
            const planName = PLAN_NAMES[planId as keyof typeof PLAN_NAMES];
            const planPrice = PLAN_PRICING[planId as keyof typeof PLAN_PRICING]?.monthly || 0;
            
            return (
              <motion.div
                key={planId}
                className={`p-4 rounded-lg relative overflow-hidden ${
                  isCurrentPlan 
                    ? 'border-2 border-purple-500 bg-purple-900 bg-opacity-40' 
                    : 'bg-white bg-opacity-5 border border-transparent hover:border-purple-500'
                }`}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {isPro && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-5 translate-y-3">
                      {t('popular')}
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{planName}</h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${planPrice}</span>
                  <span className="text-violet-300 ml-1">{t('per_month')}</span>
                </div>
                
                <ul className="mb-6 space-y-2">
                  <li className="flex items-start">
                    <FiCheck className="text-green-400 w-5 h-5 mr-2 mt-0.5" />
                    <span className="text-violet-200">
                      {getFeatureLimit(planId, 'apiCalls')} {t('api_calls')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-400 w-5 h-5 mr-2 mt-0.5" />
                    <span className="text-violet-200">
                      {formatStorageSize(getFeatureLimit(planId, 'storage') as number)} {t('storage')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-400 w-5 h-5 mr-2 mt-0.5" />
                    <span className="text-violet-200">
                      {getFeatureLimit(planId, 'modelLimit')} {t('model_access')}
                    </span>
                  </li>
                  {/* Add more features as needed */}
                </ul>
                
                <button
                  onClick={() => handleChangePlan(planId)}
                  disabled={isUpdating || isCurrentPlan}
                  className={`w-full py-2 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors ${
                    isCurrentPlan
                      ? 'bg-purple-700 text-purple-300 cursor-not-allowed'
                      : isPro
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                  }`}
                >
                  {isCurrentPlan ? (
                    t('current_plan')
                  ) : (
                    <>
                      {isPro ? t('recommended') : t('select_plan')}
                      <FiArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionDashboard;
