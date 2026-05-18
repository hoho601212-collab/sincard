'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export interface FAQCardProps {
  question?: string;
  answer?: string;
  isExpanded?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FAQCard: React.FC<FAQCardProps> = ({
  question = '자주 묻는 질문',
  answer = '답변 내용이 여기에 표시됩니다.',
  isExpanded = false,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[10px]',
        'border-[1.5px]',
        isExpanded ? 'border-[#0565FF]' : 'border-[#E0E0E0]',
        'overflow-hidden',
        'transition-colors',
        className
      )}
    >
      {/* 질문 (클릭 가능) */}
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-between',
          'px-6 py-5',
          'text-left',
          'hover:bg-[#F5F5F5] transition-colors'
        )}
      >
        <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.45px] text-[#212121]">
          {question}
        </p>
        <Icon
          icon={isExpanded ? 'up' : 'down'}
          size={24}
          color="#212121"
          className="flex-shrink-0"
        />
      </button>

      {/* 답변 (확장 시 표시) */}
      {isExpanded && (
        <div className="px-6 pb-5 pt-0">
          <div className="bg-[#F5F5F5] rounded-[10px] px-5 py-4">
            <p className="text-[16px] font-normal leading-[1.5] tracking-[-0.4px] text-[#616161]">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
