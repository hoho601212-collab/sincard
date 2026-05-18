'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Image from 'next/image';

export interface ProductDetailCardProps {
  brandLogo?: string;
  productName?: string;
  cardDiscount?: string;
  mobileDiscount?: string;
  onPurchaseClick?: () => void;
  className?: string;
}

export const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  brandLogo,
  productName = '상품명',
  cardDiscount = '00%↓',
  mobileDiscount = '00%↓',
  onPurchaseClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[10px]',
        'border-[1.5px] border-[#E0E0E0]',
        'flex flex-col gap-6 items-center',
        'px-8 py-6',
        className
      )}
    >
      {/* 상품 정보 */}
      <div className="flex flex-col gap-4 w-full">
        {/* 브랜드 로고 + 상품명 */}
        <div className="flex flex-col items-center w-full">
          {brandLogo ? (
            <div className="relative w-[104px] h-[104px] mb-0">
              <Image src={brandLogo} alt={productName} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-[104px] h-[104px] bg-gray-100 rounded-lg" />
          )}
          <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#212121] text-center whitespace-nowrap overflow-ellipsis overflow-hidden w-full">
            {productName}
          </p>
        </div>

        {/* 할인율 */}
        <div className="flex gap-4 items-center justify-center">
          <div className="bg-neutral-50 rounded-[10px] px-8 py-4 flex flex-col gap-1 items-center">
            <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#212121]">
              카드
            </p>
            <p className="text-[24px] font-medium leading-[1.3] tracking-[-0.6px] text-[#03C3FF]">
              {cardDiscount}
            </p>
          </div>
          <div className="bg-neutral-50 rounded-[10px] px-8 py-4 flex flex-col gap-1 items-center">
            <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#212121]">
              휴대폰
            </p>
            <p className="text-[24px] font-medium leading-[1.3] tracking-[-0.6px] text-[#03C3FF]">
              {mobileDiscount}
            </p>
          </div>
        </div>
      </div>

      {/* 구매 버튼 */}
      <button
        onClick={onPurchaseClick}
        className={cn(
          'w-full',
          'border-[1.5px] border-[#0565FF]',
          'rounded-[10px] px-8 py-5',
          'text-[24px] font-semibold leading-[1.3] tracking-[-0.6px]',
          'text-[#0565FF]',
          'hover:bg-[#DAE8FF] transition-colors'
        )}
      >
        바로 구매하기
      </button>
    </div>
  );
};
