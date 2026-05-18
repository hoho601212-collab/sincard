'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setAuth: (accessToken: string, refreshToken?: string | null) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      setAuth: (accessToken: string, refreshToken?: string | null) => {
        set({
          accessToken,
          refreshToken: refreshToken || null,
          isLoggedIn: true,
        });
      },
      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        });
      },
      getAccessToken: () => get().accessToken,
    }),
    {
      name: 'auth-storage',
    }
  )
);
