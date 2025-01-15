import { supabase } from '@/lib/supabase';
import { getStripe } from './config';

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

    // Create checkout session
    const response = await supabase.functions.invoke(
      'create-checkout-session',
      {
        body: { 
          marketId,
          userId: user.id,
          returnUrl: window.location.origin + '/markets'
        }
      }
    );

    if (response.error) {
      console.error('Function error:', response.error);
      throw new Error('Failed to create checkout session');
    }

    const { data } = response;
    if (!data?.sessionId) {
      console.error('No session ID:', data);
      throw new Error('No session ID returned');
    }

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe not initialized');

    const { error: checkoutError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (checkoutError) throw checkoutError;

  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}