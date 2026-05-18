'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface TextInputSectionProps {
  /**
   * 제목
   */
  title?: string;

  /**
   * 부제목
   */
  subtitle?: string;

  /**
   * 제목 플레이스홀더
   * @default "제목을 입력해주세요"
   */
  titlePlaceholder?: string;

  /**
   * 부제목 플레이스홀더
   * @default "부제목을 입력해주세요"
   */
  subtitlePlaceholder?: string;

  /**
   * 제목 변경 핸들러
   */
  onTitleChange?: (value: string) => void;

  /**
   * 부제목 변경 핸들러
   */
  onSubtitleChange?: (value: string) => void;

  /**
   * 버튼 텍스트
   * @default "Button"
   */
  buttonText?: string;

  /**
   * 버튼 클릭 핸들러
   */
  onButtonClick?: () => void;

  /**
   * 버튼 표시 여부
   * @default true
   */
  showButton?: boolean;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const TextInputSection = React.forwardRef<HTMLDivElement, TextInputSectionProps>(
  (
    {
      title,
      subtitle,
      titlePlaceholder = '제목을 입력해주세요',
      subtitlePlaceholder = '부제목을 입력해주세요',
      onTitleChange,
      onSubtitleChange,
      buttonText = 'Button',
      onButtonClick,
      showButton = true,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-[42px] items-start',
          'w-[431px]',
          className
        )}
      >
        {/* 제목 및 부제목 입력 영역 */}
        <div className="flex flex-col gap-4 items-start w-full whitespace-pre-wrap">
          {/* 제목 입력 */}
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder={titlePlaceholder}
            className={cn(
              'w-full',
              'text-[40px] font-bold leading-[1.3] tracking-[-1px]',
              'text-black placeholder:text-gray-400',
              'bg-transparent',
              'border-none outline-none',
              'focus:outline-none focus:ring-0'
            )}
          />

          {/* 부제목 입력 */}
          <input
            type="text"
            value={subtitle}
            onChange={(e) => onSubtitleChange?.(e.target.value)}
            placeholder={subtitlePlaceholder}
            className={cn(
              'w-full',
              'text-[24px] font-medium leading-[1.3] tracking-[-0.6px]',
              'text-[#616161] placeholder:text-gray-400',
              'bg-transparent',
              'border-none outline-none',
              'focus:outline-none focus:ring-0'
            )}
          />
        </div>

        {/* 버튼 영역 */}
        {showButton && (
          <div className="flex gap-6 items-center w-full">
            <Button
              size="large"
              variant="filled"
              status="primary"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

TextInputSection.displayName = 'TextInputSection';
