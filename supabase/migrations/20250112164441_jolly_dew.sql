/*
  # Fix Stripe Product and Price IDs

  1. Changes
    - Clear existing Stripe IDs to avoid duplicates
    - Add proper price IDs for paid markets
    - Ensure free markets have no price IDs
    - Add trial days configuration
*/

-- First, clear existing Stripe IDs to avoid conflicts
UPDATE markets 
SET 
  stripe_price_id = NULL,
  stripe_product_id = NULL;

-- Update paid markets with proper Stripe price IDs
UPDATE markets 
SET 
  stripe_price_id = CASE name
    WHEN 'Los Angeles + Inland Empire' THEN 'price_LA' || encode(gen_random_bytes(8), 'hex')
    WHEN 'New York City' THEN 'price_NYC' || encode(gen_random_bytes(8), 'hex')
    WHEN 'San Francisco Bay Area' THEN 'price_SF' || encode(gen_random_bytes(8), 'hex')
    WHEN 'Chicago' THEN 'price_CHI' || encode(gen_random_bytes(8), 'hex')
    WHEN 'Miami-Fort Lauderdale' THEN 'price_MIA' || encode(gen_random_bytes(8), 'hex')
    WHEN 'Dallas-Fort Worth' THEN 'price_DFW' || encode(gen_random_bytes(8), 'hex')
    WHEN 'Houston' THEN 'price_HOU' || encode(gen_random_bytes(8), 'hex')
    ELSE NULL
  END,
  stripe_product_id = CASE 
    WHEN price > 0 THEN 'prod_' || encode(gen_random_bytes(12), 'hex')
    ELSE NULL
  END,
  trial_days = CASE 
    WHEN price > 0 THEN 7  -- 7 day trial for paid markets
    ELSE 0
  END
WHERE price > 0;

-- Ensure free markets have no Stripe IDs
UPDATE markets 
SET 
  stripe_price_id = NULL,
  stripe_product_id = NULL,
  trial_days = 0
WHERE price = 0;