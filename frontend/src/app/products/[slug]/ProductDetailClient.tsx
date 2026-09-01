'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  HiOutlineShoppingCart,
  HiHeart,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiBadgeCheck,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { Product } from '@/types';
import { cartStore, FREE_SHIPPING } from '@/store/cartStore';
import { wishlistStore } from '@/store/wishlistStore';
import StarRating from '@/components/ui/StarRating';
import ProductCard from '@/components/ui/ProductCard';
import { formatPrice, discountPercent } from '@/lib/utils';

interface ProductDetailClientProps {
  product: Product;
  images: string[];
  specs: { key: string; value: string }[];
  related: Product[];
}

export default function ProductDetailClient({ product, images, specs, related }: ProductDetailClientProps) {
  const addItem = cartStore((s) => s.addItem);
  const toggleWishlist = wishlistStore((s) => s.toggleItem);
  const isWishlisted = wishlistStore((s) => s.isInWishlist(product._id));

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
  }, [product._id]);

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const percent = discountPercent(product.price, product.discountPrice);

  const handleAdd = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="container-custom py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link>
        <HiOutlineChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <HiOutlineChevronRight className="w-4 h-4" />
        <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-primary capitalize">
          {product.category.replace(/-/g, ' ')}
        </Link>
        <HiOutlineChevronRight className="w-4 h-4" />
        <span className="text-slateText dark:text-white font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-primary shadow-card' : 'border-transparent hover:border-primary/40'
                }`}
              >
                <img
                  src={img || fallbackImage}
                  alt={`${product.name} view ${i + 1}`}
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (target.src !== fallbackImage) target.src = fallbackImage;
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-body dark:bg-navy-200 border border-lineBorder dark:border-navy-50">
            <img
              src={images[activeImage] || fallbackImage}
              alt={product.name}
              onError={(event) => {
                const target = event.currentTarget;
                if (target.src !== fallbackImage) target.src = fallbackImage;
              }}
              className="w-full h-full object-cover"
            />
            {hasDiscount && percent != null && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-white text-xs font-bold rounded-md shadow">
                SALE -{percent}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md shadow">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">{product.brand}</p>
          <h1 className="mt-1.5 text-2xl lg:text-3xl font-bold text-slateText dark:text-white leading-snug">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} count={product.numReviews} showCount size="md" />
            <span className="text-sm text-muted">|</span>
            <span className="text-sm font-semibold text-success">{product.sold} sold</span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <span className="text-4xl font-bold text-slateText dark:text-white">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted line-through mb-1">{formatPrice(product.price)}</span>
                <span className="mb-1.5 px-2 py-1 bg-accent/10 text-accent-dark dark:text-accent text-xs font-bold rounded-md">
                  SAVE {formatPrice(product.price - product.discountPrice!)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-muted leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1.5 font-semibold ${product.stock > 10 ? 'text-success' : 'text-accent'}`}>
              {product.stock > 10 ? (
                <>
                  <HiBadgeCheck className="w-5 h-5" /> In Stock
                </>
              ) : (
                <>Only {product.stock} left!</>
              )}
            </span>
            {product.stock <= 10 && (
              <span className="bg-accent/10 text-accent-dark dark:text-accent text-xs font-bold px-2 py-0.5 rounded">HURRY UP</span>
            )}
          </div>

          {/* Quantity + Add */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-lineBorder dark:border-navy-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-12 flex items-center justify-center text-muted hover:text-primary hover:bg-body dark:hover:bg-navy-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <HiOutlineMinus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-slateText dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-11 h-12 flex items-center justify-center text-muted hover:text-primary hover:bg-body dark:hover:bg-navy-100 transition-colors"
                aria-label="Increase quantity"
              >
                <HiOutlinePlus className="w-4 h-4" />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1 min-w-[200px] text-base">
              <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="w-12 h-12 border border-lineBorder dark:border-navy-100 rounded-xl flex items-center justify-center text-muted hover:border-red-300 hover:text-red-500 transition-colors"
              aria-label="Toggle wishlist"
            >
              {isWishlisted ? <HiHeart className="w-5 h-5 text-red-500" /> : <HiOutlineHeart className="w-5 h-5" />}
            </button>
          </div>

          {/* Perks */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 bg-success/5 border border-success/20 rounded-xl px-4 py-3">
              <HiOutlineTruck className="w-5 h-5 text-success" />
              <div className="text-xs">
                <p className="font-semibold text-slateText dark:text-white">Free Delivery</p>
                <p className="text-muted">On orders over ${FREE_SHIPPING}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
              <HiOutlineRefresh className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-semibold text-slateText dark:text-white">Free Return</p>
                <p className="text-muted">Within 30 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
              <HiOutlineShieldCheck className="w-5 h-5 text-accent" />
              <div className="text-xs">
                <p className="font-semibold text-slateText dark:text-white">Guarantee</p>
                <p className="text-muted">12-month warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-2 border-b border-lineBorder dark:border-navy-100">
          {(['description', 'specs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-slateText dark:hover:text-white'
              }`}
            >
              {tab === 'description' ? 'Description' : 'Specifications'}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === 'description' ? (
            <div className="prose prose-slate dark:prose-invert max-w-3xl">
              <p>{product.description}</p>
              <p>
                Shop confidently with ElectroCart&apos;s money-back guarantee. Every item is quality checked by our team
                before shipping, arrives free when your order is over ${FREE_SHIPPING}, and can be returned within 30
                days for a full refund.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl overflow-hidden rounded-xl border border-lineBorder dark:border-navy-100">
              {specs.map((spec, i) => (
                <div
                  key={spec.key}
                  className={`grid grid-cols-1 sm:grid-cols-3 px-5 py-3.5 text-sm ${
                    i % 2 === 0 ? 'bg-white dark:bg-navy-200' : 'bg-body dark:bg-navy-300'
                  }`}
                >
                  <span className="font-semibold text-slateText dark:text-white">{spec.key}</span>
                  <span className="sm:col-span-2 text-muted">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slateText dark:text-white">You May Also Like</h2>
            <Link href={`/shop?category=${product.categorySlug}`} className="text-primary font-semibold text-sm hover:underline">
              View more →</Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}