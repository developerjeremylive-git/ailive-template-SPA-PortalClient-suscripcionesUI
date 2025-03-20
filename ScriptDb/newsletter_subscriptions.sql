-- Create newsletter_subscriptions table
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('active', 'unsubscribed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscriptions_updated_at
    BEFORE UPDATE ON newsletter_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();