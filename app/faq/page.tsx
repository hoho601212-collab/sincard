import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { faqsAllQuery } from "@/sanity/lib/queries";
import { MainHeader, MainFooter } from "@/components/layout";
import { FAQJsonLd } from "@/components/seo";
import type { FAQ } from "@/sanity/types";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "핀토스몰 상품권 구매, 결제, 계정 관련 자주 묻는 질문과 답변을 확인하세요. 상품권 소액결제, 카드결제, 휴대폰 결제 등 궁금하신 내용을 빠르게 찾아보실 수 있습니다.",
  keywords: [
    "핀토스 FAQ",
    "상품권 구매 질문",
    "상품권 결제 방법",
    "상품권 환불",
    "상품권 문의",
    "핀토스 고객센터",
  ],
  openGraph: {
    title: "자주 묻는 질문 | 핀토스몰",
    description:
      "핀토스몰 상품권 구매, 결제, 계정 관련 자주 묻는 질문과 답변을 확인하세요.",
    url: "/faq",
    siteName: "핀토스몰",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "자주 묻는 질문 | 핀토스몰",
    description:
      "핀토스몰 상품권 구매, 결제, 계정 관련 자주 묻는 질문과 답변을 확인하세요.",
  },
};

export const revalidate = 60;

export default async function FaqPage() {
  const faqs = await client.fetch<FAQ[]>(faqsAllQuery);

  // 카테고리별 그룹핑
  const grouped = faqs.reduce(
    (acc: Record<string, FAQ[]>, faq: FAQ) => {
      const category = faq.category || "etc";
      if (!acc[category]) acc[category] = [];
      acc[category].push(faq);
      return acc;
    },
    {} as Record<string, FAQ[]>
  );

  const categoryNames: Record<string, string> = {
    course: "수강 관련",
    payment: "결제 관련",
    account: "계정 관련",
    etc: "기타",
  };

  // FAQ 스키마를 위한 데이터 변환
  const faqSchemaItems = faqs.map((faq) => {
    const answerText = faq.answer
      .map((block) => {
        if (block._type === 'block' && 'children' in block) {
          return (block.children as Array<{ text: string }>).map((child) => child.text).join('');
        }
        return '';
      })
      .join('\n');

    return {
      question: faq.question,
      answer: answerText,
    };
  });

  return (
    <>
      {/* FAQ Schema */}
      {faqs.length > 0 && <FAQJsonLd items={faqSchemaItems} />}

      <div className="min-h-screen bg-white">
        {/* Header */}
        <MainHeader />

      {/* Main Content - Mobile First */}
      <main className="px-4 py-8 md:px-8 md:py-12 lg:px-[120px] lg:py-16 xl:px-[200px]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-12">
            <Link
              href="/"
              className="inline-flex items-center text-[#0565FF] hover:underline mb-4 md:mb-6 text-[14px] md:text-[16px] font-medium"
            >
              ← 홈으로
            </Link>
            <div className="text-center mb-6 md:mb-10">
              <p className="text-[14px] md:text-[18px] font-medium text-[#03C3FF] mb-1 md:mb-2">
                FAQ
              </p>
              <h1 className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-[#212121]">
                자주 묻는 질문
              </h1>
            </div>
          </div>

          {faqs.length > 0 ? (
            <div className="space-y-6 md:space-y-10 lg:space-y-12">
              {Object.entries(grouped).map(([category, items]: [string, FAQ[]]) => (
                <section key={category}>
                  <h2 className="text-[18px] md:text-[22px] lg:text-[24px] font-semibold mb-3 md:mb-5 text-[#212121] pb-2 md:pb-3 border-b-2 border-[#03C3FF]">
                    {categoryNames[category] || category}
                  </h2>
                  <ul className="space-y-2 md:space-y-3">
                    {items.map((faq) => (
                      <li key={faq._id}>
                        <Link
                          href={`/faq/${faq.slug?.current || faq._id}`}
                          className="flex items-start gap-3 p-4 md:p-5 lg:p-6 border border-[#E0E0E0] rounded-[10px] hover:bg-[#FAFAFA] hover:border-[#03C3FF] transition-all"
                        >
                          <span className="text-[#03C3FF] font-semibold text-[14px] md:text-[16px] flex-shrink-0">
                            Q.
                          </span>
                          <span className="font-medium text-[#212121] text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed">
                            {faq.question}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 lg:py-20">
              <p className="text-[#9E9E9E] text-[14px] md:text-[16px] lg:text-[18px]">
                등록된 FAQ가 없습니다.
              </p>
            </div>
          )}
        </div>
      </main>

        {/* Footer */}
        <MainFooter />
      </div>
    </>
  );
}
