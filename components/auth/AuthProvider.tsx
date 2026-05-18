'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isHydrated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isLoggedIn, clearAuth } = useAuthStore();

  useEffect(() => {
    // zustand persist hydration 완료 체크
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // 이미 hydration이 완료된 경우
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: isLoggedIn, isHydrated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
