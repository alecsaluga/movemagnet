/*
  # Fix leads table schema

  1. Changes
    - Add missing address fields
    - Add proper constraints
    - Update RLS policies
*/

-- Ensure all address fields exist with proper constraints
ALTER TABLE leads
  ALTER COLUMN street SET NOT NULL,
  ALTER COLUMN city SET NOT NULL,
  ALTER COLUMN state SET NOT NULL,
  ALTER COLUMN zip SET NOT NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS leads_business_name_idx ON leads(business_name);
CREATE INDEX IF NOT EXISTS leads_street_idx ON leads(street);
CREATE INDEX IF NOT EXISTS leads_city_idx ON leads(city);
CREATE INDEX IF NOT EXISTS leads_state_idx ON leads(state);

-- Update RLS policies
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