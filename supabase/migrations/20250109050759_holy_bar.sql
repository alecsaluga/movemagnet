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
  -- E
  (
    'El Paso',
    'TX',
    'https://www.loopnet.com/search/commercial-real-estate/el-paso-tx/for-lease',
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
    'Eugene',
    'OR',
    'https://www.loopnet.com/search/commercial-real-estate/eugene-or/for-lease',
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
  -- F
  (
    'Fargo',
    'ND',
    'https://www.loopnet.com/search/commercial-real-estate/fargo-nd/for-lease',
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
    'Fort Wayne',
    'IN',
    'https://www.loopnet.com/search/commercial-real-estate/fort-wayne-in/for-lease',
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
  -- G
  (
    'Grand Rapids',
    'MI',
    'https://www.loopnet.com/search/commercial-real-estate/grand-rapids-mi/for-lease',
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
    'Greensboro-Winston-Salem',
    'NC',
    'https://www.loopnet.com/search/commercial-real-estate/greensboro-nc/for-lease',
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
    'Greenville',
    'SC',
    'https://www.loopnet.com/search/commercial-real-estate/greenville-sc/for-lease',
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
  -- H
  (
    'Hartford',
    'CT',
    'https://www.loopnet.com/search/commercial-real-estate/hartford-ct/for-lease',
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
    'Honolulu',
    'HI',
    'https://www.loopnet.com/search/commercial-real-estate/honolulu-hi/for-lease',
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
    'Huntington',
    'WV',
    'https://www.loopnet.com/search/commercial-real-estate/huntington-wv/for-lease',
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
    'Huntsville',
    'AL',
    'https://www.loopnet.com/search/commercial-real-estate/huntsville-al/for-lease',
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
  -- I
  (
    'Indianapolis',
    'IN',
    'https://www.loopnet.com/search/commercial-real-estate/indianapolis-in/for-lease',
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
  -- J
  (
    'Jackson',
    'MS',
    'https://www.loopnet.com/search/commercial-real-estate/jackson-ms/for-lease',
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
    'Jacksonville',
    'FL',
    'https://www.loopnet.com/search/commercial-real-estate/jacksonville-fl/for-lease',
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
    'Jersey City',
    'NJ',
    'https://www.loopnet.com/search/commercial-real-estate/jersey-city-nj/for-lease',
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