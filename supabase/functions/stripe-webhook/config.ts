import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

export const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

export const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';