import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiCreditCard, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, subscription, signOut } = useAuth();
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get plan name based on plan_id
  const getPlanName = (planId: string) => {
    switch (planId) {
      case '2':
        return t('starter_plan');
      case '3':
        return t('pro_plan');
      case '4':
        return t('enterprise_plan');
      default:
        return t('free_plan');
    }
  };

  const planName = subscription ? getPlanName(subscription.plan_id) : t('free_plan');
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center text-white">
          {user.email?.charAt(0).toUpperCase() || <FiUser />}
        </div>
        <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden bg-[var(--theme-background)] border border-purple-500/20 shadow-xl shadow-purple-500/20 z-50"
          >
            <div className="p-4 border-b border-white/10">
              <p className="text-white font-medium truncate">{user.email}</p>
              <div className="flex items-center mt-1">
                <span className="px-2 py-1 bg-purple-500 bg-opacity-20 rounded-full text-xs text-purple-300">
                  {planName}
                </span>
              </div>
            </div>

            <nav className="p-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiGrid className="w-5 h-5 text-purple-400" />
                <span>{t('dashboard')}</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiUser className="w-5 h-5 text-purple-400" />
                <span>{t('profile')}</span>
              </Link>
              <Link
                to="/subscription"
                className="flex items-center gap-3 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiCreditCard className="w-5 h-5 text-purple-400" />
                <span>{t('subscription')}</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="w-5 h-5 text-purple-400" />
                <span>{t('settings')}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <FiLogOut className="w-5 h-5 text-purple-400" />
                <span>{t('sign_out')}</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
