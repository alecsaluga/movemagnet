/*
  # Update Market Contacts Schema

  1. Changes
    - Drop and recreate constraints to ensure proper enforcement
    - Add updated_at column for tracking changes
    - Add order column to maintain contact priority
    - Ensure proper indexing

  2. Security
    - Reapply RLS policies with updated conditions
*/

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'market_contacts' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE market_contacts 
    ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add order column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'market_contacts' 
    AND column_name = 'display_order'
  ) THEN
    ALTER TABLE market_contacts 
    ADD COLUMN display_order smallint DEFAULT 0;
  END IF;
END $$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS enforce_market_contacts_limit ON market_contacts;
DROP FUNCTION IF EXISTS check_market_contacts_limit();

-- Create improved function to check contacts limit and maintain order
CREATE OR REPLACE FUNCTION check_market_contacts_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check total contacts limit
  IF (
    SELECT COUNT(*)
    FROM market_contacts
    WHERE market_id = NEW.market_id
  ) >= 3 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Maximum of 3 contacts allowed per market';
  END IF;

  -- Set display order if not provided
  IF NEW.display_order IS NULL THEN
    SELECT COALESCE(MAX(display_order) + 1, 0)
    INTO NEW.display_order
    FROM market_contacts
    WHERE market_id = NEW.market_id;
  END IF;

  -- Set updated_at
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER enforce_market_contacts_limit
  BEFORE INSERT OR UPDATE ON market_contacts
  FOR EACH ROW
  EXECUTE FUNCTION check_market_contacts_limit();

-- Create index on display_order
CREATE INDEX IF NOT EXISTS market_contacts_order_idx 
ON market_contacts(market_id, display_order);

-- Drop and recreate RLS policies
DROP POLICY IF EXISTS "Users can manage contacts for their markets" ON market_contacts;

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