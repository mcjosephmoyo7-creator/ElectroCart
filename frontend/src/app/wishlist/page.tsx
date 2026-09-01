'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineShoppingCart, HiOutlineTrash, HiOutlineHeart, HiOutlineArrowRight } from 'react-icons/hi';
import { wishlistStore } from '@/store/wishlistStore';
import { cartStore } from '@/store/cartStore';
import ProductCard from '@/components/ui/ProductCard';
import AuthGate from '@/components/auth/AuthGate';
import { formatPrice } from '@/lib/utils';
import { getElectronicsProducts } from '@/lib/productApi';
import { Product } from '@/types';

export default function WishlistPage() {
  const wishlistItems = wishlistStore((s) => s.items);
  const removeItem = wishlistStore((s) => s.removeItem);
  const addItem = cartStore((s) => s.addItem);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    async function loadSuggestions() {
      try {
        const response = await getElectronicsProducts({ sort: 'rating' });
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

  const handleAddToCart = (id: string) => {
    const product = wishlistItems.find((p) => p._id === id);
    if (product) {
      addItem(product);
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <AuthGate
      title="Sign in to view your wishlist"
      subtitle="Your wishlist is saved securely on your account, so it stays in sync across all your devices."
      benefits={['wishlist', 'secure']}
    >
      <div className="container-custom py-8 lg:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-1">Home / Wishlist</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slateText dark:text-white flex items-center gap-3">
            <HiOutlineHeart className="w-9 h-9 text-red-500" /> My Wishlist
          </h1>
          <p className="text-muted mt-1.5">{wishlistItems.length} saved item{wishlistItems.length === 1 ? '' : 's'}</p>
        </div>
        {wishlistItems.length > 0 && (
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
            Continue browsing <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl">
          <p className="mb-4"><HiOutlineHeart className="w-20 h-20 inline-block text-muted/50" /></p>
          <h2 className="text-xl font-bold text-slateText dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-muted text-sm mb-6">Tap the heart on any product to save it here for later.</p>
          <Link href="/shop" className="btn-primary inline-flex">
            Discover Products <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {wishlistItems.map((product) => {
            const price = product.discountPrice ?? product.price;
            return (
              <div key={product._id} className="group bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs text-muted uppercase">{product.brand}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-slateText dark:text-white line-clamp-1 text-sm hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 font-bold text-primary">{formatPrice(price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-navy dark:bg-navy-50 hover:bg-primary text-white py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <HiOutlineShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        removeItem(product._id);
                        toast.success('Removed from wishlist');
                      }}
                      className="w-9 h-8 border border-lineBorder dark:border-navy-100 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:border-red-300 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggestions */}
      {wishlistItems.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slateText dark:text-white mb-6">Top Rated Picks</h2>
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