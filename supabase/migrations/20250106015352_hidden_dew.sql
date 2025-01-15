/*
  # Create leads table with proper structure

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `market_id` (uuid, foreign key)
      - `business_name` (text)
      - `address` (text)
      - `suite` (text, optional)
      - `city` (text)
      - `state` (text)
      - `zip` (text)
      - `move_date` (date)
      - `predicted_move_date` (date)
      - `contact_name` (text)
      - `contact_phone` (text)
      - `is_new` (boolean)
      - `in_crm` (boolean)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS
    - Add policy for users to access leads from their subscribed markets
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS leads;

-- Create leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  address text NOT NULL,
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
CREATE INDEX leads_business_name_idx ON leads(business_name);
CREATE INDEX leads_address_idx ON leads(address);
CREATE INDEX leads_city_idx ON leads(city);
CREATE INDEX leads_state_idx ON leads(state);
CREATE INDEX leads_market_id_idx ON leads(market_id);
CREATE INDEX leads_user_id_idx ON leads(user_id);
CREATE INDEX leads_created_at_idx ON leads(created_at);

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