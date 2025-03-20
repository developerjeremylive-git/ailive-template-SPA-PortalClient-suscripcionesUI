import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiSave, FiLock, FiMail, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import AnimatedFooter from '../components/AnimatedFooter';
import ProfileSubscriptionSection from '../components/ProfileSubscriptionSection';
// import CustomerDetailsForm from '../components/CustomerDetailsForm';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.user_metadata?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  if (!user) return null;

  const validatePhone = (value: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError(t('invalid_phone'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError(t('invalid_email'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      setUsernameError(t('username_min_length'));
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setUsernameError(t('username_only_letters'));
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!username || !validateUsername(username)) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateProfile({
        display_name: username
      });

      if (error) throw error;

      setShowSuccess(true);
      setEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError(t('passwords_dont_match'));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t('password_too_short'));
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would call an API to change the password
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(t('error_changing_password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header variant="default" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t('profile')}
            </h1>
            <p className="text-violet-200 mb-8">
              {t('profile_description')}
            </p>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                className="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-xl border border-green-500 border-opacity-30 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {t('profile_updated_successfully')}
              </motion.div>
            )}

            {/* Profile Card */}
            <div className="mb-8">
              <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 overflow-hidden">
                {/* Profile Header */}
                <div className="p-6 bg-gradient-to-r from-purple-700 to-violet-700 bg-opacity-30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
                      {username?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || <FiUser className="w-8 h-8" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {username || email}
                      </h2>
                      <p className="text-violet-200">
                        {t('member_since')}: {new Date(user?.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="ml-auto px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors flex items-center gap-2"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>{t('edit')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="p-6">
                  {editing ? (
                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-violet-200 mb-2" htmlFor="username">
                            {t('username')}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="text-violet-400" />
                            </div>
                            <input
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => {
                                const value = e.target.value;
                                setUsername(value);
                                validateUsername(value);
                              }}
                              className="block w-full pl-10 pr-3 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
                              placeholder={t('enter_username')}
                            />
                          </div>
                          {usernameError && (
                            <p className="mt-2 text-red-400 text-sm">{usernameError}</p>
                          )}
                        </div>
                        {/*    <div>
                          <label className="block text-violet-200 mb-2" htmlFor="email">
                            {t('email')}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="text-violet-400" />
                            </div>
                            <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => {
                                const value = e.target.value;
                                setEmail(value);
                                validateEmail(value);
                              }}
                              className="block w-full pl-10 pr-3 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
                              placeholder={t('enter_email')}
                            />
                          </div>
                          {emailError && (
                            <p className="mt-2 text-red-400 text-sm">{emailError}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-violet-200 mb-2" htmlFor="phone">
                            {t('phone_number')}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiPhone className="text-violet-400" />
                            </div>
                            <input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => {
                                const value = e.target.value;
                                setPhone(value);
                                validatePhone(value);
                              }}
                              className="block w-full pl-10 pr-3 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
                              placeholder={t('enter_phone')}
                            />
                          </div>
                          {phoneError && (
                            <p className="mt-2 text-red-400 text-sm">{phoneError}</p>
                          )}
                        </div>
                     
 */}
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setUsername(user?.user_metadata?.display_name || '');
                            setEditing(false);
                          }}
                          className="px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors"
                          disabled={loading}
                        >
                          {t('cancel')}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition-colors flex items-center gap-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              <span>{t('saving')}</span>
                            </>
                          ) : (
                            <>
                              <FiSave className="w-4 h-4" />
                              <span>{t('save_changes')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-violet-200 mb-2">{t('username')}</h3>
                        <p className="text-white">{username || '—'}</p>
                      </div>
                      <div>
                        <h3 className="text-violet-200 mb-2">{t('email')}</h3>
                        <p className="text-white">{email || '—'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <ProfileSubscriptionSection />

            {/* Password Change Card */}
            {/* <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                {t('security')}
              </h2>

              <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('password')}</h3>
                    <p className="text-violet-300 text-sm">{t('last_changed')}: {new Date(user?.updated_at).toLocaleDateString()}</p>
                  </div>

                  {!changingPassword && (
                    <button
                      onClick={() => setChangingPassword(true)}
                      className="px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors flex items-center gap-2"
                    >
                      <FiLock className="w-4 h-4" />
                      <span>{t('change_password')}</span>
                    </button>
                  )}
                </div>

                {changingPassword && (
                  <form onSubmit={handlePasswordChange}>
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg text-white">
                        {passwordError}
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-violet-200 mb-2" htmlFor="current-password">
                          {t('current_password')}
                        </label>
                        <input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="block w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-violet-200 mb-2" htmlFor="new-password">
                          {t('new_password')}
                        </label>
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-violet-200 mb-2" htmlFor="confirm-password">
                          {t('confirm_password')}
                        </label>
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setChangingPassword(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                        }}
                        className="px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-colors"
                        disabled={loading}
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition-colors"
                        disabled={loading}
                      >
                        {loading ? t('updating') : t('update_password')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div> */}

            {/* Connected Services (can be expanded later) */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                {t('connected_services')}
              </h2>

              <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500 border-opacity-20 p-6">
                <p className="text-violet-200">
                  {t('no_connected_services')}
                </p>
              </div>
            </div>
            
            {/* Customer Details Form */}
            {/* <CustomerDetailsForm /> */}
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}
