'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export type IconType =
  | 'down'
  | 'up'
  | 'left'
  | 'right'
  | 'check'
  | 'plus'
  | 'minus'
  | 'close';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * 아이콘 타입
   */
  icon: IconType;

  /**
   * 아이콘 크기
   * @default 24
   */
  size?: number;

  /**
   * 아이콘 색상
   * @default "currentColor"
   */
  color?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon, size = 24, color = 'currentColor', className, ...props }, ref) => {
    const renderIcon = () => {
      switch (icon) {
        case 'down':
          return (
            <path
              d="M6 9L12 15L18 9"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );

        case 'up':
          return (
            <path
              d="M6 15L12 9L18 15"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );

        case 'left':
          return (
            <path
              d="M15 6L9 12L15 18"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );

        case 'right':
          return (
            <path
              d="M9 6L15 12L9 18"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );

        case 'check':
          return (
            <path
              d="M4 12L9 17L20 6"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );

        case 'plus':
          return (
            <>
              <path
                d="M12 5V19"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          );

        case 'minus':
          return (
            <path
              d="M5 12H19"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );

        case 'close':
          return (
            <>
              <path
                d="M6 6L18 18"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 18L18 6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          );

        default:
          return null;
      }
    };

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block', className)}
        {...props}
      >
        {renderIcon()}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
