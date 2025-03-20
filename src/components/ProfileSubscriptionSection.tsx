import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatStorageSize, getFeatureLimit } from '../utils/subscriptionHelpers';
import { PLAN_IDS, PLAN_NAMES } from '../utils/subscriptionConstants';
import { Link } from 'react-router-dom';
import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronRight
} from 'react-icons/fi';

const ProfileSubscriptionSection: React.FC = () => {
  const { t } = useLanguage();
  const {
    userSubscription,
    usageStats,
    redirectToCustomerPortal,
    stripeCustomerId
  } = useAuth();

  const currentPlanId = userSubscription?.plan_id || PLAN_IDS.FREE;
  const currentPlanName = PLAN_NAMES[currentPlanId as keyof typeof PLAN_NAMES] || 'Free';
  
  // Get renewal date (if available)
  const renewalDate = userSubscription?.current_period_end 
    ? new Date(userSubscription.current_period_end).toLocaleDateString()
    : null;
  
  // Determine subscription status
  const isActive = userSubscription?.status === 'active';
  const isCanceled = userSubscription?.status === 'canceled';
  const isPastDue = userSubscription?.status === 'past_due';
  const isFree = !userSubscription || currentPlanId === PLAN_IDS.FREE;

  const handleManageSubscription = async () => {
    if (stripeCustomerId) {
      await redirectToCustomerPortal();
    }
  };

  return (
    <motion.div
      className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{t('subscription')}</h3>
        {stripeCustomerId && !isFree && (
          <button
            onClick={handleManageSubscription}
            className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors text-sm"
          >
            <FiCreditCard className="w-4 h-4" />
            {t('manage')}
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActive ? 'bg-green-500 bg-opacity-20' : 
              isCanceled ? 'bg-yellow-500 bg-opacity-20' :
              isPastDue ? 'bg-red-500 bg-opacity-20' :
              'bg-purple-500 bg-opacity-20'
            }`}>
              {isActive ? (
                <FiCheckCircle className="w-5 h-5 text-green-400" />
              ) : isCanceled ? (
                <FiClock className="w-5 h-5 text-yellow-400" />
              ) : isPastDue ? (
                <FiAlertCircle className="w-5 h-5 text-red-400" />
              ) : (
                <FiCheckCircle className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div>
              <h4 className="text-white font-medium">{currentPlanName} {t('plan')}</h4>
              <p className="text-sm text-violet-300">
                {isActive ? t('active') : 
                 isCanceled ? t('canceled') : 
                 isPastDue ? t('past_due') : 
                 t('free_plan')}
              </p>
            </div>
          </div>

          {renewalDate && (
            <div className="mb-4 text-sm">
              <span className="text-violet-200">
                {isCanceled ? t('access_until') : t('renews_on')}:
              </span>
              <span className="text-white ml-2 font-medium">{renewalDate}</span>
            </div>
          )}

          <div className="mb-4">
            <h5 className="text-sm text-violet-200 mb-2">{t('included_features')}</h5>
            <ul className="space-y-1">
              <li className="text-white flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-400" />
                <span>
                  {getFeatureLimit(currentPlanId, 'apiCalls')} {t('api_calls_per_month')}
                </span>
              </li>
              <li className="text-white flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-400" />
                <span>
                  {formatStorageSize(getFeatureLimit(currentPlanId, 'storage') as number)} {t('storage')}
                </span>
              </li>
              <li className="text-white flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-400" />
                <span>
                  {getFeatureLimit(currentPlanId, 'modelLimit')} {t('model_access')}
                </span>
              </li>
              {(getFeatureLimit(currentPlanId, 'customization') as boolean) && (
                <li className="text-white flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                  <span>{t('customization')}</span>
                </li>
              )}
              {(getFeatureLimit(currentPlanId, 'analytics') as boolean) && (
                <li className="text-white flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-400" />
                  <span>{t('analytics')}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-purple-900 bg-opacity-30 rounded-lg mb-4">
            <h5 className="text-sm text-violet-200 mb-2">{t('current_usage')}</h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{t('api_calls')}</span>
                  <span className="text-white">
                    {usageStats?.api_calls || 0} / {getFeatureLimit(currentPlanId, 'apiCalls')}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(((usageStats?.api_calls || 0) / (getFeatureLimit(currentPlanId, 'apiCalls') as number)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{t('storage')}</span>
                  <span className="text-white">
                    {formatStorageSize(usageStats?.storage_used || 0)} / {formatStorageSize(getFeatureLimit(currentPlanId, 'storage') as number)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(((usageStats?.storage_used || 0) / (getFeatureLimit(currentPlanId, 'storage') as number)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isFree ? (
            <Link 
              to="/pricing" 
              className="mt-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              {t('upgrade_plan')}
              <FiChevronRight className="w-4 h-4" />
            </Link>
          ) : isCanceled ? (
            <Link 
              to="/pricing" 
              className="mt-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              {t('renew_subscription')}
              <FiChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              to={`/${ 
                currentPlanId === PLAN_IDS.STARTER ? 'starter' : 
                currentPlanId === PLAN_IDS.PRO ? 'pro' : 
                currentPlanId === PLAN_IDS.ENTERPRISE ? 'enterprise' : 
                'interactive'}-dashboard`} 
              className="mt-auto bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              {t('go_to_dashboard')}
              <FiChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSubscriptionSection;
