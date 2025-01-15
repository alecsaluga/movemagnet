/*
  # Fix profile table and trigger function

  1. Changes
    - Create profiles table with proper structure
    - Add trigger function for handling new users
    - Add RLS policies for profile access
    - Ensure proper column types and constraints

  2. Security
    - Enable RLS
    - Add policies for viewing and updating profiles
    - Use SECURITY DEFINER for trigger function
*/

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create or replace the function to handle new user creation
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

  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    profile_name,
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is properly set
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure all existing users have profiles
INSERT INTO profiles (id, name, email)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', SPLIT_PART(email, '@', 1), 'User') as name,
  email
FROM auth.users
ON CONFLICT (id) DO NOTHING;