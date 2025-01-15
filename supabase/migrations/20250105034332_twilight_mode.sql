/*
  # Initial Schema Setup

  1. New Tables
    - `markets`
      - `id` (uuid, primary key)
      - `name` (text) - e.g., "San Diego"
      - `state` (text) - e.g., "CA"
      - `url` (text) - Loopnet URL for scraping
      - `last_scraped_at` (timestamp) - Track when market was last scraped
      - `created_at` (timestamp)
      - `user_id` (uuid) - Links to auth.users

    - `leads`
      - `id` (uuid, primary key)
      - `market_id` (uuid) - References markets
      - `property_url` (text) - Original Loopnet URL
      - `address` (text)
      - `suite` (text)
      - `size` (text)
      - `available_date` (date) - Date from scraper
      - `predicted_move_date` (date) - 30 days before available_date
      - `business_name` (text, nullable) - To be filled by Places API
      - `contact_name` (text, nullable)
      - `contact_phone` (text, nullable)
      - `in_crm` (boolean)
      - `created_at` (timestamp)
      - `user_id` (uuid) - Links to auth.users

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Markets table
CREATE TABLE markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  url text NOT NULL,
  last_scraped_at timestamptz,
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
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE NOT NULL,
  property_url text NOT NULL,
  address text NOT NULL,
  suite text,
  size text,
  available_date date,
  predicted_move_date date,
  business_name text,
  contact_name text,
  contact_phone text,
  in_crm boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  UNIQUE(property_url, suite, user_id)
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