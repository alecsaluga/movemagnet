import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Market, MarketFeature } from '@/types';
import { MarketCard } from '@/components/markets/MarketCard';
import { Building2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createSubscription } from '@/lib/stripe/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MARKETS_PER_PAGE = 12;

const getMarketFeatures = (price: number): MarketFeature[] => {
  if (price === 0) {
    return [
      { title: "Basic Market Access" },
      { title: "Basic Lead Tracking" },
      { title: "Email Notifications" }
    ];
  }

  return [
    { title: "Exclusive Market Access" },
    { title: "Real-Time Lead Updates" },
    { title: "Contact Info" },
    { title: "Priority Support" }
  ];
};

export function MarketsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [marketsList, setMarketsList] = useState<Market[]>([]);
  const [totalMarkets, setTotalMarkets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMarkets = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // First, get total count
      const countQuery = supabase
        .from('markets')
        .select('id', { count: 'exact' });

      if (searchTerm) {
        countQuery.ilike('name', `%${searchTerm}%`);
      }

      const { count } = await countQuery;
      setTotalMarkets(count || 0);

      // Then get paginated data
      const from = (currentPage - 1) * MARKETS_PER_PAGE;
      const to = from + MARKETS_PER_PAGE - 1;

      let query = supabase
        .from('markets')
        .select('*')
        .order('name')
        .range(from, to);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data: markets, error: marketsError } = await query;

      if (marketsError) throw marketsError;

      const formattedMarkets: Market[] = markets.map(market => ({
        id: market.id,
        name: market.name,
        state: market.state,
        totalLeads: market.total_leads || 0,
        price: market.price || 0,
        trial_days: market.trial_days,
        features: getMarketFeatures(market.price),
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
  }, [user, toast, currentPage, searchTerm]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const totalPages = Math.ceil(totalMarkets / MARKETS_PER_PAGE);

  const subscribedMarkets = marketsList.filter(market => market.isSubscribed);
  const availableMarkets = marketsList.filter(market => !market.isSubscribed);

  if (loading && currentPage === 1) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Your Markets</h1>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Markets</h2>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({totalMarkets} markets)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMarkets.map(market => (
            <MarketCard
              key={market.id}
              market={market}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}