/*
  # Create leads view with automatic new status

  1. Changes
    - Creates a view that automatically computes is_new status based on creation date
    - Adds security policies for the view
*/

-- Create a secure view that automatically handles is_new status
CREATE OR REPLACE VIEW public.leads_with_status AS
SELECT 
  l.*,
  CASE 
    WHEN l.created_at >= (CURRENT_TIMESTAMP - interval '3 days') THEN true
    ELSE false
  END as is_new_status
FROM public.leads l;

-- Grant access to authenticated users
GRANT SELECT ON public.leads_with_status TO authenticated;

-- Create secure RLS policy for the base leads table
DROP POLICY IF EXISTS "Users can access leads for their markets" ON public.leads;
CREATE POLICY "Users can access leads for their markets"
  ON public.leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.markets
      WHERE markets.id = leads.market_id
      AND markets.user_id = auth.uid()
      AND markets.subscription_status = 'subscribed'
    )
  );