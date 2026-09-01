import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase securely on ElectroCart.',
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-custom py-24 text-center text-muted">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}