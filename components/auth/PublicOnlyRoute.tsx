'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

/**
 * 비로그인 사용자만 접근 가능한 페이지를 위한 컴포넌트
 * 로그인 사용자 → /로 리다이렉트
 */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/');
    }
  }, [isHydrated, isAuthenticated, router]);

  // hydration 전이면 로딩 표시
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#0565FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#757575]">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인된 상태면 리다이렉트 중이므로 아무것도 표시하지 않음
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
