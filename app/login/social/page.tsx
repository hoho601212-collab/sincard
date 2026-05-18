'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

function SocialLoginRedirectContent() {
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const isSuccess = searchParams.get('isSuccess') === 'true';
    const accessToken = searchParams.get('accessToken');
    const oauthSignupUuid = searchParams.get('oauthSignupUuid');

    // ❌ 로그인 실패 → pin-toss 로그인으로 이동
    if (!isSuccess) {
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      window.location.href = 'https://www.pin-toss.com/login';
      return;
    }

    // ✅ 기존 회원 → 토큰 저장 후 pin-toss 메인으로 이동
    if (accessToken) {
      setAuth(accessToken);
      toast.success('로그인 성공!');

      const returnUrl = sessionStorage.getItem('returnUrl') || '/';
      sessionStorage.removeItem('returnUrl');

      window.location.href = `https://www.pin-toss.com${returnUrl}`;
      return;
    }

    // 🆕 신규 회원 → pin-toss 회원가입으로 이동
    if (oauthSignupUuid) {
      toast.info('회원가입이 필요합니다.');

      window.location.href = `https://www.pin-toss.com/signup/oauth?oauthSignupUuid=${oauthSignupUuid}`;
      return;
    }

    // ❌ 예외 상황
    toast.error('로그인 정보를 받을 수 없습니다.');
    window.location.href = 'https://www.pin-toss.com/login';

  }, [searchParams, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#0565FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[18px] text-[#757575]">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function SocialLoginRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0565FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[18px] text-[#757575]">로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <SocialLoginRedirectContent />
    </Suspense>
  );
}
