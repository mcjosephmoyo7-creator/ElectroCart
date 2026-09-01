'use client';

import { create } from 'zustand';
import { dashboardApi, productApi, orderApi } from '@/lib/api';
import type { DashboardStats, DashboardProduct, DashboardOrder } from '@/types/dashboard';

interface DashboardState {
  stats: DashboardStats | null;
  products: DashboardProduct[];
  orders: DashboardOrder[];
  lowStockProducts: DashboardProduct[];
  loading: boolean;
  fetchStats: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  products: [],
  orders: [],
  lowStockProducts: [],
  loading: false,

  fetchStats: async () => {
    try {
      const res = await dashboardApi.getStats();
      set({ stats: res.data.data });
    } catch {
      // ignore
    }
  },

  refresh: async () => {
    set({ loading: true });
    const [statsRes, productsRes, ordersRes] = await Promise.allSettled([
      dashboardApi.getStats(),
      productApi.getAll({ limit: '100' }),
      orderApi.getAll({ limit: '50' }),
    ]);

    const stats = statsRes.status === 'fulfilled' ? statsRes.value.data.data : null;
    const products =
      productsRes.status === 'fulfilled'
        ? productsRes.value.data.data.products || []
        : [];
    const orders =
      ordersRes.status === 'fulfilled' ? ordersRes.value.data.data.orders || [] : [];

    set({
      stats,
      products,
      orders,
      lowStockProducts: products.filter((p: DashboardProduct) => p.stock < 10),
      loading: false,
    });
  },
}));
