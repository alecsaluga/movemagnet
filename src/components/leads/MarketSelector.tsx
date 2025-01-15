import { useState, useEffect } from 'react';
import { Market } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MarketSelectorProps {
  selectedMarket: string;
  onMarketChange: (marketId: string) => void;
}

export function MarketSelector({ selectedMarket, onMarketChange }: MarketSelectorProps) {
  const { user } = useAuth();
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    async function fetchMarkets() {
      if (!user) return;

      const { data } = await supabase
        .from('markets')
        .select('*')
        .eq('subscription_status', 'subscribed')
        .order('name');

      if (data) {
        const formattedMarkets: Market[] = data.map(market => ({
          id: market.id,
          name: market.name,
          state: market.state,
          totalLeads: market.total_leads || 0,
          price: market.price || 0,
          isSubscribed: true
        }));
        setMarkets(formattedMarkets);

        // If no market is selected and we have markets, select the first one
        if (!selectedMarket && formattedMarkets.length > 0) {
          onMarketChange(formattedMarkets[0].id);
        }
      }
    }

    fetchMarkets();
  }, [user, selectedMarket, onMarketChange]);

  if (markets.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="No markets available" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedMarket} onValueChange={onMarketChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select market" />
      </SelectTrigger>
      <SelectContent>
        {markets.map(market => (
          <SelectItem key={market.id} value={market.id}>
            {market.name}, {market.state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}