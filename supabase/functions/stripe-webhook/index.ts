import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";


const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  try {
    // Log incoming request details
    console.log('Received webhook request');
    console.log('Signature:', signature);
    
    if (!signature) {
      console.error('No stripe-signature header');
      throw new Error('No stripe-signature header');
    }

    if (!endpointSecret) {
      console.error('No webhook secret configured');
      throw new Error('No webhook secret configured');
    }

    const body = await req.text();
    console.log('Request body:', body);

    let event;
    try {
      // event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      // Then in your webhook handler, replace the stripe.webhooks.constructEvent with:
      const isValid = verifyStripeSignature(body, signature, endpointSecret);
      if (!isValid) {
        throw new Error('Invalid signature');
      }
      event = JSON.parse(body);
    } catch (err) {
      console.error('Error constructing webhook event:', err);
      throw err;
    }

    console.log('Event type:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Processing subscription:', subscription.id);
        
        const { marketId, userId } = subscription.metadata;
        console.log('Metadata:', { marketId, userId });

        const result = await supabase
          .from('stripe_subscriptions')
          .upsert({
            market_id: marketId,
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date(),
          });

        if (result.error) {
          console.error('Error updating subscription in database:', result.error);
          throw result.error;
        }

        console.log('Successfully processed subscription update');
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

const verifyStripeSignature = async (payload: string, signature: string, secret: string) => {
  const timestamp = signature.split(',')[0].split('=')[1];
  const signedPayload = `${timestamp}.${payload}`;
  
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );
  
  const signatureHex = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  return `sha256=${signatureHex}` === signature.split(',')[1];
};