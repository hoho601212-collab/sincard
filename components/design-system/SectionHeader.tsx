'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { Icon } from './Icon';

export interface SectionHeaderProps {
  /**
   * 제목 텍스트
   * @default "제목을 입력해주세요"
   */
  title?: string;

  /**
   * 더보기 링크 표시 여부
   * @default true
   */
  showMoreLink?: boolean;

  /**
   * 더보기 링크 URL
   * @default "#"
   */
  moreHref?: string;

  /**
   * 더보기 텍스트
   * @default "더보기"
   */
  moreText?: string;

  /**
   * 사이즈
   * @default "small"
   */
  size?: 'small' | 'medium';

  /**
   * 더보기 클릭 핸들러
   */
  onMoreClick?: () => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title = '제목을 입력해주세요',
  showMoreLink = true,
  moreHref = '#',
  moreText = '더보기',
  size = 'small',
  onMoreClick,
  className,
}) => {
  const sizeStyles = {
    small: {
      container: 'pt-[80px] pb-[17px]',
      title: 'text-[24px] font-semibold tracking-[-0.6px]',
    },
    medium: {
      container: 'pt-[80px] pb-[6px]',
      title: 'text-[32px] font-bold tracking-[-0.8px]',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={cn(
        'bg-white w-full',
        'box-border',
        'flex items-center',
        'px-[200px]',
        currentSize.container,
        className
      )}
    >
      {/* 제목 */}
      <h2
        className={cn(
          'flex-1 min-w-0',
          'leading-[1.3] text-black',
          'whitespace-pre-wrap',
          currentSize.title
        )}
      >
        {title}
      </h2>

      {/* 더보기 링크 (small 사이즈에만 표시) */}
      {showMoreLink && size === 'small' && (
        <Link
          href={moreHref}
          onClick={onMoreClick}
          className={cn(
            'flex items-center justify-center gap-1',
            'w-[65px] shrink-0',
            'transition-opacity duration-200',
            'hover:opacity-70'
          )}
        >
          <span className="text-[16px] font-medium leading-[1.3] tracking-[-0.4px] text-[#03C3FF] text-right">
            {moreText}
          </span>
          <Icon icon="right" size={16.667} color="#03C3FF" />
        </Link>
      )}
    </div>
  );
};
