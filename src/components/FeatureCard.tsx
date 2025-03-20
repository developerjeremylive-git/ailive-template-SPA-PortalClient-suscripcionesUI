import React from 'react';
import { FiCheck, FiX, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredPlan: string;
  link?: string;
  onClick?: () => void;
  comingSoon?: boolean;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  requiredPlan,
  link,
  onClick,
  comingSoon = false
}) => {
  const { hasAccess } = useAuth();
  const isAccessible = hasAccess(requiredPlan);

  // Determine which plan name to display
  const getPlanName = (planId: string): string => {
    switch (planId) {
      case '1': return 'Free';
      case '2': return 'Starter';
      case '3': return 'Pro';
      case '4': return 'Enterprise';
      default: return '';
    }
  };

  // Render different card styles based on accessibility
  const renderContent = () => {
    const cardContent = (
      <>
        <div className="flex items-center mb-3">
          <div className="text-purple-500 mr-3 text-2xl">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {comingSoon && (
            <span className="ml-2 px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-violet-200 mb-4 text-sm">{description}</p>
      </>
    );

    if (comingSoon) {
      return (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-5 border border-gray-700 h-full transition-all cursor-not-allowed">
          {cardContent}
          <div className="flex items-center text-gray-400 text-sm mt-auto">
            <FiLock className="mr-2" /> Coming in future update
          </div>
        </div>
      );
    }
    
    if (!isAccessible) {
      return (
        <div className="bg-gray-800 bg-opacity-70 rounded-xl p-5 border border-gray-700 h-full transition-all">
          {cardContent}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center text-gray-400 text-sm">
              <FiLock className="mr-2" /> Requires {getPlanName(requiredPlan)}
            </div>
            <Link 
              to="/pricing" 
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      );
    }

    if (link) {
      return (
        <Link
          to={link}
          className="bg-white bg-opacity-5 rounded-xl p-5 border border-purple-500 border-opacity-20 h-full flex flex-col hover:bg-opacity-10 transition-all"
        >
          {cardContent}
          <div className="flex items-center text-green-400 text-sm mt-auto">
            <FiCheck className="mr-2" /> Available
          </div>
        </Link>
      );
    }

    if (onClick) {
      return (
        <button
          onClick={onClick}
          className="bg-white bg-opacity-5 rounded-xl p-5 border border-purple-500 border-opacity-20 h-full flex flex-col text-left hover:bg-opacity-10 transition-all w-full"
        >
          {cardContent}
          <div className="flex items-center text-green-400 text-sm mt-auto">
            <FiCheck className="mr-2" /> Available
          </div>
        </button>
      );
    }

    return (
      <div className="bg-white bg-opacity-5 rounded-xl p-5 border border-purple-500 border-opacity-20 h-full flex flex-col">
        {cardContent}
        <div className="flex items-center text-green-400 text-sm mt-auto">
          <FiCheck className="mr-2" /> Available
        </div>
      </div>
    );
  };

  return renderContent();
};

export default FeatureCard;
