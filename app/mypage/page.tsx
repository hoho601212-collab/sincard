'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Footer } from '@/components/design-system';
import { MainHeader } from '@/components/layout';
import { useUserInfoAPI, useWithdrawAPI } from '@/lib/api/user';
import { useAuthStore } from '@/store/auth';
import { ProtectedRoute } from '@/components/auth';
import { WithdrawModal } from '@/components/mypage/WithdrawModal';

export const dynamic = 'force-dynamic';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageLayout />
    </ProtectedRoute>
  );
}

function MyPageContent() {
  const router = useRouter();
  const { data: response, isLoading, error } = useUserInfoAPI();
  const { clearAuth } = useAuthStore();
  const withdrawMutation = useWithdrawAPI();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-sm md:text-base text-[#757575]">로딩 중...</p>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-sm md:text-base text-[#757575]">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const userInfo = response.data;

  const handleLogout = () => {
    clearAuth();
    toast.success('로그아웃되었습니다.');
    router.replace('/');
  };

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync();
      toast.success('회원 탈퇴가 완료되었습니다.');
      clearAuth();
      router.replace('/');
    } catch {
      toast.error('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="px-4 py-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-12">
      <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold text-[#212121] mb-6 md:mb-8">
        마이페이지
      </h1>

      {/* 사용자 정보 카드 */}
      <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl lg:text-[24px] font-bold text-[#212121] mb-4 md:mb-6">
          내 정보
        </h2>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between py-2 md:py-3 border-b border-[#F0F0F0]">
            <span className="text-sm md:text-base text-[#757575]">이름</span>
            <span className="text-sm md:text-base font-medium text-[#212121]">{userInfo.name}</span>
          </div>

          <div className="flex items-center justify-between py-2 md:py-3 border-b border-[#F0F0F0]">
            <span className="text-sm md:text-base text-[#757575]">이메일</span>
            <span className="text-sm md:text-base font-medium text-[#212121] break-all">{userInfo.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 md:py-3">
            <span className="text-sm md:text-base text-[#757575]">휴대폰 번호</span>
            <span className="text-sm md:text-base font-medium text-[#212121]">{userInfo.phone}</span>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <button
          onClick={() => router.push('/order')}
          className="bg-white rounded-[10px] border border-[#E0E0E0] p-4 md:p-6 hover:border-[#0565FF] transition-colors text-left"
        >
          <h3 className="text-base md:text-lg lg:text-[20px] font-semibold text-[#212121] mb-1 md:mb-2">
            주문 내역
          </h3>
          <p className="text-xs md:text-sm text-[#757575]">구매한 상품권 내역을 확인하세요</p>
        </button>

        <button
          onClick={() => router.push('/mypage/change-password')}
          className="bg-white rounded-[10px] border border-[#E0E0E0] p-4 md:p-6 hover:border-[#0565FF] transition-colors text-left"
        >
          <h3 className="text-base md:text-lg lg:text-[20px] font-semibold text-[#212121] mb-1 md:mb-2">
            비밀번호 변경
          </h3>
          <p className="text-xs md:text-sm text-[#757575]">계정 비밀번호를 변경하세요</p>
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="w-full h-12 md:h-14 bg-white text-[#FF6B6B] border-2 border-[#FF6B6B] rounded-[10px] text-base md:text-lg font-semibold hover:bg-[#FFF5F5] transition-colors"
      >
        로그아웃
      </button>

      {/* 회원 탈퇴 버튼 */}
      <div className="flex justify-end mt-3 md:mt-4">
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="w-[20%] min-w-[100px] h-10 md:h-11 bg-white text-[#757575] border border-[#E0E0E0] rounded-[10px] text-xs md:text-sm font-medium hover:bg-[#F5F5F5] hover:text-[#FF6B6B] hover:border-[#FF6B6B] transition-colors"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 회원 탈퇴 모달 */}
      <WithdrawModal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        onConfirm={handleWithdraw}
        isLoading={withdrawMutation.isPending}
      />
    </div>
  );
}

function MyPageLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <MainHeader />

      <Suspense
        fallback={
          <div className="px-4 py-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-12">
            <div className="bg-white rounded-[10px] p-4 md:p-8 h-[300px] md:h-[400px] animate-pulse" />
          </div>
        }
      >
        <MyPageContent />
      </Suspense>

      <Footer />
    </div>
  );
}
