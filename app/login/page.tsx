"use client";

import { useEffect } from "react";

const MAIN_SITE = "https://www.pin-toss.com";

export default function LoginPage() {
  useEffect(() => {
    window.location.replace(`${MAIN_SITE}/login`);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <p className="text-[18px] font-semibold text-[#212121] mb-2">
          로그인 페이지로 이동 중입니다
        </p>
        <p className="text-[14px] text-[#757575]">
          잠시 후 pin-toss.com 로그인 화면으로 이동합니다.
        </p>
      </div>
    </div>
  );
}
