/*
  # Set up Stripe markets
  
  1. Updates
    - Add Stripe price IDs for paid markets
    - Set free market for San Diego
*/

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

-- Update paid markets with Stripe price IDs
UPDATE markets 
SET 
  stripe_price_id = CASE name
    WHEN 'Los Angeles' THEN 'price_1Qe5leGPuFdbGQ96pExjaftFq'
    WHEN 'San Francisco' THEN 'price_2Qe5leGPuFdbGQ96pExjaftFq'
    WHEN 'New York' THEN 'price_3Qe5leGPuFdbGQ96pExjaftFq'
    WHEN 'Chicago' THEN 'price_4Qe5leGPuFdbGQ96pExjaftFq'
    WHEN 'Miami' THEN 'price_5Qe5leGPuFdbGQ96pExjaftFq'
    WHEN 'Houston' THEN 'price_6Qe5leGPuFdbGQ96pExjaftFq'
    WHEN 'Seattle' THEN 'price_7Qe5leGPuFdbGQ96pExjaftFq'
  END,
  features = '[
    "Unlimited lead access",
    "Real-time notifications",
    "CRM integration",
    "Lead export",
    "Priority support"
  ]'::jsonb
WHERE price > 0;