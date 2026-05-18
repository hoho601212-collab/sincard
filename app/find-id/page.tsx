'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/design-system';
import { useFindIdAPI, AccountInfo } from '@/lib/api/auth';

export default function FindIdPage() {
  const router = useRouter();
  const findIdMutation = useFindIdAPI();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundAccounts, setFoundAccounts] = useState<AccountInfo[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await findIdMutation.mutateAsync({ name, phone });
      setFoundAccounts(response.data);
    } catch (error) {
      console.error('아이디 찾기 실패:', error);
      alert('일치하는 회원 정보가 없습니다.');
    }
  };

  const getLoginTypeDisplay = (loginType: string) => {
    switch (loginType) {
      case 'KAKAO':
        return '카카오';
      case 'NAVER':
        return '네이버';
      case 'LOCAL':
        return '일반';
      default:
        return loginType;
    }
  };

  const getLoginTypeDescription = (loginType: string, account: string) => {
    switch (loginType) {
      case 'KAKAO':
        return `카카오 계정 (${account})으로 가입하셨습니다.`;
      case 'NAVER':
        return `네이버 계정 (${account})으로 가입하셨습니다.`;
      case 'LOCAL':
        return `이메일 (${account})로 가입하셨습니다.`;
      default:
        return `${account}로 가입하셨습니다.`;
    }
  };

  if (foundAccounts && foundAccounts.length > 0) {
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
            <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8 md:mb-12">아이디 찾기 결과</h1>

            <div className="space-y-4 mb-6">
              <p className="text-[14px] md:text-[16px] text-[#757575]">
                {foundAccounts.length}개의 계정을 찾았습니다.
              </p>

              {foundAccounts.map((accountInfo, index) => (
                <div key={index} className="bg-[#F5F7FA] rounded-[10px] p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0565FF] text-white text-[12px] md:text-[14px] font-medium">
                      {getLoginTypeDisplay(accountInfo.loginType)}
                    </span>
                  </div>
                  <p className="text-[16px] md:text-[20px] font-bold text-[#212121] mb-2 break-all">
                    {accountInfo.account}
                  </p>
                  <p className="text-[12px] md:text-[14px] text-[#757575]">
                    {getLoginTypeDescription(accountInfo.loginType, accountInfo.account)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/login')}
                className="flex-1 h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#044CBF] transition-colors"
              >
                로그인하기
              </button>
              <button
                onClick={() => router.push('/password-reset')}
                className="flex-1 h-12 md:h-14 bg-white text-[#0565FF] border-2 border-[#0565FF] rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#F5F7FA] transition-colors"
              >
                비밀번호 재설정
              </button>
            </div>
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
          <h1 className="text-[24px] md:text-[32px] font-bold text-black mb-8 md:mb-12">아이디 찾기</h1>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-[12px] md:text-[14px] font-medium text-[#212121] mb-2">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="w-full h-11 md:h-12 bg-[#F5F5F5] rounded-[10px] px-4 md:px-6 text-[14px] md:text-[16px] text-[#212121] placeholder:text-[#9E9E9E]"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] md:text-[14px] font-medium text-[#212121] mb-2">
                휴대폰 번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="휴대폰 번호를 입력해주세요 (예: 01012345678)"
                className="w-full h-11 md:h-12 bg-[#F5F5F5] rounded-[10px] px-4 md:px-6 text-[14px] md:text-[16px] text-[#212121] placeholder:text-[#9E9E9E]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={findIdMutation.isPending}
              className="w-full h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[20px] font-semibold hover:bg-[#044CBF] transition-colors disabled:bg-[#BDBDBD]"
            >
              {findIdMutation.isPending ? '조회 중...' : '아이디 찾기'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 text-[12px] md:text-[14px]">
            <button
              onClick={() => router.push('/password-reset')}
              className="text-[#757575] hover:text-[#212121]"
            >
              비밀번호 재설정
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
