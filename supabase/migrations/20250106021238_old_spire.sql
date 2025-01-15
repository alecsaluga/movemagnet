/*
  # Auto-remove NEW badge after 3 days

  1. Changes
    - Creates a view that dynamically computes is_new status based on creation date
    - Adds RLS policies for the view
*/

-- Create a view that automatically handles is_new status
CREATE OR REPLACE VIEW public.leads_with_status AS
SELECT 
  l.*,
  CASE 
    WHEN l.created_at >= (CURRENT_TIMESTAMP - interval '3 days') THEN true
    ELSE false
  END as is_new_status
FROM public.leads l;

-- Add RLS policy for the view
ALTER TABLE public.leads_with_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access leads_with_status for their markets"
  ON public.leads_with_status
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.markets
      WHERE markets.id = leads_with_status.market_id
      AND markets.user_id = auth.uid()
      AND markets.subscription_status = 'subscribed'
    )
  );