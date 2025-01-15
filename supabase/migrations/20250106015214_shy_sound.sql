/*
  # Fix leads table schema

  1. Changes
    - Create leads table with proper structure
    - Add proper constraints and indexes
    - Set up RLS policies
*/

-- Create leads table with proper structure
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  street text NOT NULL,
  suite text,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  move_date date,
  predicted_move_date date,
  contact_name text,
  contact_phone text,
  is_new boolean DEFAULT true,
  in_crm boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS leads_business_name_idx ON leads(business_name);
CREATE INDEX IF NOT EXISTS leads_street_idx ON leads(street);
CREATE INDEX IF NOT EXISTS leads_city_idx ON leads(city);
CREATE INDEX IF NOT EXISTS leads_state_idx ON leads(state);
CREATE INDEX IF NOT EXISTS leads_market_id_idx ON leads(market_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);

-- Create RLS policy
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