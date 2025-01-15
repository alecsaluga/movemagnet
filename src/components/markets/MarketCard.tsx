import { Market } from '@/types';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SubscribeDialog } from './SubscribeDialog';

interface MarketCardProps {
  market: Market;
  onSubscribe: (marketId: string) => Promise<void>;
}

export function MarketCard({ market, onSubscribe }: MarketCardProps) {
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg',
      market.isSubscribed && 'border-primary'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {market.name}, {market.state}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            {market.totalLeads} active leads
          </p>
          {market.price > 0 ? (
            <p className="font-semibold">
              ${market.price}/month
            </p>
          ) : (
            <p className="font-semibold text-green-500">
              Free
            </p>
          )}
          {market.features && market.features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {market.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {market.isSubscribed ? (
          <Button variant="secondary" className="w-full" disabled>
            Subscribed
          </Button>
        ) : (
          market.price > 0 ? (
            <SubscribeDialog market={market} onSubscribe={onSubscribe} />
          ) : (
            <Button onClick={() => onSubscribe(market.id)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Subscribe for Free
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}