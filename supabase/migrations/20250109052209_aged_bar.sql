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
  -- N
  (
    'Nashville',
    'TN',
    'https://www.loopnet.com/search/commercial-real-estate/nashville-tn/for-lease',
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
    'New Haven',
    'CT',
    'https://www.loopnet.com/search/commercial-real-estate/new-haven-ct/for-lease',
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
    'New Orleans',
    'LA',
    'https://www.loopnet.com/search/commercial-real-estate/new-orleans-la/for-lease',
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
    'Newark',
    'NJ',
    'https://www.loopnet.com/search/commercial-real-estate/newark-nj/for-lease',
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
  -- O
  (
    'Ogden-Clearfield',
    'UT',
    'https://www.loopnet.com/search/commercial-real-estate/ogden-ut/for-lease',
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
    'Oklahoma City',
    'OK',
    'https://www.loopnet.com/search/commercial-real-estate/oklahoma-city-ok/for-lease',
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
    'Omaha',
    'NE',
    'https://www.loopnet.com/search/commercial-real-estate/omaha-ne/for-lease',
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
    'Orlando',
    'FL',
    'https://www.loopnet.com/search/commercial-real-estate/orlando-fl/for-lease',
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
    'Overland Park',
    'KS',
    'https://www.loopnet.com/search/commercial-real-estate/overland-park-ks/for-lease',
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
  -- P
  (
    'Portland',
    'ME',
    'https://www.loopnet.com/search/commercial-real-estate/portland-me/for-lease',
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
    'Portland',
    'OR',
    'https://www.loopnet.com/search/commercial-real-estate/portland-or/for-lease',
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
    'Provo-Orem',
    'UT',
    'https://www.loopnet.com/search/commercial-real-estate/provo-ut/for-lease',
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
    'Providence',
    'RI',
    'https://www.loopnet.com/search/commercial-real-estate/providence-ri/for-lease',
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
  -- R
  (
    'Raleigh-Durham',
    'NC',
    'https://www.loopnet.com/search/commercial-real-estate/raleigh-nc/for-lease',
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
    'Reno',
    'NV',
    'https://www.loopnet.com/search/commercial-real-estate/reno-nv/for-lease',
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
    'Richmond',
    'VA',
    'https://www.loopnet.com/search/commercial-real-estate/richmond-va/for-lease',
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
    'Rochester',
    'NY',
    'https://www.loopnet.com/search/commercial-real-estate/rochester-ny/for-lease',
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