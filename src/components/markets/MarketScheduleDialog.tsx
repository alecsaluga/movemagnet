import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';
import { ScraperScheduler } from '@/lib/scraper/scheduler';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MarketScheduleDialogProps {
  marketId: string;
  currentFrequency?: number;
  isActive?: boolean;
}

export function MarketScheduleDialog({ 
  marketId, 
  currentFrequency = 3,
  isActive = false 
}: MarketScheduleDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [frequency, setFrequency] = useState(currentFrequency);
  const [enabled, setEnabled] = useState(isActive);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const scheduler = new ScraperScheduler();
      await scheduler.scheduleMarketScrape(marketId, user.id, enabled ? frequency : 0);

      toast({
        title: 'Schedule Updated',
        description: enabled 
          ? `Market will be scraped every ${frequency} days` 
          : 'Scraping schedule disabled',
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
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
          <Clock className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scraping Schedule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="schedule-enabled">Enable Automatic Scraping</Label>
            <Switch
              id="schedule-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
          {enabled && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (days)</Label>
              <Input
                id="frequency"
                type="number"
                min={1}
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}