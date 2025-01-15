import { stripe, supabase } from './config.ts';
import { StripeSubscription } from './types.ts';

export async function handleSubscriptionChange(subscription: StripeSubscription) {
  const { marketId, userId } = subscription.metadata;

  await supabase
    .from('stripe_subscriptions')
    .upsert({
      market_id: marketId,
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date(),
    });
}