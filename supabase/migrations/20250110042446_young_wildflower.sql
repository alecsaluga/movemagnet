/*
  # Update Leads Schema for Multiple Contacts

  1. Changes
    - Drop dependent view
    - Add contacts array to store up to 3 contacts per lead
    - Each contact has name, role, email, and phone
    - Remove old contact fields
    - Add validation for contacts array
    - Recreate view with updated fields

  2. Security
    - Maintain existing RLS policies
*/

-- First, drop the dependent view
DROP VIEW IF EXISTS leads_with_status;

-- Add the contacts column
ALTER TABLE leads
ADD COLUMN contacts jsonb DEFAULT '[]'::jsonb;

-- Create function to validate contacts
CREATE OR REPLACE FUNCTION validate_contacts(contacts_array jsonb)
RETURNS boolean AS $$
BEGIN
  -- Check if it's an array
  IF jsonb_typeof(contacts_array) != 'array' THEN
    RETURN false;
  END IF;

  -- Check array length
  IF jsonb_array_length(contacts_array) > 3 THEN
    RETURN false;
  END IF;

  -- Check each contact has required fields
  FOR i IN 0..jsonb_array_length(contacts_array) - 1 LOOP
    IF NOT (
      contacts_array->i ? 'name' AND
      (contacts_array->i ? 'email' OR contacts_array->i ? 'phone')
    ) THEN
      RETURN false;
    END IF;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add check constraint using the validation function
ALTER TABLE leads
ADD CONSTRAINT valid_contacts_structure 
CHECK (validate_contacts(contacts));

-- Migrate existing contact data to the new structure
UPDATE leads
SET contacts = jsonb_build_array(
  jsonb_build_object(
    'name', contact_name,
    'role', NULL,
    'email', NULL,
    'phone', contact_phone
  )
)
WHERE contact_name IS NOT NULL OR contact_phone IS NOT NULL;

-- Drop old contact columns
ALTER TABLE leads
DROP COLUMN IF EXISTS contact_name CASCADE,
DROP COLUMN IF EXISTS contact_phone CASCADE;

-- Create index for better performance when querying contacts
CREATE INDEX leads_contacts_gin_idx ON leads USING gin (contacts);

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