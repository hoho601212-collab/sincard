import { Suspense } from "react";
import Image from "next/image";
import { HeroSectionWrapper } from "@/components/HeroSectionWrapper";
import { FloatingNav } from "@/components/FloatingNav";
import { MainHeader, MainFooter } from "@/components/layout";
import { NoticeSection } from "@/components/NoticeSection";
import { FAQSection } from "@/components/FAQSection";
import { PopularProductsSection } from "@/components/PopularProductsSection";
import { AllProductsSection } from "@/components/AllProductsSection";
import { NoticePopup } from "@/components/NoticePopup";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <NoticePopup />
      <MainHeader />
      <FloatingNav />

      <section
        id="hero"
        className="bg-gradient-to-br from-[#F6F8FC] via-[#EEF4FF] to-[#F8FFFC] px-4 py-8 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-16 lg:py-[73px]"
      >
        <HeroSectionWrapper />
      </section>

      <section className="bg-[#F4F7FB] px-4 pt-10 pb-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:pt-16 md:pb-8 lg:pt-20 lg:pb-10">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-[20px] font-bold text-[#1F2937] md:text-[26px]">
            자주 확인하는 항목
          </h2>
        </div>

        <Suspense
          fallback={
            <div className="flex gap-4 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E5EDF7] rounded-[22px] w-[150px] h-[220px] animate-pulse md:w-[236px] md:h-[280px]"
                />
              ))}
            </div>
          }
        >
          <PopularProductsSection />
        </Suspense>
      </section>

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

      <section
        id="safety"
        className="bg-[#F4F7FB] px-4 py-10 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-16 lg:py-20"
      >
        <h2 className="text-[22px] font-bold text-[#1F2937] mb-6 md:text-[30px] lg:text-[34px] md:mb-8 lg:mb-10">
          결제 흐름과 확인 요소 안내
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {[
            {
              src: "/Rectangle 55.png",
              alt: "실시간 이용 안내",
              title: "실시간 이용 안내",
              desc: "이용 과정에서 필요한 확인 절차와 진행 흐름을 시간대와 관계없이 쉽게 살펴볼 수 있습니다.",
            },
            {
              src: "/lock.png",
              alt: "인증 및 확인 절차",
              title: "인증 및 확인 절차",
              desc: "본인확인과 보안 기준을 먼저 이해하면 결제 제한 상황을 더 차분하게 판단할 수 있습니다.",
            },
            {
              src: "/shield.png",
              alt: "상품권 이용 기준",
              title: "상품권 이용 기준",
              desc: "상품권 이용 전 확인해야 할 기본 기준과 발급 흐름을 정보 중심으로 정리했습니다.",
            },
            {
              src: "/card.png",
              alt: "결제 방식 안내",
              title: "결제 방식 안내",
              desc: "카드와 휴대폰 결제 방식의 차이를 비교하고, 이용 전 확인할 항목을 안내합니다.",
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

      <section
        id="notice"
        className="bg-[#F4F7FB] px-4 py-10 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-16 lg:py-20"
      >
        <h2 className="text-[20px] font-bold text-[#1F2937] mb-4 md:text-[26px] md:mb-6">
          공지사항 및 FAQ
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
                    공지사항
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
