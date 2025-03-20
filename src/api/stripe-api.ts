import { Env } from '../types';
import Stripe from 'stripe';

export async function handleStripeRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/stripe', '');
  
  // Initialize Stripe with the secret key from environment variables
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
  
  try {
    // Route requests to the appropriate handler
    if (path.startsWith('/customers')) {
      return handleCustomers(request, stripe, path);
    } else if (path.startsWith('/checkout-sessions')) {
      return handleCheckoutSessions(request, stripe, path);
    } else if (path.startsWith('/portal-sessions')) {
      return handlePortalSessions(request, stripe);
    } else if (path.startsWith('/subscriptions')) {
      return handleSubscriptions(request, stripe, path);
    } else if (path.startsWith('/webhook')) {
      return handleWebhook(request, stripe, env.STRIPE_WEBHOOK_SECRET);
    } else {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle customer-related operations
async function handleCustomers(
  request: Request, 
  stripe: Stripe,
  path: string
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);
  
  // Get customer by ID
  if (request.method === 'GET' && path.match(/\/customers\/[^\/]+$/)) {
    const customerId = path.split('/').pop()!;
    
    const customer = await stripe.customers.retrieve(customerId);
    
    return new Response(JSON.stringify(customer), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  // Get customer subscriptions
  if (request.method === 'GET' && path.match(/\/customers\/[^\/]+\/subscriptions$/)) {
    const customerId = path.split('/').slice(-2)[0];
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });
    
    return new Response(JSON.stringify(subscriptions), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  // Create a new customer
  if (request.method === 'POST' && path === '/customers') {
    const { email, name } = await request.json();
    
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });
    
    return new Response(JSON.stringify(customer), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle checkout session operations
async function handleCheckoutSessions(
  request: Request, 
  stripe: Stripe,
  path: string
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);
  
  // Create a new checkout session
  if (request.method === 'POST' && path === '/checkout-sessions') {
    const { priceId, customerId, successUrl, cancelUrl } = await request.json();
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    
    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  // Retrieve a checkout session
  if (request.method === 'GET' && path.match(/\/checkout-sessions\/[^\/]+$/)) {
    const sessionId = path.split('/').pop()!;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'subscription.default_payment_method'],
    });
    
    return new Response(JSON.stringify(session), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle customer portal sessions
async function handlePortalSessions(
  request: Request, 
  stripe: Stripe
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);
  
  // Create a new portal session
  if (request.method === 'POST') {
    const { customerId, returnUrl } = await request.json();
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle subscription operations
async function handleSubscriptions(
  request: Request, 
  stripe: Stripe,
  path: string
): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);
  
  // Get subscription by ID
  if (request.method === 'GET' && path.match(/\/subscriptions\/[^\/]+$/)) {
    const subscriptionId = path.split('/').pop()!;
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'customer'],
    });
    
    return new Response(JSON.stringify(subscription), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  // Update subscription
  if (request.method === 'PATCH' && path.match(/\/subscriptions\/[^\/]+$/)) {
    const subscriptionId = path.split('/').pop()!;
    const { priceId } = await request.json();
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Update the subscription with the new price
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
      payment_behavior: 'pending_if_incomplete',
    });
    
    return new Response(JSON.stringify(updatedSubscription), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  // Cancel subscription
  if (request.method === 'POST' && path.match(/\/subscriptions\/[^\/]+\/cancel$/)) {
    const subscriptionId = path.split('/').slice(-2)[0];
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    
    return new Response(JSON.stringify(subscription), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// Handle Stripe webhooks
async function handleWebhook(
  request: Request, 
  stripe: Stripe,
  webhookSecret: string
): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response(JSON.stringify({ error: 'No signature provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const body = await request.text();
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Handle specific webhook events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Store subscription details in your database
      console.log('Checkout session completed:', session);
      
      break;
    }
    
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update subscription details in your database
      console.log('Subscription updated:', subscription);
      
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Handle subscription cancellation in your database
      console.log('Subscription deleted:', subscription);
      
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      
      // Handle successful payment
      console.log('Invoice payment succeeded:', invoice);
      
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      
      // Handle failed payment
      console.log('Invoice payment failed:', invoice);
      
      break;
    }
  }
  
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Helper to generate CORS headers
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}
