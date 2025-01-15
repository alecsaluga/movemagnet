/*
  # Add major US markets
  
  1. New Data
    - Adds major US markets including San Diego (free)
    - Uses function to get first user ID
  
  2. Markets Added
    - San Diego, CA (Free)
    - Los Angeles, CA
    - San Francisco, CA
    - New York, NY
    - Chicago, IL
    - Miami, FL
    - Houston, TX
    - Seattle, WA
*/

-- Insert major markets
INSERT INTO markets (
  name,
  state,
  url,
  subscription_status,
  user_id
) VALUES 
  (
    'San Diego',
    'CA',
    'https://www.loopnet.com/search/commercial-real-estate/san-diego-ca/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'Los Angeles',
    'CA',
    'https://www.loopnet.com/search/commercial-real-estate/los-angeles-ca/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'San Francisco',
    'CA',
    'https://www.loopnet.com/search/commercial-real-estate/san-francisco-ca/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'New York',
    'NY',
    'https://www.loopnet.com/search/commercial-real-estate/new-york-ny/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'Chicago',
    'IL',
    'https://www.loopnet.com/search/commercial-real-estate/chicago-il/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'Miami',
    'FL',
    'https://www.loopnet.com/search/commercial-real-estate/miami-fl/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'Houston',
    'TX',
    'https://www.loopnet.com/search/commercial-real-estate/houston-tx/for-lease',
    'available',
    get_first_user_id()
  ),
  (
    'Seattle',
    'WA',
    'https://www.loopnet.com/search/commercial-real-estate/seattle-wa/for-lease',
    'available',
    get_first_user_id()
  )
ON CONFLICT (name, state, user_id) DO UPDATE 
SET 
  url = EXCLUDED.url,
  subscription_status = EXCLUDED.subscription_status;