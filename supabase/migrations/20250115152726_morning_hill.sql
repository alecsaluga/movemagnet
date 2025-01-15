-- Modify the sync_lead_ownership function to handle admins
CREATE OR REPLACE FUNCTION sync_lead_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- For admins, keep the user_id as is (the admin's ID)
  IF is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- For non-admins, set user_id to current market subscriber
  NEW.user_id := get_market_subscriber(NEW.market_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger to use the updated function
DROP TRIGGER IF EXISTS sync_lead_ownership_trigger ON leads;
CREATE TRIGGER sync_lead_ownership_trigger
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION sync_lead_ownership();

-- Update RLS policies for leads
DROP POLICY IF EXISTS "Users can access leads for their markets" ON leads;

CREATE POLICY "Users can access leads for their markets"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    -- Allow access if user is admin
    is_admin(auth.uid())
    OR
    -- Or if user is current subscriber of the market
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = leads.market_id
      AND markets.current_subscriber_id = auth.uid()
    )
  );

-- Add comment explaining the policy
COMMENT ON POLICY "Users can access leads for their markets" ON leads IS 
  'Allows admins to access all leads, and subscribers to access leads for their markets';