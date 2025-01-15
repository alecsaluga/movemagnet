/*
  # Market Subscription System

  1. Changes
    - Add current_subscriber_id to markets
    - Update RLS policies for exclusive access
    - Clean up subscription tables
    - Add constraints and triggers

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Ensure data integrity with constraints
*/

-- Drop unused tables
DROP TABLE IF EXISTS subscriptions;

-- Keep only stripe_subscriptions for subscription tracking
ALTER TABLE stripe_subscriptions
ADD CONSTRAINT unique_market_subscription UNIQUE (market_id);

-- Add current subscriber tracking to markets
ALTER TABLE markets
ADD COLUMN current_subscriber_id uuid REFERENCES auth.users(id),
ADD CONSTRAINT one_subscriber_per_market UNIQUE (id, current_subscriber_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view available markets" ON markets;
DROP POLICY IF EXISTS "Users can manage their subscribed markets" ON markets;

-- Create new policies for exclusive access
CREATE POLICY "Users can view markets"
  ON markets
  FOR SELECT
  TO authenticated
  USING (
    current_subscriber_id IS NULL OR -- Available markets
    current_subscriber_id = auth.uid() -- User's subscribed markets
  );

CREATE POLICY "Users can manage subscribed markets"
  ON markets
  FOR UPDATE
  TO authenticated
  USING (
    -- Can only update markets that are available or already subscribed by this user
    current_subscriber_id IS NULL OR current_subscriber_id = auth.uid()
  );

-- Function to handle subscription status changes
CREATE OR REPLACE FUNCTION handle_market_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new subscriber is set, update subscription status
  IF NEW.current_subscriber_id IS NOT NULL THEN
    NEW.subscription_status := 'subscribed';
  ELSE
    NEW.subscription_status := 'available';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain subscription status
CREATE TRIGGER market_subscription_trigger
  BEFORE UPDATE ON markets
  FOR EACH ROW
  EXECUTE FUNCTION handle_market_subscription();

-- Function to handle Stripe subscription updates
CREATE OR REPLACE FUNCTION handle_stripe_subscription_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update market subscriber based on Stripe subscription status
  IF NEW.status IN ('trialing', 'active') THEN
    UPDATE markets
    SET current_subscriber_id = NEW.user_id
    WHERE id = NEW.market_id;
  ELSE
    UPDATE markets
    SET current_subscriber_id = NULL
    WHERE id = NEW.market_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Stripe subscription updates
CREATE TRIGGER stripe_subscription_update_trigger
  AFTER INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_stripe_subscription_update();

-- Update existing subscribed markets
UPDATE markets m
SET current_subscriber_id = s.user_id
FROM stripe_subscriptions s
WHERE m.id = s.market_id
AND s.status IN ('trialing', 'active');