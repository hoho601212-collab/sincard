import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { noticeBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/sanity/components/PortableText";
import { MainHeader, MainFooter } from "@/components/layout";
import type { Notice } from "@/sanity/types";

export const revalidate = 60;
export const dynamicParams = true;

const FIXED_SLUG = "2026-credit-card-approval-requirements";
const SECOND_FIXED_SLUG = "신용카드-현금화-vs-소액결제-현금화-차이";

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
    };
  }

  if (slug === SECOND_FIXED_SLUG) {
    return {
      title: "신용카드 현금화 vs 소액결제 현금화 차이",
      description:
        "신용카드 현금화와 소액결제 현금화의 확보 방식, 이용 구조, 장단점, 주의사항을 비교한 가이드입니다.",
    };
  }

  const notice = await client.fetch<Notice>(noticeBySlugQuery, { slug });

  if (!notice) {
    return {
      title: "정보공유를 찾을 수 없습니다",
    };
  }

  return {
    title: notice.title,
    description: `${notice.title} - 신카 머니존몰 정보공유`,
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === SECOND_FIXED_SLUG) {
    return <SecondFixedArticle />;
  }

  if (slug === FIXED_SLUG) {
    return <CreditCardApprovalArticle />;
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

function SecondFixedArticle() {
  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      <main className="px-4 py-10 md:px-8 md:py-14 lg:px-[120px] xl:px-[200px]">
        <article className="mx-auto max-w-4xl text-[#222] leading-[1.85]">
          <Link
            href="/notice"
            className="mb-8 inline-flex items-center text-[14px] font-medium text-[#0565FF] hover:underline md:text-[16px]"
          >
            ← 목록으로
          </Link>

          <h1 className="mb-6 text-[28px] font-extrabold leading-[1.35] text-[#111827] md:text-[40px]">
            신용카드 현금화 vs 소액결제 현금화
            <br />
            확보 방식 차이 및 이용방법 완벽 가이드
          </h1>

          <p>
            급하게 현금이 필요한 순간은 누구에게나 찾아옵니다. 월급일까지 며칠
            남지 않았는데 예상치 못한 지출이 생기거나, 갑작스러운 병원비·생활비가
            발생하는 상황이 대표적입니다. 이때 주로 알아보는 방법이 바로 신용카드
            현금화입니다.
          </p>

          <p>
            하지만 실제로 정보를 찾아보면 비슷해 보이는 방법들이 함께 등장합니다.
            그중 대표적인 것이 소액결제 현금화입니다. 이름은 비슷하지만 작동 방식,
            위험도, 이용 구조는 꽤 다릅니다.
          </p>

          <p>
            이 글에서는 두 방식의 차이를 단순 비교가 아닌 실제 사용 상황 중심으로
            풀어보며, 어떤 경우에 무엇을 고려해야 하는지 현실적인 기준을 제시합니다.
          </p>

          <img
            src="http://sinyongkadeu.com/wp-content/uploads/2026/02/신용카드-현금화-vs-소액결제-현금화-확보-방식-차이.png"
            alt="신용카드 현금화 vs 소액결제 현금화 확보 방식 차이"
            className="my-10 w-full rounded-[18px]"
          />

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            신용카드 현금화 vs 소액결제 현금화 개념 정리
          </h2>

          <h3 className="mb-3 mt-8 text-[22px] font-bold">신용카드 현금화란?</h3>

          <p>
            신용카드 현금화는 신용카드를 이용하여 상품이나 서비스를 구매한 후,
            이를 현금으로 교환하는 방식입니다. 특정 가맹점에서 물품을 구매한 뒤
            재판매하거나, 카드 한도 내에서 상품권을 구매해 일정 수수료를 제외하고
            현금으로 교환하는 과정을 말합니다.
          </p>

          <h3 className="mb-3 mt-8 text-[22px] font-bold">소액결제 현금화란?</h3>

          <p>
            소액결제 현금화는 휴대폰 소액결제 서비스를 통해 상품이나 상품권을
            구매한 후 이를 현금으로 바꾸는 과정입니다. 주로 모바일 결제 서비스로
            상품권을 구매한 뒤 다른 곳에서 현금으로 교환하는 방식으로 이해할 수
            있습니다.
          </p>

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            주로 누가 이용하는건가요?
          </h2>

          <p>
            대부분의 이용자는 투자 목적이 아니라 단기적으로 급하게 현금이 필요하기
            때문에 방법을 찾습니다.
          </p>

          <ul className="list-disc pl-6">
            <li>급여일 전 카드값 자동이체 예정</li>
            <li>갑작스럽게 지출을 해야 하는 상황 발생</li>
            <li>대출 심사 기간 동안 임시 자금 필요</li>
            <li>신용대출은 부담스럽고 절차가 길게 느껴질 때</li>
          </ul>

          <p>
            은행 대출은 심사와 서류가 필요하고, 지인에게 돈을 빌리는 것도 심리적
            부담이 큽니다. 그래서 비교적 접근성이 쉬운 결제 기반 자금 확보 방법을
            찾게 됩니다.
          </p>

          <div className="my-8 rounded-[18px] bg-[#F8FAFC] p-6">
            <ul className="list-disc pl-6">
              <li>신용카드 한도를 활용하는 방식</li>
              <li>휴대폰 결제 한도를 활용하는 방식</li>
            </ul>
          </div>

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            신용카드 현금화의 구조
          </h2>

          <img
            src="http://sinyongkadeu.com/wp-content/uploads/2026/02/신용카드-상품권교환.webp"
            alt="신용카드 상품권 교환"
            className="my-10 w-full rounded-[18px]"
          />

          <p className="font-bold text-[#111827]">
            “카드 한도를 결제로 바꾸는 방식”
          </p>

          <p>
            신용카드 현금화는 카드의 사용 가능 한도를 이용해 결제를 진행한 뒤,
            이를 현금으로 교환하는 방법입니다. 신용카드는 미래의 소득을 먼저
            사용하는 도구이고, 현금화는 그 미래 소비를 현재 현금으로 당겨오는
            과정입니다.
          </p>

          <ol className="list-decimal pl-6">
            <li>카드 결제 진행</li>
            <li>상품 또는 디지털 자산 구매</li>
            <li>재판매 또는 정산 과정 발생</li>
            <li>일정 수수료 제외 후 현금 수령</li>
          </ol>

          <div className="my-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[18px] bg-[#EFF6FF] p-6">
              <h3 className="mb-3 text-[20px] font-bold">장점</h3>
              <ul className="list-disc pl-6">
                <li>절차가 비교적 빠른 편</li>
                <li>기존 카드만 있으면 진행 가능</li>
                <li>별도 대출 기록이 남지 않는 경우 존재</li>
                <li>금액 규모 조절이 상대적으로 자유로움</li>
              </ul>
            </div>

            <div className="rounded-[18px] bg-[#FFF7ED] p-6">
              <h3 className="mb-3 text-[20px] font-bold">단점</h3>
              <ul className="list-disc pl-6">
                <li>수수료 구조가 업체마다 다름</li>
                <li>과도한 사용 시 카드 이용 패턴 이상 감지 가능</li>
                <li>상환 계획 없이 진행하면 카드 부담 증가</li>
                <li>불법 방식과 합법 구조가 혼재되어 있음</li>
                <li>상품권 구매 시 카드 한도와 별도 한도가 적용될 수 있음</li>
              </ul>
            </div>
          </div>

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            소액결제 현금화 방식은?
          </h2>

          <img
            src="http://sinyongkadeu.com/wp-content/uploads/2026/02/소액결제-상품권.webp"
            alt="소액결제 상품권"
            className="my-10 w-full rounded-[18px]"
          />

          <p className="font-bold text-[#111827]">
            “휴대폰 결제 한도를 활용하는 구조”
          </p>

          <p>
            소액결제 현금화는 통신사에서 제공하는 휴대폰 결제 한도를 이용합니다.
            카드가 아닌 통신 요금 청구 시스템을 기반으로 작동합니다.
          </p>

          <ol className="list-decimal pl-6">
            <li>휴대폰 결제로 콘텐츠 또는 상품 구매</li>
            <li>해당 자산을 재판매 또는 교환</li>
            <li>정산 후 현금 지급</li>
            <li>다음 달 통신요금에 합산 청구</li>
          </ol>

          <div className="my-8 overflow-x-auto">
            <table className="w-full border-collapse text-[15px]">
              <thead>
                <tr className="bg-[#111827] text-white">
                  <th className="border p-3">구분</th>
                  <th className="border p-3">신용카드 기반</th>
                  <th className="border p-3">휴대폰 결제 기반</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["사용 수단", "카드 한도", "통신사 결제 한도"],
                  ["청구 방식", "카드 결제일 청구", "통신요금 합산"],
                  ["이용 가능 금액", "비교적 큼", "소액 중심"],
                  ["접근성", "카드 필요", "휴대폰만 있으면 가능"],
                  ["위험 요소", "과소비 가능성", "연체 시 통신 제한"],
                ].map((row) => (
                  <tr key={row[0]} className="odd:bg-white even:bg-[#F9FAFB]">
                    <td className="border p-3 font-semibold">{row[0]}</td>
                    <td className="border p-3">{row[1]}</td>
                    <td className="border p-3">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            실제로 많이 묻는 질문 (FAQ)
          </h2>

          <div className="grid gap-4">
            {[
              [
                "신용카드 현금화는 신용점수에 영향이 있나요?",
                "직접적인 대출 기록이 아니더라도 카드 사용 패턴 변화가 영향을 줄 수 있습니다. 미납이 발생하면 신용점수에도 영향을 줄 수 있습니다.",
              ],
              [
                "수수료는 왜 차이가 큰가요?",
                "정산 방식, 위험 관리 비용, 처리 구조가 업체마다 다르기 때문입니다.",
              ],
              [
                "두 방법을 동시에 사용해도 되나요?",
                "가능은 하지만 상환 부담이 동시에 발생하기 때문에 추천되지는 않습니다.",
              ],
              [
                "가장 중요한 체크 포인트는 무엇인가요?",
                "진행 전 다음 달 내가 무리 없이 갚을 수 있는가를 먼저 확인하는 것입니다.",
              ],
            ].map(([q, a]) => (
              <div key={q} className="rounded-[18px] border border-[#E5E7EB] p-5">
                <p className="font-bold text-[#111827]">{q}</p>
                <p className="mt-2 text-[#4B5563]">{a}</p>
              </div>
            ))}
          </div>
        </article>
      </main>

      <MainFooter />
    </div>
  );
}

function CreditCardApprovalArticle() {
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

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            2. 주부 신용카드 발급 가능 여부
          </h2>

          <ul className="list-disc pl-6">
            <li>국민연금 지역가입자라면 월 5만 원 이상 납부 시 승인 가능</li>
            <li>배우자의 직업·소득·근속연수가 안정적이면 심사 시 긍정적 요소로 반영</li>
          </ul>

          <h2 className="mb-5 mt-14 text-[26px] font-bold text-[#111827] md:text-[32px]">
            3. 신용점수 기준 (2026)
          </h2>

          <img
            src="https://sinyongkadeu.com/wp-content/uploads/2026/03/%EA%B8%B0%EB%B3%B8%EC%A1%B0%EA%B1%B4-1024x265.png"
            alt="신용점수 기준"
            className="my-10 w-full rounded-[18px]"
          />

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
