'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING = 9.99;

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

export const cartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product._id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.product._id !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.product._id === productId
                ? { ...i, quantity: Math.min(quantity, i.product.stock) }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.discountPrice ?? i.product.price;
          return sum + price * i.quantity;
        }, 0),

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return FLAT_SHIPPING;
      },

      getTotal: () => get().getSubtotal() + get().getShipping(),
    }),
    {
      name: 'shopcart-cart',
      partialize: (state) => ({ items: state.items }) as CartState,
    }
  )
);

export const useCartCount = () => cartStore((s) => s.items);
export const FREE_SHIPPING = FREE_SHIPPING_THRESHOLD;