'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, Footer } from '@/components/design-system';
import { FormInput, VerificationBox } from '@/components/form';
import { useResetPasswordAPI } from '@/lib/api/auth';
import { toast } from 'sonner';

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPasswordAPI();

  // 쿼리 파라미터 출력
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    console.log('Password Reset 페이지 쿼리 파라미터:', params);
  }, [searchParams]);

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [verifySessionId, setVerifySessionId] = useState<string>('');
  const [niceVerified, setNiceVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // NICE 본인인증 완료 시 호출 (postMessage 수신)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('NICE 본인인증 postMessage 수신:', event.data);
      console.log('verifySessionId:', event.data?.verifySessionId);

      if (event.data?.verifySessionId) {
        setVerifySessionId(event.data.verifySessionId);
        setNiceVerified(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // NICE 본인인증
  const handleNiceVerification = async () => {
    try {
      const { getNiceEncryptedData, openNiceVerificationPopup } = await import('@/lib/api/nice');
      const encryptedData = await getNiceEncryptedData('PASSWORD_RESET');
      openNiceVerificationPopup(encryptedData);
    } catch (error) {
      console.error('NICE 본인인증 실패:', error);
      toast.error('본인인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email: formData.email,
        verifySessionId,
        newPassword: formData.newPassword,
      });

      setIsSuccess(true);
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      toast.error('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const canSubmit = formData.email && niceVerified && formData.newPassword && formData.confirmPassword;

  // 성공 화면
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header
          logoSrc="/logo.png"
          navItems={[
            { label: '고객센터', href: '/#notice', active: false },
            { label: '회원가입', href: '/signup', active: false },
            { label: '로그인', href: '/login', active: false },
          ]}
        />

        <div className="flex-1 flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
          <div className="w-full max-w-[640px]">
            <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8 md:mb-12">비밀번호 재설정 완료</h1>

            <div className="bg-[#F5F7FA] rounded-[10px] p-5 md:p-8 mb-6">
              <p className="text-[14px] md:text-[18px] text-[#212121] mb-2 md:mb-3">
                비밀번호가 성공적으로 변경되었습니다.
              </p>
              <p className="text-[12px] md:text-[14px] text-[#757575]">
                새로운 비밀번호로 로그인해주세요.
              </p>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#044CBF] transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        logoSrc="/logo.png"
        navItems={[
          { label: '고객센터', href: '/#notice', active: false },
          { label: '회원가입', href: '/signup', active: false },
          { label: '로그인', href: '/login', active: false },
        ]}
      />

      <div className="flex-1 flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
        <div className="w-full max-w-[640px]">
          <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8 md:mb-12">비밀번호 재설정</h1>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* 이메일 입력 */}
            <FormInput
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="가입 시 사용한 이메일을 입력해주세요"
              required
            />

            {/* NICE 본인인증 */}
            <VerificationBox
              title="본인인증"
              buttonText="휴대폰 본인인증"
              description="비밀번호 재설정을 위해 NICE 본인인증이 필요합니다"
              verified={niceVerified}
              onVerify={handleNiceVerification}
            />

            {/* 본인인증 완료 후 새 비밀번호 입력 필드 표시 */}
            {niceVerified && (
              <>
                <FormInput
                  label="새 비밀번호"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="새 비밀번호를 입력해주세요"
                  required
                />

                <FormInput
                  label="비밀번호 확인"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력해주세요"
                  required
                />

                <p className="text-[12px] md:text-[14px] text-[#757575] bg-[#FFF4E6] p-3 md:p-4 rounded-[10px]">
                  비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.
                </p>
              </>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || resetPasswordMutation.isPending}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#044CBF] transition-colors disabled:bg-[#BDBDBD]"
            >
              {resetPasswordMutation.isPending ? '처리 중...' : '비밀번호 변경'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 text-[12px] md:text-[14px]">
            <button
              onClick={() => router.push('/find-id')}
              className="text-[#757575] hover:text-[#212121]"
            >
              아이디 찾기
            </button>
            <div className="w-px h-4 md:h-5 bg-[#EEEEEE]"></div>
            <button
              onClick={() => router.push('/login')}
              className="text-[#03C3FF] hover:text-[#0292BF] font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
