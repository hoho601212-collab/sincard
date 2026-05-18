import { Suspense } from 'react';
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo';

interface Voucher {
  id: number;
  name: string;
  price: number;
}

interface VoucherIssuer {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  publisher: string;
  vouchers?: Voucher[];
}

// 서버에서 상품 정보 조회
async function getProductData(productId: number): Promise<VoucherIssuer | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/voucher-issuer/${productId}`,
      { next: { revalidate: 3600 } } // 1시간 캐시
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.data;
  } catch {
    return null;
  }
}

// 동적 메타데이터 생성 (SEO 핵심)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const productIdNumber = parseInt(productId, 10);

  if (isNaN(productIdNumber)) {
    return {
      title: '상품을 찾을 수 없습니다 | 핀토스',
    };
  }

  const product = await getProductData(productIdNumber);

  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다 | 핀토스',
    };
  }

  // HTML 태그 제거 (description에서)
  const cleanDescription = product.description
    .replace(/<[^>]*>/g, '')
    .substring(0, 160);

  return {
    title: `${product.name} | 핀토스`,
    description: cleanDescription || `${product.name} - 핀토스에서 간편하게 구매하세요`,
    openGraph: {
      title: `${product.name} | 핀토스`,
      description: cleanDescription || `${product.name} - 핀토스에서 간편하게 구매하세요`,
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
      type: 'website',
      siteName: '핀토스',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | 핀토스`,
      description: cleanDescription || `${product.name} - 핀토스에서 간편하게 구매하세요`,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const productIdNumber = parseInt(productId, 10);

  if (isNaN(productIdNumber)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm md:text-base text-[#757575]">잘못된 상품 ID입니다.</p>
      </div>
    );
  }

  // 서버에서 상품 데이터 가져오기 (JSON-LD용)
  const product = await getProductData(productIdNumber);
  const cleanDescription = product?.description
    ?.replace(/<[^>]*>/g, '')
    .substring(0, 300) || '';

  // 가격 정보 계산 (vouchers 배열에서)
  const vouchers = product?.vouchers || [];
  const prices = vouchers.map(v => v.price).filter(p => p > 0);
  const lowPrice = prices.length > 0 ? Math.min(...prices) : undefined;
  const highPrice = prices.length > 0 ? Math.max(...prices) : undefined;
  const offerCount = prices.length;

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      {product && (
        <>
          <ProductJsonLd
            name={product.name}
            description={cleanDescription || `${product.name} - 핀토스몰에서 간편하게 구매하세요`}
            image={product.imageUrl}
            sku={`PINTOSS-${product.id}`}
            brand={product.publisher || '핀토스몰'}
            url={`https://pin-toss.com/product/${product.id}`}
            lowPrice={lowPrice}
            highPrice={highPrice}
            offerCount={offerCount}
          />
          <BreadcrumbJsonLd
            items={[
              { name: '홈', url: 'https://pin-toss.com' },
              { name: '상품', url: 'https://pin-toss.com/#products' },
              { name: product.name, url: `https://pin-toss.com/product/${product.id}` },
            ]}
          />
        </>
      )}

      <Suspense
        fallback={
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <p className="text-sm md:text-base text-[#757575]">상품 정보를 불러오는 중...</p>
          </div>
        }
      >
        <ProductDetailClient productId={productIdNumber} />
      </Suspense>
    </>
  );
}
