-- Continue adding remaining markets
INSERT INTO markets (
  name,
  state,
  url,
  price,
  subscription_status,
  features,
  user_id
) VALUES 
  -- S
  (
    'Sacramento',
    'CA',
    'https://www.loopnet.com/search/commercial-real-estate/sacramento-ca/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Saint Louis',
    'MO',
    'https://www.loopnet.com/search/commercial-real-estate/saint-louis-mo/for-lease',
    129,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Salem',
    'OR',
    'https://www.loopnet.com/search/commercial-real-estate/salem-or/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Salt Lake City',
    'UT',
    'https://www.loopnet.com/search/commercial-real-estate/salt-lake-city-ut/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'San Antonio',
    'TX',
    'https://www.loopnet.com/search/commercial-real-estate/san-antonio-tx/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Santa Fe',
    'NM',
    'https://www.loopnet.com/search/commercial-real-estate/santa-fe-nm/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Savannah',
    'GA',
    'https://www.loopnet.com/search/commercial-real-estate/savannah-ga/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Sioux Falls',
    'SD',
    'https://www.loopnet.com/search/commercial-real-estate/sioux-falls-sd/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Spokane',
    'WA',
    'https://www.loopnet.com/search/commercial-real-estate/spokane-wa/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  -- T
  (
    'Tampa-St. Petersburg',
    'FL',
    'https://www.loopnet.com/search/commercial-real-estate/tampa-fl/for-lease',
    129,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Toledo',
    'OH',
    'https://www.loopnet.com/search/commercial-real-estate/toledo-oh/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Tucson',
    'AZ',
    'https://www.loopnet.com/search/commercial-real-estate/tucson-az/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  (
    'Tulsa',
    'OK',
    'https://www.loopnet.com/search/commercial-real-estate/tulsa-ok/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  -- V
  (
    'Virginia Beach-Norfolk',
    'VA',
    'https://www.loopnet.com/search/commercial-real-estate/virginia-beach-va/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  ),
  -- W
  (
    'Wichita',
    'KS',
    'https://www.loopnet.com/search/commercial-real-estate/wichita-ks/for-lease',
    99,
    'available',
    '[
      "Unlimited lead access",
      "Real-time notifications",
      "CRM integration",
      "Lead export",
      "Priority support"
    ]'::jsonb,
    get_first_user_id()
  )
ON CONFLICT (name, state, user_id) 
DO UPDATE SET 
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  url = EXCLUDED.url,
  subscription_status = EXCLUDED.subscription_status;