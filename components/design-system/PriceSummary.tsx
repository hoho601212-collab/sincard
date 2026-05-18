'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface PriceSummaryProps {
  unitPrice?: number;
  quantity?: number;
  discount?: number;
  showDiscount?: boolean;
  className?: string;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  unitPrice = 10000,
  quantity = 10,
  discount = 0,
  showDiscount = false,
  className,
}) => {
  const subtotal = unitPrice * quantity;
  const discountAmount = showDiscount ? (subtotal * discount) / 100 : 0;
  const total = subtotal - discountAmount;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div
      className={cn(
        'bg-white rounded-[10px]',
        'border-[1.5px] border-[#E0E0E0]',
        'px-8 py-6',
        'flex flex-col gap-4',
        className
      )}
    >
      {/* 상품 금액 */}
      <div className="flex items-center justify-between">
        <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#616161]">
          상품 금액
        </p>
        <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.45px] text-[#212121]">
          {formatPrice(unitPrice)}원 × {quantity}개
        </p>
      </div>

      {/* 할인 (조건부 표시) */}
      {showDiscount && discount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#616161]">
            할인
          </p>
          <p className="text-[18px] font-semibold leading-[1.3] tracking-[-0.45px] text-[#0565FF]">
            -{formatPrice(discountAmount)}원
          </p>
        </div>
      )}

      {/* 구분선 */}
      <div className="h-[1px] bg-[#E0E0E0]" />

      {/* 총 결제 금액 */}
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#212121]">
          총 결제 금액
        </p>
        <p className="text-[28px] font-bold leading-[1.3] tracking-[-0.7px] text-[#0565FF]">
          {formatPrice(total)}원
        </p>
      </div>
    </div>
  );
};
