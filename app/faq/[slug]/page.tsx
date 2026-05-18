import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@/sanity/components/PortableText";
import { MainHeader, MainFooter } from "@/components/layout";
import { FAQJsonLd } from "@/components/seo";
import type { FAQ } from "@/sanity/types";

export const revalidate = 60;

// FAQ slug 또는 _id로 조회하는 쿼리
const faqBySlugQuery = `*[_type == "faq" && (slug.current == $slug || _id == $slug)][0]{
  _id,
  question,
  answer,
  category,
  slug,
  _createdAt
}`;

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faq = await client.fetch<FAQ>(faqBySlugQuery, { slug });

  if (!faq) {
    return {
      title: "FAQ를 찾을 수 없습니다",
    };
  }

  const description = `${faq.question} - 핀토스몰 자주 묻는 질문`;

  return {
    title: faq.question,
    description,
    keywords: [
      "핀토스 FAQ",
      faq.question,
      "상품권",
      "핀토스몰",
    ],
    openGraph: {
      title: `${faq.question} | 핀토스몰 FAQ`,
      description,
      url: `/faq/${slug}`,
      siteName: "핀토스몰",
      locale: "ko_KR",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${faq.question} | 핀토스몰 FAQ`,
      description,
    },
  };
}

export default async function FaqDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = await client.fetch<FAQ>(faqBySlugQuery, { slug });

  if (!faq) {
    notFound();
  }

  // PortableText를 일반 텍스트로 변환
  const answerText = faq.answer
    .map((block) => {
      if (block._type === 'block' && 'children' in block) {
        return (block.children as Array<{ text: string }>).map((child) => child.text).join('');
      }
      return '';
    })
    .join('\n');

  return (
    <>
      {/* FAQ Schema */}
      <FAQJsonLd
        items={[
          {
            question: faq.question,
            answer: answerText,
          },
        ]}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <MainHeader />

      {/* Main Content - Mobile First */}
      <main className="px-4 py-8 md:px-8 md:py-12 lg:px-[120px] lg:py-16 xl:px-[200px]">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/faq"
            className="inline-flex items-center text-[#03C3FF] hover:underline mb-4 md:mb-8 text-[14px] md:text-[16px] font-medium"
          >
            ← 목록으로
          </Link>

          <article className="bg-white">
            <div className="mb-6 md:mb-10">
              {/* 질문 */}
              <div className="flex items-start gap-3 mb-3 md:mb-6">
                <span className="text-[#03C3FF] font-bold text-[24px] md:text-[32px] flex-shrink-0">
                  Q.
                </span>
                <h1 className="text-[20px] md:text-[28px] lg:text-[36px] font-bold text-[#212121] leading-tight">
                  {faq.question}
                </h1>
              </div>
              <div className="pb-4 md:pb-8 border-b-2 border-[#E0E0E0]"></div>
            </div>

            {/* 답변 */}
            <div className="flex items-start gap-3">
              <span className="text-[#03C3FF] font-bold text-[20px] md:text-[24px] flex-shrink-0 mt-1">
                A.
              </span>
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-[#424242] leading-relaxed">
                <PortableText value={faq.answer} />
              </div>
            </div>
          </article>
        </div>
      </main>

        {/* Footer */}
        <MainFooter />
      </div>
    </>
  );
}
