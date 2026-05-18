'use client';

import React from 'react';
import { cn } from '@/lib/cn';

// 아이콘 컴포넌트들
const CardIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="4"
      y="8"
      width="24"
      height="16"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="4" y="12" width="24" height="3" fill="#0565FF" />
  </svg>
);

const NoticeIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 6L26 11V21L16 26L6 21V11L16 6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="13" r="3" fill="currentColor" />
  </svg>
);

const FaqIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="16" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="15" r="1.5" fill="currentColor" />
    <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    <circle cx="22" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="16" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="14" r="1.5" fill="currentColor" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" />
    <circle cx="22" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="5"
      y="5"
      width="8"
      height="8"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
      fill="#0565FF"
    />
    <rect
      x="19"
      y="5"
      width="8"
      height="8"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="5"
      y="19"
      width="8"
      height="8"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="19"
      y="19"
      width="8"
      height="8"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const TopIcon = ({ className }: { className?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M8 6L16 6L24 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M8 14L16 6L24 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 26L16 18L24 26"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface SidebarItemProps {
  /**
   * 아이콘 타입
   */
  icon: 'card' | 'notice' | 'faq' | 'message' | 'menu' | 'top';

  /**
   * 라벨 텍스트
   */
  label: string;

  /**
   * 활성화 상태
   */
  active?: boolean;

  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
}) => {
  const IconComponent = {
    card: CardIcon,
    notice: NoticeIcon,
    faq: FaqIcon,
    message: MessageIcon,
    menu: MenuIcon,
    top: TopIcon,
  }[icon];

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 w-full',
        'transition-colors duration-200',
        'hover:opacity-70',
        active && 'text-[#0565FF]'
      )}
    >
      <IconComponent className="w-8 h-8 shrink-0" />
      <span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.35px] text-center">
        {label}
      </span>
    </button>
  );
};

export interface SidebarProps {
  /**
   * 현재 활성화된 메뉴 아이템
   */
  activeItem?: string;

  /**
   * 메뉴 아이템 클릭 핸들러
   */
  onItemClick?: (item: string) => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  className,
}) => {
  const menuItems: Array<{
    icon: SidebarItemProps['icon'];
    label: string;
    key: string;
  }> = [
    { icon: 'card', label: '결제내역', key: 'payment' },
    { icon: 'notice', label: '공지사항', key: 'notice' },
    { icon: 'faq', label: 'FAQ', key: 'faq' },
    { icon: 'message', label: '문의', key: 'inquiry' },
    { icon: 'menu', label: '전체 상품', key: 'products' },
  ];

  return (
    <nav
      className={cn(
        'bg-white',
        'border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-r-0',
        'border-solid border-[#EEEEEE]',
        'rounded-tl-[10px] rounded-bl-[10px]',
        'flex flex-col items-center gap-6',
        'px-4 py-6',
        'box-border',
        className
      )}
    >
      {menuItems.map((item) => (
        <SidebarItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={activeItem === item.key}
          onClick={() => onItemClick?.(item.key)}
        />
      ))}

      {/* 구분선 */}
      <div className="w-full h-[1.5px] bg-[#EEEEEE]" />

      {/* TOP 버튼 */}
      <SidebarItem
        icon="top"
        label="TOP"
        active={activeItem === 'top'}
        onClick={() => {
          onItemClick?.('top');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </nav>
  );
};
