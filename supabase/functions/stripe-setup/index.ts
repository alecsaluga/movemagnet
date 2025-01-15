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
    // Get all markets that need Stripe setup
    const { data: markets } = await supabase
      .from('markets')
      .select('*')
      .gt('price', 0)
      .is('stripe_price_id', null);

    if (!markets || markets.length === 0) {
      return new Response('No markets to process', { status: 200 });
    }

    const results = [];

    for (const market of markets) {
      try {
        // Create Stripe product
        const product = await stripe.products.create({
          name: `${market.name}, ${market.state} Market Access`,
          description: `Access to all leads in ${market.name}, ${market.state}`,
          active: true,
        });

        // Create Stripe price (no trial period)
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(market.price * 100), // Convert to cents
          currency: 'usd',
          recurring: {
            interval: 'month',
          },
        });

        // Update market with real Stripe IDs
        const { error: updateError } = await supabase
          .from('markets')
          .update({
            stripe_product_id: product.id,
            stripe_price_id: price.id,
          })
          .eq('id', market.id);

        if (updateError) throw updateError;

        results.push({
          marketId: market.id,
          name: market.name,
          success: true,
          productId: product.id,
          priceId: price.id
        });

      } catch (error) {
        console.error(`Error processing market ${market.name}:`, error);
        results.push({
          marketId: market.id,
          name: market.name,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });
  }
});