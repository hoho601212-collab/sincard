import { MainHeader, MainFooter } from "@/components/layout";
export default function AboutPage() {
  return (
    <main className="bg-[#F6F8FC]">
      <section className="mx-auto max-w-[1180px] px-4 py-16 md:py-24">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[14px] font-semibold text-[#0565FF]">
            COMPANY
          </p>

          <h1 className="text-[34px] font-bold text-[#111827] md:text-[46px]">
            회사소개
          </h1>

          <p className="mx-auto mt-4 max-w-[720px] text-[16px] leading-[1.9] text-[#4B5563]">
            신카머니존은 투명한 절차와 안전한 운영 기준을 바탕으로
            고객에게 신뢰할 수 있는 금융 정보와 서비스를 제공합니다.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm md:p-10">
          <h2 className="mb-5 text-[26px] font-bold text-[#111827]">
            회사 소개
          </h2>

          <p className="text-[16px] leading-[2] text-[#374151]">
            신카머니존은 오랜 경험과 전문성을 바탕으로 신용카드 현금화 서비스를
            전문적으로 제공하는 신뢰 중심의 업체입니다. 단순히 현금을 만드는
            과정이 아니라, 고객이 안심할 수 있는 합법적인 절차와 투명한 수수료
            정책을 통해 보다 안전한 금융 솔루션을 제시하고 있습니다.
          </p>

          <p className="mt-4 text-[16px] leading-[2] text-[#374151]">
            현금이 필요할 때 누구나 빠르고 간편하게 이용할 수 있도록 24시간
            상담 시스템을 운영하며, 모든 거래 내역은 철저하게 보안 관리되어
            개인정보와 자금 흐름이 외부로 노출되지 않도록 보호합니다.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[24px] font-bold text-[#111827]">
              기업 개요
            </h2>

            <p className="text-[15px] leading-[1.9] text-[#4B5563]">
              신용카드 전문 플랫폼 신용카드닷컴은 고객이 필요할 때 안전하게
              현금을 확보할 수 있도록 전문적인 서비스를 제공합니다. 다년간의
              노하우와 합법적인 절차를 기반으로 운영되며, 신용카드 현금화,
              상품권 구매·교환 등 다양한 금융 솔루션을 안내합니다.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#EEF5FF] p-6 shadow-sm">
            <h2 className="mb-4 text-[24px] font-bold text-[#111827]">
              기업이념
            </h2>

            <div className="space-y-3 text-[15px] leading-[1.8] text-[#374151]">
              <p><strong>신뢰성:</strong> 투명한 수수료와 철저한 보안 관리</p>
              <p><strong>전문성:</strong> 업계 경험과 금융 지식을 바탕으로 한 안내</p>
              <p><strong>고객중심:</strong> 빠른 처리와 친절한 상담</p>
              <p><strong>합법성:</strong> 법과 규정을 준수하는 운영 원칙</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-white p-6 shadow-sm md:p-10">
          <h2 className="mb-6 text-[26px] font-bold text-[#111827]">
            사업목표
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                title: "안전한 현금화 표준화",
                desc: "불필요한 위험을 줄이고 합법적인 금융 서비스를 제공합니다.",
              },
              {
                title: "이용자 편의 극대화",
                desc: "24시간 상담과 신속한 처리 시스템으로 긴급 상황에 대응합니다.",
              },
              {
                title: "시장 신뢰 확보",
                desc: "투명한 운영과 지속적인 고객 후기 관리로 신뢰도를 높입니다.",
              },
              {
                title: "지속 성장과 혁신",
                desc: "온라인 플랫폼 최적화와 다양한 금융 연계 서비스를 개발합니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[20px] border border-[#E5EAF3] bg-[#F8FAFF] p-5"
              >
                <h3 className="mb-3 text-[17px] font-bold text-[#111827]">
                  {item.title}
                </h3>

                <p className="text-[14px] leading-[1.8] text-[#4B5563]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-[#111827] p-6 text-white shadow-sm md:p-10">
          <h2 className="mb-6 text-[26px] font-bold">
            오시는 길 및 문의
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[20px] bg-white/10 p-5">
              <p className="mb-2 text-[14px] text-white/70">주소</p>
              <p className="text-[17px] font-semibold">
                부산 강서구 명지국제1로 60-1 SR빌딩 5층
              </p>
            </div>

            <div className="rounded-[20px] bg-white/10 p-5">
              <p className="mb-2 text-[14px] text-white/70">대표번호</p>
              <p className="text-[17px] font-semibold">051-710-2985</p>
            </div>

            <div className="rounded-[20px] bg-white/10 p-5">
              <p className="mb-2 text-[14px] text-white/70">이메일 문의</p>
              <p className="text-[17px] font-semibold">
                cs@sinyongkadeu.com
              </p>
            </div>

            <div className="rounded-[20px] bg-white/10 p-5">
              <p className="mb-2 text-[14px] text-white/70">운영시간</p>
              <p className="text-[17px] font-semibold">
                연중무휴, 24시간 상담 가능
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] bg-white p-5 text-[#111827]">
            <h3 className="mb-4 text-[20px] font-bold">
              교통 안내
            </h3>

            <div className="space-y-3 text-[15px] leading-[1.9] text-[#374151]">
              <p>
                <strong>지하철:</strong> 하단역에서 버스로 환승 후 진동 정류장 하차,
                SR빌딩까지 도보 이동
              </p>

              <p>
                <strong>버스:</strong> 520번, 58-1번, 58-2번 이용 후 진동 정류장 하차,
                도보 약 4분 거리
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
