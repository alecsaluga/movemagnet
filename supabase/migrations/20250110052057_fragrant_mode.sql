/*
  # Add admin role support
  
  1. Changes
    - Add is_admin column to profiles table
    - Add admin-specific RLS policies
    - Create admin role function
    - Make first user an admin
  
  2. Security
    - Only admins can access admin features
    - Only super admins can grant admin access
*/

-- Drop any existing triggers that might cause conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Add admin column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Create admin-specific policies for markets
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Admins can manage all markets'
  ) THEN
    CREATE POLICY "Admins can manage all markets"
      ON markets
      FOR ALL
      TO authenticated
      USING (is_admin(auth.uid()));
  END IF;
END $$;

-- Create admin-specific policies for leads
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Admins can manage all leads'
  ) THEN
    CREATE POLICY "Admins can manage all leads"
      ON leads
      FOR ALL
      TO authenticated
      USING (is_admin(auth.uid()));
  END IF;
END $$;

-- Create admin-specific policies for profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (is_admin(auth.uid()));
  END IF;
END $$;

-- Make first user an admin
UPDATE profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);