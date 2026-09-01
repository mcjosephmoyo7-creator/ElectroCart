'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
}

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p._id === product._id);
          return {
            items: exists
              ? state.items.filter((p) => p._id !== product._id)
              : [...state.items, product],
          };
        }),

      isInWishlist: (productId) =>
        get().items.some((p) => p._id === productId),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((p) => p._id !== productId),
        })),
    }),
    {
      name: 'shopcart-wishlist',
      partialize: (state) => ({ items: state.items }) as WishlistState,
    }
  )
);