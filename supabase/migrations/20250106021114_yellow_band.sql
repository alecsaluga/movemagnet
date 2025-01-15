-- Function to automatically remove NEW badge after 3 days
CREATE OR REPLACE FUNCTION update_lead_new_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If the lead is more than 3 days old, set is_new to false
  IF NEW.created_at < (now() - interval '3 days') THEN
    NEW.is_new = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update is_new status before returning leads
DROP TRIGGER IF EXISTS update_lead_new_status_trigger ON leads;
CREATE TRIGGER update_lead_new_status_trigger
  BEFORE SELECT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_new_status();

-- Update existing leads
UPDATE leads
SET is_new = false
WHERE created_at < (now() - interval '3 days');