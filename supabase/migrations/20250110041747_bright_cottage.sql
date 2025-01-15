/*
  # Add Market Contacts Support

  1. New Tables
    - `market_contacts`
      - `id` (uuid, primary key)
      - `market_id` (uuid, references markets)
      - `name` (text)
      - `role` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on market_contacts table
    - Add policy for authenticated users to manage contacts
    - Add constraint to limit contacts per market

  3. Changes
    - Add table for storing market contacts
    - Add constraint to limit max contacts per market
    - Add RLS policies for security
*/

-- Create market_contacts table
CREATE TABLE market_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  -- Add constraint to ensure either email or phone is provided
  CONSTRAINT contact_info_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Create index for better query performance
CREATE INDEX market_contacts_market_id_idx ON market_contacts(market_id);

-- Add constraint to limit contacts per market
CREATE OR REPLACE FUNCTION check_market_contacts_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM market_contacts
    WHERE market_id = NEW.market_id
  ) >= 3 THEN
    RAISE EXCEPTION 'Maximum of 3 contacts allowed per market';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_market_contacts_limit
  BEFORE INSERT ON market_contacts
  FOR EACH ROW
  EXECUTE FUNCTION check_market_contacts_limit();

-- Enable RLS
ALTER TABLE market_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage contacts for their markets"
  ON market_contacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM markets
      WHERE markets.id = market_contacts.market_id
      AND markets.user_id = auth.uid()
    )
  );