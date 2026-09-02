'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HiOutlineCheckCircle, HiOutlineTruck, HiOutlineArrowRight } from 'react-icons/hi';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? 'SC-0000-0000-0000';

  return (
  <div className="container-custom py-16 lg:py-24">
  <div className="max-w-xl mx-auto text-center bg-white  border border-lineBorder  rounded-3xl p-10 lg:p-14 shadow-card">
  <div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
  <HiOutlineCheckCircle className="w-12 h-12 text-success" />
  </div>
  <h1 className="text-3xl lg:text-4xl font-bold text-slateText  mb-3">
  Order Confirmed!
  </h1>
  <p className="text-muted leading-relaxed mb-6">
  Thank you for shopping with ElectroCart. Your order has been placed successfully and is now being prepared.
  </p>

  <div className="bg-body  border border-lineBorder  rounded-2xl p-6 mb-6">
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-1">Your Order ID</p>
  <p className="text-2xl font-bold text-primary tracking-wide">{orderId}</p>
  <p className="flex items-center justify-center gap-1.5 text-xs text-muted mt-2">
  <HiOutlineTruck className="w-4 h-4 text-accent" /> Estimated delivery in 3-5 business days
  </p>
  </div>

  <div className="flex flex-col sm:flex-row gap-3 justify-center">
  <Link href="/shop" className="btn-primary">
  Continue Shopping <HiOutlineArrowRight className="w-5 h-5" />
  </Link>
  <Link href="/" className="btn-outline">Back to Home</Link>
  </div>

  <p className="text-xs text-muted mt-6">
  A confirmation email has been sent to your inbox with all order details.
  </p>
  </div>
  </div>
  );
}