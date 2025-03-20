import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

type UsageMetricsProps = {
  compact?: boolean;
  showRefresh?: boolean;
};

const UsageMetrics: React.FC<UsageMetricsProps> = ({ 
  compact = false,
  showRefresh = true 
}) => {
  const { t } = useLanguage();
  const { user, userSubscription, refreshSubscriptionData, supabase } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{
    apiCalls: number;
    apiCallsLimit: number;
    storageUsed: number;
    storageLimit: number;
    modelAccess: number;
    modelAccessLimit: number;
    nextReset: string;
  }>({
    apiCalls: 0,
    apiCallsLimit: 100,
    storageUsed: 0,
    storageLimit: 100,
    modelAccess: 0,
    modelAccessLimit: 3,
    nextReset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Fetch user usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_usage')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching usage data:', error);
        } else if (data) {
          // Set limits based on subscription plan
          const apiCallsLimit = getApiCallLimit();
          const storageLimit = getStorageLimit();
          const modelAccessLimit = getModelAccessLimit();

          setUsage({
            apiCalls: data.api_calls || 0,
            apiCallsLimit,
            storageUsed: data.storage_used || 0,
            storageLimit,
            modelAccess: data.model_access_count || 0,
            modelAccessLimit,
            nextReset: data.next_reset || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } catch (error) {
        console.error('Error processing usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [user, userSubscription, supabase]);

  // Get API call limits based on subscription
  const getApiCallLimit = () => {
    if (!userSubscription) return 100;
    
    switch(userSubscription.plan_id) {
      case '1': return 100;
      case '2': return 1000;
      case '3': return 10000;
      case '4': return 100000;
      default: return 100;
    }
  };
  
  // Get storage limits based on subscription
  const getStorageLimit = () => {
    if (!userSubscription) return 100;
    
    switch(userSubscription.plan_id) {
      case '1': return 100; // 100 MB
      case '2': return 1024; // 1 GB
      case '3': return 10240; // 10 GB
      case '4': return 102400; // 100 GB
      default: return 100;
    }
  };
  
  // Get model access limit based on subscription
  const getModelAccessLimit = () => {
    if (!userSubscription) return 3;
    
    switch(userSubscription.plan_id) {
      case '1': return 3;
      case '2': return 10;
      case '3': return 30;
      case '4': return 100;
      default: return 3;
    }
  };

  // Calculate usage percentages
  const getUsagePercentage = (used: number, limit: number) => {
    if (!limit) return 0;
    const percentage = (used / limit) * 100;
    return Math.min(percentage, 100);
  };

  // Format date for display
  const formatDateRelative = (dateString: string) => {
    const resetDate = new Date(dateString);
    const now = new Date();
    
    // Calculate days difference
    const diffTime = resetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return t('today');
    } else if (diffDays === 1) {
      return t('tomorrow');
    } else {
      return t('in_x_days', { days: diffDays });
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setLoading(true);
    await refreshSubscriptionData();
    
    // Re-fetch usage data
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_usage')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          // Set limits based on subscription plan
          const apiCallsLimit = getApiCallLimit();
          const storageLimit = getStorageLimit();
          const modelAccessLimit = getModelAccessLimit();

          setUsage({
            apiCalls: data.api_calls || 0,
            apiCallsLimit,
            storageUsed: data.storage_used || 0,
            storageLimit,
            modelAccess: data.model_access_count || 0,
            modelAccessLimit,
            nextReset: data.next_reset || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } catch (error) {
        console.error('Error refreshing usage data:', error);
      }
    }
    
    setLoading(false);
  };

  // Animation variants
  const barVariants = {
    initial: { width: 0 },
    animate: { width: `${getUsagePercentage(usage.apiCalls, usage.apiCallsLimit)}%` }
  };

  // Get color based on usage percentage
  const getBarColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Determine if any resource is near the limit
  const isNearLimit = 
    getUsagePercentage(usage.apiCalls, usage.apiCallsLimit) > 80 ||
    getUsagePercentage(usage.storageUsed, usage.storageLimit) > 80 ||
    getUsagePercentage(usage.modelAccess, usage.modelAccessLimit) > 80;

  if (compact) {
    return (
      <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-purple-500 border-opacity-20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-medium text-white">
            {t('resource_usage')}
          </h3>
          
          {showRefresh && (
            <button 
              onClick={handleRefresh} 
              disabled={loading}
              className="text-violet-300 hover:text-white transition-colors"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
        
        {isNearLimit && (
          <div className="mb-3 flex items-center text-sm text-yellow-300 bg-yellow-500 bg-opacity-10 p-2 rounded">
            <FiAlertCircle className="mr-2" />
            {t('approaching_limit')}
          </div>
        )}
        
        {/* API Calls Usage */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-violet-200 mb-1">
            <span>{t('api_calls')}</span>
            <span>
              {usage.apiCalls}/{usage.apiCallsLimit}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <motion.div 
              className={`${getBarColor(getUsagePercentage(usage.apiCalls, usage.apiCallsLimit))} h-1.5 rounded-full`}
              initial="initial"
              animate="animate"
              variants={barVariants}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-violet-200 mt-3">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            {t('resets')} {formatDateRelative(usage.nextReset)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-purple-500 border-opacity-20">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold text-white">
          {t('resource_usage')}
        </h3>
        
        {showRefresh && (
          <button 
            onClick={handleRefresh} 
            disabled={loading}
            className="flex items-center text-violet-300 hover:text-white px-3 py-1 bg-white bg-opacity-5 rounded-md hover:bg-opacity-10 transition-all"
          >
            <FiRefreshCw className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </button>
        )}
      </div>
      
      {isNearLimit && (
        <div className="mb-5 flex items-center text-yellow-300 bg-yellow-500 bg-opacity-10 p-3 rounded-lg">
          <FiAlertCircle className="mr-2 text-lg" />
          <div>
            <p className="font-medium">{t('approaching_limit_title')}</p>
            <p className="text-sm opacity-80">{t('approaching_limit_message')}</p>
          </div>
        </div>
      )}
      
      {/* API Calls Usage */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-violet-200 mb-1">
          <span>{t('api_calls')}</span>
          <span>
            {usage.apiCalls}/{usage.apiCallsLimit}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`${getBarColor(getUsagePercentage(usage.apiCalls, usage.apiCallsLimit))} h-2 rounded-full`}
            initial="initial"
            animate="animate"
            variants={barVariants}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
      </div>
      
      {/* Storage Usage */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-violet-200 mb-1">
          <span>{t('storage')}</span>
          <span>
            {Math.round(usage.storageUsed)} MB / {usage.storageLimit} MB
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`${getBarColor(getUsagePercentage(usage.storageUsed, usage.storageLimit))} h-2 rounded-full`}
            initial="initial"
            animate="animate"
            variants={{
              initial: { width: 0 },
              animate: { width: `${getUsagePercentage(usage.storageUsed, usage.storageLimit)}%` }
            }}
            transition={{ duration: 0.8, delay: 0.1 }}
          ></motion.div>
        </div>
      </div>
      
      {/* Model Access Usage */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-violet-200 mb-1">
          <span>{t('model_access')}</span>
          <span>
            {usage.modelAccess}/{usage.modelAccessLimit}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`${getBarColor(getUsagePercentage(usage.modelAccess, usage.modelAccessLimit))} h-2 rounded-full`}
            initial="initial"
            animate="animate"
            variants={{
              initial: { width: 0 },
              animate: { width: `${getUsagePercentage(usage.modelAccess, usage.modelAccessLimit)}%` }
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-violet-200 mt-4">
        <FiClock className="mr-2" />
        {t('usage_resets')} {formatDateRelative(usage.nextReset)}
      </div>
    </div>
  );
};

export default UsageMetrics;
