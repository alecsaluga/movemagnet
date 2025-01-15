/*
  # Add test market for San Diego

  1. New Data
    - Adds San Diego market with Loopnet URL for testing
  
  2. Security
    - Uses existing RLS policies
*/

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
  auth.uid()
);