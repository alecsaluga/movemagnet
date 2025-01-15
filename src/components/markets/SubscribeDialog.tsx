import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Market } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscribeDialogProps {
  market: Market;
  onSubscribe: (marketId: string) => Promise<void>;
}

export function SubscribeDialog({ market, onSubscribe }: SubscribeDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
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
      await onSubscribe(market.id);
      // Don't close the dialog - it will be redirected to Stripe
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process subscription. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to {market.name}, {market.state}</DialogTitle>
          <DialogDescription>
            Get access to all leads in this market
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">${market.price}/month</span>
            {market.trial_days > 0 && (
              <Badge variant="secondary">
                {market.trial_days} days free trial
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">What's included:</h4>
            <ul className="space-y-2">
              {market.features?.map((feature, i) => (
                <li key={i} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Start Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}