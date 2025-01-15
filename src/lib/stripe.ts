import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createSubscription(marketId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get market details
    const { data: market } = await supabase
      .from('markets')
      .select('*')
      .eq('id', marketId)
      .single();

    if (!market) throw new Error('Market not found');

    // For free markets, update subscription directly
    if (market.price === 0) {
      const { error } = await supabase
        .from('markets')
        .update({ subscription_status: 'subscribed' })
        .eq('id', marketId);
      
      if (error) throw error;
      return;
    }

    // Create checkout session via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { 
        marketId,
        userId: user.id,
        returnUrl: window.location.origin + '/markets'
      }
    });

    if (error) throw error;
    if (!data?.sessionId) throw new Error('No session ID returned');

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (stripeError) throw stripeError;

  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}