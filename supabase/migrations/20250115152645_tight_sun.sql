-- Drop existing policies
DROP POLICY IF EXISTS "Users can access leads for their markets" ON leads;

-- Create new policies for leads
CREATE POLICY "Users can access leads for their markets"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = leads.market_id
      AND (
        -- Allow access if user is current subscriber
        markets.current_subscriber_id = auth.uid()
        -- Or if user is admin
        OR is_admin(auth.uid())
      )
    )
  );

-- Add comment explaining the policy
COMMENT ON POLICY "Users can access leads for their markets" ON leads IS 
  'Allows users to access leads if they are the current subscriber of the market or if they are an admin';