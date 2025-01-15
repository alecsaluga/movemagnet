/*
  # Add market paywall and subscription handling

  1. Changes
    - Adds pricing and subscription fields to markets table
    - Creates subscription tracking table
    - Adds RLS policies for subscriptions
*/

-- Add pricing fields to markets
ALTER TABLE markets
ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;

-- Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(market_id, user_id)
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update subscription status
CREATE OR REPLACE FUNCTION check_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update market subscription status based on subscription
  UPDATE markets
  SET subscription_status = 
    CASE 
      WHEN NEW.status = 'active' AND NEW.current_period_end > now() THEN 'subscribed'
      ELSE 'available'
    END
  WHERE id = NEW.market_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription status updates
CREATE TRIGGER update_market_subscription_status
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION check_subscription_status();

-- Update existing markets with pricing
UPDATE markets 
SET 
  price = 299,
  trial_days = 7,
  features = '[
    "Unlimited lead access",
    "Real-time notifications",
    "CRM integration",
    "Lead export"
  ]'::jsonb
WHERE subscription_status = 'available';