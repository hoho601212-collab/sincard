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
    "신카 머니존몰 상품권 구매, 결제, 계정 관련 자주 묻는 질문과 답변을 확인하세요.",
  keywords: [
    "신카 머니존 FAQ",
    "상품권 구매 질문",
    "상품권 결제 방법",
    "상품권 환불",
    "상품권 문의",
    "신카 머니존 고객센터",
  ],
  openGraph: {
    title: "자주 묻는 질문 | 신카 머니존몰",
    description:
      "신카 머니존몰 상품권 구매, 결제, 계정 관련 자주 묻는 질문과 답변을 확인하세요.",
    url: "/faq",
    siteName: "신카 머니존몰",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "자주 묻는 질문 | 신카 머니존몰",
    description:
      "신카 머니존몰 상품권 구매, 결제, 계정 관련 자주 묻는 질문과 답변을 확인하세요.",
  },
};

export const revalidate = 60;

export default async function FaqPage() {
  const faqsResult = await client.fetch<FAQ[] | null>(faqsAllQuery);
  const faqs = faqsResult ?? [];

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

  const faqSchemaItems = faqs.map((faq) => {
    const answerBlocks = faq.answer ?? [];

    const answerText = answerBlocks
      .map((block) => {
        if (block?._type === "block" && "children" in block) {
          return (block.children as Array<{ text?: string }>)
            .map((child) => child.text ?? "")
            .join("");
        }

        return "";
      })
      .join("\n");

    return {
      question: faq.question ?? "",
      answer: answerText,
    };
  });

  return (
    <>
      {faqs.length > 0 && <FAQJsonLd items={faqSchemaItems} />}

      <div className="min-h-screen bg-white">
        <MainHeader />

        <main className="px-4 py-8 md:px-8 md:py-12 lg:px-[120px] lg:py-16 xl:px-[200px]">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 md:mb-12">
              <Link
                href="/"
                className="mb-4 inline-flex items-center text-[14px] font-medium text-[#0565FF] hover:underline md:mb-6 md:text-[16px]"
              >
                ← 홈으로
              </Link>

              <div className="mb-6 text-center md:mb-10">
                <p className="mb-1 text-[14px] font-medium text-[#03C3FF] md:mb-2 md:text-[18px]">
                  FAQ
                </p>

                <h1 className="text-[24px] font-bold text-[#212121] md:text-[32px] lg:text-[40px]">
                  자주 묻는 질문
                </h1>
              </div>
            </div>

            {faqs.length > 0 ? (
              <div className="space-y-6 md:space-y-10 lg:space-y-12">
                {Object.entries(grouped).map(([category, items]) => (
                  <section key={category}>
                    <h2 className="mb-3 border-b-2 border-[#03C3FF] pb-2 text-[18px] font-semibold text-[#212121] md:mb-5 md:pb-3 md:text-[22px] lg:text-[24px]">
                      {categoryNames[category] || category}
                    </h2>

                    <ul className="space-y-2 md:space-y-3">
                      {items.map((faq) => (
                        <li key={faq._id}>
                          <Link
                            href={`/faq/${faq.slug?.current || faq._id}`}
                            className="flex items-start gap-3 rounded-[10px] border border-[#E0E0E0] p-4 transition-all hover:border-[#03C3FF] hover:bg-[#FAFAFA] md:p-5 lg:p-6"
                          >
                            <span className="flex-shrink-0 text-[14px] font-semibold text-[#03C3FF] md:text-[16px]">
                              Q.
                            </span>

                            <span className="text-[14px] font-medium leading-relaxed text-[#212121] md:text-[16px] lg:text-[18px]">
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
              <div className="py-12 text-center md:py-16 lg:py-20">
                <p className="text-[14px] text-[#9E9E9E] md:text-[16px] lg:text-[18px]">
                  등록된 FAQ가 없습니다.
                </p>
              </div>
            )}
          </div>
        </main>

        <MainFooter />
      </div>
    </>
  );
}
