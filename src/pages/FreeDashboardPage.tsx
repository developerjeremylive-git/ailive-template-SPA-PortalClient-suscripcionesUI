import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight, FiClock, FiMessageSquare, FiZap } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import DashboardLayout from '../components/DashboardLayout';

export default function FreeDashboardPage() {
  const { t } = useLanguage();

  // Sample prompt templates for free tier
  const promptTemplates = [
    {
      id: 'pt1',
      title: 'Simple Chatbot',
      description: 'Create a conversational response to the user query',
      prompt: 'You are a helpful assistant. Respond to the following query in a friendly and informative way: {{query}}',
      category: 'Conversation'
    },
    {
      id: 'pt2',
      title: 'Text Summarizer',
      description: 'Summarize a long piece of text into key points',
      prompt: 'Summarize the following text into 3-5 key points: {{text}}',
      category: 'Productivity'
    },
    {
      id: 'pt3',
      title: 'Code Helper',
      description: 'Get help with coding problems or questions',
      prompt: 'You are a programming expert. Help solve this coding problem or answer this question: {{code_question}}',
      category: 'Development'
    }
  ];

  return (
    <DashboardLayout
      title={t('free_dashboard')}
      subtitle={t('free_dashboard_subtitle')}
      planName={t('free_plan')}
      planIcon={<FiHeart className="w-5 h-5" />}
    >
      {/* Welcome Card */}
      <div className="mb-12">
        <div className="p-6 bg-gradient-to-br from-purple-600/30 to-violet-600/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-3">
            {t('welcome_to_free_plan')}
          </h2>
          <p className="text-violet-200 mb-6">
            {t('free_plan_description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-white/5 rounded-lg">
              <FiMessageSquare className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <div className="text-white font-medium">{t('basic_chat')}</div>
                <div className="text-sm text-violet-300">{t('included')}</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white/5 rounded-lg">
              <FiZap className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <div className="text-white font-medium">100 {t('requests')}</div>
                <div className="text-sm text-violet-300">{t('per_day')}</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white/5 rounded-lg">
              <FiClock className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <div className="text-white font-medium">{t('standard_speed')}</div>
                <div className="text-sm text-violet-300">{t('response_time')}</div>
              </div>
            </div>
          </div>
          
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            {t('upgrade_for_more')}
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t('quick_start')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl hover:bg-opacity-10 transition-all border border-transparent hover:border-purple-500/20"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-purple-600/20 rounded-full mb-4 text-2xl">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('try_chat')}
            </h3>
            <p className="text-violet-200 mb-4">
              {t('try_chat_description')}
            </p>
            <Link
              to="/chat"
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              {t('start_chatting')}
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl hover:bg-opacity-10 transition-all border border-transparent hover:border-purple-500/20"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-purple-600/20 rounded-full mb-4 text-2xl">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('explore_models')}
            </h3>
            <p className="text-violet-200 mb-4">
              {t('explore_models_description')}
            </p>
            <Link
              to="/models"
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              {t('browse_models')}
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl hover:bg-opacity-10 transition-all border border-transparent hover:border-purple-500/20"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-purple-600/20 rounded-full mb-4 text-2xl">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('check_usage')}
            </h3>
            <p className="text-violet-200 mb-4">
              {t('check_usage_description')}
            </p>
            <Link
              to="/usage"
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              {t('view_stats')}
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Prompt Templates */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t('prompt_templates')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promptTemplates.map((template) => (
            <motion.div
              key={template.id}
              className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <span className="inline-block px-3 py-1 mb-4 bg-purple-500/20 rounded-full text-sm text-purple-300">
                {template.category}
              </span>
              <h3 className="text-xl font-semibold text-white mb-2">
                {template.title}
              </h3>
              <p className="text-violet-200 mb-4">
                {template.description}
              </p>
              <div className="p-3 bg-gray-900 rounded-lg mb-4 overflow-x-auto">
                <pre className="text-sm text-violet-200">
                  <code>{template.prompt}</code>
                </pre>
              </div>
              <Link
                to={`/chat?template=${template.id}`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {t('use_template')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {t('usage_stats')}
        </h2>
        
        <div className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
              <h4 className="text-violet-200 mb-2">{t('api_calls')}</h4>
              <div className="text-3xl font-bold text-white">42</div>
              <div className="text-sm text-violet-300 mt-1">{t('today')}</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <div className="text-xs text-violet-300 mt-1">42/100 {t('today')}</div>
            </div>
            
            <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
              <h4 className="text-violet-200 mb-2">{t('api_calls_month')}</h4>
              <div className="text-3xl font-bold text-white">428</div>
              <div className="text-sm text-violet-300 mt-1">{t('this_month')}</div>
            </div>
            
            <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
              <h4 className="text-violet-200 mb-2">{t('plan_limit')}</h4>
              <div className="text-3xl font-bold text-white">100</div>
              <div className="text-sm text-violet-300 mt-1">{t('requests_per_day')}</div>
              <Link 
                to="/pricing" 
                className="mt-3 text-sm text-purple-300 hover:text-white inline-flex items-center gap-1"
              >
                {t('need_more')}
                <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
