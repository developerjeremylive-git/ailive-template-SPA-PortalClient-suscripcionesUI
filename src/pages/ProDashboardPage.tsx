import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiExternalLink, FiGlobe, FiCode, FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import DashboardLayout from '../components/DashboardLayout';

export default function ProDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('browser');

  // Browser Agent chat messages
  const [browserMessages, setBrowserMessages] = useState([
    { sender: 'user', content: 'Can you find the latest news about AI development?' },
    { 
      sender: 'agent', 
      content: 'I\'ll search for the latest AI news. Let me gather that information for you...',
    },
    { 
      sender: 'agent', 
      content: 'Here\'s a summary of the latest AI news:\n\n1. OpenAI released a new version of GPT-4 with improved reasoning capabilities\n2. Google announced advancements in multimodal AI understanding\n3. A new research paper shows promising results in reducing AI hallucinations\n4. Several countries are developing new AI regulations\n\nWould you like me to elaborate on any of these topics?',
    },
  ]);

  // Scraping Agent chat messages
  const [scrapingMessages, setScrapingMessages] = useState([
    { sender: 'user', content: 'I need to extract product information from amazon.com' },
    { 
      sender: 'agent', 
      content: 'I can help you with that. What specific product information are you looking to extract?',
    },
    { 
      sender: 'user', 
      content: 'I need product names, prices, and ratings for laptops under $1000' 
    },
    { 
      sender: 'agent', 
      content: 'I\'ll create a script to extract that information. Here\'s a JavaScript snippet you can use:',
      code: `// JavaScript for extracting laptop information under $1000
const extractLaptopInfo = () => {
  const products = [];
  const productElements = document.querySelectorAll('.s-result-item');
  
  productElements.forEach(element => {
    const nameElement = element.querySelector('h2 a span');
    const priceElement = element.querySelector('.a-price-whole');
    const ratingElement = element.querySelector('.a-icon-star-small .a-icon-alt');
    
    if (nameElement && priceElement) {
      const name = nameElement.textContent.trim();
      const price = parseFloat(priceElement.textContent.replace(',', ''));
      const rating = ratingElement ? 
        parseFloat(ratingElement.textContent.split(' ')[0]) : 
        null;
      
      if (price < 1000 && name.toLowerCase().includes('laptop')) {
        products.push({ name, price, rating });
      }
    }
  });
  
  return products;
}

// Run the extraction
const laptops = extractLaptopInfo();
console.log(JSON.stringify(laptops, null, 2));`
    },
  ]);

  // Hugging Face Spaces for Pro plan (more advanced ones)
  const huggingFaceSpaces = [
    {
      id: 'hf1',
      name: 'Advanced Text-to-Image',
      description: 'Fine-tuned stable diffusion models with better quality and control',
      url: 'https://huggingface.co/spaces/multimodalart/stable-diffusion-xl',
      tags: ['Image Generation', 'SDXL'],
      popularity: 99
    },
    {
      id: 'hf2',
      name: 'Mistral Large',
      description: 'High-performance language model for complex reasoning and generation',
      url: 'https://huggingface.co/spaces/mistralai/mistral-large',
      tags: ['LLM', 'Advanced'],
      popularity: 97
    },
    {
      id: 'hf3',
      name: 'Video Generation',
      description: 'Generate short video clips from text descriptions',
      url: 'https://huggingface.co/spaces/multimodalart/stable-video-diffusion',
      tags: ['Video', 'Text-to-Video'],
      popularity: 94
    },
    {
      id: 'hf4',
      name: 'Advanced Voice Cloning',
      description: 'Clone voices with just a few seconds of audio input',
      url: 'https://huggingface.co/spaces/suno-ai/bark',
      tags: ['Voice', 'Audio'],
      popularity: 92
    }
  ];

  const handleChatTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'browser':
        return (
          <div className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{t('browser_agent')}</h3>
              <p className="text-violet-200">{t('browser_agent_description')}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {browserMessages.map((message, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl ${
                    message.sender === 'user' 
                      ? 'bg-purple-500 bg-opacity-20 ml-auto max-w-[80%]' 
                      : 'bg-white bg-opacity-10 mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-violet-100 whitespace-pre-line">{message.content}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 p-3 rounded-lg bg-white bg-opacity-10 border border-violet-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-violet-400"
                placeholder={t('type_browser_request')}
              />
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                {t('send')}
              </button>
            </div>
          </div>
        );
      
      case 'scraping':
        return (
          <div className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{t('scraping_agent')}</h3>
              <p className="text-violet-200">{t('scraping_agent_description')}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {scrapingMessages.map((message, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl ${
                    message.sender === 'user' 
                      ? 'bg-purple-500 bg-opacity-20 ml-auto max-w-[80%]' 
                      : 'bg-white bg-opacity-10 mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-violet-100 whitespace-pre-line">{message.content}</p>
                  {message.code && (
                    <div className="mt-3 p-3 bg-gray-900 rounded-lg overflow-x-auto">
                      <pre className="text-violet-100 text-sm">
                        <code>{message.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 p-3 rounded-lg bg-white bg-opacity-10 border border-violet-500 border-opacity-30 text-white placeholder-violet-300 focus:outline-none focus:border-violet-400"
                placeholder={t('type_scraping_request')}
              />
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                {t('send')}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title={t('pro_dashboard')}
      subtitle={t('pro_dashboard_subtitle')}
      planName={t('pro_plan')}
      planIcon={<FiCpu className="w-5 h-5" />}
    >
      {/* Pro Features */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t('pro_features')}
          </h2>
          <a 
            href="/models" 
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            {t('all_models')}
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-purple-500 border-opacity-20"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white mb-4">
              <FiGlobe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('browser_agent')}
            </h3>
            <p className="text-violet-200 mb-4">
              {t('browser_agent_description')}
            </p>
            <button 
              onClick={() => handleChatTabChange('browser')}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 transition-colors text-white rounded-lg"
            >
              {t('try_it_now')}
            </button>
          </motion.div>
          
          <motion.div
            className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-purple-500 border-opacity-20"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white mb-4">
              <FiCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('scraping_agent')}
            </h3>
            <p className="text-violet-200 mb-4">
              {t('scraping_agent_description')}
            </p>
            <button 
              onClick={() => handleChatTabChange('scraping')}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 transition-colors text-white rounded-lg"
            >
              {t('try_it_now')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Agent Interface */}
      <div className="mb-12">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleChatTabChange('browser')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'browser'
                ? 'bg-purple-500 text-white'
                : 'bg-white bg-opacity-10 text-violet-200 hover:bg-opacity-20'
            } transition-colors`}
          >
            <div className="flex items-center gap-2">
              <FiGlobe className="w-5 h-5" />
              <span>{t('browser_agent')}</span>
            </div>
          </button>
          
          <button
            onClick={() => handleChatTabChange('scraping')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'scraping'
                ? 'bg-purple-500 text-white'
                : 'bg-white bg-opacity-10 text-violet-200 hover:bg-opacity-20'
            } transition-colors`}
          >
            <div className="flex items-center gap-2">
              <FiCode className="w-5 h-5" />
              <span>{t('scraping_agent')}</span>
            </div>
          </button>
        </div>
        
        {renderTabContent()}
      </div>

      {/* Hugging Face Spaces */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t('advanced_huggingface_spaces')}
          </h2>
          <a 
            href="https://huggingface.co/spaces" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            {t('explore_all')}
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {huggingFaceSpaces.map((space) => (
            <motion.a
              key={space.id}
              href={space.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-10 transition-all border border-transparent hover:border-purple-500 border-opacity-50"
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {space.name}
                </h3>
                <span className="px-2 py-1 bg-purple-500 bg-opacity-20 rounded-full text-xs text-purple-300">
                  {space.popularity}%
                </span>
              </div>
              <p className="text-violet-200 mb-4">
                {space.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {space.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-white bg-opacity-10 rounded-full text-xs text-violet-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {t('usage_stats')}
        </h2>
        
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
              <h4 className="text-violet-200 mb-2">{t('api_calls')}</h4>
              <div className="text-3xl font-bold text-white">3,892</div>
              <div className="text-sm text-violet-300 mt-1">{t('this_month')}</div>
            </div>
            <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
              <h4 className="text-violet-200 mb-2">{t('cloud_storage')}</h4>
              <div className="text-3xl font-bold text-white">245.8 MB</div>
              <div className="text-sm text-violet-300 mt-1">{t('of')} 5 GB</div>
            </div>
            <div className="p-4 bg-purple-900 bg-opacity-40 rounded-lg">
              <h4 className="text-violet-200 mb-2">{t('agents_used')}</h4>
              <div className="text-3xl font-bold text-white">2/2</div>
              <div className="text-sm text-violet-300 mt-1">{t('this_month')}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
