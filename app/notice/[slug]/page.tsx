import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { noticeBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/sanity/components/PortableText";
import { MainHeader, MainFooter } from "@/components/layout";
import type { Notice } from "@/sanity/types";

export const revalidate = 60;

const FIXED_SLUG = "2026-credit-card-approval-requirements";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug === FIXED_SLUG) {
    return {
      title: "2026 신용카드 발급 조건 완벽 분석",
      description:
        "신용점수·소득 조건부터 승인 확률 높이는 방법까지 정리한 신용카드 발급 조건 가이드입니다.",
      keywords: [
        "신용카드 발급 조건",
        "신용카드 승인",
        "신용점수",
        "신용카드 발급 기준",
      ],
    };
  }

  const notice = await client.fetch<Notice>(noticeBySlugQuery, { slug });

  if (!notice) {
    return {
      title: "정보공유를 찾을 수 없습니다",
    };
  }

  const description = `${notice.title} - 신카 머니존몰 정보공유`;
  const publishedDate = new Date(notice.createdAt).toISOString();

  return {
    title: notice.title,
    description,
    keywords: ["신카 머니존 정보공유", notice.title, "상품권", "신카 머니존몰"],
    openGraph: {
      title: `${notice.title} | 신카 머니존몰 정보공유`,
      description,
      url: `/notice/${slug}`,
      siteName: "신카 머니존몰",
      locale: "ko_KR",
      type: "article",
      publishedTime: publishedDate,
      authors: ["신카 머니존몰"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${notice.title} | 신카 머니존몰 정보공유`,
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

  if (slug === FIXED_SLUG) {
    return (
      <div className="min-h-screen bg-white">
        <MainHeader />

        <main className="px-4 py-10 md:px-8 md:py-14 lg:px-[120px] xl:px-[200px]">
          <article className="mx-auto max-w-4xl text-[#222] leading-[1.8]">
            <Link
              href="/notice"
              className="mb-8 inline-flex items-center text-[14px] font-medium text-[#0565FF] hover:underline md:text-[16px]"
            >
              ← 목록으로
            </Link>

            <h1 className="mb-6 text-[28px] font-extrabold leading-[1.35] text-[#111827] md:text-[40px]">
              2026 신용카드 발급 조건 완벽 분석
              <br />
              신용점수·소득 조건부터 승인 확률 높이는 핵심 방법
            </h1>

            <p>
              현대인의 대부분은 신용카드를 한 장 이상 가지고 있습니다. 필요할 때
              현금을 쓰지 않고 결제할 수 있으며, 연말정산 세제 혜택, 대출 우대,
              포인트 적립 등 다양한 장점이 있기 때문입니다.
            </p>

            <p>
              하지만 신용카드는 발급 기준이 명확히 존재하기 때문에 소득이 없거나
              신용점수가 낮은 사람은 어려움을 겪는 경우도 많습니다.
            </p>

            <p>
              아래에서는 2026년 신용카드 발급 기준, 신용점수·소득 조건, 직업별
              발급 가능 여부, 승인 확률 높이는 방법 등을 정리했습니다.
            </p>

            <img
              src="https://sinyongkadeu.com/wp-content/uploads/2026/03/%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C-%EB%B0%9C%EA%B8%89%EC%A1%B0%EA%B1%B4-%EC%82%B4%ED%8E%B4%EB%B3%B4%EC%9E%90-1024x724.png"
              alt="신용카드 발급 조건"
              className="my-10 w-full rounded-[18px]"
            />

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              1. 신용카드 발급 기본 조건
            </h2>

            <p>
              신용카드는 사용자의 결제 능력을 카드사가 보증하는 구조이므로
              연령·직업·소득·신용도 등이 심사에 반영됩니다.
            </p>

            <h3 className="mb-3 mt-8 text-[22px] font-bold">1) 연령 조건</h3>

            <ul className="list-disc pl-6">
              <li>만 19세 이상만 발급 가능</li>
              <li>체크카드와 달리 미성년자 발급 불가</li>
            </ul>

            <h3 className="mb-4 mt-10 text-[22px] font-bold">
              2) 직업 및 소득 조건 비교표
            </h3>

            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr className="bg-[#111827] text-white">
                    <th className="border p-3">직업/상황</th>
                    <th className="border p-3">발급 가능 여부</th>
                    <th className="border p-3">필요한 조건</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["정규직 직장인", "매우 높음", "4대보험, 급여 입금 내역"],
                    ["공무원·전문직", "매우 높음", "직업·소득 자동 인정"],
                    ["자영업자", "보통", "소득·사업자등록증 필요"],
                    ["주부", "보통", "국민연금 지역가입(月 5만↑) 또는 배우자 소득"],
                    ["프리랜서", "중간", "3개월 소득 입금 내역"],
                    ["대학생", "낮음", "3개월 입금 50만↑ 또는 잔액 기준"],
                    ["아르바이트", "낮음", "3개월 꾸준한 입금 내역"],
                    ["미필자", "낮음", "동일하게 소득 증빙 필요"],
                    ["무직자", "매우 낮음", "잔액 기준 일부 가능"],
                    ["본인 명의 주택 보유자", "중간", "자산 인정으로 발급 가능성 증가"],
                  ].map((row) => (
                    <tr key={row[0]} className="odd:bg-white even:bg-[#F9FAFB]">
                      <td className="border p-3">{row[0]}</td>
                      <td className="border p-3 font-semibold">{row[1]}</td>
                      <td className="border p-3">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <img
              src="https://sinyongkadeu.com/wp-content/uploads/2026/03/%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C-%EA%B8%B0%EB%B3%B8%EC%A1%B0%EA%B1%B4%EA%B3%BC-%EB%B0%9C%EA%B8%89%EC%A0%88%EC%B0%A8-1024x436.png"
              alt="신용카드 기본조건과 발급절차"
              className="my-10 w-full rounded-[18px]"
            />

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              2. 주부 신용카드 발급 가능 여부
            </h2>

            <p>소득이 없어도 다음 조건을 충족하면 발급 가능합니다.</p>

            <ul className="list-disc pl-6">
              <li>국민연금 지역가입자라면 월 5만 원 이상 납부 시 승인 가능</li>
              <li>
                배우자의 직업·소득·근속연수가 안정적이면 심사 시 긍정적 요소로
                반영
              </li>
            </ul>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              3. 신용점수 기준 (2026)
            </h2>

            <img
              src="https://sinyongkadeu.com/wp-content/uploads/2026/03/%EA%B8%B0%EB%B3%B8%EC%A1%B0%EA%B1%B4-1024x265.png"
              alt="신용점수 기준"
              className="my-10 w-full rounded-[18px]"
            />

            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr className="bg-[#111827] text-white">
                    <th className="border p-3">신용점수</th>
                    <th className="border p-3">발급 가능성</th>
                    <th className="border p-3">설명</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["700점 이상", "높음", "대부분 원활한 발급"],
                    ["650~699점", "보통", "소득 증빙 시 승인 가능"],
                    ["600~649점", "낮음", "거절 가능, 추가 증빙 필요"],
                    ["600점 이하", "매우 낮음", "잔액·소득 등 특별 조건 필요"],
                  ].map((row) => (
                    <tr key={row[0]} className="odd:bg-white even:bg-[#F9FAFB]">
                      <td className="border p-3">{row[0]}</td>
                      <td className="border p-3 font-semibold">{row[1]}</td>
                      <td className="border p-3">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              사회 초년생은 평균 700점대 중반으로 시작하기 때문에 발급이 어렵지
              않습니다.
            </p>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              4. 대학생·아르바이트·인턴 발급 조건
            </h2>

            <p>다음 금융기관은 신용카드 발급이 제한적인 경우가 많습니다.</p>

            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr className="bg-[#111827] text-white">
                    <th className="border p-3">기관</th>
                    <th className="border p-3">발급 난이도</th>
                    <th className="border p-3">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["우체국", "매우 어려움", "체크카드 중심"],
                    ["저축은행", "어려움", "영업점별 기준 차이 큼"],
                    ["신용금고", "어려움", "상황별 승인 사례 존재"],
                    ["일반 시중은행", "쉬움", "조건 충족 시 대부분 승인"],
                  ].map((row) => (
                    <tr key={row[0]} className="odd:bg-white even:bg-[#F9FAFB]">
                      <td className="border p-3">{row[0]}</td>
                      <td className="border p-3 font-semibold">{row[1]}</td>
                      <td className="border p-3">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              5. 발급이 어려운 금융기관 비교
            </h2>

            <div className="rounded-[18px] bg-[#F8FAFC] p-6">
              <p>
                많은 사람들이 “어느 것이 더 안전한가”를 묻지만, 사실 더 중요한
                질문은 이것입니다.
              </p>
              <p className="font-bold text-[#111827]">
                “내 상황에서 감당 가능한 방식인가?” 또는 “다음달 결제일에 납부가
                가능한가?”
              </p>
              <ul className="list-disc pl-6">
                <li>카드 결제 관리가 익숙한 경우 → 신용카드 기반 방식이 유리할 수 있음</li>
                <li>소액만 잠깐 필요한 경우 → 휴대폰 결제가 부담이 적을 수 있음</li>
                <li>다음 달 상환 계획이 명확한가 → 가장 중요한 기준</li>
              </ul>
            </div>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              6. 신용카드 승인 확률 높이는 방법
            </h2>

            <ol className="list-decimal pl-6">
              <li>짧은 기간 여러 카드 신청 금지</li>
              <li>체크카드 사용 실적 쌓기</li>
              <li>연말 승인률 상승 활용</li>
            </ol>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              7. 큰 금액 결제를 위한 특별 한도 제도
            </h2>

            <p>
              결혼·장례·여행·가구·차량 구매 등 큰 금액이 필요한 경우에는 발급 후
              임시 한도 상향을 신청할 수 있습니다.
            </p>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              8. 마무리 요약
            </h2>

            <div className="rounded-[18px] bg-[#EFF6FF] p-6">
              <p className="font-bold text-[#1E3A8A]">
                신용카드 발급에서 가장 중요한 요소는 신용점수 + 꾸준한 소득 증빙 +
                납부 실적입니다.
              </p>
              <p>
                사회 초년생부터 신용 관리를 시작한다면 향후 금융 거래에서 큰 이점을
                얻을 수 있습니다.
              </p>
            </div>

            <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
              9. 관련 영상 (참조 영상)
            </h2>

            <div className="relative my-6 h-0 overflow-hidden rounded-[18px] pb-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/KfZwLRPbEbo"
                title="신용카드 발급조건"
                className="absolute left-0 top-0 h-full w-full"
                allowFullScreen
              />
            </div>
          </article>
        </main>

        <MainFooter />
      </div>
    );
  }

  const notice = await client.fetch<Notice>(noticeBySlugQuery, { slug });

  if (!notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      <main className="px-4 py-8 md:px-8 md:py-12 lg:px-[120px] lg:py-16 xl:px-[200px]">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/notice"
            className="mb-4 inline-flex items-center text-[14px] font-medium text-[#0565FF] hover:underline md:mb-8 md:text-[16px]"
          >
            ← 목록으로
          </Link>

          <article className="bg-white">
            <div className="mb-6 md:mb-10">
              <h1 className="mb-3 text-[20px] font-bold leading-tight text-[#212121] md:mb-6 md:text-[28px] lg:text-[36px]">
                {notice.title}
              </h1>
              <div className="flex items-center gap-2 border-b-2 border-[#E0E0E0] pb-4 md:pb-8">
                <span className="text-[12px] text-[#9E9E9E] md:text-[14px]">
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-[#424242] leading-relaxed md:prose-base lg:prose-lg">
              <PortableText value={notice.content} />
            </div>
          </article>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
