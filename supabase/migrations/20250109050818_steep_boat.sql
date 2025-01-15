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
  -- K
  (
    'Kansas City',
    'MO',
    'https://www.loopnet.com/search/commercial-real-estate/kansas-city-mo/for-lease',
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
    'Knoxville',
    'TN',
    'https://www.loopnet.com/search/commercial-real-estate/knoxville-tn/for-lease',
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
  -- L
  (
    'Las Vegas',
    'NV',
    'https://www.loopnet.com/search/commercial-real-estate/las-vegas-nv/for-lease',
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
    'Lexington',
    'KY',
    'https://www.loopnet.com/search/commercial-real-estate/lexington-ky/for-lease',
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
    'Lincoln',
    'NE',
    'https://www.loopnet.com/search/commercial-real-estate/lincoln-ne/for-lease',
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
    'Little Rock',
    'AR',
    'https://www.loopnet.com/search/commercial-real-estate/little-rock-ar/for-lease',
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
    'Louisville',
    'KY',
    'https://www.loopnet.com/search/commercial-real-estate/louisville-ky/for-lease',
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
  -- M
  (
    'Madison',
    'WI',
    'https://www.loopnet.com/search/commercial-real-estate/madison-wi/for-lease',
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
    'Manchester',
    'NH',
    'https://www.loopnet.com/search/commercial-real-estate/manchester-nh/for-lease',
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
    'Memphis',
    'TN',
    'https://www.loopnet.com/search/commercial-real-estate/memphis-tn/for-lease',
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
    'Miami-Fort Lauderdale',
    'FL',
    'https://www.loopnet.com/search/commercial-real-estate/miami-fl/for-lease',
    169,
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
    'Milwaukee',
    'WI',
    'https://www.loopnet.com/search/commercial-real-estate/milwaukee-wi/for-lease',
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
    'Minneapolis-St. Paul',
    'MN',
    'https://www.loopnet.com/search/commercial-real-estate/minneapolis-mn/for-lease',
    149,
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
    'Mobile',
    'AL',
    'https://www.loopnet.com/search/commercial-real-estate/mobile-al/for-lease',
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
    'Morgantown',
    'WV',
    'https://www.loopnet.com/search/commercial-real-estate/morgantown-wv/for-lease',
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
    'Montgomery',
    'AL',
    'https://www.loopnet.com/search/commercial-real-estate/montgomery-al/for-lease',
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