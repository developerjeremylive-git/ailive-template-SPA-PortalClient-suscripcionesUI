import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from './Header';
import AnimatedFooter from './AnimatedFooter';
import { FiHome, FiMessageSquare, FiZap, FiCpu, FiGrid, FiSettings } from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  planName: string;
  planIcon: ReactNode;
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  planName, 
  planIcon 
}: DashboardLayoutProps) {
  const { user, subscription } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header variant="default" />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white border-opacity-10">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    {planIcon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{planName}</h3>
                    <span className="text-sm text-violet-300">{t('dashboard')}</span>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <FiHome className="w-5 h-5" />
                    <span>{t('dashboard_overview')}</span>
                  </Link>
                  <Link
                    to="/chat"
                    className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <FiMessageSquare className="w-5 h-5" />
                    <span>{t('ai_chat')}</span>
                  </Link>
                  <Link
                    to="/models"
                    className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <FiCpu className="w-5 h-5" />
                    <span>{t('ai_models')}</span>
                  </Link>
                  <Link
                    to="/usage"
                    className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <FiZap className="w-5 h-5" />
                    <span>{t('usage_stats')}</span>
                  </Link>
                  <Link
                    to="/tools"
                    className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <FiGrid className="w-5 h-5" />
                    <span>{t('tools')}</span>
                  </Link>
                  <Link
                    to="/profile/settings"
                    className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <FiSettings className="w-5 h-5" />
                    <span>{t('settings')}</span>
                  </Link>
                </nav>
                
                {subscription?.plan_id !== '4' && (
                  <div className="mt-8 p-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{t('upgrade_plan')}</h4>
                    <p className="text-sm text-white text-opacity-80 mb-3">
                      {t('unlock_more_features')}
                    </p>
                    <Link
                      to="/pricing"
                      className="block w-full py-2 text-center bg-white text-purple-600 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      {t('upgrade')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {title}
                </h1>
                <p className="text-violet-200">
                  {subtitle}
                </p>
              </div>
              
              {children}
            </motion.div>
          </div>
        </div>
      </div>
      
      <AnimatedFooter />
    </div>
  );
}
