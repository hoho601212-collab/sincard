'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface DateInputProps {
  /**
   * 날짜 문자열 (예: "20XX. XX. XX.")
   */
  date?: string;

  /**
   * 플레이스홀더 또는 입력 텍스트
   */
  placeholder?: string;

  /**
   * 입력 값
   */
  value?: string;

  /**
   * 색상 타입
   * @default "primary"
   */
  type?: 'primary' | 'secondary';

  /**
   * 포커스/호버 상태 (테두리 표시)
   * @default false
   */
  focused?: boolean;

  /**
   * onChange 이벤트 핸들러
   */
  onChange?: (value: string) => void;

  /**
   * onFocus 이벤트 핸들러
   */
  onFocus?: () => void;

  /**
   * onBlur 이벤트 핸들러
   */
  onBlur?: () => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      date = '20XX. XX. XX.',
      placeholder = '내용을 입력해주세요',
      value,
      type = 'primary',
      focused = false,
      onChange,
      onFocus,
      onBlur,
      className,
    },
    ref
  ) => {
    const [internalFocused, setInternalFocused] = React.useState(focused);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const typeColors = {
      primary: {
        date: 'text-[#0565FF]',
        border: 'border-[#0565FF]',
      },
      secondary: {
        date: 'text-[#03C3FF]',
        border: 'border-[#03C3FF]',
      },
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    const handleFocus = () => {
      setInternalFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setInternalFocused(false);
      onBlur?.();
    };

    const showBorder = focused || internalFocused;

    return (
      <div
        ref={ref}
        onClick={handleContainerClick}
        className={cn(
          'bg-white rounded-[12px]',
          'flex items-center gap-4',
          'px-8 py-6',
          'w-[425px]',
          'box-border',
          'transition-all duration-200',
          'cursor-text',
          showBorder ? `border-[1.5px] border-solid ${typeColors[type].border}` : 'border-[1.5px] border-transparent',
          !showBorder && 'hover:border-gray-200',
          className
        )}
      >
        {/* 날짜 표시 */}
        <p
          className={cn(
            'shrink-0 w-[108px]',
            'text-[18px] font-medium leading-[1.3] tracking-[-0.45px]',
            typeColors[type].date,
            'whitespace-pre-wrap'
          )}
        >
          {date}
        </p>

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'flex-1 min-w-0',
            'text-[18px] font-medium leading-[1.3] tracking-[-0.45px]',
            'text-black placeholder:text-gray-400',
            'bg-transparent',
            'border-none outline-none',
            'overflow-ellipsis overflow-hidden whitespace-nowrap'
          )}
        />
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
