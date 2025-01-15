/*
  # Update markets and leads tables

  1. New Tables
    - `markets`
      - Basic market information
      - Tracks subscriptions and lead counts
    - `leads`
      - Business lead information
      - Contact details and move dates
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
  
  3. Performance
    - Add indexes for foreign keys
*/

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  total_leads integer DEFAULT 0,
  price numeric(10,2) NOT NULL,
  is_subscribed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  UNIQUE(name, state, user_id)
);

ALTER TABLE markets ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'markets' AND policyname = 'Users can manage their own markets'
  ) THEN
    CREATE POLICY "Users can manage their own markets"
      ON markets
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  street text NOT NULL,
  suite text,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  move_date date NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  is_new boolean DEFAULT true,
  in_crm boolean DEFAULT false,
  added_at timestamptz DEFAULT now(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' AND policyname = 'Users can manage their own leads'
  ) THEN
    CREATE POLICY "Users can manage their own leads"
      ON leads
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS leads_market_id_idx ON leads(market_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS markets_user_id_idx ON markets(user_id);