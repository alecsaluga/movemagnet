import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { testScraper } from '@/lib/scraper/test-scraper';
import { Loader2, TestTube2 } from 'lucide-react';

interface TestScrapeDialogProps {
  marketId: string;
  marketName: string;
}

export function TestScrapeDialog({ marketId, marketName }: TestScrapeDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleTest = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await testScraper(marketId, user.id);
      setResults(result);
      
      toast({
        title: 'Test Complete',
        description: 'Scraper test completed successfully',
      });
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Test scrape failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TestTube2 className="mr-2 h-4 w-4" />
          Test Scraper
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Test Scraper - {marketName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!results ? (
            <div className="text-center py-4">
              <Button 
                onClick={handleTest}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  'Start Test'
                )}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Market Details</h3>
                  <pre className="mt-2 rounded bg-muted p-4">
                    {JSON.stringify(results.market, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold">Sample Leads</h3>
                  <pre className="mt-2 rounded bg-muted p-4">
                    {JSON.stringify(results.sampleLeads, null, 2)}
                  </pre>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}