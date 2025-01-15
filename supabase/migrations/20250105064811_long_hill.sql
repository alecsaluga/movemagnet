-- Function to get market owner's user_id
CREATE OR REPLACE FUNCTION get_market_owner_id(market_id uuid)
RETURNS uuid AS $$
DECLARE
  owner_id uuid;
BEGIN
  SELECT user_id INTO owner_id
  FROM markets
  WHERE id = market_id;
  RETURN owner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically set user_id based on market_id
CREATE OR REPLACE FUNCTION set_lead_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Set user_id to the market owner's user_id
  NEW.user_id := get_market_owner_id(NEW.market_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically set user_id before insert
CREATE TRIGGER set_lead_user_id_trigger
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_lead_user_id();