import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiDatabase, FiSettings, FiBriefcase, FiUsers, FiServer, FiBarChart2, FiPieChart, FiActivity } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import DashboardLayout from '../components/DashboardLayout';

export default function EnterpriseDashboardPage() {
  const { t } = useLanguage();
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  // Sample enterprise usage data
  const usageData = {
    month: {
      apiCalls: 23845,
      tokens: 15420000,
      models: {
        gpt4: 40,
        claude: 35,
        mistral: 25
      },
      teams: 5,
      users: 28,
      customModels: 3
    },
    quarter: {
      apiCalls: 67952,
      tokens: 45862000,
      models: {
        gpt4: 38,
        claude: 36,
        mistral: 26
      },
      teams: 6,
      users: 32,
      customModels: 4
    },
    year: {
      apiCalls: 248520,
      tokens: 192500000,
      models: {
        gpt4: 42,
        claude: 33,
        mistral: 25
      },
      teams: 8,
      users: 45,
      customModels: 6
    }
  };

  // Sample enterprise teams
  const teams = [
    {
      id: 'team1',
      name: 'Product Development',
      members: 8,
      usage: 42,
      projects: 5
    },
    {
      id: 'team2',
      name: 'Marketing & Analytics',
      members: 6,
      usage: 28,
      projects: 3
    },
    {
      id: 'team3',
      name: 'Customer Support',
      members: 12,
      usage: 30,
      projects: 2
    },
    {
      id: 'team4',
      name: 'Research',
      members: 4,
      usage: 15,
      projects: 4
    },
    {
      id: 'team5',
      name: 'Executive',
      members: 3,
      usage: 10,
      projects: 1
    }
  ];

  // Sample enterprise customizations
  const customizations = [
    {
      id: 'custom1',
      name: 'Proprietary Document Retriever',
      type: 'Data Processing',
      status: 'Active',
      lastUpdated: '2025-02-28'
    },
    {
      id: 'custom2',
      name: 'Industry Knowledge Base',
      type: 'Custom Model',
      status: 'Training',
      lastUpdated: '2025-03-05'
    },
    {
      id: 'custom3',
      name: 'Multilingual Support Agent',
      type: 'Custom Agent',
      status: 'Active',
      lastUpdated: '2025-02-15'
    }
  ];

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
  };

  const currentData = usageData[selectedTimeRange];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <DashboardLayout
      title={t('enterprise_dashboard')}
      subtitle={t('enterprise_dashboard_subtitle')}
      planName={t('enterprise_plan')}
      planIcon={<FiBriefcase className="w-5 h-5" />}
    >
      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-3 inline-flex">
          <button
            onClick={() => handleTimeRangeChange('month')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === 'month'
                ? 'bg-purple-500 text-white'
                : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
            } transition-colors`}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => handleTimeRangeChange('quarter')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === 'quarter'
                ? 'bg-purple-500 text-white'
                : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
            } transition-colors`}
          >
            {t('quarterly')}
          </button>
          <button
            onClick={() => handleTimeRangeChange('year')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === 'year'
                ? 'bg-purple-500 text-white'
                : 'text-violet-200 hover:bg-white hover:bg-opacity-10'
            } transition-colors`}
          >
            {t('yearly')}
          </button>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t('usage_overview')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 bg-opacity-20 flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-sm text-violet-300">{t(selectedTimeRange)}</span>
            </div>
            <h3 className="text-violet-200 mb-1">{t('api_calls')}</h3>
            <div className="text-3xl font-bold text-white">
              {formatNumber(currentData.apiCalls)}
            </div>
          </motion.div>
          
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 bg-opacity-20 flex items-center justify-center">
                <FiServer className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-sm text-violet-300">{t(selectedTimeRange)}</span>
            </div>
            <h3 className="text-violet-200 mb-1">{t('tokens_processed')}</h3>
            <div className="text-3xl font-bold text-white">
              {formatNumber(currentData.tokens)}
            </div>
          </motion.div>
          
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 bg-opacity-20 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-sm text-violet-300">{t('active')}</span>
            </div>
            <h3 className="text-violet-200 mb-1">{t('team_members')}</h3>
            <div className="text-3xl font-bold text-white">
              {currentData.users}
            </div>
          </motion.div>
          
          <motion.div
            className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 bg-opacity-20 flex items-center justify-center">
                <FiSettings className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-sm text-violet-300">{t('deployed')}</span>
            </div>
            <h3 className="text-violet-200 mb-1">{t('custom_models')}</h3>
            <div className="text-3xl font-bold text-white">
              {currentData.customModels}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Model Distribution */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t('model_distribution')}
        </h2>
        
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative w-48 h-48">
              {/* Simulated pie chart using colored segments */}
              <div className="absolute inset-0 rounded-full border-8 border-purple-500 opacity-40"></div>
              <div 
                className="absolute inset-0 rounded-full border-8 border-transparent border-t-violet-500 border-r-violet-500 border-opacity-80"
                style={{ transform: `rotate(${currentData.models.gpt4 * 3.6}deg)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiPieChart className="w-12 h-12 text-purple-300" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-white">GPT-4 Turbo</span>
                  </div>
                  <span className="text-violet-200">{currentData.models.gpt4}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${currentData.models.gpt4}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-violet-500 rounded-full mr-2"></div>
                    <span className="text-white">Claude 3</span>
                  </div>
                  <span className="text-violet-200">{currentData.models.claude}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-violet-500 h-2 rounded-full" 
                    style={{ width: `${currentData.models.claude}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
                    <span className="text-white">Mistral Large</span>
                  </div>
                  <span className="text-violet-200">{currentData.models.mistral}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ width: `${currentData.models.mistral}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t('team_management')}
          </h2>
          <Link 
            to="/teams/manage" 
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            {t('manage_teams')}
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white border-opacity-10">
                <th className="py-4 px-6 text-left text-violet-200 font-medium">{t('team_name')}</th>
                <th className="py-4 px-6 text-left text-violet-200 font-medium">{t('members')}</th>
                <th className="py-4 px-6 text-left text-violet-200 font-medium">{t('usage')} (%)</th>
                <th className="py-4 px-6 text-left text-violet-200 font-medium">{t('projects')}</th>
                <th className="py-4 px-6 text-left text-violet-200 font-medium">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <motion.tr 
                  key={team.id}
                  className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <td className="py-4 px-6 text-white">{team.name}</td>
                  <td className="py-4 px-6 text-violet-200">{team.members}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-24 bg-white/10 rounded-full h-2 mr-3">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${team.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-violet-200">{team.usage}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-violet-200">{team.projects}</td>
                  <td className="py-4 px-6">
                    <Link
                      to={`/team/${team.id}`}
                      className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      {t('view')}
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customizations */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t('enterprise_customizations')}
          </h2>
          <Link 
            to="/customizations" 
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            {t('view_all')}
          </Link>
        </div>
        
        <div className="space-y-4">
          {customizations.map((customization) => (
            <motion.div
              key={customization.id}
              className="p-6 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-purple-500/20"
              whileHover={{ y: -3 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {customization.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-violet-300">{customization.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customization.status === 'Active' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {customization.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="text-sm text-violet-300">
                    {t('last_updated')}: {customization.lastUpdated}
                  </span>
                  <Link
                    to={`/customization/${customization.id}`}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {t('manage')}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
