'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Image from 'next/image';

export interface ProductCardProps {
  brandLogo?: string;
  brandLogoAlt?: string;
  productName?: string;
  price?: string;
  buttonText?: string;
  selected?: boolean;
  showButton?: boolean;
  onClick?: () => void;
  onPurchaseClick?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  brandLogo,
  brandLogoAlt = '상품권 브랜드 로고',
  productName = '상품권',
  price = '00,000원',
  buttonText = '상품권 구매하기',
  selected = false,
  showButton = true,
  onClick,
  onPurchaseClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-[24px]',
        'flex flex-col items-center justify-between gap-5',
        'bg-gradient-to-b from-white to-[#F8FBFF]',
        'px-5 py-6 md:px-6 md:py-7',
        'box-border cursor-pointer',
        'border border-[#D7E4F3]',
        'shadow-[0_10px_28px_rgba(15,23,42,0.05)]',
        'transition-all duration-200',
        'hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_38px_rgba(37,99,235,0.12)]',
        selected &&
          'border-[#2563EB] bg-[#EFF6FF] shadow-[0_18px_38px_rgba(37,99,235,0.16)]',
        className
      )}
    >
      <div className="absolute right-4 top-4 rounded-full bg-[#EEF6FF] px-3 py-1 text-[11px] font-bold text-[#2563EB]">
        GIFT
      </div>

      {brandLogo ? (
        <div className="relative mt-4 h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[22px] border border-[#E3ECF8] bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)] md:h-[112px] md:w-[112px]">
          <Image
            src={brandLogo}
            alt={brandLogoAlt}
            fill
            className="object-contain p-[15px]"
          />
        </div>
      ) : (
        <div className="mt-4 flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[22px] border border-[#E3ECF8] bg-white md:h-[112px] md:w-[112px]">
          <span className="text-[13px] font-semibold text-[#94A3B8]">
            로고
          </span>
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-2 text-center">
        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold leading-[1.4] tracking-[-0.35px] text-[#1F2937] md:text-[17px]">
          {productName}
        </p>

        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[19px] font-black leading-[1.3] tracking-[-0.5px] text-[#0F172A] md:text-[22px]">
          {price}
        </p>

        <p className="text-[11px] font-medium text-[#64748B] md:text-[12px]">
          휴대폰 결제 · 신용카드 결제 가능
        </p>
      </div>

      {showButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPurchaseClick?.();
          }}
          className={cn(
            'w-full rounded-[16px]',
            'px-5 py-3.5',
            'text-[14px] font-extrabold tracking-[-0.3px] md:text-[15px]',
            'transition-all duration-200',
            selected
              ? 'bg-[#2563EB] text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)] hover:bg-[#1D4ED8]'
              : 'bg-[#0F172A] text-white shadow-[0_10px_22px_rgba(15,23,42,0.16)] hover:bg-[#2563EB] hover:shadow-[0_12px_26px_rgba(37,99,235,0.24)]'
          )}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
