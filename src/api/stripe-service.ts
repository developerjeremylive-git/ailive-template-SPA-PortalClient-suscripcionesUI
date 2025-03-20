import { SubscriptionPlan } from '../context/AuthContext';
import { PLAN_TO_PRICE_MAP, PRICE_TO_PLAN_MAP } from '../utils/subscriptionConstants';

// Define Stripe API endpoints
const STRIPE_API = {
  createCustomer: '/api/stripe/customers',
  updateCustomer: '/api/stripe/customers',
  createSession: '/api/stripe/create-checkout-session',
  retrieveSession: '/api/stripe/retrieve-session',
  getSubscription: '/api/stripe/subscriptions',
  getCustomerSubscriptions: '/api/stripe/customer-subscriptions',
  updateSubscription: '/api/stripe/subscriptions',
  cancelSubscription: '/api/stripe/subscriptions/cancel',
  createPortalSession: '/api/stripe/create-portal-session'
};

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  start_date: number;
  canceled_at: number | null;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      price: {
        id: string;
        product: string;
      }
    }>
  };
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface CheckoutSessionParams {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

export interface CustomerParams {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface CustomerUpdateParams {
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
}

class StripeService {
  private apiRoot: string;

  constructor(apiRoot = '') {
    this.apiRoot = apiRoot;
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(params: CustomerParams): Promise<StripeCustomer> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.createCustomer}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create Stripe customer');
    }

    return response.json();
  }

  /**
   * Update a Stripe customer
   */
  async updateCustomer(customerId: string, updates: CustomerUpdateParams): Promise<StripeCustomer> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.updateCustomer}/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update Stripe customer');
    }

    return response.json();
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(params: CheckoutSessionParams): Promise<{ sessionId: string; url: string }> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.createSession}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: params.priceId,
        customerId: params.customerId,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  }

  /**
   * Create a customer portal session
   */
  async createCustomerPortalSession(params: CustomerPortalParams): Promise<{ url: string }> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.createPortalSession}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: params.customerId,
        returnUrl: params.returnUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create portal session');
    }

    return response.json();
  }

  /**
   * Get subscription by ID
   */
  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.getSubscription}/${subscriptionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retrieve subscription');
    }

    return response.json();
  }

  /**
   * Get subscriptions for a customer
   */
  async getCustomerSubscriptions(customerId: string): Promise<{ data: StripeSubscription[] }> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.getCustomerSubscriptions}/${customerId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retrieve customer subscriptions');
    }

    return response.json();
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<StripeSubscription> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.updateSubscription}/${subscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: newPriceId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update subscription');
    }

    return response.json();
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{ canceled: boolean }> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.cancelSubscription}/${subscriptionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    return response.json();
  }

  /**
   * Retrieve checkout session by ID
   */
  async retrieveSession(sessionId: string): Promise<any> {
    const response = await fetch(`${this.apiRoot}${STRIPE_API.retrieveSession}/${sessionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retrieve checkout session');
    }

    return response.json();
  }
}

// Export a singleton instance of the service
const stripeService = new StripeService();
export default stripeService;
