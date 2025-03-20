import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import { FiSearch, FiGlobe, FiCode, FiMessageSquare, FiBook, FiCpu } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';

export default function ProDashboard() {
  const { t } = useLanguage();
  const { user, userSubscription, setIsLoginOpen } = useAuth();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolLaunch = (toolName: string) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setSelectedTool(toolName);
  };

  const features = [
    {
      icon: <FiGlobe className="w-6 h-6" />,
      name: 'Hugging Face API',
      description: t('huggingface_api_description') || 'Access to the latest AI models and Spaces from Hugging Face for various AI tasks',
      comingSoon: false,
      onClick: () => handleToolLaunch('huggingface'),
    },
    {
      icon: <FiSearch className="w-6 h-6" />,
      name: 'Browser Agent',
      description: t('browser_agent_description') || 'Interactive chat agent that can browse and extract information from websites',
      comingSoon: false,
      onClick: () => handleToolLaunch('browser'),
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      name: 'Scraping Agent',
      description: t('scraping_agent_description') || 'AI-powered agent that can create and inject JavaScript for form filling and data extraction',
      comingSoon: false,
      onClick: () => handleToolLaunch('scraping'),
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      name: 'Deep Research',
      description: t('deep_research_description') || 'Advanced research capabilities with deep analysis and comprehensive insights',
      comingSoon: false,
      onClick: () => handleToolLaunch('research'),
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      name: 'AI Assistant',
      description: t('ai_assistant_description') || 'Powerful AI assistant with enhanced capabilities and 100 API calls per day',
      comingSoon: false,
      onClick: () => handleToolLaunch('assistant'),
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      name: 'Advanced Chat',
      description: t('pro_chat_description') || 'Premium chat experience with extended features and higher API limits',
      comingSoon: false,
      onClick: () => handleToolLaunch('chat'),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--theme-background)]">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--theme-text-primary)]">
              {t('pro_dashboard_welcome')}
            </h1>
            <div className="bg-gradient-to-r from-purple-600 to-violet-700 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-white font-medium">
                {t('subscription_type')}: {t('pro_plan')}
              </span>
            </div>
          </div>

          {/* Support Message */}
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-600/10 to-violet-700/10 rounded-lg border border-purple-500/20">
            <p className="text-[var(--theme-text-primary)] text-sm">
              {t('enterprise_support_message')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative bg-[var(--theme-background)] bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-[var(--theme-border)] hover:border-[var(--theme-text-highlight)] transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[var(--theme-background-highlight)] bg-opacity-10 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-[var(--theme-text-primary)]">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-[var(--theme-text-secondary)] min-h-[60px]">
                  {feature.description}
                </p>
                {feature.comingSoon ? (
                  <span className="absolute top-4 right-4 text-xs bg-[var(--theme-background-highlight)] bg-opacity-20 text-[var(--theme-text-highlight)] px-2 py-1 rounded-full">
                    {t('coming_soon')}
                  </span>
                ) : (
                  <button 
                    onClick={feature.onClick}
                    className="mt-4 w-full py-2 bg-[var(--theme-background-highlight)] hover:bg-[var(--theme-background-highlight-hover)] text-[var(--theme-text-primary)] rounded-lg transition-colors"
                  >
                    {t('launch_tool')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
