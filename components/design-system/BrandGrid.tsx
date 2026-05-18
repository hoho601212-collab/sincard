'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Image from 'next/image';

export interface BrandItem {
  id: string;
  name: string;
  logo: string;
  onClick?: () => void;
}

export interface BrandGridProps {
  brands?: BrandItem[];
  className?: string;
}

const defaultBrands: BrandItem[] = [
  { id: '1', name: '컬쳐랜드', logo: '/brands/cultureland.png' },
  { id: '2', name: '구글 기프트카드', logo: '/brands/google-play.png' },
  { id: '3', name: '북앤라이프 도서문화상품권', logo: '/brands/book-and-life.png' },
  { id: '4', name: '에그머니', logo: '/brands/egg-money.png' },
  { id: '5', name: '티머니GO', logo: '/brands/tmoneygo.png' },
  { id: '6', name: '핀카드', logo: '/brands/pin-card.png' },
  { id: '7', name: '해피머니', logo: '/brands/happy-money.png' },
  { id: '8', name: '스마트문화상품권', logo: '/brands/smart-cultureland.png' },
];

export const BrandGrid: React.FC<BrandGridProps> = ({
  brands = defaultBrands,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-4 gap-4',
        className
      )}
    >
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={brand.onClick}
          className={cn(
            'bg-white rounded-[10px]',
            'border-[1.5px] border-[#E0E0E0]',
            'flex items-center justify-center',
            'p-6',
            'hover:border-[#0565FF] transition-colors',
            'cursor-pointer'
          )}
        >
          <div className="relative w-full h-[80px]">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>
        </button>
      ))}
    </div>
  );
};
