import { SupabaseClient } from '@supabase/supabase-js';

interface NewsletterSubscription {
  id?: string;
  email: string;
  subscribed_at?: string;
  status?: 'active' | 'unsubscribed';
}

class NewsletterService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Subscribe an email to the newsletter
   */
  async subscribe(email: string): Promise<{ data: NewsletterSubscription | null; error: any }> {
    try {
      // Check if email already exists
      const { data: existing } = await this.supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        return {
          data: existing,
          error: 'Email already subscribed'
        };
      }

      // Insert new subscription
      const { data, error } = await this.supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email,
            subscribed_at: new Date().toISOString(),
            status: 'active'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Here you would typically integrate with your email service
      // to send a welcome email
      await this.sendWelcomeEmail(email);

      return { data, error: null };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return { data: null, error };
    }
  }

  /**
   * Send welcome email to new subscriber
   * Note: Implement your email service integration here
   */
  private async sendWelcomeEmail(email: string): Promise<void> {
    // TODO: Implement email sending functionality
    // This is a placeholder for email service integration
    console.log(`Welcome email would be sent to ${email}`);
  }
}

export default new NewsletterService();