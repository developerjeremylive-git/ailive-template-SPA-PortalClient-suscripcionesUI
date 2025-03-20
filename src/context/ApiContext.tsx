import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Types for API models and features
export type ApiModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  requiredPlan: string;
  endpoint: string;
  contextWindow: number;
  maxTokens: number;
  isAvailable: boolean;
};

export type ToolFeature = {
  id: string;
  name: string;
  description: string;
  requiredPlan: string;
  endpoint?: string;
  isAvailable: boolean;
};

// Context type
type ApiContextType = {
  availableModels: ApiModel[];
  availableTools: ToolFeature[];
  isModelAvailable: (modelId: string) => boolean;
  isToolAvailable: (toolId: string) => boolean;
  getModelDetails: (modelId: string) => ApiModel | null;
  getToolDetails: (toolId: string) => ToolFeature | null;
  callApi: <T>(endpoint: string, body: any) => Promise<T>;
  loading: boolean;
};

// Create context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// API Provider Component
export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user, userSubscription, hasAccess, supabase, incrementApiUsage } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableModels, setAvailableModels] = useState<ApiModel[]>([]);
  const [availableTools, setAvailableTools] = useState<ToolFeature[]>([]);

  // Fetch available models and tools
  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      try {
        // Fetch models
        // const { data: modelsData, error: modelsError } = await supabase
        //   .from('api_models')
        //   .select('*')
        //   .order('required_plan', { ascending: true }); // Changed from requiredPlan to required_plan

        // if (modelsError) {
        //   console.error('Error fetching API models:', modelsError);
        // } else {
        //   // Process models and check availability based on subscription
        //   const processedModels = modelsData.map((model: any) => ({
        //     ...model,
        //     isAvailable: hasAccess(model.requiredPlan)
        //   }));
        //   setAvailableModels(processedModels);
        // }

        // Fetch tools
        // const { data: toolsData, error: toolsError } = await supabase
        //   .from('api_tools')
        //   .select('*')
        //   .order('requiredPlan', { ascending: true });

        // if (toolsError) {
        //   console.error('Error fetching API tools:', toolsError);
        // } else {
        //   // Process tools and check availability based on subscription
        //   const processedTools = toolsData.map((tool: any) => ({
        //     ...tool,
        //     isAvailable: hasAccess(tool.requiredPlan)
        //   }));
        //   setAvailableTools(processedTools);
        // }
      } catch (error) {
        console.error('Error processing API data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && userSubscription) {
      fetchApiData();
    }
  }, [user, userSubscription, hasAccess, supabase]);

  // Check if a model is available based on subscription
  const isModelAvailable = (modelId: string): boolean => {
    const model = availableModels.find(m => m.id === modelId);
    return model ? model.isAvailable : false;
  };

  // Check if a tool is available based on subscription
  const isToolAvailable = (toolId: string): boolean => {
    const tool = availableTools.find(t => t.id === toolId);
    return tool ? tool.isAvailable : false;
  };

  // Get details for a specific model
  const getModelDetails = (modelId: string): ApiModel | null => {
    return availableModels.find(m => m.id === modelId) || null;
  };

  // Get details for a specific tool
  const getToolDetails = (toolId: string): ToolFeature | null => {
    return availableTools.find(t => t.id === toolId) || null;
  };

  // Generic API call function with subscription validation
  const callApi = async <T,>(endpoint: string, body: any): Promise<T> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if the endpoint is restricted
    const targetTool = availableTools.find(t => t.endpoint === endpoint);
    if (targetTool && !targetTool.isAvailable) {
      throw new Error(`This feature requires a ${getPlanName(targetTool.requiredPlan)} subscription`);
    }

    try {
      // Increment API usage for analytics
      await incrementApiUsage();

      // Make the API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}` // Use user ID as authentication token
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error calling API');
      }

      return await response.json() as T;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Helper function to get plan name
  const getPlanName = (planId: string): string => {
    switch (planId) {
      case '1': return 'Free';
      case '2': return 'Starter';
      case '3': return 'Pro';
      case '4': return 'Enterprise';
      default: return 'higher tier';
    }
  };

  // Value provided by the context
  const value = {
    availableModels,
    availableTools,
    isModelAvailable,
    isToolAvailable,
    getModelDetails,
    getToolDetails,
    callApi,
    loading
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

// Hook to use the API context
export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
