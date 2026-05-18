'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface InfoCardProps {
  icon?: React.ReactNode;
  title?: string;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title = '제목은 여기에',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[10px]',
        'border-[1.5px] border-[#E0E0E0]',
        'flex items-center gap-3',
        'px-6 py-4',
        className
      )}
    >
      {/* 아이콘 */}
      {icon && (
        <div className="flex-shrink-0 w-6 h-6 text-[#0565FF]">
          {icon}
        </div>
      )}

      {/* 제목 */}
      <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#212121]">
        {title}
      </p>
    </div>
  );
};

// Shield Icon Component (default icon for InfoCard)
export const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L4 6V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V6L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
