/*
  # Initial Schema Setup

  1. New Tables
    - `markets`
      - Core fields for market data
      - RLS enabled for user-specific access
    - `leads`
      - Stores lead information
      - Links to markets and users
      - RLS enabled for data security

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Policies ensure users can only access their own data
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

CREATE POLICY "Users can manage their own markets"
  ON markets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

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

CREATE POLICY "Users can manage their own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX leads_market_id_idx ON leads(market_id);
CREATE INDEX leads_user_id_idx ON leads(user_id);
CREATE INDEX markets_user_id_idx ON markets(user_id);