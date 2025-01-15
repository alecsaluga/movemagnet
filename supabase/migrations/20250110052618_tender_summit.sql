-- Drop existing market policies
DROP POLICY IF EXISTS "Users can view markets" ON markets;
DROP POLICY IF EXISTS "Users can manage subscribed markets" ON markets;
DROP POLICY IF EXISTS "Admins can manage all markets" ON markets;

-- Create new market policies
CREATE POLICY "Users can view all markets"
  ON markets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage subscribed markets"
  ON markets
  FOR UPDATE
  TO authenticated
  USING (
    subscription_status = 'subscribed' AND user_id = auth.uid() OR
    is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage all markets"
  ON markets
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Update market subscription status function
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