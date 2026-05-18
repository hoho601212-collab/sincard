export interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`px-4 py-6 bg-neutral-50 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-10 lg:py-12 ${className}`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end md:gap-8">
        {/* 좌측 */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="w-[100px] h-8 md:w-[142px] md:h-10">
            <img
              src="/logo.png"
              alt="핀토스"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 text-[11px] text-[#424242] leading-[1.5] md:gap-4 md:text-[16px]">
            <p>
              상호: 핀토스 l 주소: (47190) 부산광역시 부산진구 당감로17, 7동
              906호(당감동) l 대표 조문국
            </p>
            <p>
              사업자등록번호: 590-95-01527 l 통신판매번호 2024-부산진-1016 l
              Email : admin@pin-toss.com
            </p>
            <p className="hidden md:block">
              고객센터 주소 : 부산광역시 부산진구 당감로17, 7동 906호(당감동) l
              핀토스 고객센터 Tel: 010-9300-4202
            </p>
            <p className="hidden md:block">
              민원담당자: 조문국 l 연락처: 010-9300-4202
            </p>
          
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <button className="bg-[#0565FF] text-white px-4 py-2.5 rounded-[10px] text-[12px] font-semibold md:px-8 md:py-3 md:text-[18px]">
              대량구매/제휴문의 : admin@pin-toss.com
            </button>
            <div className="bg-[#FFFADA] flex items-center gap-2 px-4 py-2.5 rounded-[10px] md:gap-3 md:px-6 md:py-3">
              <img
                src="/kakao-logo.png"
                alt="카카오톡"
                className="w-5 h-5 md:w-[22px] md:h-[22px]"
              />
              <p className="text-[12px] font-medium text-[#3E2723] md:text-[18px]">
                카카오톡 m4202
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-[#BDBDBD] md:text-[16px]">
            Copyright © 핀토스 All rights reserved.
          </p>
        </div>

        {/* 우측 */}
        <div className="flex flex-col gap-4 md:gap-8 md:items-end">
          {/* 고객센터 */}
          <div className="flex flex-col gap-2 md:gap-3 md:items-end">
            <p className="text-[14px] font-semibold text-[#212121] md:text-[20px]">
              고객센터
            </p>
            <div className="flex flex-col md:items-end">
              <p className="text-[20px] font-bold text-[#0565FF] leading-[1.3] md:text-[32px]">
                1544-4202
              </p>
              <p className="text-[14px] font-medium text-[#757575] leading-[1.3] md:text-[20px]">
                10:00 - 18:00
              </p>
            </div>
            <div className="flex gap-4 text-[11px] text-[#757575] md:gap-6 md:text-[16px]">
              <button onClick={() => window.open('/privacy', '_blank')} className="hover:text-[#0565FF] transition-colors">개인정보 처리방침</button>
              <button onClick={() => window.open('/terms', '_blank')} className="hover:text-[#0565FF] transition-colors">이용약관</button>
            </div>
          </div>

          {/* 상품권 판매하기 링크 */}
          <a
            href="https://www.ksdl.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold text-[#0565FF] underline md:text-[16px]"
          >
            상품권 판매하기
          </a>

          {/* 결제보안 배너 */}
          <div className="mt-2 md:mt-0">
            <img
              src="/protect-banner.png"
              alt="결제보안 인증"
              className="h-[30px] w-auto md:h-[43px]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
