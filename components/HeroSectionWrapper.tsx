"use client";

import { HeroSection } from "@/components/design-system";

export function HeroSectionWrapper() {
  return (
    <HeroSection
      title={["신용카드 현금화, 안전한 방법부터 수수료 비교"]}
      subtitle="구매 즉시 발급, 24시간 상품권 구매부터 상품권 현금화까지"
      buttonText="문의 하기"
      onButtonClick={() => {
        const element = document.querySelector("#products");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }}
      imageSrc="/gift_card.png"
    />
  );
}
