import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCheck, FiX, FiAlertTriangle, FiToggleLeft, FiToggleRight, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import AnimatedFooter from '../components/AnimatedFooter';
import PaymentMethodPopup from '../components/PaymentMethodPopup';

export default function SubscriptionPage() {
  const { user, userSubscription, cancelSubscription, updateSubscription } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);

  // Get plan details based on plan_id
  const getPlanDetails = (planId: string) => {
    switch (planId) {
      case '2':
        return {
          name: t('starter_plan'),
          price: billingCycle === 'monthly' ? '$9.99' : '$99.99',
          billingCycle: t(billingCycle),
          features: [
            t('starter_feature_1'),
            t('starter_feature_2'),
            t('starter_feature_3')
          ]
        };
      case '3':
        return {
          name: t('pro_plan'),
          price: billingCycle === 'monthly' ? '$19.99' : '$199.99',
          billingCycle: t(billingCycle),
          features: [
            t('pro_feature_1'),
            t('pro_feature_2'),
            t('pro_feature_3'),
            t('pro_feature_4')
          ]
        };
      case '4':
        return {
          name: t('enterprise_plan'),
          // price: t('contact_sales'),
          price: billingCycle === 'monthly' ? '$99.99' : '$999.99',
          billingCycle: t(billingCycle),
          features: [
            t('enterprise_feature_1'),
            t('enterprise_feature_2'),
            t('enterprise_feature_3'),
            t('enterprise_feature_4'),
            t('enterprise_feature_5')
          ]
        };
      default:
        return {
          name: t('free_plan'),
          price: t('free'),
          billingCycle: '-',
          features: [
            t('free_feature_1'),
            t('free_feature_2'),
            t('free_feature_3')
          ]
        };
    }
  };

  const currentPlanId = userSubscription?.plan_id || '1';
  const currentPlan = getPlanDetails(currentPlanId);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setProcessing(true);
    try {
      await cancelSubscription();
      setSuccessMessage(t('subscription_cancelled') as string);
      setShowSuccess(true);
      setConfirmCancel(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Handle subscription update
  const handleUpdateSubscription = async (newPlanId: string) => {
    if (newPlanId === currentPlanId) return;

    setProcessing(true);
    try {
      await updateSubscription(newPlanId);
      setSuccessMessage(t('subscription_updated') as string);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header variant="default" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t('subscription_management')}
            </h1>
            <p className="text-violet-200 mb-8">
              {t('subscription_management_description')}
            </p>

            {/* Current Subscription Card */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                {t('current_subscription')}
              </h2>

              <motion.div
                className="pricing-card relative p-8 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(147, 51, 234, 0.1) 0%, 
                    rgba(79, 70, 229, 0.1) 50%, 
                    rgba(236, 72, 153, 0.1) 100%)`,
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                  transform: 'translate3d(0, 0, 0)'
                }}
              >
                {/* Plan emoji decoration */}
                <div className="absolute -top-5 -right-5 transform rotate-12 text-4xl z-20 animate-bounce-gentle">
                  {currentPlanId === '4' ? '⭐️ 💎 🌟' : currentPlanId === '3' ? '🚀' : '✨'}</div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                        <FiCreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {currentPlan.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-violet-300">{currentPlan.price}</span>
                          {currentPlan.billingCycle !== '-' && (
                            <span className="text-violet-400 text-sm">/ {currentPlan.billingCycle}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {userSubscription?.created_at && (
                      <div className="text-sm text-violet-300 mb-1">
                        {t('started_on')}: {formatDate(userSubscription.created_at)}
                      </div>
                    )}

                    {userSubscription?.current_period_end && (
                      <div className="text-sm text-violet-300">
                        {t('next_billing_date')}: {formatDate(userSubscription.current_period_end)}
                      </div>
                    )}
                  </div>

                  {currentPlanId !== '1' && !confirmCancel && (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      disabled={processing}
                    >
                      {t('cancel_subscription')}
                    </button>
                  )}

                  {confirmCancel && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelSubscription}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        disabled={processing}
                      >
                        {processing ? t('processing') : t('confirm_cancel')}
                      </button>
                      <button
                        onClick={() => setConfirmCancel(false)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        disabled={processing}
                      >
                        {t('keep_subscription')}
                      </button>
                    </div>
                  )}
                </div>

                {currentPlanId !== '1' && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="text-sm text-violet-300">
                      {t('subscription_auto_renew_notice')}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                className="mb-8 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-white flex items-center gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FiCheck className="w-5 h-5 text-green-400" />
                <span>{successMessage}</span>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="ml-auto text-white/70 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Payment Method Card */}
            <div className="mt-8 p-6 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ease-in-out" style={{
              background: `linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)`,
              borderColor: 'rgba(147, 51, 234, 0.3)',
              marginBottom: '20px'
            }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('payment_method')}
                  </h3>
                  <p className="text-violet-200 mb-4">
                    {t('payment_method_description') || 'Secure your subscription by adding a payment method. We support major credit cards and various payment options.'}
                  </p>
                  <div className="flex items-center gap-3 text-violet-300 text-sm">
                    <div className="flex items-center gap-1">
                      <FiCreditCard className="w-4 h-4" />
                      <span>{t('credit_card')}</span>
                    </div>
                    <div className="w-1 h-1 bg-violet-400 rounded-full" />
                    <div className="flex items-center gap-1">
                      <FiCheck className="w-4 h-4 text-green-400" />
                      <span>{t('secure_payment')}</span>
                    </div>
                    <div className="w-1 h-1 bg-violet-400 rounded-full" />
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      <span>{t('premium_features')}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPaymentMethodOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FiCreditCard className="w-5 h-5" />
                  {t('add_payment_method') || 'Add Payment Method'}
                </motion.button>
              </div>
            </div>

            {/* Change Plan Section */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                {t('change_plan')}
              </h2>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center mb-8">
                <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-white' : 'text-violet-200'}`}>
                  {currentLanguage === 'es' ? 'Facturación Mensual' : 'Monthly Billing'}
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly' as 'monthly' | 'yearly')}
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
                    <FiStar className="w-3 h-3 mr-1" />
                    {currentLanguage === 'es' ? 'Ahorra' : 'Save'} 17%
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['1', '2', '3', '4'].map((planId) => {
                  const plan = getPlanDetails(planId);
                  const isCurrentPlan = planId === currentPlanId;

                  return (
                    <motion.div
                      key={planId}
                      className={`p-5 rounded-xl backdrop-blur-sm border ${isCurrentPlan
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-white/5 border-purple-500/20 hover:border-purple-500/50'
                        } transition-colors`}
                      whileHover={!isCurrentPlan ? { y: -5 } : {}}
                    >
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-xl font-bold text-white">{plan.price}</span>
                        {plan.billingCycle !== '-' && (
                          <span className="text-violet-300 text-sm ml-1">/ {plan.billingCycle}</span>
                        )}
                      </div>

                      <ul className="space-y-2 mb-5">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FiCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-violet-200 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={false}
                        onClick={() => {
                          handleUpdateSubscription(planId);
                          const dashboardRoutes = {
                            '1': '/interactive-demo',
                            '2': '/starter-dashboard',
                            '3': '/pro-dashboard',
                            '4': '/enterprise-dashboard'
                          };
                          window.location.href = dashboardRoutes[planId as keyof typeof dashboardRoutes];
                        }}
                        className={`relative w-full bg-gradient-to-r from-purple-600 to-violet-600
                          text-white rounded-lg py-3 px-6 font-semibold
                          transition-all duration-300 ease-in-out
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transform hover:-translate-y-0.5
                          overflow-hidden group`}
                        disabled={processing}
                        style={{
                          background: `linear-gradient(135deg, 
                            rgba(147, 51, 234, 0.9) 0%, 
                            rgba(79, 70, 229, 0.9) 50%, 
                            rgba(236, 72, 153, 0.9) 100%)`
                        }}
                      >
                        <span className="relative z-10">
                          {processing ? t('processing') : parseInt(planId) > parseInt(currentPlanId) ? t('upgrade') : t('downgrade')}
                        </span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle 80px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                              rgba(236, 72, 153, 0.6),
                              transparent 100%)`
                          }}
                        />
                      </motion.button>

                    </motion.div>
                  );
                })}
              </div>

              {/* Enterprise Notice */}
              <div className="mt-8 p-5 bg-white/5 border border-purple-500/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-violet-500/20 p-3 rounded-lg">
                    <FiAlertTriangle className="w-6 h-6 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('need_enterprise_features')}
                    </h3>
                    <p className="text-violet-200 mb-4">
                      {t('enterprise_custom_description')}
                    </p>
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={false}
                      className={`relative inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600
                        text-white rounded-lg font-semibold
                        transition-all duration-300 ease-in-out
                        transform hover:-translate-y-0.5
                        overflow-hidden group`}
                      style={{
                        background: `linear-gradient(135deg, 
                          rgba(147, 51, 234, 0.9) 0%, 
                          rgba(79, 70, 229, 0.9) 50%, 
                          rgba(236, 72, 153, 0.9) 100%)`
                      }}
                    >
                      <span className="relative z-10">
                        {t('contact_our_sales_team')}
                      </span>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle 80px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                            rgba(236, 72, 153, 0.6),
                            transparent 100%)`
                        }}
                      />
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}
