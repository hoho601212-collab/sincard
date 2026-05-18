import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { noticeBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/sanity/components/PortableText";
import { MainHeader, MainFooter } from "@/components/layout";
import type { Notice } from "@/sanity/types";

export const revalidate = 60;

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const notice = await client.fetch<Notice>(noticeBySlugQuery, { slug });

  if (!notice) {
    return {
      title: "공지사항을 찾을 수 없습니다",
    };
  }

  const description = `${notice.title} - 핀토스몰 공지사항`;
  const publishedDate = new Date(notice.createdAt).toISOString();

  return {
    title: notice.title,
    description,
    keywords: [
      "핀토스 공지사항",
      notice.title,
      "상품권",
      "핀토스몰",
    ],
    openGraph: {
      title: `${notice.title} | 핀토스몰 공지사항`,
      description,
      url: `/notice/${slug}`,
      siteName: "핀토스몰",
      locale: "ko_KR",
      type: "article",
      publishedTime: publishedDate,
      authors: ["핀토스몰"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${notice.title} | 핀토스몰 공지사항`,
      description,
    },
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await client.fetch(noticeBySlugQuery, { slug });

  if (!notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainHeader />

      {/* Main Content - Mobile First */}
      <main className="px-4 py-8 md:px-8 md:py-12 lg:px-[120px] lg:py-16 xl:px-[200px]">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/notice"
            className="inline-flex items-center text-[#0565FF] hover:underline mb-4 md:mb-8 text-[14px] md:text-[16px] font-medium"
          >
            ← 목록으로
          </Link>

          <article className="bg-white">
            <div className="mb-6 md:mb-10">
              <h1 className="text-[20px] md:text-[28px] lg:text-[36px] font-bold mb-3 md:mb-6 text-[#212121] leading-tight">
                {notice.title}
              </h1>
              <div className="flex items-center gap-2 pb-4 md:pb-8 border-b-2 border-[#E0E0E0]">
                <span className="text-[12px] md:text-[14px] text-[#9E9E9E]">
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-[#424242] leading-relaxed">
              <PortableText value={notice.content} />
            </div>
          </article>
        </div>
      </main>

      {/* Footer */}
      <MainFooter />
    </div>
  );
}
