import type { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Thank you for your order!',
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={<div className="container-custom py-24 text-center text-muted">Verifying order...</div>}
    >
      <SuccessContent />
    </Suspense>
  );
}