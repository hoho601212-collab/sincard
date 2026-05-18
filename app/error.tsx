'use client';

import NextLink from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white px-6'>
      {/* 에러 아이콘 */}
      <div className='mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#F5F5F5]'>
        <svg
          className='h-12 w-12 text-[#9E9E9E]'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
          />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <h1 className='mb-3 text-center text-3xl font-bold text-[#212121]'>
        문제가 발생했습니다
      </h1>

      <p className='mb-8 text-center text-base text-[#9E9E9E]'>
        {error.message || '일시적인 오류가 발생했습니다.'}
        <br />
        잠시 후 다시 시도해주세요.
      </p>

      {/* 버튼 그룹 */}
      <div className='flex gap-3'>
        <button
          onClick={reset}
          className='rounded-lg border border-[#E0E0E0] bg-white px-6 py-3 text-sm font-medium text-[#212121] transition-colors hover:bg-[#FAFAFA]'
        >
          다시 시도
        </button>
        <NextLink
          href='/'
          className='rounded-lg bg-[#0565FF] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#044CBF]'
        >
          홈으로 이동
        </NextLink>
      </div>
    </div>
  );
}
