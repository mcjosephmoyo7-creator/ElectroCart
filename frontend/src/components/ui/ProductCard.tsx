'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiOutlineEye } from 'react-icons/hi';
import { Product } from '@/types';
import { cartStore } from '@/store/cartStore';
import { wishlistStore } from '@/store/wishlistStore';
import { authStore } from '@/store/authStore';
import { authUiStore } from '@/store/authUiStore';
import StarRating from '@/components/ui/StarRating';
import { formatPrice, discountPercent } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = cartStore((s) => s.addItem);
  const toggleWishlist = wishlistStore((s) => s.toggleItem);
  const isWishlisted = wishlistStore((s) => s.isInWishlist(product._id));
  const authStatus = authStore((s) => s.status);
  const openModal = authUiStore((s) => s.openModal);

  const [isHovered, setIsHovered] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const percent = discountPercent(product.price, product.discountPrice);

  const handleNavigate = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (authStatus !== 'authenticated') {
      openModal('signin', { type: 'toggleWishlist', product });
      return;
    }
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div
      className="group relative bg-white dark:bg-navy-200 rounded-xl border border-lineBorder dark:border-navy-50 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-body">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget;
            if (target.src !== fallbackImage) {
              target.src = fallbackImage;
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.onSale && hasDiscount && percent != null && (
            <span className="px-2 py-1 bg-accent text-white text-[11px] font-bold rounded-md shadow-sm">
              SALE -{percent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 bg-primary text-white text-[11px] font-bold rounded-md shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Quick view */}
        <div
          className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <button
            onClick={handleNavigate}
            className="w-full flex items-center justify-center gap-2 bg-white/95 dark:bg-navy-50/95 backdrop-blur text-navy dark:text-white py-2.5 rounded-lg text-sm font-semibold shadow hover:bg-primary hover:text-white transition-colors"
          >
            <HiOutlineEye className="w-4 h-4" /> Quick View
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 w-9 h-9 bg-white dark:bg-navy-50 rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          {isWishlisted ? (
            <HiHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-muted" />
          )}
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-medium text-primary dark:text-primary-light mb-1">{product.brand}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-slateText dark:text-white text-[15px] leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <StarRating rating={product.rating} count={product.numReviews} showCount />
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slateText dark:text-white">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[13px] text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <HiOutlineShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}