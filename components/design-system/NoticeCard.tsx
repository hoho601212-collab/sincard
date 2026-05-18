'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface NoticeCardProps {
  title?: string;
  date?: string;
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  title = '공지사항 제목',
  date = '2024.01.01',
  isNew = false,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-[10px]',
        'border-[1.5px] border-[#E0E0E0]',
        'flex items-center justify-between',
        'px-6 py-5',
        'cursor-pointer',
        'hover:border-[#0565FF] transition-colors',
        className
      )}
    >
      {/* 왼쪽: 제목 + NEW 뱃지 */}
      <div className="flex items-center gap-3">
        {isNew && (
          <span className="bg-[#0565FF] text-white text-[14px] font-semibold px-2 py-1 rounded-[5px]">
            NEW
          </span>
        )}
        <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#212121]">
          {title}
        </p>
      </div>

      {/* 오른쪽: 날짜 */}
      <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.4px] text-[#9E9E9E]">
        {date}
      </p>
    </div>
  );
};
