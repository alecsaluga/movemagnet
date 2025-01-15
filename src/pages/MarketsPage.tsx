import { useState, useEffect } from 'react';
import { Market } from '@/types';
import { MarketCard } from '@/components/markets/MarketCard';
import { Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createSubscription } from '@/lib/stripe/subscription';
import { useSearchParams } from 'react-router-dom';

export function MarketsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [marketsList, setMarketsList] = useState<Market[]>([]);

  // Check for Stripe success/cancel status
  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: 'Success',
        description: 'Your subscription has been activated',
      });
    } else if (searchParams.get('canceled')) {
      toast({
        title: 'Canceled',
        description: 'Subscription was not completed',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  // Fetch markets
  useEffect(() => {
    async function fetchMarkets() {
      if (!user) return;

      try {
        const { data: markets, error: marketsError } = await supabase
          .from('markets')
          .select('*')
          .order('name');

        if (marketsError) throw marketsError;

        const formattedMarkets: Market[] = markets.map(market => ({
          id: market.id,
          name: market.name,
          state: market.state,
          totalLeads: market.total_leads || 0,
          price: market.price || 0,
          trial_days: market.trial_days,
          features: market.features,
          isSubscribed: market.subscription_status === 'subscribed'
        }));

        setMarketsList(formattedMarkets);
      } catch (error) {
        console.error('Error fetching markets:', error);
        toast({
          title: 'Error',
          description: 'Failed to load markets',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, [user, toast]);

  const handleSubscribe = async (marketId: string) => {
    if (!user) return;

    try {
      await createSubscription(marketId);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription',
        variant: 'destructive'
      });
    }
  };

  const subscribedMarkets = marketsList.filter(market => market.isSubscribed);
  const availableMarkets = marketsList.filter(market => !market.isSubscribed);

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Your Markets</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Your Markets</h1>
      </div>

      {subscribedMarkets.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Subscribed Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscribedMarkets.map(market => (
              <MarketCard
                key={market.id}
                market={market}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Markets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMarkets.map(market => (
            <MarketCard
              key={market.id}
              market={market}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      </section>
    </div>
  );
}