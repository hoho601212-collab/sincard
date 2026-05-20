"use client";

import { toast } from "sonner";
import { Header } from "@/components/design-system";
import { useAuth } from "@/components/auth";

export function MainHeader() {
  const { isAuthenticated, isHydrated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다.");
    window.location.href = "/";
  };

  const getNavItems = () => {
    if (!isHydrated) {
      return [
         { label: '고객센터', href: '/#notice', active: false },
    { label: '회사소개', href: '/about', active: false },
    { label: '정보공유', href: '/faq', active: false },
    { label: '자주 묻는 질문', href: '/notice', active: false },
      ];
    }

    if (isAuthenticated) {
      return [
         { label: '고객센터', href: '/#notice', active: false },
    { label: '회사소개', href: '/about', active: false },
    { label: '정보공유', href: '/faq', active: false },
    { label: '자주 묻는 질문', href: '/notice', active: false },
      ];
    }

    return [
       { label: '고객센터', href: '/#notice', active: false },
    { label: '회사소개', href: '/about', active: false },
    { label: '정보공유', href: '/faq', active: false },
    { label: '자주 묻는 질문', href: '/notice', active: false },
    ];
  };

  return <Header logoSrc="/신카머니존logo.png" navItems={getNavItems()} />;
}
