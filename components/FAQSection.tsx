import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { faqsQuery } from "@/sanity/lib/queries";
import type { FAQ } from "@/sanity/types";

export const revalidate = 10;

export async function FAQSection() {
  const faqs = await client.fetch<FAQ[]>(
    faqsQuery(3),
    {},
    { next: { revalidate: 10 } }
  );

  return (
    <div className="rounded-[24px] border border-[#DCE6F2] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-10">
      <div className="mb-5 text-center md:mb-8">
        <p className="mb-2 text-[13px] font-black uppercase tracking-[1.5px] text-[#2563EB] md:text-[15px]">
          FAQ GUIDE
        </p>

        <p className="text-[22px] font-black tracking-[-0.6px] text-[#0F172A] md:text-[34px]">
          자주 묻는 질문
        </p>

        <p className="mt-3 text-[13px] leading-[1.7] text-[#64748B] md:text-[15px]">
          휴대폰 결제와 상품권 이용 과정에서 자주 확인하는 내용을 정리했습니다.
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <Link
              key={faq._id}
              href={`/faq/${faq.slug?.current || faq._id}`}
              className="group flex items-center gap-3 rounded-[16px] border border-[#E5EDF7] bg-[#F8FAFC] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB] hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] md:px-6 md:py-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[13px] font-black text-[#2563EB] ring-1 ring-[#DBEAFE] md:h-9 md:w-9 md:text-[14px]">
                Q
              </span>

              <span className="truncate text-[14px] font-bold text-[#334155] transition-colors group-hover:text-[#0F172A] md:text-[17px]">
                {faq.question}
              </span>
            </Link>
          ))
        ) : (
          <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center md:px-6 md:py-8">
            <span className="text-[13px] font-semibold text-[#94A3B8] md:text-[16px]">
              등록된 FAQ가 없습니다.
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 text-center md:mt-8">
        <Link
          href="/faq"
          className="inline-flex items-center justify-center rounded-[14px] border border-[#2563EB] bg-[#2563EB] px-6 py-3 text-[14px] font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1D4ED8] md:px-8 md:py-4 md:text-[17px]"
        >
          FAQ 전체 보기
        </Link>
      </div>
    </div>
  );
}
