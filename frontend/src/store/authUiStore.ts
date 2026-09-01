'use client';

import { create } from 'zustand';
import { Product } from '@/types';

export type AuthMode = 'signin' | 'register' | 'forgot';

export type AuthIntent =
  | { type: 'navigate'; path: string }
  | { type: 'toggleWishlist'; product: Product };

interface AuthUiState {
  open: boolean;
  mode: AuthMode;
  intent: AuthIntent | null;
  openModal: (mode?: AuthMode, intent?: AuthIntent) => void;
  close: () => void;
  setMode: (mode: AuthMode) => void;
  setIntent: (intent: AuthIntent) => void;
  clearIntent: () => void;
}

export const authUiStore = create<AuthUiState>()((set) => ({
  open: false,
  mode: 'signin',
  intent: null,

  openModal: (mode = 'signin', intent) =>
    set((state) => ({
      open: true,
      mode,
      intent: intent || state.intent,
    })),

  close: () => set({ open: false }),

  setMode: (mode) => set({ mode }),

  setIntent: (intent) => set({ intent }),

  clearIntent: () => set({ intent: null }),
}));