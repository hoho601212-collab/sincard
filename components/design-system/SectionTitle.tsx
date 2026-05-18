'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface SectionTitleProps {
  number?: string;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  number = '01',
  title = '제목을 입력해주세요',
  size = 'medium',
  className,
}) => {
  const sizeStyles = {
    small: {
      number: 'text-[20px]',
      title: 'text-[20px]',
    },
    medium: {
      number: 'text-[24px]',
      title: 'text-[24px]',
    },
    large: {
      number: 'text-[32px]',
      title: 'text-[32px]',
    },
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        className
      )}
    >
      {/* 번호 */}
      <span
        className={cn(
          'font-bold leading-[1.3] tracking-[-0.6px]',
          'text-[#0565FF]',
          sizeStyles[size].number
        )}
      >
        {number}
      </span>

      {/* 제목 */}
      <h2
        className={cn(
          'font-semibold leading-[1.3] tracking-[-0.6px]',
          'text-[#212121]',
          sizeStyles[size].title
        )}
      >
        {title}
      </h2>
    </div>
  );
};
