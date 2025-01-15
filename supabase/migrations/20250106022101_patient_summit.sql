-- Add Stripe-specific fields to markets
ALTER TABLE markets
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS stripe_product_id text;

-- Add Stripe customer ID to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create stripe_subscriptions table
CREATE TABLE stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(market_id, user_id)
);

-- Enable RLS
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own subscriptions"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update market subscription status
CREATE OR REPLACE FUNCTION update_market_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update market subscription status based on Stripe subscription
  UPDATE markets
  SET subscription_status = 
    CASE 
      WHEN NEW.status IN ('trialing', 'active') THEN 'subscribed'
      ELSE 'available'
    END
  WHERE id = NEW.market_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription status updates
CREATE TRIGGER update_market_subscription_status
  AFTER INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_market_subscription_status();

-- Update markets with Stripe pricing
UPDATE markets 
SET 
  stripe_price_id = CASE 
    WHEN price > 0 THEN 'price_' || encode(gen_random_bytes(12), 'hex')
    ELSE NULL 
  END,
  stripe_product_id = CASE 
    WHEN price > 0 THEN 'prod_' || encode(gen_random_bytes(12), 'hex')
    ELSE NULL 
  END
WHERE price > 0;