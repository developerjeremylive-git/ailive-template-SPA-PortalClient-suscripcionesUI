import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../context/ApiContext'
import { getPlanName, formatStorageSize, getFeatureLimit, PlanType } from '../utils/subscriptionHelpers'

const planColors = {
  free: {
    light: {
      primary: '#7B2BF9',  // Violeta vibrante
      secondary: '#9747FF',
      accent: '#B47AFF',
      border: '#B47AFF',
      hover: 'hover:shadow-[0_0_30px_rgba(123,43,249,0.3)]',
      button: 'from-[#7B2BF9] to-[#9747FF] hover:from-[#9747FF] hover:to-[#7B2BF9]',
      text: 'text-white',
      bgOpacity: '95'
    },
    dark: {
      primary: '#7B2BF9',
      secondary: '#9747FF',
      accent: '#B47AFF',
      border: '#B47AFF',
      hover: 'hover:shadow-[0_0_30px_rgba(123,43,249,0.4)]',
      button: 'from-[#7B2BF9] to-[#9747FF] hover:from-[#9747FF] hover:to-[#7B2BF9]',
      text: 'text-white',
      bgOpacity: '95'
    }
  },
  starter: {
    light: {
      primary: '#FF0080',  // Rosa mexicano
      secondary: '#FF1493',
      accent: '#FF69B4',
      border: '#FF69B4',
      hover: 'hover:shadow-[0_0_30px_rgba(255,0,128,0.3)]',
      button: 'from-[#FF0080] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF0080]',
      text: 'text-white',
      bgOpacity: '95'
    },
    dark: {
      primary: '#FF0080',
      secondary: '#FF1493',
      accent: '#FF69B4',
      border: '#FF69B4',
      hover: 'hover:shadow-[0_0_30px_rgba(255,0,128,0.4)]',
      button: 'from-[#FF0080] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF0080]',
      text: 'text-white',
      bgOpacity: '95'
    }
  },
  pro: {
    light: {
      primary: '#00C853',  // Verde vibrante
      secondary: '#00E676',
      accent: '#69F0AE',
      border: '#69F0AE',
      hover: 'hover:shadow-[0_0_30px_rgba(0,200,83,0.3)]',
      button: 'from-[#00C853] to-[#00E676] hover:from-[#00E676] hover:to-[#00C853]',
      text: 'text-white',
      bgOpacity: '95'
    },
    dark: {
      primary: '#00C853',
      secondary: '#00E676',
      accent: '#69F0AE',
      border: '#69F0AE',
      hover: 'hover:shadow-[0_0_30px_rgba(0,200,83,0.4)]',
      button: 'from-[#00C853] to-[#00E676] hover:from-[#00E676] hover:to-[#00C853]',
      text: 'text-white',
      bgOpacity: '95'
    }
  },
  enterprise: {
    light: {
      primary: '#FF6D00',  // Naranja brillante
      secondary: '#FF9100',
      accent: '#FFAB40',
      border: '#FFAB40',
      hover: 'hover:shadow-[0_0_30px_rgba(255,109,0,0.3)]',
      button: 'from-[#FF6D00] to-[#FF9100] hover:from-[#FF9100] hover:to-[#FF6D00]',
      text: 'text-white',
      bgOpacity: '95'
    },
    dark: {
      primary: '#FF6D00',
      secondary: '#FF9100',
      accent: '#FFAB40',
      border: '#FFAB40',
      hover: 'hover:shadow-[0_0_30px_rgba(255,109,0,0.4)]',
      button: 'from-[#FF6D00] to-[#FF9100] hover:from-[#FF9100] hover:to-[#FF6D00]',
      text: 'text-white',
      bgOpacity: '95'
    }
  }
}

// CSS animations for emojis
const emojiAnimations = `
  @keyframes bounce-gentle {
    0%, 100% { transform: translateY(0) rotate(-12deg); }
    50% { transform: translateY(-5px) rotate(-12deg); }
  }
  @keyframes pulse-1 {
    0%, 100% { transform: scale(1) rotate(12deg); }
    50% { transform: scale(1.1) rotate(12deg); }
  }
  @keyframes pulse-2 {
    0%, 100% { transform: scale(1) rotate(12deg); }
    50% { transform: scale(1.1) rotate(12deg); }
  }
  @keyframes pulse-3 {
    0%, 100% { transform: scale(1) rotate(12deg); }
    50% { transform: scale(1.1) rotate(12deg); }
  }
  .animate-bounce-gentle {
    animation: bounce-gentle 2s ease-in-out infinite;
  }
  .animate-pulse-1 {
    animation: pulse-1 2s ease-in-out infinite;
    animation-delay: 0s;
  }
  .animate-pulse-2 {
    animation: pulse-2 2s ease-in-out infinite;
    animation-delay: 0.3s;
  }
  .animate-pulse-3 {
    animation: pulse-3 2s ease-in-out infinite;
    animation-delay: 0.6s;
  }
`;

export default function PricingPage() {
  const { t, currentLanguage } = useLanguage()
  const { user, userSubscription, availablePlans, hasAccess, redirectToCheckout, setIsLoginOpen } = useAuth()
  const { isApiLimitReached } = useApi()
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isUpdating, setIsUpdating] = useState(false)

  // Fallback plans in case API fails to load
  const fallbackPlans = [
    {
      id: 'free',
      name: currentLanguage === 'es' ? 'Gratis' : 'Free',
      description: currentLanguage === 'es' ? 'Funciones básicas para uso personal' : 'Basic features for personal use',
      price_monthly: 0,
      price_yearly: 0,
      billing_cycle: 'monthly',
      features: [
        currentLanguage === 'es' ? 'Chat de IA Básico' : 'Basic AI Chat',
        currentLanguage === 'es' ? '5 llamadas API por día' : '5 API calls per day',
        currentLanguage === 'es' ? 'Soporte comunitario' : 'Community Support',
        currentLanguage === 'es' ? 'Tiempo de respuesta estándar' : 'Standard Response Time'
      ],
      popular: false,
    },
    {
      id: 'starter',
      name: currentLanguage === 'es' ? 'Inicial' : 'Starter',
      description: currentLanguage === 'es' ? 'Funciones mejoradas para equipos pequeños' : 'Enhanced features for small teams',
      price_monthly: 9.99,
      price_yearly: 99.99,
      billing_cycle: 'monthly',
      features: [
        currentLanguage === 'es' ? 'Chat de IA Avanzado' : 'Advanced AI Chat',
        currentLanguage === 'es' ? 'Acceso API Hugging Face - Últimos Modelos y Espacios de IA' : 'Hugging Face API Access - Latest AI Models & Spaces',
        currentLanguage === 'es' ? 'Agente de Navegador - Interacción Web Inteligente y Extracción de Datos' : 'Browser Agent - Smart Web Interaction & Data Extraction',
        currentLanguage === 'es' ? '25 llamadas API por día' : '25 API calls per day',
        currentLanguage === 'es' ? 'Soporte prioritario con tiempo de respuesta rápido' : 'Priority Support with Fast Response Time'
      ],
      popular: true,
    },
    {
      id: 'pro',
      name: currentLanguage === 'es' ? 'Profesional' : 'Professional',
      description: currentLanguage === 'es' ? 'Funciones avanzadas para empresas' : 'Advanced features for businesses',
      price_monthly: 19.99,
      price_yearly: 199.99,
      billing_cycle: 'monthly',
      features: [
        currentLanguage === 'es' ? 'Todas las funciones Iniciales' : 'All Starter Features',
        currentLanguage === 'es' ? 'Agente de Scraping - Llenado de Formularios y Recopilación de Datos' : 'Scraping Agent - Form Filling & Data Collection',
        currentLanguage === 'es' ? 'Investigación Profunda - Análisis Avanzado y Perspectivas' : 'Deep Research - Advanced Analysis & Insights',
        currentLanguage === 'es' ? 'Asistente de IA con Capacidades Mejoradas' : 'AI Assistant with Enhanced Capabilities',
        currentLanguage === 'es' ? '100 llamadas API por día' : '100 API calls per day',
        currentLanguage === 'es' ? 'Soporte premium con acceso 24/7' : 'Premium Support with 24/7 Access'
      ],
      popular: false,
    },
    {
      id: 'enterprise',
      name: currentLanguage === 'es' ? 'Empresarial' : 'Enterprise',
      description: currentLanguage === 'es' ? 'Acceso completo para grandes organizaciones' : 'Complete access for large organizations',
      price_monthly: 99.99,
      price_yearly: 999.99,
      billing_cycle: 'monthly',
      features: [
        currentLanguage === 'es' ? 'Todas las funciones Profesionales' : 'All Pro Features',
        currentLanguage === 'es' ? 'Desarrollo y Despliegue de Modelos IA Personalizados' : 'Custom AI Models Development & Deployment',
        currentLanguage === 'es' ? 'Ajuste y Optimización de Modelos' : 'Model Fine-tuning & Optimization',
        currentLanguage === 'es' ? 'Llamadas API ilimitadas' : 'Unlimited API Calls',
        currentLanguage === 'es' ? 'Equipo de soporte dedicado 24/7' : '24/7 Dedicated Support Team',
        currentLanguage === 'es' ? 'Integraciones y Soluciones Personalizadas' : 'Custom Integrations & Solutions'
      ],
      popular: false,
    },
  ]

  // Use available plans from context or fallback to default plans
  const plans = availablePlans.length > 0 
    ? availablePlans
    : fallbackPlans

  // Map plan IDs to their types based on subscription tiers
  const getPlanType = (planId: string) => {
    // Free: Basic AI Chat, 5 API calls/day
    // Starter: Hugging Face API, Browser Agent
    // Pro: All Starter features + Deep Research, AI Assistant
    // Enterprise: All Pro features + Custom Models, fine-tuning
    switch (planId) {
      case 'free': return 'free';
      case 'starter': return 'starter';
      case 'pro': return 'pro';
      case 'enterprise': return 'enterprise';
      default: return 'free';
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      // First navigate to the corresponding dashboard
      let dashboardPath = '';
      switch (planId) {
        case 'free':
          dashboardPath = '/interactive-demo';
          break;
        case 'starter':
          dashboardPath = '/starter-dashboard';
          break;
        case 'pro':
          dashboardPath = '/pro-dashboard';
          break;
        case 'enterprise':
          dashboardPath = '/enterprise-dashboard';
          break;
      }

      // Always navigate to dashboard first, login popup will show if needed
      navigate(dashboardPath);
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  // Calculate discount percentage for yearly billing
  const getYearlyDiscount = (monthlyPrice: number, yearlyPrice: number): number => {
    if (!monthlyPrice || !yearlyPrice) return 0
    const annualCost = monthlyPrice * 12
    return Math.round(((annualCost - yearlyPrice) / annualCost) * 100)
  }

  // Mouse tracking effect for cards and buttons
  useEffect(() => {
    const cards = document.querySelectorAll('.pricing-card');
    const buttons = document.querySelectorAll('.pricing-button');
    
    const handleMouseMove = (e: MouseEvent, element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      element.style.setProperty('--mouse-x', `${x}px`);
      element.style.setProperty('--mouse-y', `${y}px`);
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card as HTMLElement));
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.removeProperty('--mouse-x');
        (card as HTMLElement).style.removeProperty('--mouse-y');
      });
    });

    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => handleMouseMove(e, button as HTMLElement));
      button.addEventListener('mouseleave', () => {
        (button as HTMLElement).style.removeProperty('--mouse-x');
        (button as HTMLElement).style.removeProperty('--mouse-y');
      });
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', (e) => handleMouseMove(e, card as HTMLElement));
        card.removeEventListener('mouseleave', () => {});
      });
      buttons.forEach(button => {
        button.removeEventListener('mousemove', (e) => handleMouseMove(e, button as HTMLElement));
        button.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Add animations to head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = emojiAnimations;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--theme-background)]">
      <Header variant="default" />
      <div className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--theme-text-primary)] mb-6">
              {currentLanguage === 'es' ? 'Precios Simples y Transparentes' : 'Simple, Transparent Pricing'}
            </h1>
            <p className="text-lg text-[var(--theme-text-secondary)]">
              {currentLanguage === 'es' ? 'Elige el plan que mejor se adapte a tus necesidades' : 'Choose the plan that best fits your needs'}
            </p>

            {/* Billing cycle toggle */}
            <div className="flex items-center justify-center mt-8">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-secondary)]'}`}>
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
                  <FiToggleLeft className="w-10 h-10 text-[var(--theme-text-secondary)]" />
                ) : (
                  <FiToggleRight className="w-10 h-10 text-[var(--theme-text-primary)]" />
                )}
              </button>
              <span className={`ml-3 flex items-center ${billingCycle === 'yearly' ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-secondary)]'}`}>
                {currentLanguage === 'es' ? 'Facturación Anual' : 'Yearly Billing'}
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--theme-background-highlight)] text-[var(--theme-text-primary)]">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  {currentLanguage === 'es' ? 'Ahorra' : 'Save'} 17%
                </span>
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
              const isCurrentPlan = userSubscription && userSubscription.plan_id === plan.id;
              const discount = getYearlyDiscount(plan.price_monthly || 0, plan.price_yearly || 0);
              
              const isDarkMode = document.documentElement.classList.contains('dark');
              const planType = getPlanType(plan.id);
              const planColor = planColors[planType][isDarkMode ? 'dark' : 'light'];

              // Add emoji decorations based on plan level
              const planEmojis = {
                pro: '🚀',
                enterprise: '⭐️ 💎 🌟'
              };

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  className={`pricing-card relative rounded-2xl p-8 backdrop-blur-sm
                    border-2 transition-all duration-300 ease-in-out cursor-pointer
                    ${plan.popular ? `border-[${planColor.border}]` : `border-[${planColor.primary}]`}
                    ${planColor.hover}
                    group overflow-visible`}
                  style={{
                    background: `linear-gradient(135deg, 
                      ${planColor.primary}${planColor.bgOpacity} 0%, 
                      ${planColor.secondary}${planColor.bgOpacity} 50%, 
                      ${planColor.accent}${planColor.bgOpacity} 100%)`,
                    transform: 'translate3d(0, 0, 0)'  // Force GPU acceleration for smoother animations
                  }}
                >
                  {/* Mouse follow effect with improved performance */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none will-change-transform"
                    style={{
                      background: `radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                        ${planColor.accent}40,
                        ${planColor.secondary}30 40%,
                        ${planColor.primary}20 60%,
                        transparent 100%)`
                    }}
                  />

                  {/* Pro Plan Emoji with enhanced positioning */}
                  {plan.id === 'pro' && (
                    <div className="absolute -top-5 -left-5 transform -rotate-12 text-4xl animate-bounce-gentle z-20">
                      {planEmojis.pro}
                    </div>
                  )}

                  {/* Enterprise Plan Emojis with enhanced positioning */}
                  {plan.id === 'enterprise' && (
                    <div className="absolute -top-5 -right-5 transform rotate-12 text-4xl flex gap-2 z-20">
                      {planEmojis.enterprise.split(' ').map((emoji, i) => (
                        <span key={i} className={`animate-pulse-${i + 1}`}>{emoji}</span>
                      ))}
                    </div>
                  )}

                  {/* Popular badge with improved visibility */}
                  {plan.popular && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                      <span className={`bg-gradient-to-r ${planColor.button} text-white text-sm font-semibold px-6 py-1.5 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm`}>
                        {currentLanguage === 'es' ? 'Popular' : 'Popular'}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8 relative">
                    <h3 className={`text-2xl font-bold mb-2 ${planColor.text}`}>
                      {plan.name}
                    </h3>
                    <p className="text-[var(--theme-text-primary)] mb-6 min-h-[48px]">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className={`text-5xl font-bold ${planColor.text}`}>
                        ${price}
                      </span>
                      <span className="ml-2 text-[var(--theme-text-primary)]">
                        /{currentLanguage === 'es' ? (billingCycle === 'monthly' ? 'mensual' : 'anual') : billingCycle}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && discount > 0 && (
                      <p className="mt-1 text-sm">
                        <span className={`font-semibold ${planColor.text}`}>
                          {currentLanguage === 'es' ? 'Ahorra' : 'Save'} {discount}%
                        </span> <span className="text-[var(--theme-text-primary)]">{currentLanguage === 'es' ? 'con facturación anual' : 'with yearly billing'}</span>
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 relative">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 bg-gradient-to-r ${planColor.button} rounded-full flex items-center justify-center`}>
                          <CheckIcon className="w-3 h-3 text-white" />
                        </span>
                        <span className="text-[var(--theme-text-primary)]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={false}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isUpdating || isCurrentPlan}
                    className={`pricing-button relative w-full bg-gradient-to-r ${planColor.button} 
                      text-white rounded-lg py-3 px-6 font-semibold 
                      transition-all duration-300 ease-in-out 
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      transform hover:-translate-y-0.5
                      overflow-hidden group`}
                  >
                    <span className="relative z-10">
                      {isCurrentPlan ? 
                        (currentLanguage === 'es' ? 'Plan Actual' : 'Current Plan') : 
                        (currentLanguage === 'es' ? 'Comenzar Ahora' : 'Get Started Now')}
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle 80px at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                          ${planColor.accent}99,
                          transparent 100%)`
                      }}
                    />
                  </motion.button>
                </motion.div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[var(--theme-text-primary)] mb-12">
              {currentLanguage === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </h2>
            <div className="grid gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2">
                  {currentLanguage === 'es' ? '¿Cuál es la diferencia entre los planes?' : 'What is the difference between the plans?'}
                </h3>
                <p className="text-[var(--theme-text-secondary)]">{currentLanguage === 'es' ? 'La principal diferencia entre los planes es el número de llamadas API y características disponibles.' : 'The main difference between the plans is the number of API calls and features available.'}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2">
                  {currentLanguage === 'es' ? '¿Puedo actualizar o degradar mi plan?' : 'Can I upgrade or downgrade my plan?'}
                </h3>
                <p className="text-[var(--theme-text-secondary)]">{currentLanguage === 'es' ? 'Sí, puedes actualizar o degradar tu plan en cualquier momento.' : 'Yes, you can upgrade or downgrade your plan at any time.'}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2">
                  {currentLanguage === 'es' ? '¿Cuál es la política de reembolso?' : 'What is the refund policy?'}
                </h3>
                <p className="text-[var(--theme-text-secondary)]">{currentLanguage === 'es' ? 'Ofrecemos una garantía de devolución de dinero de 30 días.' : 'We offer a 30-day money-back guarantee.'}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2">
                  {currentLanguage === 'es' ? '¿Cómo puedo contactar con el soporte?' : 'How do I contact support?'}
                </h3>
                <p className="text-[var(--theme-text-secondary)]">{currentLanguage === 'es' ? 'Puedes contactar con nuestro equipo de soporte por correo electrónico o a través de nuestro sitio web.' : 'You can contact our support team by email or through our website.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatedFooter />
    </div>
  )
}
