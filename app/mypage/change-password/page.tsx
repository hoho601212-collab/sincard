'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Footer } from '@/components/design-system';
import { MainHeader } from '@/components/layout';
import { FormInput } from '@/components/form';
import { useChangePasswordAPI } from '@/lib/api/user';
import { ProtectedRoute } from '@/components/auth';

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePasswordPageContent />
    </ProtectedRoute>
  );
}

function ChangePasswordPageContent() {
  const router = useRouter();
  const changePasswordMutation = useChangePasswordAPI();

  const [formData, setFormData] = useState({
    originPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        originPassword: formData.originPassword,
        newPassword: formData.newPassword,
      });

      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      router.push('/mypage');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      toast.error('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  const canSubmit =
    formData.originPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-neutral-50">
      <MainHeader />

      <div className="px-4 py-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-12">
        <div className="max-w-[640px] mx-auto">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <button
              onClick={() => router.back()}
              className="text-xl md:text-[24px] text-[#757575] hover:text-[#212121]"
            >
              ←
            </button>
            <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold text-[#212121]">비밀번호 변경</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 현재 비밀번호 */}
            <FormInput
              label="현재 비밀번호"
              name="originPassword"
              type="password"
              value={formData.originPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력해주세요"
              required
            />

            {/* 새 비밀번호 */}
            <FormInput
              label="새 비밀번호"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 입력해주세요 (최소 8자)"
              required
            />

            {/* 비밀번호 확인 */}
            <FormInput
              label="새 비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력해주세요"
              required
            />

            {/* 비밀번호 일치 여부 표시 */}
            {formData.newPassword && formData.confirmPassword && (
              <div
                className={`text-xs md:text-[14px] ${
                  formData.newPassword === formData.confirmPassword
                    ? 'text-[#4CAF50]'
                    : 'text-[#FF6B6B]'
                }`}
              >
                {formData.newPassword === formData.confirmPassword
                  ? '✓ 비밀번호가 일치합니다'
                  : '✕ 비밀번호가 일치하지 않습니다'}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || changePasswordMutation.isPending}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-base md:text-[18px] font-semibold hover:bg-[#044CBF] transition-colors disabled:bg-[#BDBDBD]"
            >
              {changePasswordMutation.isPending ? '처리 중...' : '비밀번호 변경'}
            </button>

            {/* 취소 버튼 */}
            <button
              type="button"
              onClick={() => router.push('/mypage')}
              className="w-full h-12 md:h-14 bg-white text-[#757575] border-2 border-[#E0E0E0] rounded-[10px] text-base md:text-[18px] font-semibold hover:bg-[#F5F7FA] transition-colors"
            >
              취소
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
