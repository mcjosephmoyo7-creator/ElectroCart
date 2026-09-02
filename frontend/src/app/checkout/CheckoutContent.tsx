'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineCheck,
  HiOutlineShieldCheck,
  HiOutlineShoppingCart,
} from 'react-icons/hi';
import { cartStore } from '@/store/cartStore';
import { authStore } from '@/store/authStore';
import { authUiStore } from '@/store/authUiStore';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { formatPrice, generateOrderId } from '@/lib/utils';

const steps = ['Shipping', 'Payment', 'Review'];
const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Other'];

interface FormValue {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'card' | 'paypal' | 'cod';
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}

const initialForm: FormValue = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  paymentMethod: 'card',
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvc: '',
};

export default function CheckoutContent() {
  const router = useRouter();
  const authStatus = authStore((s) => s.status);
  const items = cartStore((s) => s.items);
  const getSubtotal = cartStore((s) => s.getSubtotal);
  const getShipping = cartStore((s) => s.getShipping);
  const getTotal = cartStore((s) => s.getTotal);
  const clearCart = cartStore((s) => s.clearCart);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormValue>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  const set = (key: keyof FormValue, value: string) => {
  setForm((f) => ({ ...f, [key]: value }));
  setErrors((e) => {
  const next = { ...e };
  delete next[key];
  return next;
  });
  };

  const validateShipping = (): boolean => {
  const e: Record<string, string> = {};
  if (!form.fullName.trim()) e.fullName = 'Full name is required';
  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
  if (!form.phone.trim()) e.phone = 'Phone is required';
  else if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number';
  if (!form.address.trim()) e.address = 'Street address is required';
  if (!form.city.trim()) e.city = 'City is required';
  if (!form.state.trim()) e.state = 'State / Province is required';
  if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
  if (!form.country) e.country = 'Country is required';
  setErrors(e);
  return Object.keys(e).length === 0;
  };

  const validatePayment = (): boolean => {
  const e: Record<string, string> = {};
  if (form.paymentMethod === 'card') {
  if (!/^[\d\s]{12,19}$/.test(form.cardNumber.replace(/\s/g, ''))) e.cardNumber = 'Enter a valid card number';
  if (!form.cardName.trim()) e.cardName = 'Name on card is required';
  if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(form.expiry)) e.expiry = 'Use MM/YY format';
  if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = 'Enter a valid CVC';
  }
  setErrors(e);
  return Object.keys(e).length === 0;
  };

  const goNext = () => {
  const ok = step === 0 ? validateShipping() : validatePayment();
  if (!ok) {
  toast.error('Please fix the highlighted fields');
  return;
  }
  setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = async () => {
  if (items.length === 0) {
  toast.error('Your cart is empty');
  return;
  }
  if (authStore.getState().status !== 'authenticated') {
  authUiStore.getState().openModal('signin', { type: 'navigate', path: '/checkout' });
  return;
  }
  setPlacing(true);
  try {
  const orderId = generateOrderId();
  const payload = {
  orderId,
  customer: { fullName: form.fullName, email: form.email, phone: form.phone },
  shippingAddress: {
  address: form.address,
  city: form.city,
  state: form.state,
  postalCode: form.postalCode,
  country: form.country,
  },
  paymentMethod: form.paymentMethod,
  items: items.map((i) => ({
  name: i.product.name,
  image: i.product.image,
  price: i.product.discountPrice ?? i.product.price,
  quantity: i.quantity,
  })),
  subtotal,
  shippingCost: shipping,
  total,
  };

  const res = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Order failed');

  clearCart();
  router.push(`/checkout/success?orderId=${orderId}`);
  toast.success('Order placed successfully!');
  } catch {
  toast.error('Something went wrong placing your order. Please try again.');
  } finally {
  setPlacing(false);
  }
  };

  if (items.length === 0) {
  return (
  <div className="container-custom py-24 text-center">
  <p className="mb-4"><HiOutlineShoppingCart className="w-20 h-20 inline-block text-muted/50" /></p>
  <h1 className="text-2xl font-bold text-slateText  mb-2">Checkout</h1>
  <p className="text-muted mb-6">Your cart is empty. Add some products before checking out.</p>
  <Link href="/shop" className="btn-primary inline-flex">Browse Products</Link>
  </div>
  );
  }

  if (authStatus === 'loading') {
  return (
  <div className="container-custom py-24 flex justify-center">
  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
  );
  }

  if (authStatus !== 'authenticated') {
  return (
  <div className="container-custom py-8 lg:py-12">
  <AuthPrompt
  title="Sign in to complete your purchase"
  subtitle="Secure checkout requires an account. Your items are saved in your cart and will be waiting for you."
  benefits={['orders', 'secure']}
  />
  </div>
  );
  }

  return (
  <div className="container-custom py-8 lg:py-12">
  <nav className="flex items-center gap-1.5 text-sm text-muted mb-6" aria-label="Breadcrumb">
  <Link href="/" className="hover:text-primary">Home</Link>
  <span className="opacity-50">/</span>
  <Link href="/cart" className="hover:text-primary">Cart</Link>
  <span className="opacity-50">/</span>
  <span className="text-slateText  font-medium">Checkout</span>
  </nav>

  <h1 className="text-3xl lg:text-4xl font-bold text-slateText  mb-8">Checkout</h1>

  {/* Stepper */}
  <div className="flex items-center gap-2 mb-10 overflow-x-auto">
  {steps.map((label, i) => (
  <div key={label} className="flex items-center gap-2">
  <div
  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
  i === step
  ? 'bg-primary text-white'
  : i < step
  ? 'bg-success/10 text-success'
  : 'bg-white  text-muted border border-lineBorder '
  }`}
  >
  {i < step ? <HiOutlineCheck className="w-4 h-4" /> : <span>{i + 1}</span>}
  {label}
  </div>
  {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-success' : 'bg-lineBorder '}`} />}
  </div>
  ))}
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
  <div className="bg-white  border border-lineBorder  rounded-2xl p-6 lg:p-8">
  {step === 0 && (
  <div>
  <h2 className="text-xl font-bold flex items-center gap-2.5 text-slateText  mb-6">
  <HiOutlineTruck className="w-6 h-6 text-primary" /> Shipping Information
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="sm:col-span-2">
  <label className="block text-sm font-semibold mb-1.5">Full Name *</label>
  <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="John Doe" className="input-field" data-error={!!errors.fullName} />
  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">Email Address *</label>
  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="john@example.com" className="input-field" />
  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">Phone *</label>
  <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 000 0000" className="input-field" />
  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
  </div>
  <div className="sm:col-span-2">
  <label className="block text-sm font-semibold mb-1.5">Street Address *</label>
  <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main Street, Apt 4B" className="input-field" />
  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">City *</label>
  <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New Orleans" className="input-field" />
  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">State / Province *</label>
  <input value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="Louisiana" className="input-field" />
  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">Postal Code *</label>
  <input value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="70130" className="input-field" />
  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">Country *</label>
  <select value={form.country} onChange={(e) => set('country', e.target.value)} className="input-field">
  {countries.map((c) => (
  <option key={c}>{c}</option>
  ))}
  </select>
  </div>
  </div>
  </div>
  )}

  {step === 1 && (
  <div>
  <h2 className="text-xl font-bold flex items-center gap-2.5 text-slateText  mb-6">
  <HiOutlineCreditCard className="w-6 h-6 text-primary" /> Payment Method
  </h2>
  <div className="space-y-3 mb-6">
  {([
  { key: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex' },
  { key: 'paypal', label: 'PayPal', desc: 'Pay with your PayPal account' },
  { key: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
  ] as const).map((method) => (
  <label
  key={method.key}
  className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-all ${
  form.paymentMethod === method.key
  ? 'border-primary bg-primary/5 shadow-sm'
  : 'border-lineBorder  hover:border-primary/40'
  }`}
  >
  <input
  type="radio"
  name="payment"
  checked={form.paymentMethod === method.key}
  onChange={() => set('paymentMethod', method.key)}
  className="accent-primary w-4 h-4"
  />
  <span className="text-sm font-semibold text-slateText ">{method.label}</span>
  <span className="ml-auto text-xs text-muted">{method.desc}</span>
  </label>
  ))}
  </div>

  {form.paymentMethod === 'card' && (
  <div className="grid grid-cols-2 gap-4">
  <div className="col-span-2">
  <label className="block text-sm font-semibold mb-1.5">Card Number *</label>
  <input
  value={form.cardNumber}
  onChange={(e) => set('cardNumber', e.target.value.replace(/[^\d\s]/g, '').slice(0, 19))}
  placeholder="4242 4242 4242 4242"
  className="input-field"
  />
  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
  </div>
  <div className="col-span-2">
  <label className="block text-sm font-semibold mb-1.5">Name on Card *</label>
  <input value={form.cardName} onChange={(e) => set('cardName', e.target.value)} placeholder="JOHN DOE" className="input-field uppercase" />
  {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">Expiry (MM/YY) *</label>
  <input value={form.expiry} onChange={(e) => set('expiry', e.target.value)} placeholder="12/28" className="input-field" />
  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
  </div>
  <div>
  <label className="block text-sm font-semibold mb-1.5">CVC *</label>
  <input value={form.cvc} onChange={(e) => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className="input-field" />
  {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
  </div>
  </div>
  )}

  {form.paymentMethod !== 'card' && (
  <div className="bg-body  border border-dashed border-lineBorder  rounded-xl p-5 text-sm text-muted">
  {form.paymentMethod === 'paypal' ? (
  'You will be redirected to PayPal to complete your payment securely after placing the order.'
  ) : (
  'Please keep cash ready when your order arrives. Our rider will confirm your order with a phone call.'
  )}
  </div>
  )}
  </div>
  )}

  {step === 2 && (
  <div>
  <h2 className="text-xl font-bold text-slateText  mb-6">Review Your Order</h2>
  <div className="space-y-4">
  {items.map(({ product, quantity }) => (
  <div key={product._id} className="flex items-center gap-4">
  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
  </div>
  <div className="flex-1 min-w-0">
  <p className="text-sm font-semibold text-slateText  line-clamp-1">{product.name}</p>
  <p className="text-xs text-muted">Qty: {quantity}</p>
  </div>
  <span className="font-bold text-slateText ">{formatPrice((product.discountPrice ?? product.price) * quantity)}</span>
  </div>
  ))}

  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-lineBorder ">
  <div>
  <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2">Shipping To</p>
  <p className="text-sm font-semibold text-slateText ">{form.fullName}</p>
  <p className="text-sm text-muted">
  {form.address}, {form.city}, {form.state} {form.postalCode}, {form.country}
  </p>
  <p className="text-sm text-muted">{form.email} · {form.phone}</p>
  </div>
  <div>
  <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2">Payment</p>
  <p className="text-sm font-semibold text-slateText  capitalize">
  {form.paymentMethod === 'card' ? `Credit Card (${form.cardName || form.cardNumber || 'N/A'})` : form.paymentMethod.replace('-', ' ')}
  </p>
  </div>
  </div>
  </div>
  </div>
  )}

  {/* Step nav */}
  <div className="flex items-center justify-between mt-8 pt-6 border-t border-lineBorder ">
  <button
  onClick={goBack}
  disabled={step === 0}
  className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-slateText  disabled:opacity-40 disabled:hover:text-muted transition-colors"
  >
  <HiOutlineChevronLeft className="w-4 h-4" /> Back
  </button>
  {step < 2 ? (
  <button onClick={goNext} className="btn-primary">
  Continue <HiOutlineChevronRight className="w-5 h-5" />
  </button>
  ) : (
  <button onClick={placeOrder} disabled={placing} className="btn-primary text-base disabled:opacity-60">
  {placing ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
  </button>
  )}
  </div>
  </div>

  {/* Summary sidebar */}
  <aside className="h-fit lg:sticky lg:top-28">
  <div className="bg-white  border border-lineBorder  rounded-2xl p-6">
  <h3 className="font-bold text-slateText  mb-4">Order Summary</h3>
  <div className="max-h-56 overflow-y-auto space-y-3 mb-4">
  {items.map(({ product, quantity }) => (
  <div key={product._id} className="flex items-center gap-3">
  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
  <span className="absolute -top-1 -right-1 bg-navy text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
  {quantity}
  </span>
  </div>
  <p className="flex-1 text-xs text-slateText  line-clamp-1">{product.name}</p>
  <span className="text-xs font-bold">{formatPrice((product.discountPrice ?? product.price) * quantity)}</span>
  </div>
  ))}
  </div>
  <div className="space-y-2 pt-4 border-t border-lineBorder  text-sm">
  <div className="flex justify-between text-muted">
  <span>Subtotal</span><span className="text-slateText  font-semibold">{formatPrice(subtotal)}</span>
  </div>
  <div className="flex justify-between text-muted">
  <span>Shipping</span>
  {shipping === 0 ? <span className="text-success font-semibold">FREE</span> : <span className="text-slateText  font-semibold">{formatPrice(shipping)}</span>}
  </div>
  <div className="flex justify-between text-muted">
  <span>Tax</span><span className="text-slateText  font-semibold">$0.00</span>
  </div>
  </div>
  <div className="flex justify-between items-center pt-4 border-t border-lineBorder  mt-4">
  <span className="font-bold text-slateText ">Total</span>
  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
  </div>
  <p className="flex items-center gap-1.5 text-xs text-muted mt-4">
  <HiOutlineShieldCheck className="w-4 h-4 text-success" /> Secure checkout. Your payment details are encrypted.
  </p>
  </div>
  </aside>
  </div>
  </div>
  );
}