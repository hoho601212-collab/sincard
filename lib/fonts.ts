import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    // 필수 웨이트만 로드 (6.7MB → 3MB로 감소)
    {
      path: '../font/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../font/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../font/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});
