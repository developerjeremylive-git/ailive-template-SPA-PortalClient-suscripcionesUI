import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  hasAccess as checkAccess, 
  hasModelAccess, 
  getPlanName, 
  getFeatureLimit, 
  formatStorageSize,
  getNextPlan,
  PlanType
} from '../utils/subscriptionHelpers';
import stripeService from '../api/stripe-service';
import { PLAN_IDS, PLAN_TO_PRICE_MAP, PRICE_TO_PLAN_MAP } from '../utils/subscriptionConstants';

// Define tipos para las suscripciones
export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price_monthly?: number;
  price_yearly?: number;
  billing_cycle: string;
  features: any;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  current_period_start?: string;
  current_period_end?: string;
  subscription_id?: string; // Stripe subscription ID
  canceled_at?: string;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
};

export type UsageStats = {
  id: string;
  user_id: string;
  api_calls: number;
  storage_used: number;
  last_active: string;
  created_at: string;
  updated_at: string;
};

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  stripe_customer_id?: string;
  email?: string;
  display_name?: string;
};

// Define tipo para el contexto de autenticación
type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  userSubscription: Subscription | null;
  usageStats: UsageStats | null;
  availablePlans: SubscriptionPlan[];
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ user?: any; error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string, accessToken: string) => Promise<{ error: any | null }>;
  updateSubscription: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  incrementApiUsage: () => Promise<void>;
  addStorageUsage: (bytesAdded: number) => Promise<void>;
  hasAccess: (requiredPlanId: string) => boolean;
  hasModelAccess: (modelId: string) => boolean;
  getPlanName: (planId: string) => string;
  refreshSubscriptionData: () => Promise<void>;
  isLoading: boolean;
  supabase: SupabaseClient;
  stripeCustomerId: string | null;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  redirectToCheckout: (planId: string) => Promise<void>;
  redirectToCustomerPortal: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  stripeCustomerId: string | null;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Supabase client
const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
const supabaseKey = (import.meta.env as any).VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
  const session = localStorage.getItem('supabase.auth.session');
  return session ? JSON.parse(session).user : null;
});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Inicializar y escuchar cambios de autenticación
  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      
      // Comprobar si hay una sesión activa
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData && sessionData?.session?.user) {
      localStorage.setItem('supabase.auth.session', JSON.stringify(sessionData.session));
        setUser(sessionData.session.user);
        await loadUserData(sessionData.session.user.id);
      }
      
      // Suscribirse a cambios de autenticación
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
        localStorage.setItem('supabase.auth.session', JSON.stringify(session));
          setUser(session.user);
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase.auth.session');
          setUser(null);
          setProfile(null);
          setUserSubscription(null);
          setUsageStats(null);
        }
      });
      
      // Cargar planes disponibles
      // await loadAvailablePlans();
      
      setIsLoading(false);
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
    
    getInitialSession();
  }, []);
  
  // Cargar datos del usuario (perfil, suscripción, uso)
  async function loadUserData(userId: string) {
    try {
      // Cargar perfil
      // const { data: profileData, error: profileError } = await supabase
      //   .from('profiles')
      //   .select('*', { head: false, count: null })
      //   .eq('id', userId)
      //   .single();
      
      // if (profileError) {
      //   console.error('Error cargando el perfil:', profileError);
      // } else {
      //   setProfile(profileData);
        
      //   // Load Stripe customer ID if it exists
      //   if (profileData.stripe_customer_id) {
      //     setStripeCustomerId(profileData.stripe_customer_id);
      //   }
      // }
      
      // Cargar suscripción
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error cargando la suscripción:', subscriptionError);
      } else if (subscriptionData) {
        setUserSubscription(subscriptionData);
      } else {
        // Si no hay suscripción activa, asignar plan gratuito por defecto
        const { data: newSubscription, error: createSubError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan_id: '1', // Plan gratuito
            status: 'active',
            start_date: new Date().toISOString()
          })
          .select()
          .single();
          
        if (createSubError) {
          console.error('Error creando suscripción por defecto:', createSubError);
        } else {
          setUserSubscription(newSubscription);
        }
      }
      
      // Cargar estadísticas de uso
      // const { data: usageData, error: usageError } = await supabase
      //   .from('usage_stats')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();
      
      // if (usageError && usageError.code !== 'PGRST116') {
      //   console.error('Error cargando estadísticas de uso:', usageError);
      // } else if (usageData) {
      //   setUsageStats(usageData);
      // } else {
      //   // Si no hay estadísticas, crear nuevas
      //   const { data: newUsage, error: createUsageError } = await supabase
      //     .from('usage_stats')
      //     .insert({
      //       user_id: userId,
      //       api_calls: 0,
      //       storage_used: 0,
      //       last_active: new Date().toISOString()
      //     })
      //     .select()
      //     .single();
          
      //   if (createUsageError) {
      //     console.error('Error creando estadísticas de uso:', createUsageError);
      //   } else {
      //     setUsageStats(newUsage);
      //   }
      // }
    } catch (error) {
      console.error('Error cargando datos de usuario:', error);
    }
  }
  
  // Cargar planes disponibles
  // async function loadAvailablePlans() {
  //   try {
  //     const { data, error } = await supabase
  //       .from('subscription_plans')
  //       .select('*')
  //       // .order('price_monthly', { ascending: true });
        
  //     if (error) {
  //       console.error('Error cargando planes:', error);
  //     } else {
  //       setAvailablePlans(data || []);
  //     }
  //   } catch (error) {
  //     console.error('Error cargando planes disponibles:', error);
  //   }
  // }
  
  // Iniciar sesión
  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) return { error };
      return { data };
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return { error };
    }
  }
  
  // Cerrar sesión
  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      throw error;
    }
  }
  
  // Registrarse
  async function signUp(email: string, password: string, username?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) return { error };
      
      if (data?.user) {
        // Create profile with username if provided
        // if (username) {
        //   const { error: profileError } = await supabase
        //     .from('profiles')
        //     .update({ username })
        //     .eq('id', data.user.id);
            
        //   if (profileError) {
        //     console.error('Error updating profile with username:', profileError);
        //   }
        // }
        
        return { user: data.user };
      }
      
      return { error: new Error('Registration failed') };
    } catch (error) {
      console.error('Error durante el registro:', error);
      return { error };
    }
  }
  
  // Actualizar perfil del usuario
  async function updateProfile(updates: Partial<Profile>) {
    if (!user) throw new Error('No authenticated user');
    
    try {
      const authUpdates: any = {};
      const profileUpdates: any = {};
  
      // Only include email in auth update if it's changed
      if (updates.email) {
        authUpdates.email = updates.email;
        profileUpdates.email = updates.email;
      }
  
      // Only include username in user metadata if it's changed
      if (updates.username) {
        if (!authUpdates.data) authUpdates.data = {};
        authUpdates.data.username = updates.username;
        profileUpdates.username = updates.username;
      }

      if (updates.display_name) {
        if (!authUpdates.data) authUpdates.data = {};
        authUpdates.data.display_name = updates.display_name;
      }
  
      // Only include avatar_url in user metadata if it's changed
      if (updates.avatar_url) {
        if (!authUpdates.data) authUpdates.data = {};
        authUpdates.data.avatar_url = updates.avatar_url;
        profileUpdates.avatar_url = updates.avatar_url;
      }
  
      // Update auth user if there are auth-related changes
      if (Object.keys(authUpdates).length > 0) {
        const { data: authData, error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) throw authError;
      }
  
      // Always include updated_at in profile updates
      profileUpdates.updated_at = new Date().toISOString();
  
      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update profile in state
      if (profile) {
        setProfile({
          ...profile,
          ...profileUpdates
        });
      }
      
      // Update Stripe customer if name was changed
      if (stripeCustomerId && updates.display_name) {
        try {
          await stripeService.updateCustomer(stripeCustomerId, {
            name: updates.display_name
          });
        } catch (stripeError) {
          console.error('Error updating Stripe customer:', stripeError);
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  }
  
  // Actualizar suscripción con Stripe integration
  async function updateSubscription(planId: string) {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      // Redirect to Stripe Checkout for payment
      await redirectToCheckout(planId);
    } catch (error) {
      console.error('Error actualizando suscripción:', error);
      throw error;
    }
  }
  
  // Refresh subscription data from Stripe and update local state
  async function refreshSubscriptionData() {
    if (!user || !stripeCustomerId) return;
    
    try {
      // Get subscription from Stripe
      const subscriptions = await stripeService.getCustomerSubscriptions(stripeCustomerId);
      
      if (subscriptions && subscriptions.data && subscriptions.data.length > 0) {
        // Get the most recent active subscription
        const activeSubscription = subscriptions.data.find(sub => 
          sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due'
        );
        
        if (activeSubscription) {
          // Get plan ID from price ID
          const priceId = activeSubscription.items.data[0]?.price.id;
          const planId = PRICE_TO_PLAN_MAP[priceId] || PLAN_IDS.FREE;
          
          // Update Supabase subscription record
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              plan_id: planId,
              status: activeSubscription.status,
              subscription_id: activeSubscription.id,
              start_date: new Date(activeSubscription.start_date * 1000).toISOString(),
              current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: activeSubscription.cancel_at_period_end,
              canceled_at: activeSubscription.canceled_at 
                ? new Date(activeSubscription.canceled_at * 1000).toISOString() 
                : null,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'subscription_id'
            });
            
          if (error) {
            console.error('Error updating subscription in database:', error);
          } else {
            // Reload user data to get the updated subscription
            await loadUserData(user.id);
          }
        } else if (userSubscription && userSubscription.subscription_id) {
          // If there's a stored subscription but no active one in Stripe, mark it as canceled
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              end_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('subscription_id', userSubscription.subscription_id);
            
          if (error) {
            console.error('Error marking subscription as canceled:', error);
          } else {
            // Reload user data
            await loadUserData(user.id);
          }
        }
      } else if (userSubscription && userSubscription.subscription_id) {
        // If there's a stored subscription but none in Stripe, mark it as canceled
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            end_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', userSubscription.subscription_id);
          
        if (error) {
          console.error('Error marking subscription as canceled:', error);
        } else {
          // Reload user data
          await loadUserData(user.id);
        }
      }
    } catch (error) {
      console.error('Error refreshing subscription data:', error);
    }
  }
  
  // Cancelar suscripción
  async function cancelSubscription() {
    if (!user || !userSubscription || !userSubscription.subscription_id) {
      throw new Error('No active subscription to cancel');
    }
    
    try {
      // Cancel subscription in Stripe
      if (userSubscription.subscription_id) {
        await stripeService.cancelSubscription(userSubscription.subscription_id);
      }
      
      // Update subscription in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userSubscription.id);
        
      if (error) throw error;
      
      // Recargar datos de suscripción
      await loadUserData(user.id);
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
      throw error;
    }
  }
  
  // Incrementar el contador de uso de API
  async function incrementApiUsage() {
    if (!user || !usageStats) return;
    
    try {
      const newCount = (usageStats.api_calls || 0) + 1;
      
      const { error } = await supabase
        .from('usage_stats')
        .update({ 
          api_calls: newCount,
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', usageStats.id);
        
      if (error) throw error;
      
      // Actualizar estado local
      setUsageStats({
        ...usageStats,
        api_calls: newCount,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error incrementando uso de API:', error);
    }
  }
  
  // Agregar uso de almacenamiento
  async function addStorageUsage(bytesAdded: number) {
    if (!user || !usageStats) return;
    
    try {
      const newStorage = (usageStats.storage_used || 0) + bytesAdded;
      
      const { error } = await supabase
        .from('usage_stats')
        .update({ 
          storage_used: newStorage,
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', usageStats.id);
        
      if (error) throw error;
      
      // Actualizar estado local
      setUsageStats({
        ...usageStats,
        storage_used: newStorage,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error actualizando uso de almacenamiento:', error);
    }
  }
  
  // Verificar si el usuario tiene acceso a funcionalidades premium
  function hasAccess(requiredPlanId: string): boolean {
    if (!userSubscription) return requiredPlanId === '1'; // Only allow free features
    
    return checkAccess(userSubscription.plan_id, requiredPlanId);
  }
  
  // Verificar si el usuario tiene acceso a un modelo específico
  function hasModelAccess(modelId: string): boolean {
    if (!userSubscription) return false;
    
    return hasModelAccess(userSubscription.plan_id, modelId);
  }
  
  // Refrescar datos de suscripción
  async function refreshSubscriptionData() {
    if (!user) return;
    await loadUserData(user.id);
  }

  // Redirect to Stripe Checkout
  async function redirectToCheckout(planId: string) {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Get the price ID for the selected plan
      const priceId = PLAN_TO_PRICE_MAP[planId];
      
      if (!priceId) {
        throw new Error('Invalid plan ID');
      }
      
      // Create or get Stripe customer
      let customerId = stripeCustomerId;
      
      if (!customerId && profile) {
        // Create a new customer in Stripe
        const customerResponse = await stripeService.createCustomer({
          email: user.email,
          name: profile.username || user.email?.split('@')[0],
          metadata: {
            user_id: user.id
          }
        });
        
        if (customerResponse && customerResponse.id) {
          customerId = customerResponse.id;
          
          // Update profile with Stripe customer ID
          const { error } = await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
            
          if (error) {
            console.error('Error updating profile with Stripe customer ID:', error);
          } else {
            setStripeCustomerId(customerId);
          }
        }
      }
      
      if (!customerId) {
        throw new Error('Could not create or retrieve Stripe customer');
      }
      
      // Create checkout session and redirect
      const session = await stripeService.createCheckoutSession({
        customerId,
        priceId,
        successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      });
      
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }
  
  // Redirect to Stripe Customer Portal
  async function redirectToCustomerPortal() {
    if (!user || !stripeCustomerId) {
      throw new Error('User not authenticated or no Stripe customer ID');
    }
    
    try {
      // Create customer portal session and redirect
      const session = await stripeService.createCustomerPortalSession({
        customerId: stripeCustomerId,
        returnUrl: `${window.location.origin}/profile`
      });
      
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Failed to create customer portal session');
      }
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      throw error;
    }
  }

  // Reset password functionality
  async function resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error('Error resetting password:', error);
        throw error;
      }
      
      return { error: null, data };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error, data: null };
    }
  }

  async function updatePassword(newPassword: string, accessToken: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error };
    }
  }

  // Added alias for signOut to match API in components
  async function logout() {
    return signOut();
  }

  const value = {
    user,
    profile,
    userSubscription,
    usageStats,
    availablePlans,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    updateProfile,
    updateSubscription,
    cancelSubscription,
    incrementApiUsage,
    addStorageUsage,
    hasAccess,
    hasModelAccess,
    getPlanName: (planId: string) => getPlanName(planId as PlanType),
    refreshSubscriptionData,
    supabase,
    redirectToCheckout,
    redirectToCustomerPortal,
    logout,
    isLoading,
    stripeCustomerId,
    isLoginOpen,
    setIsLoginOpen
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
