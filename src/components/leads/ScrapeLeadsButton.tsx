import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLeadScraper } from '@/hooks/useLeadScraper';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ScrapeLeadsButtonProps {
  marketId: string;
  onSuccess?: () => void;
}

export function ScrapeLeadsButton({ marketId, onSuccess }: ScrapeLeadsButtonProps) {
  const { scrapeAndSaveLeads, loading } = useLeadScraper();
  const { toast } = useToast();
  const [isScrapingComplete, setIsScrapingComplete] = useState(false);

  const handleScrape = async () => {
    try {
      const leads = await scrapeAndSaveLeads(marketId);
      toast({
        title: 'Success',
        description: `Found ${leads?.length ?? 0} new leads`,
      });
      setIsScrapingComplete(true);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to scrape leads. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handleScrape}
      disabled={loading || isScrapingComplete}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scraping...
        </>
      ) : isScrapingComplete ? (
        'Scraping Complete'
      ) : (
        'Scrape New Leads'
      )}
    </Button>
  );
}