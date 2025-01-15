-- Add created_at column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);