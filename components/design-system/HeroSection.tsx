'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import Image from 'next/image';

export interface HeroSectionProps {
  title?: string[];
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = [
    '휴대폰 결제와 신용카드로',
    '다양한 상품권을 간편하게 확인하세요',
  ],
  subtitle =
    '모바일 결제와 카드 결제를 기반으로 컬쳐랜드, 구글기프트카드, 문화상품권 등 다양한 디지털 상품권 이용 흐름을 한눈에 안내합니다.',
  buttonText = '상품권 이용 안내 보기',
  onButtonClick,
  imageSrc = '/hero-image.png',
  imageAlt = '상품권 결제 이용 안내',
  className,
}) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[36px]',
        'bg-gradient-to-br from-[#F8FBFF] via-[#FFFFFF] to-[#EEF7FF]',
        'border border-[#D9E6F5]',
        'shadow-[0_24px_60px_rgba(15,23,42,0.08)]',
        'flex flex-col items-center gap-10',
        'px-6 py-10 sm:px-8 md:px-12 md:py-16',
        'lg:flex-row lg:items-center lg:justify-between lg:gap-20',
        className
      )}
    >
      {/* 배경 효과 */}
      <div className="absolute -top-24 -right-24 h-[260px] w-[260px] rounded-full bg-[#DBEAFE]/60 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-[240px] w-[240px] rounded-full bg-[#D1FAE5]/50 blur-3xl" />

      {/* 텍스트 영역 */}
      <div className="relative z-10 flex w-full flex-col items-center text-center lg:max-w-[560px] lg:items-start lg:text-left">

        <span className="mb-5 inline-flex items-center rounded-full border border-[#BFDBFE] bg-white px-4 py-2 text-[13px] font-bold tracking-[0.3px] text-[#2563EB] shadow-sm">
          PINTOSS PAYMENT GUIDE
        </span>

        <div className="text-[30px] font-black leading-[1.2] tracking-[-1px] text-[#0F172A] sm:text-[38px] md:text-[46px] lg:text-[54px]">
          {title.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        <p className="mt-6 max-w-[620px] text-[15px] font-medium leading-[1.9] text-[#526174] sm:text-[17px] md:text-[19px]">
          {subtitle}
        </p>

        {/* 안내 박스 */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[#D6E4F5] bg-white px-4 py-2 text-[13px] font-semibold text-[#334155] shadow-sm">
            휴대폰 소액결제
          </div>

          <div className="rounded-full border border-[#D6E4F5] bg-white px-4 py-2 text-[13px] font-semibold text-[#334155] shadow-sm">
            신용카드 결제
          </div>

          <div className="rounded-full border border-[#D6E4F5] bg-white px-4 py-2 text-[13px] font-semibold text-[#334155] shadow-sm">
            상품권 실시간 발급
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-9 flex w-full justify-center lg:justify-start">
          <button
            type="button"
            onClick={onButtonClick}
            className={cn(
              'rounded-[18px]',
              'bg-[#111827] px-8 py-4',
              'text-[15px] font-bold tracking-[-0.3px] text-white',
              'shadow-[0_14px_30px_rgba(15,23,42,0.18)]',
              'transition-all duration-200',
              'hover:-translate-y-0.5 hover:bg-[#2563EB] hover:shadow-[0_18px_36px_rgba(37,99,235,0.24)]',
              'active:translate-y-0'
            )}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="relative z-10 w-full max-w-[320px] sm:max-w-[380px] md:max-w-[450px] lg:w-[480px] lg:max-w-none">
        <div className="relative h-[250px] w-full sm:h-[320px] md:h-[360px] lg:h-[420px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain drop-shadow-[0_30px_40px_rgba(15,23,42,0.16)]"
            priority
          />
        </div>

        {/* 하단 플로팅 카드 */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-[18px] border border-[#E2E8F0] bg-white/95 px-5 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="h-3 w-3 rounded-full bg-[#22C55E]" />

          <p className="text-[13px] font-semibold text-[#334155]">
            모바일 상품권 이용 흐름 안내중
          </p>
        </div>
      </div>
    </section>
  );
};
