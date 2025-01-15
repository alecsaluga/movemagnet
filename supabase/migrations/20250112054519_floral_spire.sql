-- Make user_id optional on leads
ALTER TABLE leads
ALTER COLUMN user_id DROP NOT NULL;

-- Create function to get market subscriber
CREATE OR REPLACE FUNCTION get_market_subscriber(market_id uuid)
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT current_subscriber_id
    FROM markets
    WHERE id = market_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to sync lead ownership with market subscription
CREATE OR REPLACE FUNCTION sync_lead_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Set user_id to current market subscriber (if any)
  NEW.user_id := get_market_subscriber(NEW.market_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set user_id on lead creation
DROP TRIGGER IF EXISTS sync_lead_ownership_trigger ON leads;
CREATE TRIGGER sync_lead_ownership_trigger
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION sync_lead_ownership();

-- Update RLS policies for leads
DROP POLICY IF EXISTS "Users can access leads for their markets" ON leads;

CREATE POLICY "Users can access market leads"
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
        -- Or if market has no subscriber (available) and user is admin
        OR (markets.current_subscriber_id IS NULL AND is_admin(auth.uid()))
      )
    )
  );