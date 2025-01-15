/*
  # Update market and lead policies
  
  1. Changes
    - Modify market policies to:
      - Allow all authenticated users to view unsubscribed markets
      - Only allow subscribed users to view their own markets
    - Update lead policies to:
      - Only allow access to leads if the user owns the associated market
      - Prevent access to leads from unsubscribed markets
  
  2. Security
    - Strict RLS policies for market ownership
    - Lead access tied to market subscription
*/

-- Update market policies
DROP POLICY IF EXISTS "Users can manage their own markets" ON markets;

-- Allow users to view unsubscribed markets
CREATE POLICY "Users can view unsubscribed markets"
  ON markets
  FOR SELECT
  TO authenticated
  USING (
    (NOT is_subscribed) OR 
    (is_subscribed AND auth.uid() = user_id)
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
CREATE POLICY "Users can access leads for their subscribed markets"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = leads.market_id
      AND markets.user_id = auth.uid()
      AND markets.is_subscribed = true
    )
  );