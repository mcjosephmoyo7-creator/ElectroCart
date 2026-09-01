'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const adminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(email, password);
          const user = res.data.data?.user || res.data.data;
          if (user && (user.role === 'admin' || user.role === 'seller')) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          }
          set({ isLoading: false, error: 'Access denied. Admin privileges required.' });
          return false;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // ignore
        }
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const res = await authApi.getMe();
          const user = res.data.data?.user || res.data.data;
          if (user && (user.role === 'admin' || user.role === 'seller')) {
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'shopcart-admin-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
