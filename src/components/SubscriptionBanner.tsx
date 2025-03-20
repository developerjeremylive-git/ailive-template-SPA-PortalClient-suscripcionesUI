import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type SubscriptionBannerProps = {
  requiredPlan: string;
  featureName: string;
};

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  requiredPlan,
  featureName
}) => {
  const navigate = useNavigate();
  const { user, userSubscription } = useAuth();
  
  if (!user) {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-lg shadow-md text-white mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Esta funcionalidad requiere una cuenta</h3>
            <p>Inicia sesión o regístrate para acceder a {featureName}</p>
          </div>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-white text-amber-600 font-medium rounded-md hover:bg-gray-100"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }
  
  // If user has the required plan or better, don't show banner
  if (userSubscription && (
    userSubscription.plan_id === requiredPlan || 
    (requiredPlan === '2' && ['3', '4'].includes(userSubscription.plan_id)) ||
    (requiredPlan === '3' && userSubscription.plan_id === '4')
  )) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-md text-white mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Actualiza tu suscripción</h3>
          <p>Esta funcionalidad requiere un plan superior para acceder a {featureName}</p>
        </div>
        <button 
          onClick={() => navigate('/pricing')} 
          className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100"
        >
          Ver planes
        </button>
      </div>
    </div>
  );
};
