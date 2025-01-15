/*
  # Add total_leads column to markets table

  1. Changes
    - Add total_leads column to markets table
    - Add function to update total_leads
    - Add trigger to automatically update total_leads when leads change
*/

-- Add total_leads column if it doesn't exist
ALTER TABLE markets
ADD COLUMN IF NOT EXISTS total_leads integer DEFAULT 0;

-- Create function to update market total_leads
CREATE OR REPLACE FUNCTION update_market_total_leads()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the total_leads count for the affected market
  WITH lead_count AS (
    SELECT COUNT(*) as count
    FROM leads
    WHERE market_id = COALESCE(NEW.market_id, OLD.market_id)
  )
  UPDATE markets
  SET total_leads = lead_count.count
  FROM lead_count
  WHERE id = COALESCE(NEW.market_id, OLD.market_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update total_leads
DROP TRIGGER IF EXISTS update_market_leads_count_insert ON leads;
CREATE TRIGGER update_market_leads_count_insert
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_market_total_leads();

DROP TRIGGER IF EXISTS update_market_leads_count_delete ON leads;
CREATE TRIGGER update_market_leads_count_delete
  AFTER DELETE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_market_total_leads();