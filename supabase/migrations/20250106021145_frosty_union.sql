/*
  # Auto-remove NEW badge after 3 days

  1. Changes
    - Adds computed column for dynamic is_new status
    - Updates existing leads to respect the 3-day rule
*/

-- Add computed column for is_new status
ALTER TABLE leads DROP COLUMN IF EXISTS is_new;
ALTER TABLE leads ADD COLUMN is_new boolean 
GENERATED ALWAYS AS (
  created_at >= (now() - interval '3 days')
) STORED;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS leads_is_new_idx ON leads(is_new);

-- Update RLS policy to include the new column
DROP POLICY IF EXISTS "Users can access leads for their markets" ON leads;
CREATE POLICY "Users can access leads for their markets"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = leads.market_id
      AND markets.user_id = auth.uid()
      AND markets.subscription_status = 'subscribed'
    )
  );