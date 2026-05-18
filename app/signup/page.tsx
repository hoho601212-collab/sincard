"use client";

import { useEffect } from "react";

const MAIN_SITE = "https://www.pin-toss.com";

export default function SignupPage() {
  useEffect(() => {
    window.location.replace(`${MAIN_SITE}/signup`);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <p className="text-[18px] font-semibold text-[#212121] mb-2">
          회원가입 페이지로 이동 중입니다
        </p>
        <p className="text-[14px] text-[#757575]">
          잠시 후 pin-toss.com 회원가입 화면으로 이동합니다.
        </p>
      </div>
    </div>
  );
}
