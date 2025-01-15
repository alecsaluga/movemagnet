/*
  # Update Leads Schema for Multiple Manual Contacts

  1. Changes
    - Drop the JSON contacts column
    - Add separate contact columns for up to 3 contacts
    - Each contact has name, role, email, and phone fields
    - Migrate existing data
    - Recreate view with new structure

  2. Security
    - Maintain existing RLS policies
*/

-- First, drop the dependent view
DROP VIEW IF EXISTS leads_with_status;

-- Drop the JSON contacts column and constraint
ALTER TABLE leads
DROP COLUMN IF EXISTS contacts CASCADE;

-- Add columns for up to 3 contacts
ALTER TABLE leads
ADD COLUMN contact1_name text,
ADD COLUMN contact1_role text,
ADD COLUMN contact1_email text,
ADD COLUMN contact1_phone text,
ADD COLUMN contact2_name text,
ADD COLUMN contact2_role text,
ADD COLUMN contact2_email text,
ADD COLUMN contact2_phone text,
ADD COLUMN contact3_name text,
ADD COLUMN contact3_role text,
ADD COLUMN contact3_email text,
ADD COLUMN contact3_phone text;

-- Add constraints to ensure at least one contact method per contact
ALTER TABLE leads
ADD CONSTRAINT contact1_info_required 
  CHECK (contact1_name IS NULL OR (contact1_email IS NOT NULL OR contact1_phone IS NOT NULL)),
ADD CONSTRAINT contact2_info_required 
  CHECK (contact2_name IS NULL OR (contact2_email IS NOT NULL OR contact2_phone IS NOT NULL)),
ADD CONSTRAINT contact3_info_required 
  CHECK (contact3_name IS NULL OR (contact3_email IS NOT NULL OR contact3_phone IS NOT NULL));

-- Recreate the view with updated fields
CREATE OR REPLACE VIEW public.leads_with_status AS
SELECT 
  l.*,
  CASE 
    WHEN l.created_at >= (CURRENT_TIMESTAMP - interval '3 days') THEN true
    ELSE false
  END as is_new_status
FROM public.leads l;

-- Grant access to authenticated users
GRANT SELECT ON public.leads_with_status TO authenticated;