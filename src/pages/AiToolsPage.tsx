import React, { useState } from 'react';
import { FiSearch, FiMessageSquare, FiImage, FiGlobe, FiCode, FiFile, FiMusic, FiClipboard, FiLayers, FiGrid } from 'react-icons/fi';
import Header from '../components/Header';
import AnimatedFooter from '../components/AnimatedFooter';
import FeatureCard from '../components/FeatureCard';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const AiToolsPage: React.FC = () => {
  const { t } = useLanguage();
  const { userSubscription } = useAuth();
  const { availableTools, loading } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Tools', icon: <FiGrid /> },
    { id: 'chat', name: 'Chat & Text', icon: <FiMessageSquare /> },
    { id: 'image', name: 'Image & Video', icon: <FiImage /> },
    { id: 'web', name: 'Web & Research', icon: <FiGlobe /> },
    { id: 'code', name: 'Code & Development', icon: <FiCode /> },
    { id: 'document', name: 'Document Processing', icon: <FiFile /> },
    { id: 'audio', name: 'Audio & Speech', icon: <FiMusic /> }
  ];

  // Feature tools available in the app
  const featuredTools = [
    {
      id: 'chat-assistant',
      title: 'Chat Assistant',
      description: 'Advanced conversational AI that can answer questions and help with various tasks.',
      icon: <FiMessageSquare />,
      category: 'chat',
      requiredPlan: '1', // Free plan
      link: '/chat'
    },
    {
      id: 'image-generator',
      title: 'Image Generator',
      description: 'Create stunning images from text descriptions using state-of-the-art AI models.',
      icon: <FiImage />,
      category: 'image',
      requiredPlan: '2', // Starter plan
      link: '/image-generator'
    },
    {
      id: 'code-assistant',
      title: 'Code Assistant',
      description: 'Get help with coding tasks, debugging, and code generation across multiple languages.',
      icon: <FiCode />,
      category: 'code',
      requiredPlan: '2', // Starter plan
      link: '/code-assistant'
    },
    {
      id: 'browser-agent',
      title: 'Browser Agent',
      description: 'AI-powered web browser that can search, navigate, and interact with web content on your behalf.',
      icon: <FiGlobe />,
      category: 'web',
      requiredPlan: '3', // Pro plan
      link: '/browser-agent'
    },
    {
      id: 'document-analyzer',
      title: 'Document Analyzer',
      description: 'Extract insights and summaries from documents, PDFs, and spreadsheets.',
      icon: <FiFile />,
      category: 'document',
      requiredPlan: '2', // Starter plan
      link: '/document'
    },
    {
      id: 'voice-synthesis',
      title: 'Voice Synthesis',
      description: 'Convert text to natural-sounding speech with customizable voices and languages.',
      icon: <FiMusic />,
      category: 'audio',
      requiredPlan: '3', // Pro plan
      link: '/voice'
    },
    {
      id: 'research-agent',
      title: 'Research Agent',
      description: 'AI that conducts comprehensive research on any topic and compiles findings.',
      icon: <FiClipboard />,
      category: 'web',
      requiredPlan: '3', // Pro plan
      link: '/research'
    },
    {
      id: 'multimodal-assistant',
      title: 'Multimodal Assistant',
      description: 'An assistant that can understand and work with text, images, and audio in a single conversation.',
      icon: <FiLayers />,
      category: 'chat',
      requiredPlan: '3', // Pro plan
      link: '/multimodal'
    },
    {
      id: 'video-generator',
      title: 'Video Generator',
      description: 'Create short videos from text prompts with AI-generated visuals and animations.',
      icon: <FiImage />,
      category: 'image',
      requiredPlan: '4', // Enterprise plan
      comingSoon: true
    }
  ];

  // Combine database tools with featured tools
  const allTools = [...featuredTools, ...(availableTools || [])];

  // Filter tools based on search and category
  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-theme-gradient">
      <Header variant="default" />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('ai_tools_hub')}
              </h1>
              <p className="text-xl text-violet-200 max-w-3xl mx-auto">
                {t('ai_tools_description')}
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t('search_tools')}
                    className="w-full px-4 py-3 pl-12 bg-white bg-opacity-10 rounded-xl border border-purple-500 border-opacity-20 text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-4 top-3.5 text-violet-300 text-xl" />
                </div>
              </div>

              <div className="flex overflow-x-auto pb-4 gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-purple-500 bg-opacity-30 text-white border border-purple-500 border-opacity-50'
                        : 'bg-white bg-opacity-5 text-violet-200 border border-white border-opacity-10 hover:bg-opacity-10'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredTools.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredTools.map(tool => (
                  <motion.div key={tool.id} variants={itemVariants}>
                    <FeatureCard
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      requiredPlan={tool.requiredPlan}
                      link={tool.link}
                      comingSoon={tool.comingSoon}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl text-white mb-4">{t('no_tools_found')}</h3>
                <p className="text-violet-200">{t('try_different_search')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AnimatedFooter />
    </div>
  );
};

export default AiToolsPage;
