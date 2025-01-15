/*
  # Update market and lead access policies
  
  1. Changes
    - Add subscription_status column to markets table
    - Update market policies to:
      - Allow viewing available markets
      - Restrict subscribed market access to owners
    - Update lead policies to:
      - Only allow access to leads if user owns the market
  
  2. Security
    - Strict RLS policies for market ownership
    - Lead access tied to market ownership
*/

-- Add subscription status to markets
ALTER TABLE markets 
ADD COLUMN IF NOT EXISTS subscription_status text 
DEFAULT 'available' 
CHECK (subscription_status IN ('available', 'subscribed'));

-- Update market policies
DROP POLICY IF EXISTS "Users can manage their own markets" ON markets;

-- Allow users to view available markets
CREATE POLICY "Users can view available markets"
  ON markets
  FOR SELECT
  TO authenticated
  USING (
    subscription_status = 'available' OR 
    (subscription_status = 'subscribed' AND auth.uid() = user_id)
  );

-- Allow users to manage their own markets
CREATE POLICY "Users can manage their subscribed markets"
  ON markets
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id);

-- Update lead policies
DROP POLICY IF EXISTS "Users can manage their own leads" ON leads;

-- Only allow access to leads if user owns the associated market
CREATE POLICY "Users can access leads for their markets"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = leads.market_id
      AND markets.user_id = auth.uid()
      AND markets.subscription_status = 'subscribed'
    )
  );