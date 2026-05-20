import { Suspense } from "react";
import Image from "next/image";
import { HeroSectionWrapper } from "@/components/HeroSectionWrapper";
import { FloatingNav } from "@/components/FloatingNav";
import { MainHeader, MainFooter } from "@/components/layout";
import { NoticeSection } from "@/components/NoticeSection";
import { FAQSection } from "@/components/FAQSection";
import { AllProductsSection } from "@/components/AllProductsSection";
import { NoticePopup } from "@/components/NoticePopup";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
    
      <MainHeader />
      <FloatingNav />

      {/* 히어로 */}
      <section
        id="hero"
        className="bg-gradient-to-br from-[#F6F8FC] via-[#EEF4FF] to-[#F8FFFC] px-4 py-8 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-16 lg:py-[73px]"
      >
        <HeroSectionWrapper />
      </section>

      {/* 신용카드 현금화 핵심 가이드 */}
      <section
        id="products"
        className="bg-[#F4F7FB] px-4 py-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-10 lg:py-12"
      >
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E5EDF7] rounded-[22px] h-[150px] animate-pulse md:h-[180px] lg:h-[200px]"
                />
              ))}
            </div>
          }
        >
          <AllProductsSection />
        </Suspense>
      </section>

      {/* 실전 체크리스트 */}
      <section
        id="safety"
        className="bg-[#F4F7FB] px-4 py-10 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-16 lg:py-20"
      >
        <h2 className="text-[22px] font-bold text-[#1F2937] mb-6 md:text-[30px] lg:text-[34px] md:mb-8 lg:mb-10">
          안전하게 활용하려면(실전 체크리스트)
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {[
            {
              src: "/icon1.png",
              alt: "합법 루트만",
              title: "합법 루트만",
              desc: "실물 거래 증빙이 남는 방식, 카드사 공식 서비스만 이용",
            },
            {
              src: "/icon2.png",
              alt: "정확한 비용 계산",
              title: "정확한 비용 계산",
              desc: "실수령액과 총상환액(수수료·이자 포함)을 정확하게 계산 후 이용",
            },
            {
              src: "/icon3.png",
              alt: "상환 가능성",
              title: "상환 가능성",
              desc: "급여일·현금 유입일 기준으로 결제일 역산 후 판단",
            },
            {
              src: "/icon4.png",
              alt: "거래 빈도 조절",
              title: "거래 빈도 조절",
              desc: "동일 업종·고액 반복 결제는 피하고 최소 횟수로 이용",
            },
            {
              src: "/icon5.png",
              alt: "증빙 보관",
              title: "증빙 보관",
              desc: "영수증·거래내역·정산 화면 캡처를 보관",
            },
            {
              src: "/icon6.png",
              alt: "이용전 대안 비교",
              title: "이용전 대안 비교",
              desc: "비상금대출·분할납부 등 대안도 함께 비교 검토",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E5EDF7] shadow-[0_8px_24px_rgba(15,23,42,0.04)] rounded-[22px] p-4 flex flex-col items-center text-center md:p-6"
            >
              <div className="relative w-[80px] h-[80px] mb-3 md:w-[140px] md:h-[140px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>

              <p className="text-[14px] font-bold text-[#1F2937] mb-1 md:text-[20px] md:mb-2">
                {item.title}
              </p>

              <p className="text-[11px] text-[#667085] leading-[1.55] md:text-[15px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 정보공유 FAQ */}
      <section
        id="notice"
        className="bg-[#F4F7FB] px-4 py-10 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-16 lg:py-20"
      >
        <h2 className="text-[20px] font-bold text-[#1F2937] mb-4 md:text-[26px] md:mb-6">
          정보공유 및 FAQ
        </h2>

        <div
          className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8"
          id="faq"
        >
          <Suspense
            fallback={
              <div className="bg-white border border-[#D9E3F0] rounded-[22px] p-5 md:p-10 animate-pulse">
                <div className="text-center mb-4 md:mb-8">
                  <p className="text-[14px] font-bold text-[#1F4FD8] mb-1 md:text-[18px] md:mb-2">
                    NOTICE
                  </p>

                  <p className="text-[20px] font-bold text-[#1F2937] md:text-[32px]">
                    정보공유
                  </p>
                </div>

                <div className="space-y-3 md:space-y-6">
                  <div className="bg-[#EEF2F7] rounded-[16px] h-[48px] md:h-[72px]" />
                  <div className="bg-[#EEF2F7] rounded-[16px] h-[48px] md:h-[72px]" />
                </div>
              </div>
            }
          >
            <NoticeSection />
          </Suspense>

          <Suspense
            fallback={
              <div className="bg-white border border-[#D9E3F0] rounded-[22px] p-5 md:p-10 animate-pulse">
                <div className="text-center mb-4 md:mb-8">
                  <p className="text-[14px] font-bold text-[#0F766E] mb-1 md:text-[18px] md:mb-2">
                    FAQ
                  </p>

                  <p className="text-[20px] font-bold text-[#1F2937] md:text-[32px]">
                    자주 묻는 질문
                  </p>
                </div>

                <div className="space-y-3 md:space-y-6">
                  <div className="bg-[#EEF2F7] rounded-[16px] h-[48px] md:h-[72px]" />
                </div>
              </div>
            }
          >
            <FAQSection />
          </Suspense>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
