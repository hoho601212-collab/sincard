'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import Image from 'next/image';

export interface HeaderNavItem {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface HeaderProps {
  logoSrc?: string;
  logoHref?: string;
  navItems?: HeaderNavItem[];
  logoWidth?: number;
  logoHeight?: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoSrc = '/logo.png',
  logoHref = '/',
  navItems = [
    { label: '고객센터', href: '/#notice', active: false },
    { label: '회원가입', href: 'https://www.pin-toss.com/signup', active: false },
    { label: '로그인', href: 'https://www.pin-toss.com/login', active: false },
  ],
  logoWidth = 142,
  logoHeight = 40,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavItem = (
    item: HeaderNavItem,
    index: number,
    className: string,
    onClick?: () => void
  ) => {
    if (item.onClick) {
      return (
        <button
          key={index}
          onClick={() => {
            item.onClick?.();
            onClick?.();
          }}
          className={className}
        >
          {item.label}
        </button>
      );
    }

    if (item.href?.startsWith('http')) {
      return (
        <a
          key={index}
          href={item.href}
          onClick={onClick}
          className={className}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={index}
        href={item.href || '#'}
        onClick={onClick}
        className={className}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header
        className={cn(
          'bg-white',
          'w-full',
          'box-border',
          'flex items-center justify-between',
          'py-3 px-4 md:py-4 md:px-8 lg:px-[120px] xl:px-[200px]',
          'sticky top-0 z-50',
          'border-b border-[#EEEEEE]',
          className
        )}
      >
        <Link href={logoHref} className="shrink-0 relative">
          <Image
            src={logoSrc}
            alt="pintoss logo"
            width={logoWidth}
            height={logoHeight}
            className="block w-[100px] h-[28px] md:w-[142px] md:h-[40px]"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-16 shrink-0">
          {navItems.map((item, index) =>
            renderNavItem(
              item,
              index,
              cn(
                'text-[14px] lg:text-[16px] font-medium leading-[1.3] tracking-[-0.4px]',
                'text-center',
                'transition-colors duration-200',
                item.active ? 'text-[#0565FF]' : 'text-[#616161]',
                'hover:text-[#0565FF]'
              )
            )
          )}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="메뉴 열기"
        >
          <span
            className={cn(
              'block w-6 h-0.5 bg-[#424242] transition-all duration-300',
              isMenuOpen && 'rotate-45 translate-y-2'
            )}
          />
          <span
            className={cn(
              'block w-6 h-0.5 bg-[#424242] transition-all duration-300',
              isMenuOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block w-6 h-0.5 bg-[#424242] transition-all duration-300',
              isMenuOpen && '-rotate-45 -translate-y-2'
            )}
          />
        </button>
      </header>

      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-[52px] bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          'md:hidden fixed top-[52px] left-0 right-0 bg-white z-50 border-b border-[#EEEEEE] shadow-lg',
          'transition-all duration-300 ease-in-out',
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <nav className="flex flex-col py-2">
          {navItems.map((item, index) =>
            renderNavItem(
              item,
              index,
              cn(
                'px-6 py-4 text-[16px] font-medium text-left',
                'transition-colors duration-200',
                'active:bg-[#F5F5F5]',
                item.active
                  ? 'text-[#0565FF] bg-[#F5F7FA]'
                  : 'text-[#424242] hover:bg-[#FAFAFA]'
              ),
              () => setIsMenuOpen(false)
            )
          )}
        </nav>
      </div>
    </>
  );
};
