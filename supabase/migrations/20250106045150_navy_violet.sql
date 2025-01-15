-- Update San Diego market to be free
UPDATE markets 
SET 
  price = 0,
  stripe_price_id = NULL,
  features = '[
    "Basic lead access",
    "Email notifications",
    "Limited to 50 leads/month"
  ]'::jsonb
WHERE name = 'San Diego' AND state = 'CA';

-- Update paid markets with proper price IDs
UPDATE markets 
SET 
  stripe_price_id = 'price_H5tat2J9N7102p',
  features = '[
    "Unlimited lead access",
    "Real-time notifications", 
    "CRM integration",
    "Lead export",
    "Priority support"
  ]'::jsonb
WHERE price > 0;