/*
  # Stripe Integration Setup

  1. Changes
    - Add Stripe-specific fields to markets table
    - Add subscription_status field to markets
    - Create stripe_subscriptions table
    - Add RLS policies for secure access
    - Add automatic status updates via triggers

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Add subscription_status to markets if not exists
ALTER TABLE markets 
ADD COLUMN IF NOT EXISTS subscription_status text 
DEFAULT 'available' 
CHECK (subscription_status IN ('available', 'subscribed'));

-- Add Stripe fields to markets
ALTER TABLE markets
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS stripe_product_id text;

-- Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
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
DROP TRIGGER IF EXISTS update_market_subscription_status ON stripe_subscriptions;
CREATE TRIGGER update_market_subscription_status
  AFTER INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_market_subscription_status();