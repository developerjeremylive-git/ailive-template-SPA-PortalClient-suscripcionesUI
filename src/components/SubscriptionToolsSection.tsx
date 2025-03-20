import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const SubscriptionToolsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          {...fadeInUp}
        >
          {t('subscription_tools_title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
            {...fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-3">
              {t('subscription_management_title')}
            </h3>
            <p className="text-neutral-600">
              {t('subscription_management_description')}
            </p>
          </motion.div>

          <motion.div
            className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
            {...fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-3">
              {t('usage_tracking_title')}
            </h3>
            <p className="text-neutral-600">
              {t('usage_tracking_description')}
            </p>
          </motion.div>

          <motion.div
            className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ y: -5 }}
            {...fadeInUp}
          >
            <h3 className="text-xl font-semibold mb-3">
              {t('plan_comparison_title')}
            </h3>
            <p className="text-neutral-600">
              {t('plan_comparison_description')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionToolsSection;
