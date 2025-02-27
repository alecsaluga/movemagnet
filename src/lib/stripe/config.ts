import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  throw new Error('Missing Stripe public key');
}

// Add debug logging
console.log('Initializing Stripe with key:', {
  mode: stripePublicKey.startsWith('pk_test_') ? 'test' : 'live',
  keyPrefix: stripePublicKey.substring(0, 7)
});

// Ensure we only create one instance
let stripePromise: Promise<any> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
}