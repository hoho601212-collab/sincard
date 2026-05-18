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
        { label: "고객센터", href: "/#notice", active: false },
        { label: "회원가입", href: "/signup", active: false },
        { label: "로그인", href: "/login", active: false },
      ];
    }

    if (isAuthenticated) {
      return [
        { label: "고객센터", href: "/#notice", active: false },
        { label: "주문 내역", href: "/order", active: false },
        { label: "마이페이지", href: "/mypage", active: false },
        { label: "로그아웃", onClick: handleLogout, active: false },
      ];
    }

    return [
      { label: "고객센터", href: "/#notice", active: false },
      { label: "회원가입", href: "/signup", active: false },
      { label: "로그인", href: "/login", active: false },
    ];
  };

  return <Header logoSrc="/logo.png" navItems={getNavItems()} />;
}
