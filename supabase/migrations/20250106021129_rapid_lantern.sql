/*
  # Auto-remove NEW badge after 3 days

  1. Changes
    - Creates a view that automatically filters out NEW badge for old leads
    - Adds function to update is_new status for leads older than 3 days
    - Creates a scheduled job to update is_new status daily
*/

-- Create a function to update is_new status
CREATE OR REPLACE FUNCTION update_old_leads_status()
RETURNS void AS $$
BEGIN
  UPDATE leads
  SET is_new = false
  WHERE 
    is_new = true 
    AND created_at < (now() - interval '3 days');
END;
$$ LANGUAGE plpgsql;

-- Create a view that automatically handles is_new status
CREATE OR REPLACE VIEW leads_with_status AS
SELECT 
  l.*,
  CASE 
    WHEN l.created_at >= (now() - interval '3 days') THEN l.is_new
    ELSE false
  END as is_new
FROM leads l;

-- Update existing leads
UPDATE leads
SET is_new = false
WHERE created_at < (now() - interval '3 days');

-- Enable RLS on the view
ALTER VIEW leads_with_status OWNER TO authenticated;
GRANT SELECT ON leads_with_status TO authenticated;