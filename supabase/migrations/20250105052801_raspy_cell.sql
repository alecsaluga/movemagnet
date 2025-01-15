/*
  # Scraper Job Tracking System

  1. New Tables
    - `scraper_jobs`
      - Tracks scraping jobs for each market
      - Records status, results, and timing
    - `scraper_schedules`
      - Configures scraping frequency for markets
      
  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Scraper jobs table
CREATE TABLE scraper_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  total_leads integer DEFAULT 0,
  new_leads integer DEFAULT 0,
  error text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scraper_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their scraper jobs"
  ON scraper_jobs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Scraper schedules table
CREATE TABLE scraper_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE,
  frequency_days integer NOT NULL DEFAULT 3,
  last_run timestamptz,
  next_run timestamptz,
  is_active boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(market_id, user_id)
);

ALTER TABLE scraper_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their scraper schedules"
  ON scraper_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update next run time
CREATE OR REPLACE FUNCTION update_next_run()
RETURNS trigger AS $$
BEGIN
  NEW.next_run := COALESCE(NEW.last_run, now()) + (NEW.frequency_days || ' days')::interval;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update next_run
CREATE TRIGGER update_scraper_schedule_next_run
  BEFORE INSERT OR UPDATE ON scraper_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_next_run();