import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { noticesListQuery, noticesCountQuery } from "@/sanity/lib/queries";
import { MainHeader, MainFooter } from "@/components/layout";
import type { Notice } from "@/sanity/types";

export const metadata: Metadata = {
  title: "공지사항",
  description:
    "핀토스몰의 최신 소식과 공지사항을 확인하세요. 상품권 이벤트, 시스템 점검, 서비스 업데이트 등 중요한 소식을 빠르게 전달합니다.",
  keywords: [
    "핀토스 공지사항",
    "상품권 이벤트",
    "핀토스 소식",
    "시스템 점검",
    "서비스 업데이트",
  ],
  openGraph: {
    title: "공지사항 | 핀토스몰",
    description:
      "핀토스몰의 최신 소식과 공지사항을 확인하세요. 상품권 이벤트, 시스템 점검, 서비스 업데이트 등 중요한 소식을 빠르게 전달합니다.",
    url: "/notice",
    siteName: "핀토스몰",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "공지사항 | 핀토스몰",
    description:
      "핀토스몰의 최신 소식과 공지사항을 확인하세요.",
  },
};

export const revalidate = 60;

const PER_PAGE = 10;

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [notices, totalCount] = await Promise.all([
    client.fetch<Notice[]>(noticesListQuery(start, end)),
    client.fetch<number>(noticesCountQuery),
  ]);

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
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
              <p className="text-[14px] md:text-[18px] font-medium text-[#0565FF] mb-1 md:mb-2">
                NOTICE
              </p>
              <h1 className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-[#212121]">
                공지사항
              </h1>
            </div>
          </div>

          {notices.length > 0 ? (
            <>
              <ul className="space-y-2 md:space-y-3 mb-8 md:mb-12">
                {notices.map((notice) => (
                  <li key={notice._id}>
                    <Link
                      href={`/notice/${notice.slug}`}
                      className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 p-4 md:p-5 lg:p-6 border border-[#E0E0E0] rounded-[10px] hover:bg-[#FAFAFA] hover:border-[#0565FF] transition-all"
                    >
                      <span className="font-medium text-[#212121] text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed">
                        {notice.title}
                      </span>
                      <span className="text-[12px] md:text-[14px] text-[#9E9E9E] whitespace-nowrap md:ml-4 flex-shrink-0">
                        {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* 페이지네이션 - Mobile First */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/notice?page=${p}`}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-[10px] text-[14px] md:text-[16px] font-medium transition-all ${
                          p === page
                            ? "bg-[#0565FF] text-white shadow-md"
                            : "bg-[#F5F5F5] text-[#757575] hover:bg-[#E0E0E0]"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 md:py-16 lg:py-20">
              <p className="text-[#9E9E9E] text-[14px] md:text-[16px] lg:text-[18px]">
                등록된 공지사항이 없습니다.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <MainFooter />
    </div>
  );
}
