import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiEye, FiEyeOff, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

type ApiKeyManagerProps = {
  serviceType: 'openai' | 'huggingface' | 'anthropic' | 'custom';
  title: string;
  description: string;
  requiredPlan: string;
};

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  serviceType,
  title,
  description,
  requiredPlan
}) => {
  const { user, supabase, hasAccess } = useAuth();
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validate API key length
  const isValidApiKey = (key: string) => {
    const minLength = 32;
    const maxLength = 96;
    return key.length >= minLength && key.length <= maxLength;
  };

  // Save the API key to the database
  const saveApiKey = async () => {
    if (!user) return;

    if (!apiKey.trim()) {
      toast.error('API key cannot be empty', {
        position: 'top-center',
        duration: 3000
      });
      return;
    }

    if (!isValidApiKey(apiKey)) {
      toast.error('API key must be between 32 and 96 characters long', {
        position: 'top-center',
        duration: 3000
      });
      return;
    }

    setIsSaving(true);
    try {
      // Check if key already exists
      const { data, error: checkError } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_type', serviceType);

      if (checkError) {
        throw checkError;
      }

      if (data && data.length > 0) {
        // Update existing key
        const { error: updateError } = await supabase
          .from('api_keys')
          .update({
            key_value: apiKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', data[0].id);

        if (updateError) throw updateError;
      } else {
        // Insert new key
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            service_type: serviceType,
            key_value: apiKey,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast.success('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate a new API key - only for custom keys
  const generateNewKey = async () => {
    if (serviceType !== 'custom' || !user) return;

    setIsLoading(true);
    try {
      // Generate a random key (in a real app, this would likely come from a server)
      const randomKey = 'SK-' + Array(32)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');

      setApiKey(randomKey);
      // Auto-save the new key
      await saveNewKey(randomKey);

      toast.success('New API key generated');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate new API key');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to save a new key
  const saveNewKey = async (key: string) => {
    if (!user) return;

    try {
      // Check if key already exists
      const { data, error: checkError } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_type', serviceType);

      if (checkError) {
        throw checkError;
      }

      if (data && data.length > 0) {
        // Update existing key
        const { error: updateError } = await supabase
          .from('api_keys')
          .update({
            key_value: key,
            updated_at: new Date().toISOString()
          })
          .eq('id', data[0].id);

        if (updateError) throw updateError;
      } else {
        // Insert new key
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            service_type: serviceType,
            key_value: key,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving new API key:', error);
      throw error;
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  // Render function
  if (!hasAccess(requiredPlan)) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-200 p-4 rounded-xl shadow-inner transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-amber-100">{requiredPlan === '2' ? t('Starter') : requiredPlan === '3' ? t('Pro') : t('Enterprise')} {t('plan_required')}</p>
              <p className="text-sm text-amber-300/80 mt-1">{t('upgrade_to_access')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-purple-500/5 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden transform hover:scale-[1.02]">
      <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent flex items-center">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="p-5">
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="relative space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('enter_api_key') as string}
                className="w-full bg-white/5 rounded-lg px-6 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-purple-500/20 transition-all duration-300 hover:bg-white/10"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-3">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10"
                  title={showApiKey ? String(t('hide_api_key')) : String(t('show_api_key'))}
                >
                  {showApiKey ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveApiKey}
            disabled={isSaving || isLoading || !apiKey.trim() || !isValidApiKey(apiKey)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-colors duration-300"
          >
            {isSaving ? "Saving..." : t('save_api_key')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
