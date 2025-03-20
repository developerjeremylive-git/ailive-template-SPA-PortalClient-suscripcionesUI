import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { Model } from './ModelsPage'

// Import getModels function
const getModels = (t: (key: string) => string): Model[] => [
  {
    id: 'gpt4',
    name: 'GPT-4',
    descriptionKey: 'gpt4_desc',
    icon: '🤖',
    category: t('language'),
    featureKeys: ['feature_natural_language', 'feature_content_generation', 'feature_code_assistance'],
    pricing: {
      starter: { monthly: '$9.99/'+t('monthly'), yearly: '$99.99/'+t('yearly') },
      pro: { monthly: '$19.99/'+t('monthly'), yearly: '$199.99/'+t('yearly') },
      enterprise: { monthly: '$99.99/'+t('monthly'), yearly: '$999.99/'+t('yearly') }
    },
    metrics: {
      latency: '~1s',
      availability: '99.9%',
      tokens: t('up_to') + ' 8k ' + t('tokens'),
    },
  },
  {
    id: 'dalle3',
    name: 'DALL-E 3',
    descriptionKey: 'dalle3_desc',
    icon: '🎨',
    category: t('image'),
    featureKeys: ['feature_text_to_image', 'feature_image_editing', 'feature_style_transfer'],
    pricing: {
      starter: { monthly: '$9.99/'+t('monthly'), yearly: '$99.99/'+t('yearly') },
      pro: { monthly: '$19.99/'+t('monthly'), yearly: '$199.99/'+t('yearly') },
      enterprise: { monthly: '$99.99/'+t('monthly'), yearly: '$999.99/'+t('yearly') }
    },
    metrics: {
      latency: '~3s',
      availability: '99.9%',
      resolution: t('up_to') + ' 1024x1024',
    },
  },
  {
    id: 'whisper',
    name: 'Whisper',
    descriptionKey: 'whisper_desc',
    icon: '🎤',
    category: t('speech'),
    featureKeys: ['feature_speech_to_text', 'feature_language_detection', 'feature_accent_handling'],
    pricing: {
      starter: { monthly: '$9.99/'+t('monthly'), yearly: '$99.99/'+t('yearly') },
      pro: { monthly: '$19.99/'+t('monthly'), yearly: '$199.99/'+t('yearly') },
      enterprise: { monthly: '$99.99/'+t('monthly'), yearly: '$999.99/'+t('yearly') }
    },
    metrics: {
      latency: '~2s',
      availability: '99.9%',
      languages: '100+ ' + t('supported'),
    },
  },
  {
    id: 'stable-diffusion',
    name: t('stable_diffusion'),
    descriptionKey: 'stable_diffusion_desc',
    icon: '✨',
    category: t('image'),
    featureKeys: ['feature_image_generation', 'feature_inpainting', 'feature_outpainting'],
    pricing: {
      starter: { monthly: '$9.99/'+t('monthly'), yearly: '$99.99/'+t('yearly') },
      pro: { monthly: '$19.99/'+t('monthly'), yearly: '$199.99/'+t('yearly') },
      enterprise: { monthly: '$99.99/'+t('monthly'), yearly: '$999.99/'+t('yearly') }
    },
    metrics: {
      latency: '~4s',
      availability: '99.9%',
      resolution: t('up_to') + ' 2048x2048',
    },
  },
  {
    id: 'claude',
    name: 'Claude',
    descriptionKey: 'claude_desc',
    icon: '🧠',
    category: t('language'),
    featureKeys: ['feature_task_assistance', 'feature_research', 'feature_analysis'],
    pricing: {
      starter: { monthly: '$9.99/'+t('monthly'), yearly: '$99.99/'+t('yearly') },
      pro: { monthly: '$19.99/'+t('monthly'), yearly: '$199.99/'+t('yearly') },
      enterprise: { monthly: '$99.99/'+t('monthly'), yearly: '$999.99/'+t('yearly') }
    },
    metrics: {
      latency: '~1s',
      availability: '99.9%',
      tokens: t('up_to') + ' 100k ' + t('tokens'),
    },
  },
  {
    id: 'llama',
    name: 'LLaMA',
    descriptionKey: 'llama_desc',
    icon: '🦙',
    category: t('language'),
    featureKeys: ['feature_text_generation', 'feature_translation', 'feature_classification'],
    pricing: {
      starter: { monthly: '$9.99/'+t('monthly'), yearly: '$99.99/'+t('yearly') },
      pro: { monthly: '$19.99/'+t('monthly'), yearly: '$199.99/'+t('yearly') },
      enterprise: { monthly: '$99.99/'+t('monthly'), yearly: '$999.99/'+t('yearly') }
    },
    metrics: {
      latency: '~2s',
      availability: '99.9%',
      tokens: t('up_to') + ' 4k ' + t('tokens'),
    },
  },
]

export default function ModelDetailPage() {
  const { modelId } = useParams()
  const navigate = useNavigate()
  const { isDarkTheme } = useApp()
  const { t, currentLanguage } = useLanguage()
  const { user, userSubscription } = useAuth()
  const model = getModels(t).find((m) => m.id === modelId)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  if (!model) {
    return (
      <>
        <Header variant="models" />
        <div className="min-h-screen bg-theme-gradient py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl text-white mb-8">{t('no_models_found')}</h1>
            <button
              onClick={() => navigate('/models')}
              className="text-violet-200 hover:text-white transition-colors"
            >
              {t('back_to_models')}
            </button>
          </div>
        </div>
      </>
    )
  }

  const handleTryForFree = () => {
    if (!user) {
      navigate('/pricing')
      return
    }

    // Get the minimum required plan for this model
    const requiredPlan = model.pricing.starter === 'Free' ? '1' : '2'
    const currentPlan = userSubscription?.plan_id || '1'

    if (parseInt(currentPlan) < parseInt(requiredPlan)) {
      navigate('/pricing')
      return
    }

    navigate(`/interactive-demo?model=${modelId}`)
  }

  const handleContactSales = () => {
    navigate('/contact')
  }

  return (
    <>
      <Header variant="models" />
      <div className="min-h-screen bg-theme-gradient">
        <div className="container mx-auto px-4 pt-32 pb-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm rounded-xl p-8 mb-8 border border-purple-500/20 shadow-lg shadow-purple-500/10 hover:shadow-pink-500/20 transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] mr-6 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-pink-500/30">
                <div className="w-full h-full rounded-2xl bg-[var(--theme-background)] flex items-center justify-center">
                  <span className="text-5xl">{model.icon}</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                  {model.name}
                </h1>
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-pink-500/30 transition-all duration-300">
                  {model.category}
                </span>
              </div>
            </div>
            <p className="text-violet-200 text-lg mb-8 leading-relaxed">{t(model.descriptionKey)}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(model.metrics).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg p-6 border border-purple-500/20 hover:border-pink-500/20 transition-all duration-300 transform hover:scale-105"
                >
                  <h3 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-purple-400' : 'text-white'}`}>
                    {t(`model_card_${key}`)}
                  </h3>
                  <p className="text-white text-xl font-semibold">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className={`text-2xl font-semibold mb-6 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                {t('model_card_features')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {model.featureKeys.map((featureKey, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-4 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/10 hover:border-pink-500/20 transition-all duration-300"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-xl mr-3">•</span>
                    <span className="text-violet-200">{t(featureKey)}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-8">
              <h2 className={`text-2xl font-semibold mb-6 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                {t('technical_specifications')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg p-6 border border-purple-500/20 hover:border-pink-500/20 transition-all duration-300">
                  <h3 className="text-lg font-medium text-white mb-4">{t('architecture')}</h3>
                  <ul className="space-y-3">
                    <li className="text-violet-200 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                      {model.id === 'gpt4' && t('gpt4_architecture_1')}
                      {model.id === 'dalle3' && t('dalle3_architecture_1')}
                      {model.id === 'whisper' && t('whisper_architecture_1')}
                      {model.id === 'stable-diffusion' && t('stable_diffusion_architecture_1')}
                      {model.id === 'claude' && t('claude_architecture_1')}
                      {model.id === 'llama' && t('llama_architecture_1')}

                    </li>
                    <li className="text-violet-200 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                      {model.id === 'gpt4' && t('gpt4_architecture_2')}
                      {model.id === 'dalle3' && t('dalle3_architecture_2')}
                      {model.id === 'whisper' && t('whisper_architecture_2')}
                      {model.id === 'stable-diffusion' && t('stable_diffusion_architecture_2')}
                      {model.id === 'claude' && t('claude_architecture_2')}
                      {model.id === 'llama' && t('llama_architecture_2')}

                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg p-6 border border-purple-500/20 hover:border-pink-500/20 transition-all duration-300">
                  <h3 className="text-lg font-medium text-white mb-4">{t('capabilities')}</h3>
                  <ul className="space-y-3">
                    <li className="text-violet-200 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                      {model.id === 'gpt4' && t('gpt4_capability_1')}
                      {model.id === 'dalle3' && t('dalle3_capability_1')}
                      {model.id === 'whisper' && t('whisper_capability_1')}
                      {model.id === 'stable-diffusion' && t('stable_diffusion_capability_1')}
                      {model.id === 'claude' && t('claude_capability_1')}
                      {model.id === 'llama' && t('llama_capability_1')}

                    </li>
                    <li className="text-violet-200 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                      {model.id === 'gpt4' && t('gpt4_capability_2')}
                      {model.id === 'dalle3' && t('dalle3_capability_2')}
                      {model.id === 'whisper' && t('whisper_capability_2')}
                      {model.id === 'stable-diffusion' && t('stable_diffusion_capability_2')}
                      {model.id === 'claude' && t('claude_capability_2')}
                      {model.id === 'llama' && t('llama_capability_2')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-8">
              <h2 className={`text-2xl font-semibold mb-6 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                {t('use_cases')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  model.id === 'gpt4' ? ['Content Creation', 'Code Development', 'Research Analysis'] :
                    model.id === 'dalle3' ? ['Digital Art', 'Marketing Visuals', 'Product Design'] :
                      model.id === 'whisper' ? ['Meeting Transcription', 'Subtitle Generation', 'Voice Commands'] :
                        model.id === 'stable-diffusion' ? ['Concept Art', 'Image Editing', 'Asset Generation'] :
                          model.id === 'claude' ? ['Data Analysis', 'Content Writing', 'Task Automation'] :
                            ['Language Processing', 'Text Generation', 'Custom Applications']
                ].flat().map((useCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg p-6 border border-purple-500/20 hover:border-pink-500/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <h3 className="text-lg font-medium text-white mb-3">{useCase}</h3>
                    <p className="text-violet-200">
                      {t(`${model.id}_${useCase.toLowerCase().replace(' ', '_')}_desc`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pricing Tiers */}
            <div>
              <h2 className={`text-2xl font-semibold mb-6 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                {t('model_card_pricing')}
              </h2>

              {/* Billing cycle toggle */}
              <div className="flex items-center justify-center mb-8">
                <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-white' : 'text-violet-200'}`}>
                  {currentLanguage === 'es' ? 'Facturación Mensual' : 'Monthly Billing'}
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
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
                    <SparklesIcon className="w-3 h-3 mr-1" />
                    {currentLanguage === 'es' ? 'Ahorra' : 'Save'} 17%
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(model.pricing).map(([tier, price], index) => {
                  const planEmojis = {
                    pro: '🚀',
                    enterprise: '⭐️ 💎 🌟'
                  };
                  const isDarkMode = document.documentElement.classList.contains('dark');
                  const planColor = {
                    starter: {
                      primary: '#ec4899',
                      secondary: '#f43f5e',
                      accent: '#f97316',
                      bgOpacity: '20',
                      border: '#f43f5e',
                      button: 'from-pink-500 to-rose-500',
                      hover: 'hover:border-rose-400'
                    },
                    pro: {
                      primary: '#00C853',
                      secondary: '#00E676',
                      accent: '#69F0AE',
                      bgOpacity: '20',
                      border: '#00E676',
                      button: 'from-green-500 to-emerald-500',
                      hover: 'hover:border-green-400'
                    },
                    enterprise: {
                      primary: '#f59e0b',
                      secondary: '#f97316',
                      accent: '#ef4444',
                      bgOpacity: '20',
                      border: '#f97316',
                      button: 'from-amber-500 to-orange-500',
                      hover: 'hover:border-orange-400'
                    }
                  }[tier.toLowerCase()] || planColor?.starter;

                  return (
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      className={`pricing-card relative rounded-2xl p-8 backdrop-blur-sm
                        border-2 transition-all duration-300 ease-in-out cursor-pointer
                        ${tier === 'pro' ? `border-[${planColor?.border}]` : `border-[${planColor?.primary}]`}
                        ${planColor?.hover}
                        group overflow-visible`}
                      style={{
                        background: `linear-gradient(135deg, 
                          ${planColor?.primary}${planColor?.bgOpacity} 0%, 
                          ${planColor?.secondary}${planColor?.bgOpacity} 50%, 
                          ${planColor?.accent}${planColor?.bgOpacity} 100%)`,
                        transform: 'translate3d(0, 0, 0)'
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none will-change-transform"
                        style={{
                          background: `radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                            ${planColor?.accent}40,
                            ${planColor?.secondary}30 40%,
                            ${planColor?.primary}20 60%,
                            transparent 100%)`
                        }}
                      />

                      {tier === 'pro' && (
                        <div className="absolute -top-5 -left-5 transform -rotate-12 text-4xl animate-bounce-gentle z-20">
                          {planEmojis.pro}
                        </div>
                      )}

                      {tier === 'enterprise' && (
                        <div className="absolute -top-5 -right-5 transform rotate-12 text-4xl flex gap-2 z-20">
                          {planEmojis.enterprise.split(' ').map((emoji, i) => (
                            <span key={i} className={`animate-pulse-${i + 1}`}>{emoji}</span>
                          ))}
                        </div>
                      )}

                      <h3 className={`text-lg font-semibold mb-3 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                        {t(`model_card_${tier}`)}
                      </h3>
                      <p className={`text-3xl font-bold mb-6 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                        {typeof price === 'string' ? price : price[billingCycle]}
                      </p>
                      <button
                        // onClick={tier === 'enterprise' ? handleContactSales : handleTryForFree}
                        onClick={handleTryForFree}
                        className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r ${planColor?.button} text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300`}
                      >
                        {/* {tier === 'enterprise' ? t('contact_sales') : t('try_for_free')} */}
                        {t('try_for_free')}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            {/* Try Demo Section */}
            <div className="mt-8 text-center">
              <h2 className={`text-2xl font-semibold mb-6 ${isDarkTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' : 'text-white'}`}>
                {t('try_demo')}
              </h2>
              <p className="text-violet-200 mb-6">
                {t('try_demo_description')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/interactive-demo?model=${modelId}`)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300"
              >
                {t('try_model_now')}
              </motion.button>
            </div>
          </motion.div>
        </div>
        <AnimatedFooter />
      </div>
    </>
  )
}