'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface VendorInfoItem {
  label: string;
  value: string;
  href?: string;
}

export interface VendorInfoProps {
  items?: VendorInfoItem[];
  className?: string;
}

const defaultItems: VendorInfoItem[] = [
  { label: '발행업체', value: '(주)핀토스' },
  { label: '홈페이지', value: 'www.pintoss.com', href: 'https://www.pintoss.com' },
  { label: '고객센터', value: '1234-5678' },
];

export const VendorInfo: React.FC<VendorInfoProps> = ({
  items = defaultItems,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[10px]',
        'border border-[#E0E0E0]',
        'px-8 py-6',
        'flex flex-col gap-3',
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          {/* 레이블 */}
          <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.4px] text-[#03C3FF] min-w-[80px]">
            {item.label}
          </p>

          {/* 값 (링크 또는 텍스트) */}
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] font-medium leading-[1.3] tracking-[-0.4px] text-[#0565FF] hover:underline"
            >
              {item.value}
            </a>
          ) : (
            <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.4px] text-[#212121]">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
