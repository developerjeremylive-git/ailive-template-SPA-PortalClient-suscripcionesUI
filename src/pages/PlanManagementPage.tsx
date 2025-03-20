import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiDownload, FiZap, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import AnimatedFooter from '../components/AnimatedFooter';
import { motion } from 'framer-motion';

const PlanManagementPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const {
    user,
    userSubscription,
    availablePlans,
    cancelSubscription,
    updateSubscription,
    refreshSubscriptionData,
    supabase
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [usage, setUsage] = useState<{
    apiCalls: number;
    storageUsed: number;
    lastReset: string;
    nextReset: string;
  }>({
    apiCalls: 0,
    storageUsed: 0,
    lastReset: '',
    nextReset: ''
  });

  // Fetch billing history
  useEffect(() => {
    const fetchBillingHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('billing_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching billing history:', error);
        } else {
          setBillingHistory(data || []);
        }
      } catch (error) {
        console.error('Error in billing history fetch:', error);
      }
    };

    fetchBillingHistory();
  }, [user, supabase]);

  // Fetch usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_usage')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching usage data:', error);
        } else if (data) {
          setUsage({
            apiCalls: data.api_calls || 0,
            storageUsed: data.storage_used || 0,
            lastReset: data.last_reset || new Date().toISOString(),
            nextReset: data.next_reset || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } catch (error) {
        console.error('Error in usage data fetch:', error);
      }
    };

    fetchUsageData();
  }, [user, supabase]);

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await cancelSubscription();
      setMessage({
        type: 'success',
        text: t('subscription_cancelled_success')
      });
      setConfirmCancel(false);

      // Refresh subscription data after cancellation
      await refreshSubscriptionData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setMessage({
        type: 'error',
        text: t('subscription_cancelled_error')
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription upgrade/downgrade
  const handleUpdateSubscription = async (planId: string) => {
    setLoading(true);
    try {
      await updateSubscription(planId);
      setMessage({
        type: 'success',
        text: t('subscription_updated_success')
      });

      // Refresh subscription data after update
      await refreshSubscriptionData();
    } catch (error) {
      console.error('Error updating subscription:', error);
      setMessage({
        type: 'error',
        text: t('subscription_updated_error')
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get current plan details
  const getCurrentPlan = () => {
    if (!userSubscription) return null;
    
    // Create a default plan object based on subscription data
    const defaultPlan = {
      id: userSubscription.plan_id,
      name: userSubscription.plan_id === '1' ? 'Free' :
            userSubscription.plan_id === '2' ? 'Starter' :
            userSubscription.plan_id === '3' ? 'Pro' :
            userSubscription.plan_id === '4' ? 'Enterprise' : 'Unknown',
      price_monthly: userSubscription.price || 0
    };
    
    // If availablePlans exists, try to find the matching plan
    if (availablePlans && availablePlans.length > 0) {
      const foundPlan = availablePlans.find(plan => plan.id === userSubscription.plan_id);
      return foundPlan || defaultPlan;
    }
    
    // If no availablePlans, return the default plan
    return defaultPlan;
  };

  const currentPlan = getCurrentPlan();

  // Calculate usage percentages
  const getUsagePercentage = (used: number, limit: number) => {
    if (!limit) return 0;
    const percentage = (used / limit) * 100;
    return Math.min(percentage, 100);
  };

  // Get API call limits based on subscription
  const getApiCallLimit = () => {
    if (!currentPlan) return 100;

    switch (currentPlan.id) {
      case '1': return 100;
      case '2': return 1000;
      case '3': return 10000;
      case '4': return 100000;
      default: return 100;
    }
  };

  // Get storage limits based on subscription
  const getStorageLimit = () => {
    if (!currentPlan) return 100;

    switch (currentPlan.id) {
      case '1': return 100; // 100 MB
      case '2': return 1024; // 1 GB
      case '3': return 10240; // 10 GB
      case '4': return 102400; // 100 GB
      default: return 100;
    }
  };

  // Page animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header variant="default" />

      <motion.div
        className="pt-32 pb-20"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('subscription_management')}
              </h1>
              <p className="text-xl text-violet-200">
                {t('subscription_management_subtitle')}
              </p>
            </div>

            {message && (
              <div
                className={`mb-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                    message.type === 'error' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                      'bg-blue-500 bg-opacity-20 text-blue-300'
                  }`}
              >
                <div className="flex items-center">
                  {message.type === 'success' && <FiCheck className="mr-3" />}
                  {message.type === 'error' && <FiX className="mr-3" />}
                  {message.type === 'info' && <FiAlertCircle className="mr-3" />}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Plan Card */}
              <div className="lg:col-span-2">
                <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-purple-500 border-opacity-20">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    {t('current_plan')}
                  </h2>

                  {currentPlan ? (
                    <>
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-purple-300">
                          {t('free')}
                        </span>
                        <span className="ml-4 text-violet-300">
                          {currentPlan.price_monthly
                            ? `$${currentPlan.price_monthly}/month`
                            : t('free_plan')}
                        </span>
                      </div>

                      <div className="mb-8">
                        <p className="text-violet-200 mb-2">
                          {userSubscription.status === 'active'
                            ? t('subscription_active')
                            : userSubscription.status === 'canceled'
                              ? t('subscription_canceled')
                              : t('subscription_inactive')}
                        </p>

                        {userSubscription.current_period_end && (
                          <p className="text-violet-200">
                            {userSubscription.status === 'canceled'
                              ? t('subscription_ends')
                              : t('subscription_renews')}
                            : {formatDate(userSubscription.current_period_end)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {userSubscription.status === 'active' && userSubscription.plan_id !== '1' && (
                          confirmCancel ? (
                            <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg w-full">
                              <p className="text-white mb-4">
                                {t('confirm_cancel_subscription')}
                              </p>
                              <div className="flex gap-3">
                                <button
                                  onClick={handleCancelSubscription}
                                  disabled={loading}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  {loading ? t('processing') : t('confirm_cancel')}
                                </button>
                                <button
                                  onClick={() => setConfirmCancel(false)}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  {t('keep_subscription')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancel(true)}
                              className="px-5 py-2.5 bg-red-500 bg-opacity-20 text-red-300 rounded-lg hover:bg-opacity-30 transition-colors"
                            >
                              {t('cancel_subscription')}
                            </button>
                          )
                        )}

                        <button
                          onClick={() => navigate('/pricing')}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                        >
                          {t('explore_plans')}
                        </button>

                        <button
                          // onClick={() => refreshSubscriptionData()}
                          onClick={() => navigate('/plan-management')}
                          className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                          <FiRefreshCw className="w-4 h-4" />
                          {t('refresh_data')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-purple-500 bg-opacity-20 rounded w-1/3"></div>
                      <div className="h-4 bg-purple-500 bg-opacity-20 rounded w-1/2"></div>
                      <div className="h-4 bg-purple-500 bg-opacity-20 rounded w-2/3"></div>
                      <div className="flex gap-4">
                        <div className="h-10 bg-purple-500 bg-opacity-20 rounded w-32"></div>
                        <div className="h-10 bg-purple-500 bg-opacity-20 rounded w-32"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Summary Card */}
              <div>
                <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-purple-500 border-opacity-20">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    {t('usage_summary')}
                  </h2>

                  <div className="mb-6">
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-violet-200">{t('api_calls')}</span>
                        <span className="text-white">{usage.apiCalls} / {getApiCallLimit()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full"
                          style={{ width: `${getUsagePercentage(usage.apiCalls, getApiCallLimit())}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-violet-200">{t('storage')}</span>
                        <span className="text-white">{Math.round(usage.storageUsed)} MB / {getStorageLimit()} MB</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full"
                          style={{ width: `${getUsagePercentage(usage.storageUsed, getStorageLimit())}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-violet-200">
                    <p>{t('usage_period')}: {formatDate(new Date().toISOString())} - {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}</p>
                    <p className="mt-1">{t('usage_resets_on')} {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="mt-8">
              <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-purple-500 border-opacity-20">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {t('billing_history')}
                </h2>

                {billingHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-purple-500 border-opacity-20">
                          <th className="pb-3 text-violet-200">{t('date')}</th>
                          <th className="pb-3 text-violet-200">{t('description')}</th>
                          <th className="pb-3 text-violet-200">{t('amount')}</th>
                          <th className="pb-3 text-violet-200">{t('status')}</th>
                          <th className="pb-3 text-violet-200">{t('invoice')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.map((item, index) => (
                          <tr key={index} className="border-b border-gray-700 text-white">
                            <td className="py-4">{formatDate(item.created_at)}</td>
                            <td className="py-4">{item.description}</td>
                            <td className="py-4">${item.amount}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'paid' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                                  item.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' :
                                    'bg-red-500 bg-opacity-20 text-red-300'
                                }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-4">
                              {item.invoice_url && (
                                <a
                                  href={item.invoice_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-purple-300 hover:text-purple-200 transition-colors"
                                >
                                  <FiDownload className="mr-1" />
                                  {t('download')}
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-violet-200">{t('no_billing_history')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatedFooter />
    </div>
  );
};

export default PlanManagementPage;
