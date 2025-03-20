import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Setting up the database...');
    
    // Creating api_models table first
    console.log('Creating api_models table...');
    const { error: apiModelsError } = await supabase.from('api_models').insert({
      id: '1',
      name: 'Default Model',
      required_plan: '1', // Note: using required_plan instead of requiredPlan
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select();
    
    if (apiModelsError) {
      console.error('Error with api_models table:', apiModelsError);
    }

    // Creating profiles table
    console.log('Creating profiles table...');
    const { error: profilesError } = await supabase.from('profiles').insert({
      id: '00000000-0000-0000-0000-000000000000',
      username: 'test_user',
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select();
    
    if (profilesError && profilesError.code !== '23505') {
      console.error('Error with profiles table:', profilesError);
    }

    // Creating usage_stats table
    console.log('Creating usage_stats table...');
    const { error: usageStatsError } = await supabase.from('usage_stats').insert({
      id: '00000000-0000-0000-0000-000000000000',
      user_id: '00000000-0000-0000-0000-000000000000',
      api_calls: 0,
      storage_used: 0,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select();
    
    if (usageStatsError && usageStatsError.code !== '23505') {
      console.error('Error with usage_stats table:', usageStatsError);
    }

    // Creating subscriptions table
    console.log('Creating subscriptions table...');
    const { error: subscriptionsError } = await supabase.from('subscriptions').insert({
      id: '00000000-0000-0000-0000-000000000000',
      user_id: '00000000-0000-0000-0000-000000000000',
      plan_id: '1',
      status: 'test',
      start_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select();
    
    if (subscriptionsError) {
      if (subscriptionsError.code === '42P01') {
        console.log('Subscriptions table does not exist. This is expected during initial setup.');
      } else if (subscriptionsError.code === '23505') {
        console.log('Subscriptions table already exists with test record.');
      } else {
        console.error('Error with subscriptions table:', subscriptionsError);
      }
    } else {
      console.log('Subscriptions table is working correctly.');
    }

    // Creating subscription_plans table
    console.log('Creating subscription_plans table...');
    const { error: plansError } = await supabase.from('subscription_plans').insert({
      id: '1',
      name: 'Free',
      description: 'Basic features for personal use',
      price: 0,
      billing_cycle: 'monthly',
      features: { api_calls_limit: 100, storage_limit: 100000000 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select();
    
    if (plansError) {
      if (plansError.code === '42P01') {
        console.log('Subscription_plans table does not exist. This is expected during initial setup.');
      } else if (plansError.code === '23505') {
        console.log('Subscription_plans table already exists with the Free plan record.');
      } else {
        console.error('Error with subscription_plans table:', plansError);
      }
    } else {
      console.log('Subscription_plans table is working correctly.');
      
      // If Free plan exists, let's add the other plans
      console.log('Adding other subscription plans...');
      const plans = [
        {
          id: '2',
          name: 'Starter',
          description: 'Enhanced features for small teams',
          price: 9.99,
          billing_cycle: 'monthly',
          features: { api_calls_limit: 1000, storage_limit: 500000000 }
        },
        {
          id: '3',
          name: 'Pro',
          description: 'Advanced features for businesses',
          price: 19.99,
          billing_cycle: 'monthly',
          features: { api_calls_limit: 10000, storage_limit: 1000000000 }
        },
        {
          id: '4',
          name: 'Enterprise',
          description: 'Full access for large organizations',
          price: 99.99,
          billing_cycle: 'monthly',
          features: { api_calls_limit: 100000, storage_limit: 10000000000 }
        }
      ];
      
      for (const plan of plans) {
        const { error } = await supabase.from('subscription_plans').insert(plan);
        if (error && error.code !== '23505') {
          console.error(`Error adding ${plan.name} plan:`, error);
        } else {
          console.log(`${plan.name} plan added or already exists`);
        }
      }
    }

    // Creating usage_stats table    
    if (customerDetailsError) {
      if (customerDetailsError.code === '42P01') {
        console.log('Customer_details table does not exist. This is expected during initial setup.');
      } else if (customerDetailsError.code === '23505') {
        console.log('Customer_details table already exists with test record.');
      } else {
        console.error('Error with customer_details table:', customerDetailsError);
      }
    } else {
      console.log('Customer_details table is working correctly.');
    }

    console.log('Database setup completed.');

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

createTables().catch(console.error);
