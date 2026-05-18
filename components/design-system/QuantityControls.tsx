'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface QuantityControlsProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const QuantityControls: React.FC<QuantityControlsProps> = ({
  value = 10,
  onChange,
  min = 10,
  max = 1000,
  step = 10,
  className,
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange?.(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange?.(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    onChange?.(Math.max(min, Math.min(max, newValue)));
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        className
      )}
    >
      {/* -10 버튼 */}
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className={cn(
          'bg-white rounded-[10px]',
          'border-[1.5px] border-[#E0E0E0]',
          'px-6 py-4',
          'text-[18px] font-semibold leading-[1.3] tracking-[-0.45px]',
          'text-[#212121]',
          'hover:border-[#0565FF] hover:bg-[#F5F5F5] transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#E0E0E0] disabled:hover:bg-white'
        )}
      >
        -10
      </button>

      {/* 수량 입력 */}
      <div className="bg-white rounded-[10px] border-[1.5px] border-[#E0E0E0] px-6 py-4 min-w-[120px] flex items-center justify-center">
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full text-center',
            'text-[24px] font-semibold leading-[1.3] tracking-[-0.6px]',
            'text-[#212121]',
            'bg-transparent',
            'outline-none',
            'appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            '[&::-webkit-outer-spin-button]:appearance-none'
          )}
        />
      </div>

      {/* +10 버튼 */}
      <button
        onClick={handleIncrease}
        disabled={value >= max}
        className={cn(
          'bg-white rounded-[10px]',
          'border-[1.5px] border-[#E0E0E0]',
          'px-6 py-4',
          'text-[18px] font-semibold leading-[1.3] tracking-[-0.45px]',
          'text-[#212121]',
          'hover:border-[#0565FF] hover:bg-[#F5F5F5] transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#E0E0E0] disabled:hover:bg-white'
        )}
      >
        +10
      </button>
    </div>
  );
};
