"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const POPUP_COOKIE_NAME = "notice_popup_hidden";
const POPUP_EXPIRY_HOURS = 24;

export function NoticePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 쿠키 확인 (하루에 한번만 표시)
    const shouldHide = getCookie(POPUP_COOKIE_NAME);
    if (!shouldHide) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCloseForToday = () => {
    setIsVisible(false);
    // 24시간 동안 팝업 숨기기
    setCookie(POPUP_COOKIE_NAME, "true", POPUP_EXPIRY_HOURS);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 오버레이 (모바일에서만) */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={handleClose}
      />

      {/* 팝업 */}
      <div
        className="fixed z-50 bg-white rounded-[10px] shadow-2xl overflow-hidden
          left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px]
          md:left-[10px] md:top-[80px] md:translate-x-0 md:translate-y-0 md:w-[450px] md:max-w-none"
        style={{
          height: "auto",
          maxHeight: "90vh",
        }}
      >
        {/* 팝업 내용 */}
        <div className="relative w-full">
          {/* 팝업 내용 */}
          <div className="bg-gradient-to-b from-[#E8F4FF] to-white p-6 md:p-8">
            {/* 핀토스 로고 */}
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="pintoss"
                width={142}
                height={40}
                className="w-[100px] h-[28px] md:w-[142px] md:h-[40px]"
              />
            </div>

            {/* 제목 */}
            <h2 className="text-center text-[18px] md:text-[22px] font-semibold text-[#212121] mb-2">
              KT 해킹사건 이후
            </h2>
            <p className="text-center text-[15px] md:text-[18px] font-semibold mb-1">
              <span style={{ color: "#FF1493" }}>
                각 통신사 정책이 변경
              </span>
              되었습니다
            </p>
            <p
              className="text-center text-[15px] md:text-[18px] font-semibold mb-1"
              style={{ color: "#FF1493" }}
            >
              자세한 내용은
            </p>
            <p
              className="text-center text-[15px] md:text-[18px] font-semibold mb-6"
              style={{ color: "#FF1493" }}
            >
              홈페이지 공지사항 참고 바랍니다
            </p>

            {/* 통신사 정책 내용 */}
            <div className="space-y-3 text-[14px] md:text-[17px] text-center">
              <div>
                <p className="font-semibold" style={{ color: "#FF0000" }}>
                  KT - LGT <br />
                  상품권 결제한도 10만원/월
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold" style={{ color: "#0565FF" }}>
                  SKT <br />
                  기존 구매내역 있는 사용자 50만원/월
                </p>
                <p className="font-semibold" style={{ color: "#0565FF" }}>
                  최초 구매자 10만/월
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#212121]">
                  다날 휴대폰 결제는 LGU 이용자만 이용가능 (월10만원)
                </p>
              </div>

              <p className="text-[#424242] font-semibold pt-2">
                구매에 참고바랍니다.
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex border-t border-[#E0E0E0]">
            <button
              onClick={handleCloseForToday}
              className="flex-1 py-3 md:py-4 text-[15px] md:text-[18px] font-semibold text-[#616161] hover:bg-[#F5F5F5] transition-colors border-r border-[#E0E0E0]"
            >
              오늘 다시 보지 않기
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-3 md:py-4 text-[15px] md:text-[18px] font-semibold text-[#212121] hover:bg-[#F5F5F5] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 쿠키 유틸리티 함수
function setCookie(name: string, value: string, hours: number) {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}
