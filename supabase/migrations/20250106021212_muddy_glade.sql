/*
  # Auto-remove NEW badge after 3 days

  1. Changes
    - Creates a view that dynamically computes is_new status
    - Updates existing leads table structure
    - Adds RLS policies for the view
*/

-- Add is_new column to leads table (will be managed by application)
ALTER TABLE leads DROP COLUMN IF EXISTS is_new;
ALTER TABLE leads ADD COLUMN is_new boolean DEFAULT true;

-- Create a view that automatically handles is_new status
CREATE OR REPLACE VIEW leads_with_status AS
SELECT 
  l.*,
  CASE 
    WHEN l.created_at >= (CURRENT_TIMESTAMP - interval '3 days') THEN true
    ELSE false
  END as is_new_status
FROM leads l;

-- Enable RLS on the view
ALTER VIEW leads_with_status OWNER TO authenticated;

-- Add RLS policy for the view
CREATE POLICY "Users can access leads_with_status for their markets"
  ON leads_with_status
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = leads_with_status.market_id
      AND markets.user_id = auth.uid()
      AND markets.subscription_status = 'subscribed'
    )
  );