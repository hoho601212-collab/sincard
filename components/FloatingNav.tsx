"use client";

import { useAuth } from "@/components/auth";
import { useRouter } from "next/navigation";

// 결제내역 아이콘
function IconCard() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect
        x="4"
        y="8"
        width="24"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line x1="4" y1="14" x2="28" y2="14" stroke="#0565FF" strokeWidth="2" />
    </svg>
  );
}

// 공지사항 아이콘
function IconNotice() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M6 8h20v16H6V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="14" r="2" fill="#0565FF" />
      <line
        x1="10"
        y1="14"
        x2="22"
        y2="14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="10"
        y1="18"
        x2="18"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

// FAQ 아이콘
function IconFaq() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      <circle cx="21" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 전체 상품 아이콘
function IconMenu() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect
        x="6"
        y="6"
        width="8"
        height="8"
        rx="1"
        fill="#0565FF"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="18"
        y="6"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="6"
        y="18"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="18"
        y="18"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

// TOP 아이콘
function IconTop() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M8 12L16 6L24 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8V26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}

function NavItem({ icon, label, onClick, href }: NavItemProps) {
  const handleClick = () => {
    if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 w-full text-black hover:text-[#0565FF] transition-colors"
    >
      <div className="w-8 h-8">{icon}</div>
      <span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.35px]">
        {label}
      </span>
    </button>
  );
}

export function FloatingNav() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderClick = () => {
    if (isAuthenticated) {
      router.push("/order");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden 2xl:flex">
      <div className="bg-white border-l-[1.5px] border-t-[1.5px] border-b-[1.5px] border-[#EEEEEE] rounded-l-[10px] px-4 py-6 flex flex-col gap-6 items-center shadow-lg">
        {/* 섹션 순서대로 정렬 */}
        <NavItem icon={<IconMenu />} label="전체 상품" href="#products" />

        <NavItem icon={<IconNotice />} label="공지사항" href="#notice" />
        <NavItem icon={<IconFaq />} label="FAQ" href="#faq" />
        <NavItem
          icon={<IconCard />}
          label="결제내역"
          onClick={handleOrderClick}
        />

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-[#EEEEEE]" />

        <NavItem icon={<IconTop />} label="TOP" onClick={scrollToTop} />
      </div>
    </div>
  );
}
