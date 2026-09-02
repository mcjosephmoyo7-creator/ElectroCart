'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineShoppingCart,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTruck,
  HiOutlineArrowRight,
  HiOutlineChevronRight,
  HiOutlineLockClosed,
} from 'react-icons/hi';
import { cartStore, FREE_SHIPPING } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import AuthGate from '@/components/auth/AuthGate';
import { getElectronicsProducts } from '@/lib/productApi';
import { Product } from '@/types';

export default function CartPage() {
  const items = cartStore((s) => s.items);
  const updateQuantity = cartStore((s) => s.updateQuantity);
  const removeItem = cartStore((s) => s.removeItem);
  const clearCart = cartStore((s) => s.clearCart);
  const getSubtotal = cartStore((s) => s.getSubtotal);
  const getShipping = cartStore((s) => s.getShipping);
  const getTotal = cartStore((s) => s.getTotal);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const isFreeShipping = subtotal >= FREE_SHIPPING;
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
  let active = true;

  async function loadSuggestions() {
  try {
  const response = await getElectronicsProducts({ sort: 'popular' });
  if (active) setSuggestions(response.products.slice(0, 4));
  } catch {
  if (active) setSuggestions([]);
  }
  }

  loadSuggestions();
  return () => {
  active = false;
  };
  }, []);

  const handleClear = () => {
  clearCart();
  toast.success('Cart cleared');
  };

  return (
  <AuthGate
  title="Sign in to view your cart"
  subtitle="Your cart is stored securely on your account, so your items are waiting for you on any device."
  benefits={['secure']}
  >
  <div className="container-custom py-8 lg:py-12">
  <nav className="flex items-center gap-1.5 text-sm text-muted mb-6" aria-label="Breadcrumb">
  <Link href="/" className="hover:text-primary">Home</Link>
  <HiOutlineChevronRight className="w-4 h-4" />
  <span className="text-slateText  font-medium">Cart</span>
  </nav>

  <h1 className="text-3xl lg:text-4xl font-bold text-slateText  mb-2">Shopping Cart</h1>
  <p className="text-muted mb-8">
  {items.length > 0 ? `${items.length} item${items.length === 1 ? '' : 's'} in your cart` : 'Your cart is waiting to be filled!'}
  </p>

  {items.length === 0 ? (
  <div className="text-center py-20 bg-white  border border-lineBorder  rounded-2xl">
  <p className="mb-4"><HiOutlineShoppingCart className="w-20 h-20 inline-block text-muted/50" /></p>
  <h2 className="text-xl font-bold text-slateText  mb-2">Your cart is empty</h2>
  <p className="text-muted text-sm mb-6">Looks like you haven&apos;t added anything yet.</p>
  <Link href="/shop" className="btn-primary inline-flex">
  Start Shopping <HiOutlineArrowRight className="w-5 h-5" />
  </Link>
  </div>
  ) : (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
  {/* Items */}
  <div className="bg-white  border border-lineBorder  rounded-2xl overflow-hidden">
  <div className="hidden sm:grid grid-cols-[1fr_110px_110px_50px] gap-4 px-6 py-3 bg-body  text-xs font-bold text-muted uppercase tracking-wider border-b border-lineBorder ">
  <span>Product</span>
  <span className="text-center">Price</span>
  <span className="text-center">Quantity</span>
  <span className="text-right">Remove</span>
  </div>

  {items.map(({ product, quantity }) => {
  const price = product.discountPrice ?? product.price;
  return (
  <div key={product._id} className="grid grid-cols-[70px_1fr] sm:grid-cols-[1fr_110px_110px_50px] gap-4 items-center px-6 py-4 border-b border-lineBorder/70 ">
  <Link href={`/products/${product.slug}`} className="hidden sm:flex items-center gap-4 min-w-0 group">
  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
  </div>
  <div className="min-w-0">
  <p className="text-xs text-muted uppercase">{product.brand}</p>
  <p className="text-sm font-semibold text-slateText  line-clamp-1 group-hover:text-primary transition-colors">
  {product.name}
  </p>
  {product.discountPrice && (
  <p className="text-xs text-muted line-through">{formatPrice(product.price)}</p>
  )}
  </div>
  </Link>

  {/* Mobile product cell */}
  <div className="sm:hidden flex items-center gap-3 min-w-0">
  <Link href={`/products/${product.slug}`} className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
  </Link>
  <div className="min-w-0">
  <p className="text-xs text-muted uppercase">{product.brand}</p>
  <p className="text-sm font-semibold text-slateText  line-clamp-1">{product.name}</p>
  </div>
  </div>

  <span className="sm:text-center font-bold text-slateText  text-sm sm:text-base">
  {formatPrice(price)}
  </span>

  <div className="flex justify-start sm:justify-center">
  <div className="flex items-center border border-lineBorder  rounded-lg overflow-hidden">
  <button
  onClick={() => updateQuantity(product._id, quantity - 1)}
  className="w-8 h-9 flex items-center justify-center text-muted hover:text-primary hover:bg-body  transition-colors"
  aria-label="Decrease"
  >
  <HiOutlineMinus className="w-3.5 h-3.5" />
  </button>
  <span className="w-9 text-center text-sm font-bold text-slateText ">{quantity}</span>
  <button
  onClick={() => updateQuantity(product._id, quantity + 1)}
  className="w-8 h-9 flex items-center justify-center text-muted hover:text-primary hover:bg-body  transition-colors"
  aria-label="Increase"
  >
  <HiOutlinePlus className="w-3.5 h-3.5" />
  </button>
  </div>
  </div>

  <div className="text-right">
  <button
  onClick={() => {
  removeItem(product._id);
  toast.success('Removed from cart');
  }}
  className="p-2 text-muted hover:text-red-500 transition-colors"
  aria-label={`Remove ${product.name}`}
  >
  <HiOutlineTrash className="w-5 h-5" />
  </button>
  </div>
  </div>
  );
  })}

  <div className="px-6 py-4 flex items-center justify-between">
  <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
  ← Continue Shopping
  </Link>
  <button onClick={handleClear} className="text-sm font-semibold text-red-500 hover:text-red-600 hover:underline">
  Clear Cart
  </button>
  </div>
  </div>

  {/* Summary */}
  <aside className="space-y-4 lg:sticky lg:top-28 h-fit">
  {/* Free shipping progress */}
  <div className="bg-white  border border-lineBorder  rounded-2xl p-6">
  {isFreeShipping ? (
  <div className="flex items-center gap-2 text-sm font-bold text-success bg-success/10 rounded-lg px-4 py-3">
  <HiOutlineTruck className="w-5 h-5" /> You unlocked FREE Shipping!
  </div>
  ) : (
  <>
  <p className="text-sm text-muted mb-2">
  Add <span className="font-bold text-slateText ">{formatPrice(FREE_SHIPPING - subtotal)}</span> more for
  free shipping
  </p>
  <div className="h-2 bg-lineBorder  rounded-full overflow-hidden">
  <div
  className="h-full bg-success rounded-full transition-all duration-500"
  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
  />
  </div>
  </>
  )}
  </div>

  <div className="bg-white  border border-lineBorder  rounded-2xl p-6">
  <h2 className="text-lg font-bold text-slateText  mb-5">Order Summary</h2>
  <div className="space-y-3 text-sm">
  <div className="flex justify-between">
  <span className="text-muted">Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
  <span className="font-semibold text-slateText ">{formatPrice(subtotal)}</span>
  </div>
  <div className="flex justify-between">
  <span className="text-muted">Shipping</span>
  {shipping === 0 ? (
  <span className="font-semibold text-success">FREE</span>
  ) : (
  <span className="font-semibold text-slateText ">{formatPrice(shipping)}</span>
  )}
  </div>
  <div className="flex justify-between">
  <span className="text-muted">Tax</span>
  <span className="font-semibold text-slateText ">$0.00</span>
  </div>
  </div>
  <div className="border-t border-lineBorder  my-4 pt-4 flex justify-between items-center">
  <span className="font-bold text-slateText ">Total</span>
  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
  </div>
  <Link href="/checkout" className="btn-primary w-full text-base">
  Proceed to Checkout <HiOutlineArrowRight className="w-5 h-5" />
  </Link>
  <p className="text-center text-xs text-muted mt-3"><HiOutlineLockClosed className="w-3.5 h-3.5 inline-block mr-1" />Secure checkout · Visa, Mastercard, PayPal</p>
  </div>
  </aside>
  </div>
  )}

  {/* Suggestions */}
  {items.length > 0 && (
  <div className="mt-16">
  <h2 className="text-2xl font-bold text-slateText  mb-6">You Might Also Like</h2>
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {suggestions.map((p) => (
  <ProductCard key={p._id} product={p} />
  ))}
  </div>
  </div>
  )}
  </div>
  </AuthGate>
  );
}