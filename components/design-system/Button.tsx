'use client';

import React from 'react';
import { cn } from '@/lib/cn';

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 3L11 8L6 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 크기
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 버튼 스타일 변형
   * @default "filled"
   */
  variant?: 'filled' | 'outlined';

  /**
   * 버튼 상태
   * @default "primary"
   */
  status?: 'primary' | 'secondary' | 'disabled';

  /**
   * 상단에 표시될 부제목
   */
  subtitle?: string;

  /**
   * 부제목 표시 여부
   * @default false
   */
  showSubtitle?: boolean;

  /**
   * 우측 아이콘(chevron) 표시 여부
   * @default true
   */
  showIcon?: boolean;

  /**
   * 버튼 텍스트 (children)
   */
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'medium',
      variant = 'filled',
      status = 'primary',
      subtitle,
      showSubtitle = false,
      showIcon = true,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // disabled가 true면 status를 'disabled'로 강제 설정
    const actualStatus = disabled ? 'disabled' : status;

    // 크기별 패딩 및 폰트 설정
    const sizeStyles = {
      small: {
        padding: 'px-8 py-3',
        titleFont: 'text-[18px] font-semibold leading-[1.3] tracking-[-0.45px]',
        subtitleFont: 'text-[16px] font-semibold leading-[1.3] tracking-[-0.4px]',
        iconSize: 'w-[16.667px] h-[16.667px]',
      },
      medium: {
        padding: 'px-8 py-4',
        titleFont: 'text-[24px] font-semibold leading-[1.3] tracking-[-0.6px]',
        subtitleFont: 'text-[18px] font-semibold leading-[1.3] tracking-[-0.45px]',
        iconSize: 'w-6 h-6',
      },
      large: {
        padding: 'px-8 py-5',
        titleFont: 'text-[24px] font-semibold leading-[1.3] tracking-[-0.6px]',
        subtitleFont: 'text-[18px] font-semibold leading-[1.3] tracking-[-0.45px]',
        iconSize: 'w-6 h-6',
      },
    };

    // Variant + Status 조합별 색상 스타일
    const variantStyles = {
      filled: {
        primary: cn(
          'bg-[#0565FF] text-white',
          'hover:bg-[#DAE8FF] hover:text-[#0565FF]',
          'active:bg-[#044CBF] active:text-white',
          'disabled:bg-[#F5F5F5] disabled:text-[#9E9E9E] disabled:cursor-not-allowed'
        ),
        secondary: cn(
          'bg-[#03C3FF] text-white',
          'hover:bg-[#D9F6FF] hover:text-[#0292BF]',
          'active:bg-[#0292BF] active:text-white',
          'disabled:bg-[#F5F5F5] disabled:text-[#9E9E9E] disabled:cursor-not-allowed'
        ),
        disabled: 'bg-[#F5F5F5] text-[#9E9E9E] cursor-not-allowed',
      },
      outlined: {
        primary: cn(
          'border-[1.5px] border-[#0565FF] bg-transparent text-[#0565FF]',
          'hover:bg-[#DAE8FF]',
          'active:bg-[#B2CFFF]',
          'disabled:border-[#E0E0E0] disabled:text-[#9E9E9E] disabled:cursor-not-allowed'
        ),
        secondary: cn(
          'border-[1.5px] border-[#03C3FF] bg-[#FAFAFA] text-[#03C3FF]',
          'hover:bg-[#E6F9FF]',
          'active:bg-[#D9F6FF]',
          'disabled:border-[#E0E0E0] disabled:text-[#9E9E9E] disabled:cursor-not-allowed'
        ),
        disabled: 'border-[1.5px] border-[#E0E0E0] bg-transparent text-[#9E9E9E] cursor-not-allowed',
      },
    };

    // 부제목 색상 (variant와 status에 따라 다름)
    const subtitleStyles = {
      filled: {
        primary: 'text-[#E6F0FF]',
        secondary: 'text-[#E6F9FF]',
        disabled: 'text-[#0565FF]',
      },
      outlined: {
        primary: 'text-[#B2CFFF]',
        secondary: 'text-[#212121]',
        disabled: 'text-[#0565FF]',
      },
    };

    const currentSize = sizeStyles[size];
    const currentVariant = variantStyles[variant][actualStatus];
    const currentSubtitleStyle = showSubtitle && subtitle ? subtitleStyles[variant][actualStatus] : '';

    return (
      <button
        ref={ref}
        disabled={actualStatus === 'disabled'}
        className={cn(
          // 기본 스타일
          'inline-flex flex-col items-center justify-center gap-1 rounded-[10px]',
          'transition-all duration-200 ease-in-out',
          'box-border',
          // 크기별 패딩
          currentSize.padding,
          // Variant + Status 스타일
          currentVariant,
          // 커스텀 className
          className
        )}
        {...props}
      >
        {/* 부제목 */}
        {showSubtitle && subtitle && (
          <span className={cn(currentSize.subtitleFont, currentSubtitleStyle)}>
            {subtitle}
          </span>
        )}

        {/* 메인 텍스트 + 아이콘 */}
        <div className="flex items-center justify-center gap-1">
          <span className={currentSize.titleFont}>{children}</span>
          {showIcon && (
            <ChevronRightIcon className={currentSize.iconSize} />
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
