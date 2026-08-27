import Stripe from 'stripe';

const isPlaceholder =
  !process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder';

if (isPlaceholder) {
  console.warn('Stripe key is a placeholder. Payment operations will return mock data.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-04-30.basil' as any,
});

export default stripe;
