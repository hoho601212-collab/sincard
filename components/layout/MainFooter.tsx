import Link from "next/link";

export function MainFooter() {
  return (
    <footer className="mt-20 border-t border-[#DCE6F2] bg-[#EEF3F9] px-4 py-10 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-14">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">

        {/* 상단 */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          {/* 로고 + 설명 */}
          <div className="max-w-[720px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#0F172A] text-white shadow-sm">
                <span className="text-[18px] font-black">P</span>
              </div>

              <div>
                <p className="text-[20px] font-black tracking-[-0.5px] text-[#0F172A]">
                  PINTOSS GUIDE
                </p>
                <p className="text-[12px] text-[#64748B]">
                  Information & Support Center
                </p>
              </div>
            </div>

            <p className="mt-5 text-[14px] leading-[1.9] text-[#475569] md:text-[15px]">
              pintoss.co.kr은 디지털 상품 이용 흐름과 결제 관련 기준을 정리한
              안내 페이지입니다. 이용 전 확인 요소와 자주 묻는 상황을 정보 중심으로
              제공합니다.
            </p>
          </div>

          {/* 고객지원 */}
          <div className="rounded-[24px] border border-[#D6E3F1] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <p className="text-[13px] font-bold uppercase tracking-[1px] text-[#64748B]">
              Support Center
            </p>

            <p className="mt-3 text-[28px] font-black tracking-[-1px] text-[#0F172A]">
              010-9300-4202
            </p>

            <p className="mt-2 text-[13px] leading-[1.7] text-[#64748B]">
              운영시간 10:00 - 18:00
              <br />
              주말 및 공휴일 제외
            </p>
          </div>
        </div>

        {/* 정보 카드 */}
        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-[22px] border border-[#DCE6F2] bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,0.03)]">
            <p className="mb-4 text-[15px] font-black text-[#0F172A]">
              운영 정보
            </p>

            <ul className="space-y-3 text-[13px] leading-[1.7] text-[#475569] md:text-[14px]">
              <li>상호명 : 핀토스 가이드</li>
              <li>대표자 : 조문국</li>
              <li>사업자등록번호 : 590-95-01527</li>
              <li>통신판매업 신고번호 : 2024-부산진-1016</li>
            </ul>
          </div>

          <div className="rounded-[22px] border border-[#DCE6F2] bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,0.03)]">
            <p className="mb-4 text-[15px] font-black text-[#0F172A]">
              문의 및 안내
            </p>

            <ul className="space-y-3 text-[13px] leading-[1.7] text-[#475569] md:text-[14px]">
              <li>이메일 : admin@pintoss.co.kr</li>
              <li>문의 담당 : 운영지원팀</li>
              <li>연락처 : 010-9300-4202</li>
              <li>운영 문의 : admin@pintoss.co.kr</li>
            </ul>
          </div>

          <div className="rounded-[22px] border border-[#DCE6F2] bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,0.03)]">
            <p className="mb-4 text-[15px] font-black text-[#0F172A]">
              이용 안내
            </p>

            <p className="text-[13px] leading-[1.9] text-[#475569] md:text-[14px]">
              본 페이지는 결제 흐름과 상품권 이용 구조를 설명하기 위한 안내 목적의
              정보 페이지입니다. 실제 서비스 이용 환경에 따라 절차와 제한 사항은
              달라질 수 있습니다.
            </p>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="flex flex-col gap-5 border-t border-[#DCE6F2] pt-6 md:flex-row md:items-center md:justify-between">

          <p className="max-w-[760px] text-[12px] leading-[1.8] text-[#64748B] md:text-[13px]">
            사이트 내 안내 내용은 이용 흐름과 정보 제공을 목적으로 작성되었습니다.
            결제 환경 및 운영 정책에 따라 일부 이용 조건은 변경될 수 있습니다.
          </p>

          <div className="flex flex-wrap items-center gap-5 text-[13px] font-medium text-[#475569]">
            <Link
              href="/privacy"
              className="transition hover:text-[#0F172A]"
            >
              개인정보 처리방침
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#0F172A]"
            >
              이용약관
            </Link>

            <Link
              href="/faq"
              className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-[#0F172A] transition hover:border-[#0F172A]"
            >
              자주 묻는 질문
            </Link>
          </div>
        </div>

        {/* 맨 아래 */}
        <div className="flex flex-col gap-4 border-t border-[#DCE6F2] pt-5 md:flex-row md:items-center md:justify-between">

          <p className="text-[11px] tracking-[0.2px] text-[#94A3B8] md:text-[12px]">
            Copyright © 2026 PINTOSS GUIDE. All rights reserved.
          </p>

          <div className="flex items-center gap-3 rounded-full border border-[#DCE6F2] bg-white px-4 py-2 shadow-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
            <p className="text-[12px] font-semibold text-[#475569]">
              Information Guide System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
