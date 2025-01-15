import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    // Create Stripe products and prices for each market
    const { data: markets } = await supabase
      .from('markets')
      .select('*')
      .gt('price', 0)
      .is('stripe_price_id', null);

    if (!markets) return new Response('No markets to process', { status: 200 });

    for (const market of markets) {
      // Create Stripe product
      const product = await stripe.products.create({
        name: `${market.name}, ${market.state} Market Access`,
        description: `Access to all leads in ${market.name}, ${market.state}`,
      });

      // Create Stripe price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: market.price * 100, // Convert to cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      });

      // Update market with Stripe IDs
      await supabase
        .from('markets')
        .update({
          stripe_product_id: product.id,
          stripe_price_id: price.id,
        })
        .eq('id', market.id);
    }

    return new Response('Stripe products and prices created', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
});