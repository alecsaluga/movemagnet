-- Add all remaining markets
INSERT INTO markets (
  name,
  state,
  url,
  price,
  subscription_status,
  features,
  user_id
) VALUES 
  -- B
  (
    'Baton Rouge',
    'LA',
    'https://www.loopnet.com/search/commercial-real-estate/baton-rouge-la/for-lease',
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
    'Billings',
    'MT',
    'https://www.loopnet.com/search/commercial-real-estate/billings-mt/for-lease',
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
    'Birmingham',
    'AL',
    'https://www.loopnet.com/search/commercial-real-estate/birmingham-al/for-lease',
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
    'Boise',
    'ID',
    'https://www.loopnet.com/search/commercial-real-estate/boise-id/for-lease',
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
    'Boston',
    'MA',
    'https://www.loopnet.com/search/commercial-real-estate/boston-ma/for-lease',
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
    'Bridgeport',
    'CT',
    'https://www.loopnet.com/search/commercial-real-estate/bridgeport-ct/for-lease',
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
    'Buffalo',
    'NY',
    'https://www.loopnet.com/search/commercial-real-estate/buffalo-ny/for-lease',
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
    'Burlington',
    'VT',
    'https://www.loopnet.com/search/commercial-real-estate/burlington-vt/for-lease',
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
  -- C
  (
    'Casper',
    'WY',
    'https://www.loopnet.com/search/commercial-real-estate/casper-wy/for-lease',
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
    'Cedar Rapids',
    'IA',
    'https://www.loopnet.com/search/commercial-real-estate/cedar-rapids-ia/for-lease',
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
    'Charleston',
    'SC',
    'https://www.loopnet.com/search/commercial-real-estate/charleston-sc/for-lease',
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
    'Charleston',
    'WV',
    'https://www.loopnet.com/search/commercial-real-estate/charleston-wv/for-lease',
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
    'Charlotte',
    'NC',
    'https://www.loopnet.com/search/commercial-real-estate/charlotte-nc/for-lease',
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
    'Chattanooga',
    'TN',
    'https://www.loopnet.com/search/commercial-real-estate/chattanooga-tn/for-lease',
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
    'Cheyenne',
    'WY',
    'https://www.loopnet.com/search/commercial-real-estate/cheyenne-wy/for-lease',
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
    'Cincinnati',
    'OH',
    'https://www.loopnet.com/search/commercial-real-estate/cincinnati-oh/for-lease',
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
    'Cleveland',
    'OH',
    'https://www.loopnet.com/search/commercial-real-estate/cleveland-oh/for-lease',
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
    'Colorado Springs',
    'CO',
    'https://www.loopnet.com/search/commercial-real-estate/colorado-springs-co/for-lease',
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
    'Columbia',
    'SC',
    'https://www.loopnet.com/search/commercial-real-estate/columbia-sc/for-lease',
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
    'Columbus',
    'OH',
    'https://www.loopnet.com/search/commercial-real-estate/columbus-oh/for-lease',
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
  -- D
  (
    'Dayton',
    'OH',
    'https://www.loopnet.com/search/commercial-real-estate/dayton-oh/for-lease',
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
    'Denver',
    'CO',
    'https://www.loopnet.com/search/commercial-real-estate/denver-co/for-lease',
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
    'Des Moines',
    'IA',
    'https://www.loopnet.com/search/commercial-real-estate/des-moines-ia/for-lease',
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
    'Detroit',
    'MI',
    'https://www.loopnet.com/search/commercial-real-estate/detroit-mi/for-lease',
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
  )
ON CONFLICT (name, state, user_id) 
DO UPDATE SET 
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  url = EXCLUDED.url,
  subscription_status = EXCLUDED.subscription_status;