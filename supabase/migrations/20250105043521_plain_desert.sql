/*
  # Fix profile trigger function

  1. Changes
    - Update trigger function to properly handle updated_at
    - Ensure all fields are properly set during insert/update
    - Add better error handling

  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting
*/

-- Create or replace the function to handle new user creation with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  profile_name text;
BEGIN
  -- Set profile name with fallbacks
  profile_name := COALESCE(
    new.raw_user_meta_data->>'name',
    SPLIT_PART(new.email, '@', 1),
    'User'
  );

  INSERT INTO public.profiles (
    id,
    name,
    email,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    profile_name,
    new.email,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = now();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is properly set
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update existing profiles to ensure updated_at is set
UPDATE profiles 
SET updated_at = COALESCE(updated_at, created_at, now())
WHERE updated_at IS NULL;