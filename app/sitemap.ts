import { MetadataRoute } from 'next';

const BASE_URL = 'https://pin-toss.com';

// Sanity 환경변수 체크
const SANITY_ENABLED =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET &&
  process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/notice`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 동적 상품 페이지들 - API에서 상품 목록 조회
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/voucher-issuer`,
      { next: { revalidate: 3600 } } // 1시간 캐시
    );

    if (response.ok) {
      const result = await response.json();
      const issuers = result.data || [];

      productPages = issuers.map((issuer: { id: number }) => ({
        url: `${BASE_URL}/product/${issuer.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch products', error);
  }

  // 동적 공지사항 페이지들 - Sanity에서 공지사항 목록 조회
  let noticePages: MetadataRoute.Sitemap = [];

  if (SANITY_ENABLED) {
    try {
      // 동적 import로 Sanity client 로드
      const { client } = await import('@/sanity/lib/client');
      const { noticesListQuery } = await import('@/sanity/lib/queries');

      const notices = await client.fetch<Array<{ slug: string; createdAt: string }>>(
        noticesListQuery(0, 100) // 최대 100개
      );

      noticePages = notices.map((notice) => ({
        url: `${BASE_URL}/notice/${notice.slug}`,
        lastModified: new Date(notice.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    } catch (error) {
      console.error('Sitemap: Failed to fetch notices', error);
    }
  }

  return [...staticPages, ...productPages, ...noticePages];
}
