/*
  # Add test market for San Diego with user handling

  1. New Data
    - Adds San Diego market with Loopnet URL for testing
    - Uses a function to get the first user ID
  
  2. Security
    - Uses existing RLS policies
*/

-- Function to get first user ID
CREATE OR REPLACE FUNCTION get_first_user_id()
RETURNS uuid AS $$
DECLARE
  first_user_id uuid;
BEGIN
  SELECT id INTO first_user_id FROM auth.users LIMIT 1;
  RETURN first_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert market using first user's ID
INSERT INTO markets (
  name,
  state,
  url,
  subscription_status,
  user_id
) VALUES (
  'San Diego',
  'CA',
  'https://www.loopnet.com/search/commercial-real-estate/san-diego-ca/for-lease',
  'subscribed',
  get_first_user_id()
);