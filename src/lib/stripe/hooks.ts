import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { stripe } from './config';
import { useToast } from '@/hooks/use-toast';

export function useStripeCheckout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async (marketId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          marketId,
          userId: user.id,
          returnUrl: window.location.origin + '/markets'
        }
      });

      if (error) throw error;
      if (!data?.sessionId) throw new Error('No session ID returned');

      const stripeInstance = await stripe;
      if (!stripeInstance) throw new Error('Stripe not initialized');

      const { error: stripeError } = await stripeInstance.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) throw stripeError;

    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout process',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading
  };
}