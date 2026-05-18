'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 로그인이 필요한 페이지를 보호하는 컴포넌트
 * 비로그인 사용자 → /login으로 리다이렉트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // hydration 전이거나 비로그인 상태면 로딩 표시
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#0565FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#757575]">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
