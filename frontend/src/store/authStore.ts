'use client';

import { create } from 'zustand';
import { authApi } from '@/lib/api';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role?: string;
  avatar?: string;
  phone?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthStoreState {
  user: AuthUser | null;
  status: AuthStatus;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

function mapUser(data: Record<string, unknown> | undefined): AuthUser | null {
  if (!data) return null;
  return {
    id: String(data._id ?? data.id ?? ''),
    username: String(data.username ?? data.name ?? ''),
    email: String(data.email ?? ''),
    role: data.role as string | undefined,
    avatar: data.avatar as string | undefined,
    phone: data.phone as string | undefined,
  };
}

let initPromise: Promise<void> | null = null;

export const authStore = create<AuthStoreState>()((set) => ({
  user: null,
  status: 'loading',

  initialize: async () => {
    if (!initPromise) {
      initPromise = (async () => {
        try {
          const res = await authApi.getMe();
          const user = mapUser(res.data?.data);
          set({ user, status: user ? 'authenticated' : 'unauthenticated' });
        } catch {
          set({ user: null, status: 'unauthenticated' });
        }
      })();
    }
    return initPromise;
  },

  login: async (email, password) => {
    await authApi.login(email, password);
    const res = await authApi.getMe();
    set({ user: mapUser(res.data?.data), status: 'authenticated' });
  },

  register: async (username, email, password) => {
    await authApi.register(username, email, password);
    const res = await authApi.getMe();
    set({ user: mapUser(res.data?.data), status: 'authenticated' });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, status: 'unauthenticated' });
    }
  },

  setUser: (user) => set({ user, status: 'authenticated' }),
}));