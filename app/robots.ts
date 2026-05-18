import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/mypage',
          '/order',
          '/payments',
          '/login',
          '/signup',
          '/find-id',
          '/password-reset',
          '/register',
          '/studio', // Sanity Studio 관리자 페이지
        ],
      },
    ],
    sitemap: 'https://pin-toss.com/sitemap.xml',
  };
}
