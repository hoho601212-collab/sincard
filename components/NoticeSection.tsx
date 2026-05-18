import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { noticesQuery } from "@/sanity/lib/queries";
import type { Notice } from "@/sanity/types";

export const revalidate = 10;

export async function NoticeSection() {
  const notices = await client.fetch<Notice[]>(
    noticesQuery(3),
    {},
    { next: { revalidate: 10 } }
  );

  return (
    <div className="rounded-[24px] border border-[#DCE6F2] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-10">
      <div className="mb-5 text-center md:mb-8">
        <p className="mb-2 text-[13px] font-black uppercase tracking-[1.5px] text-[#0F766E] md:text-[15px]">
          Notice Board
        </p>

        <p className="text-[22px] font-black tracking-[-0.6px] text-[#0F172A] md:text-[34px]">
          공지사항
        </p>

        <p className="mt-3 text-[13px] leading-[1.7] text-[#64748B] md:text-[15px]">
          이용 전 확인하면 좋은 안내와 변경 사항을 정리했습니다.
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <Link
              key={notice._id}
              href={`/notice/${notice.slug}`}
              className="group flex items-center gap-3 rounded-[16px] border border-[#E5EDF7] bg-[#F8FAFC] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F766E] hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] md:px-6 md:py-5"
            >
              <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#0F766E] ring-1 ring-[#DCE6F2] md:text-[13px]">
                {new Date(notice.createdAt)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\. /g, ". ")}
              </span>

              <span className="truncate text-[14px] font-bold text-[#334155] transition-colors group-hover:text-[#0F172A] md:text-[17px]">
                {notice.title}
              </span>
            </Link>
          ))
        ) : (
          <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center md:px-6 md:py-8">
            <span className="text-[13px] font-semibold text-[#94A3B8] md:text-[16px]">
              등록된 공지사항이 없습니다.
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 text-center md:mt-8">
        <Link
          href="/notice"
          className="inline-flex items-center justify-center rounded-[14px] border border-[#0F766E] bg-[#0F766E] px-6 py-3 text-[14px] font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#115E59] md:px-8 md:py-4 md:text-[17px]"
        >
          공지사항 전체 보기
        </Link>
      </div>
    </div>
  );
}
