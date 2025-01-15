import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { AddLeadDialog } from '@/components/admin/AddLeadDialog';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { EditMarketDialog } from '@/components/admin/EditMarketDialog';

interface Market {
  id: string;
  name: string;
  state: string;
  price: number;
  total_leads: number;
  subscription_status: string;
  url: string;
}

export function AdminMarkets() {
  const { toast } = useToast();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load markets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const filteredMarkets = markets.filter(market =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshMarkets = () => {
    setLoading(true);
    fetchMarkets();
  };

  const toggleMarketExpansion = (marketId: string) => {
    setExpandedMarket(expandedMarket === marketId ? null : marketId);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Markets</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Market
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Leads</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredMarkets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No markets found
                </TableCell>
              </TableRow>
            ) : (
              filteredMarkets.map((market) => (
                <React.Fragment key={market.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={() => toggleMarketExpansion(market.id)}>
                      <div className="flex items-center gap-2">
                        {expandedMarket === market.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        {market.name}
                      </div>
                    </TableCell>
                    <TableCell>{market.state}</TableCell>
                    <TableCell>${market.price}</TableCell>
                    <TableCell>{market.total_leads}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        market.subscription_status === 'subscribed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {market.subscription_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AddLeadDialog
                          marketId={market.id}
                          marketName={`${market.name}, ${market.state}`}
                          onLeadAdded={refreshMarkets}
                        />
                        <EditMarketDialog
                          market={market}
                          onMarketUpdated={refreshMarkets}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedMarket === market.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-4 bg-muted/50">
                        <LeadsTable marketId={market.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}