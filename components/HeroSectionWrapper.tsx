"use client";

import { HeroSection } from "@/components/design-system";

export function HeroSectionWrapper() {
  return (
    <HeroSection
      title={["휴대폰 소액결제,신용카드 결제", "클릭 한번으로 손쉽게 구매가능"]}
      subtitle="구매 즉시 발급, 24시간 상품권 구매부터 상품권 현금화까지"
      buttonText="바로 구매하기"
      onButtonClick={() => {
        const element = document.querySelector("#products");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }}
      imageSrc="/Group 14.png"
    />
  );
}
