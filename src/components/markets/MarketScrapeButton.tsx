import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoopnetService } from '@/lib/scraper/loopnet-service';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, RefreshCw } from 'lucide-react';

interface MarketScrapeButtonProps {
  marketId: string;
  onComplete?: () => void;
}

export function MarketScrapeButton({ marketId, onComplete }: MarketScrapeButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!user) return;

    setLoading(true);
    const service = new LoopnetService();

    try {
      await service.runScraper(marketId, user.id);
      
      toast({
        title: 'Scrape Complete',
        description: 'New leads have been added to your dashboard',
      });

      onComplete?.();
    } catch (error) {
      toast({
        title: 'Scrape Failed',
        description: error instanceof Error ? error.message : 'Failed to scrape leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleScrape}
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scraping...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Scrape Leads
        </>
      )}
    </Button>
  );
}