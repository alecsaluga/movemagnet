/*
  # Add Stripe integration for market subscriptions

  1. Changes
    - Add Stripe-related fields to subscriptions table
    - Add Stripe price ID to markets table
    - Add function to handle Stripe webhook events
*/

-- Add Stripe fields to subscriptions
ALTER TABLE subscriptions
ADD COLUMN stripe_subscription_id text UNIQUE,
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_price_id text;

-- Add Stripe price ID to markets
ALTER TABLE markets
ADD COLUMN stripe_price_id text;

-- Create function to handle subscription updates from Stripe
CREATE OR REPLACE FUNCTION handle_stripe_subscription_updated()
RETURNS TRIGGER AS $$
BEGIN
  -- Update subscription status based on Stripe data
  UPDATE subscriptions
  SET 
    status = NEW.status,
    current_period_start = NEW.current_period_start,
    current_period_end = NEW.current_period_end,
    cancel_at_period_end = NEW.cancel_at_period_end,
    updated_at = now()
  WHERE stripe_subscription_id = NEW.stripe_subscription_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;