"use client";

import { useState } from "react";
import Image from "next/image";

export function AllProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const voucherIssuers = [
    {
      id: 1,
      name: "개념",
      imageUrl: "/safe-transaction-check.webp",
    },
    {
      id: 2,
      name: "이용 목적 분석",
      imageUrl: "/transparent-fee-system.webp",
    },
    {
      id: 3,
      name: "이용층 분석",
      imageUrl: "/신용카드-현금화_이용층.webp",
    },
    {
      id: 4,
      name: "장단점 분석",
      imageUrl: "/장단점.webp",
    },
    {
      id: 5,
      name: "주의 사항",
      imageUrl: "/주의사항.webp",
    },
    {
      id: 6,
      name: "업체 선택방법",
      imageUrl: "/업체선정팁.webp",
    },
  ];

  return (
    <>
      <h2 className="mb-4 text-[18px] font-semibold text-[#212121] md:mb-5 md:text-[20px] lg:mb-6 lg:text-[24px]">
        신용카드 현금화 핵심 가이드{" "}
        <span className="text-[#0565FF]">{voucherIssuers.length}</span>
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {voucherIssuers.map((item) => (
  <button
    key={item.id}
    type="button"
    onClick={() => setSelectedProduct(item)}
    className="group min-h-[235px] rounded-[20px] border border-[#E5E7EB] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0565FF] hover:shadow-xl"
  >
    <div className="mb-5 flex justify-center">
      <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[22px] bg-[#F8FAFF] transition-all duration-300 group-hover:bg-[#EEF4FF]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={64}
          height={64}
          className="object-contain transition duration-300 group-hover:scale-105"
        />
      </div>
    </div>

    <div className="flex items-center justify-center">
      <p className="min-h-[60px] break-keep text-[17px] font-semibold leading-[1.6] text-[#212121]">
        {item.name}
      </p>
    </div>
  </button>
))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-[2px]">
          <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
            
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-5 top-5 z-10 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F3F4F6] text-[22px] text-[#666] transition hover:bg-[#E5E7EB]"
            >
              ×
            </button>

            <div className="max-h-[90vh] overflow-y-auto p-6 md:p-7">
              
              <div className="mb-6 flex justify-center">
                <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#F5F8FF]">
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="mb-6 text-center">
                <p className="mb-2 inline-flex rounded-full bg-[#EEF4FF] px-3 py-1 text-[12px] font-semibold text-[#0565FF]">
                  금융 정보 안내
                </p>

                <h3 className="text-[26px] font-bold leading-[1.4] text-[#111827]">
                  {selectedProduct.name}
                </h3>
              </div>

              {selectedProduct?.name === "신용카드 현금화란?" && (
                <div className="space-y-5">

                  <div className="rounded-[18px] border border-[#E5EAF3] bg-[#F8FAFF] p-5">
                    <p className="mb-3 text-[13px] font-semibold text-[#0565FF]">
                      이용 전 확인 사항
                    </p>

                    <div className="space-y-4 text-[15px] leading-[1.9] text-[#374151]">

                      <p>
                        신용카드 현금화는 본인 명의의 신용카드를 이용해 상품권,
                        물품 등을 결제한 뒤 이를 현금으로 전환하거나 카드사가
                        제공하는 카드론·현금서비스를 통해 단기 자금을 확보하는
                        금융 절차를 의미합니다.
                      </p>

                      <div className="rounded-[16px] bg-white p-4 shadow-sm">
                        <p className="mb-2 text-[15px] font-bold text-[#DC2626]">
                          반드시 확인해야 할 부분
                        </p>

                        <p>
                          실제 물품이나 서비스 거래 없이 현금만 지급하는 형태의
                          카드깡은 불법이며 여신전문금융업법 위반에 해당할 수
                          있습니다. 따라서 진행 전 반드시 합법적인 거래 구조인지
                          확인하는 것이 중요합니다.
                        </p>
                      </div>

                      <p>
                        예상하지 못한 생활비, 긴급 납부, 갑작스러운 지출 등으로
                        인해 단기간 자금이 필요한 상황은 누구에게나 발생할 수
                        있습니다.
                      </p>

                      <p>
                        은행권 대출은 심사 과정이 길어질 수 있고, 일반
                        현금서비스는 상대적으로 높은 이자 부담이 발생할 수
                        있습니다. 이에 따라 비교적 간단한 절차를 찾는 사례도
                        증가하고 있습니다.
                      </p>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        
                        <div className="rounded-[14px] bg-white p-4 text-center shadow-sm">
                          <p className="mb-1 text-[13px] text-[#6B7280]">
                            진행 절차
                          </p>
                          <p className="font-semibold text-[#111827]">
                            본인 인증
                          </p>
                        </div>

                        <div className="rounded-[14px] bg-white p-4 text-center shadow-sm">
                          <p className="mb-1 text-[13px] text-[#6B7280]">
                            확인 요소
                          </p>
                          <p className="font-semibold text-[#111827]">
                            한도 · 정책
                          </p>
                        </div>

                        <div className="rounded-[14px] bg-white p-4 text-center shadow-sm">
                          <p className="mb-1 text-[13px] text-[#6B7280]">
                            중요 기준
                          </p>
                          <p className="font-semibold text-[#111827]">
                            합법적 거래
                          </p>
                        </div>

                      </div>

                      <div className="rounded-[16px] bg-[#EEF5FF] p-5">
                        <p className="mb-2 text-[16px] font-bold text-[#1D4ED8]">
                          핵심 체크 포인트
                        </p>

                        <p className="text-[15px] leading-[1.8] text-[#334155]">
                          빠른 진행 여부보다 중요한 것은 수수료 구조,
                          상환 가능성, 카드사 정책, 실제 거래 여부를 충분히
                          확인하는 것입니다.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}
{selectedProduct?.name === "신용카드 현금화, 누가 왜 선택할까?" && (
  <div className="space-y-5">
    <div className="rounded-[18px] border border-[#E5EAF3] bg-[#F8FAFF] p-5">
      <p className="mb-3 text-[13px] font-semibold text-[#0565FF]">
        서비스 종류
      </p>

      <h4 className="mb-3 text-[20px] font-bold text-[#111827]">
        거래 전 확인해야 할 서비스 유형
      </h4>

      <p className="mb-5 text-[15px] leading-[1.8] text-[#4B5563]">
        거래를 시작하기 전 사전 점검은 필수입니다. 실수 없이 안전한 거래를 위해
        아래 항목을 먼저 확인해두세요.
      </p>

      <div className="space-y-4 text-[15px] leading-[1.8] text-[#374151]">
        <div className="rounded-[16px] bg-white p-4 shadow-sm">
          <p className="mb-2 text-[16px] font-bold text-[#111827]">
            1) 상품권 현금화
          </p>
          <p>
            신용카드로 문화상품권, 백화점 상품권, 도서상품권, 틴캐시 모바일
            상품권 등을 구매한 뒤 매입처에 판매하거나 개인 간 거래를 통해 현금을
            받는 방식입니다.
          </p>
          <div className="mt-3 rounded-[12px] bg-[#F3F6FB] p-3 text-[14px]">
            <p>수수료: 5~15%</p>
            <p>추천 상황: 단기간 내 상환 가능하고 대출이 부담스러운 경우</p>
            <p>주의: 이상 거래로 판단될 경우 카드사 차단 가능</p>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-4 shadow-sm">
          <p className="mb-2 text-[16px] font-bold text-[#111827]">
            2) 신용카드 한도 현금화
          </p>
          <p>
            개인·법인 카드 모두 가능하며 승인 금액의 일부를 현금화하는 방식으로
            안내되는 경우가 있습니다.
          </p>
          <div className="mt-3 rounded-[12px] bg-[#F3F6FB] p-3 text-[14px]">
            <p>수수료: 10~15%</p>
            <p>추천 상황: 급한 자금이 빠르게 필요한 경우</p>
            <p>주의: 불법 업체 이용 시 사기 피해 위험이 있음</p>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-4 shadow-sm">
          <p className="mb-2 text-[16px] font-bold text-[#111827]">
            3) 카드론·현금서비스
          </p>
          <p>
            카드사에서 제공하는 공식 대출 서비스로, 약관과 심사 기준에 따라 자금을
            확보할 수 있는 방식입니다.
          </p>
          <div className="mt-3 rounded-[12px] bg-[#F3F6FB] p-3 text-[14px]">
            <p>
              수수료: 카드사와 신용등급에 따라 다름
            </p>
            <p>
              참고: 카드론 평균금리 14.83%, 현금서비스 연 18.10% 수준
            </p>
            <p>추천 상황: 간단한 절차로 빠른 자금이 필요한 경우</p>
            <p>주의: 높은 금리와 짧은 상환 기간을 반드시 고려해야 함</p>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-4 shadow-sm">
          <p className="mb-2 text-[16px] font-bold text-[#111827]">
            4) 상테크
          </p>
          <p>
            신용카드로 할인된 상품권을 구매해 카드 실적을 채우거나, 할인 상품권을
            다시 판매해 차익을 얻는 방식을 의미합니다.
          </p>
          <div className="mt-3 rounded-[12px] bg-[#F3F6FB] p-3 text-[14px]">
            <p>구매 조건: 온라인몰에서 평균 5~8% 할인 가격으로 구매</p>
            <p>
              추천 상황: 카드사, 간편결제 앱, 온라인몰 이벤트가 동시에 진행될 때
            </p>
            <p>주의: 할인율과 수수료가 변동되므로 최신 조건 확인 필요</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
              {selectedProduct?.name === "신용카드 현금화 이용층은?" && (
  <div className="space-y-5">
    <div className="rounded-[18px] border border-[#E5EAF3] bg-[#F8FAFF] p-5">
      
      <p className="mb-3 text-[13px] font-semibold text-[#0565FF]">
        이용층 분석
      </p>

      <h4 className="mb-4 text-[22px] font-bold leading-[1.4] text-[#111827]">
        신용카드 현금화 이용층은?
      </h4>

      <p className="mb-6 text-[15px] leading-[1.9] text-[#4B5563]">
        자금 상황, 카드 혜택, 단기 활용 목적 등에 따라 다양한 이용 패턴이
        존재합니다. 아래는 대표적으로 많이 언급되는 사례들입니다.
      </p>

      <div className="space-y-4">

        <div className="rounded-[16px] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-[10px] w-[10px] rounded-full bg-[#0565FF]" />
            <p className="text-[17px] font-bold text-[#111827]">
              급전이 필요한 일반 직장인
            </p>
          </div>

          <p className="text-[15px] leading-[1.9] text-[#374151]">
            갑작스러운 의료비, 여행 경비, 가족 행사 비용 등 예상하지 못한
            지출이 발생했을 때 단기 자금 확보 목적으로 활용되는 경우가 있습니다.
            은행권 대출 대비 절차가 비교적 간단하고 승인 속도가 빠르다는 점에서
            찾는 사례가 존재합니다.
          </p>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-[10px] w-[10px] rounded-full bg-[#0565FF]" />
            <p className="text-[17px] font-bold text-[#111827]">
              카드 실적을 맞추려는 사용자
            </p>
          </div>

          <p className="text-[15px] leading-[1.9] text-[#374151]">
            일부 카드는 월 사용 금액 조건을 충족해야 포인트 적립, 할인,
            연회비 면제 등의 혜택이 유지됩니다. 상품권 구매 후 현금화 구조를
            이용해 카드 실적을 채우면서 자금 회수를 고려하는 경우도 있습니다.
          </p>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-[10px] w-[10px] rounded-full bg-[#0565FF]" />
            <p className="text-[17px] font-bold text-[#111827]">
              단기 재테크를 시도하는 사용자
            </p>
          </div>

          <p className="text-[15px] leading-[1.9] text-[#374151]">
            할인율이 높은 상품권을 구매한 뒤 다시 판매하거나, 이벤트 및
            포인트 적립 혜택을 활용해 실질적인 차익을 얻는 방식으로 접근하는
            사례도 있습니다.
          </p>
        </div>

      </div>

      <div className="mt-6 rounded-[16px] bg-[#EEF5FF] p-5">
        <p className="mb-2 text-[16px] font-bold text-[#1D4ED8]">
          확인해야 할 부분
        </p>

        <p className="text-[15px] leading-[1.8] text-[#334155]">
          이용 목적과 상관없이 과도한 사용은 신용도와 상환 부담에 영향을 줄 수
          있으므로 수수료, 상환 계획, 카드사 정책 등을 충분히 확인한 뒤
          진행 여부를 판단하는 것이 중요합니다.
        </p>
      </div>

    </div>
  </div>
)}
              {selectedProduct?.name === "장단점 분석" && (
  <div className="space-y-5">
    <div className="rounded-[18px] border border-[#E5EAF3] bg-[#F8FAFF] p-5">

      <p className="mb-3 text-[13px] font-semibold text-[#0565FF]">
        장단점 분석
      </p>

      <h4 className="mb-4 text-[22px] font-bold leading-[1.4] text-[#111827]">
        신용카드 현금화의 장단점 분석
      </h4>

      <div className="mb-6 rounded-[16px] bg-white p-4 shadow-sm">
        <p className="mb-2 text-[15px] font-bold text-[#111827]">
          한줄 요약
        </p>

        <div className="space-y-3 text-[14px] leading-[1.8] text-[#374151]">
          <p>
            <span className="font-semibold text-[#0565FF]">장점</span>
            : 빠른 진행, 비교적 간단한 절차, 심사 부담이 적음,
            상테크 이용 시 카드 혜택과 병행 가능
          </p>

          <p>
            <span className="font-semibold text-[#DC2626]">단점</span>
            : 수수료·이자 비용 발생, 카드사 모니터링 리스크,
            과도한 사용 시 신용도 하락 가능성 및 카드 제한 가능성
          </p>
        </div>
      </div>

      <div className="space-y-4">

        <div className="rounded-[16px] bg-white p-5 shadow-sm">
          <p className="mb-4 text-[18px] font-bold text-[#111827]">
            장점: 왜 사람들은 신용카드 현금화를 이용할까?
          </p>

          <div className="space-y-5 text-[15px] leading-[1.9] text-[#374151]">

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                1) 빠른 이용 가능
              </p>

              <p>
                은행 대출처럼 복잡한 서류 제출이나 긴 심사 기간 없이
                비교적 빠르게 자금을 확보할 수 있습니다.
                합법적인 상품권 거래 구조나 카드사 공식 서비스를 이용하는 경우
                수 분~당일 내 진행되는 사례도 있습니다.
              </p>
            </div>

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                2) 절차의 간편함
              </p>

              <p>
                카드론·현금서비스는 기존 카드 한도를 활용하기 때문에
                별도의 복잡한 대출 절차보다 간단하게 이용할 수 있으며,
                상품권 기반 거래 또한 비교적 단계가 단순한 편입니다.
              </p>
            </div>

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                3) 상환 기간 선택 가능
              </p>

              <p>
                월별 부담을 나누어 상환 계획을 세우기 쉬우며,
                급여일 전후처럼 단기 유동성이 필요한 상황에서
                브릿지 자금 형태로 활용되는 경우도 있습니다.
              </p>
            </div>

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                4) 담보가 필요 없음
              </p>

              <p>
                별도의 담보 없이도 카드 승인 한도 내에서 이용이 가능하며,
                추가 서류 부담이 적은 편입니다.
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-sm">
          <p className="mb-4 text-[18px] font-bold text-[#DC2626]">
            단점: 수수료와 신용 리스크
          </p>

          <div className="space-y-5 text-[15px] leading-[1.9] text-[#374151]">

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                1) 수수료 발생
              </p>

              <p>
                상품권 현금화 및 전문 매입 업체 이용 시 일정 수수료가 발생합니다.
                예를 들어 100만 원 결제에 5% 수수료가 적용되면 실제 수령 금액은
                약 95만 원 수준이 됩니다.
              </p>

              <div className="mt-3 rounded-[12px] bg-[#F5F7FA] p-3 text-[14px]">
                <p>백화점 상품권 평균 수수료: 3~5% 내외</p>
                <p>모바일 상품권 평균 수수료: 7~10% 내외</p>
              </div>
            </div>

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                2) 한도 축소 및 승인 거절 가능성
              </p>

              <p>
                반복적인 고액 결제나 동일 패턴 거래는 카드사 이상 거래
                시스템에 감지될 수 있으며,
                이에 따라 한도 축소 또는 승인 거절 가능성이 존재합니다.
              </p>
            </div>

            <div>
              <p className="mb-2 font-bold text-[#111827]">
                3) 과도한 이용 시 신용도 하락 가능성
              </p>

              <p>
                상환 계획 없이 반복적으로 사용할 경우 연체 가능성이 높아질 수
                있으며, 연체 기록은 신용평가에 장기간 영향을 줄 수 있습니다.
                이용 전 상환 가능 여부를 먼저 고려하는 것이 중요합니다.
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-sm">
          <p className="mb-4 text-[18px] font-bold text-[#111827]">
            예시로 보는 간단 계산
          </p>

          <div className="space-y-4 text-[15px] leading-[1.9] text-[#374151]">

            <div className="rounded-[14px] bg-[#F8FAFC] p-4">
              <p className="mb-2 font-bold text-[#0565FF]">
                상품권형 예시
              </p>

              <p>
                100만 원 결제 → 수수료 5% 가정 →
                실수령 약 95만 원
              </p>

              <p className="mt-2">
                확보한 자금을 다음 결제일까지 활용하고,
                카드 대금은 할부 또는 다음 달 결제로 상환하는 구조입니다.
              </p>
            </div>

            <div className="rounded-[14px] bg-[#F8FAFC] p-4">
              <p className="mb-2 font-bold text-[#0565FF]">
                카드론·현금서비스 예시
              </p>

              <p>
                카드론: 100만 원 이용 →
                약정 금리 적용 및 상환 기간 선택 가능
              </p>

              <p className="mt-2">
                현금서비스: 100만 원 이용 →
                약정 금리 적용 후 다음 달 결제일 일괄 상환
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-[18px] bg-[#EEF5FF] p-5">
          <p className="mb-2 text-[16px] font-bold text-[#1D4ED8]">
            비용 절감 팁
          </p>

          <p className="text-[15px] leading-[1.8] text-[#334155]">
            여유가 된다면 사용 기간을 최대한 짧게 유지하는 것이
            수수료와 이자 부담을 줄이는 데 도움이 될 수 있습니다.
          </p>
        </div>

      </div>

    </div>
  </div>
)}
              <div className="space-y-5">
  <div className="rounded-[18px] border border-[#E5EAF3] bg-[#F8FAFF] p-5">

    <p className="mb-3 text-[13px] font-semibold text-[#0565FF]">
      이용 전 체크사항
    </p>

    <h4 className="mb-4 text-[22px] font-bold leading-[1.4] text-[#111827]">
      이용 시 주의 사항 (TIP)
    </h4>

    <p className="mb-6 text-[15px] leading-[1.9] text-[#4B5563]">
      거래 전 기본적인 확인 사항만 점검해도 불필요한 위험을 줄이는 데
      도움이 될 수 있습니다. 아래 항목들을 먼저 확인해보세요.
    </p>

    <div className="space-y-4">

      <div className="rounded-[16px] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-[10px] w-[10px] rounded-full bg-[#0565FF]" />

          <p className="text-[17px] font-bold text-[#111827]">
            1) 카드사 내부 규정
          </p>
        </div>

        <p className="text-[15px] leading-[1.9] text-[#374151]">
          카드사는 자체적으로 위험 거래 기준을 운영합니다.
          특정 품목의 반복 결제, 단기간 고액 결제,
          동일 패턴의 반복 사용은 이상 거래로 인식될 수 있으며
          승인 거절 또는 추가 인증 요청 사유가 될 수 있습니다.
        </p>
      </div>

      <div className="rounded-[16px] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-[10px] w-[10px] rounded-full bg-[#0565FF]" />

          <p className="text-[17px] font-bold text-[#111827]">
            2) 과도한 이용 경고
          </p>
        </div>

        <p className="text-[15px] leading-[1.9] text-[#374151]">
          한 번에 과도하게 이용하는 경우 다음 달 카드 대금 부담이 커질 수
          있습니다. 사용 전 미리 상환 계획을 세우고,
          본인의 자금 상황에 맞게 이용하는 것이 중요합니다.
        </p>

        <div className="mt-4 rounded-[14px] bg-[#F5F7FA] p-4">
          <p className="text-[14px] leading-[1.8] text-[#4B5563]">
            짧은 시간 안에 반복적으로 고액 결제를 진행하는 경우
            카드 한도 축소, 거래 제한, 신용도 하락 가능성이 발생할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="rounded-[16px] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-[10px] w-[10px] rounded-full bg-[#0565FF]" />

          <p className="text-[17px] font-bold text-[#111827]">
            3) 사칭업체 피해 예방
          </p>
        </div>

        <p className="text-[15px] leading-[1.9] text-[#374151]">
          개인 거래 또는 검증되지 않은 업체를 이용할 경우
          사기 피해 위험이 존재할 수 있습니다.
          거래 전 업체 정보, 후기, 운영 기간,
          연락처 등을 충분히 확인하는 것이 중요합니다.
        </p>

        <div className="mt-4 rounded-[14px] bg-[#FFF7ED] p-4">
          <p className="mb-1 font-semibold text-[#EA580C]">
            주의해야 할 사례
          </p>

          <p className="text-[14px] leading-[1.8] text-[#7C2D12]">
            지나치게 낮은 수수료를 강조하거나,
            비정상적으로 좋은 조건만 제시하며 빠른 입금을 유도하는 경우에는
            추가 확인이 필요합니다.
          </p>
        </div>
      </div>

    </div>

    <div className="mt-6 rounded-[18px] bg-[#EEF5FF] p-5">
      <p className="mb-2 text-[16px] font-bold text-[#1D4ED8]">
        안전하게 확인하는 방법
      </p>

      <p className="text-[15px] leading-[1.8] text-[#334155]">
        진행 전 거래 구조, 수수료, 상환 계획,
        카드사 정책 여부를 충분히 확인하고,
        공식 정보와 실제 운영 여부를 먼저 검토하는 습관이 중요합니다.
      </p>
    </div>

  </div>
</div>
              <div className="space-y-6">
  <div className="rounded-[20px] border border-[#E5EAF3] bg-[#F8FAFF] p-5">

    <div className="mb-6">
      <p className="mb-3 inline-flex rounded-full bg-[#EEF4FF] px-3 py-1 text-[13px] font-semibold text-[#0565FF]">
        안전 거래 가이드
      </p>

      <h4 className="mb-4 text-[24px] font-bold leading-[1.4] text-[#111827]">
        안전하고 신뢰있는 업체 선택방법
      </h4>

      <p className="text-[15px] leading-[1.9] text-[#4B5563]">
        신용카드 현금화를 고려하고 있다면 어떤 방식으로,
        어떤 업체를 이용할 것인지 먼저 판단하는 과정이 중요합니다.
        아래 내용은 실제 거래 시 많이 확인하는 항목들을 기준으로
        정리한 체크리스트입니다.
      </p>
    </div>

    <div className="space-y-5">

      <div className="rounded-[18px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#0565FF] text-[15px] font-bold text-white">
            1
          </div>

          <p className="text-[18px] font-bold text-[#111827]">
            필수 확인 항목
          </p>
        </div>

        <div className="space-y-3 text-[15px] leading-[1.9] text-[#374151]">
          <p>
            거래 전 가장 먼저 확인해야 하는 부분은 실제 거래 구조가 존재하는지 여부입니다.
          </p>

          <div className="rounded-[14px] bg-[#F5F7FA] p-4">
            <ul className="space-y-2">
              <li>• 실물 거래가 실제로 이루어지는 구조인지 확인</li>
              <li>• 상품권·물품 구매 후 판매 방식인지 확인</li>
              <li>• 거래 영수증, 전표, 입금 내역 제공 여부 확인</li>
              <li>• 사업자등록번호와 사업장 주소 공개 여부 확인</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#0565FF] text-[15px] font-bold text-white">
            2
          </div>

          <p className="text-[18px] font-bold text-[#111827]">
            수수료의 투명성
          </p>
        </div>

        <div className="space-y-3 text-[15px] leading-[1.9] text-[#374151]">
          <p>
            신뢰할 수 있는 업체는 거래 전 수수료 구조를 명확하게 설명합니다.
            지나치게 낮은 수수료만 강조하는 경우에는 추가 확인이 필요할 수 있습니다.
          </p>

          <div className="rounded-[14px] bg-[#EEF5FF] p-4">
            <ul className="space-y-2 text-[#334155]">
              <li>• 수수료율 또는 범위를 사전에 안내하는지 확인</li>
              <li>• 거래 금액별 실제 수령 금액 예시 요청</li>
              <li>• 계좌이체·취소 수수료 등 추가 비용 여부 확인</li>
              <li>• 진행 도중 조건이 변경되는지 여부 확인</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#0565FF] text-[15px] font-bold text-white">
            3
          </div>

          <p className="text-[18px] font-bold text-[#111827]">
            거래 속도와 안정성
          </p>
        </div>

        <div className="space-y-3 text-[15px] leading-[1.9] text-[#374151]">
          <p>
            대부분의 거래는 급하게 진행되는 경우가 많기 때문에
            입금 속도와 거래 안정성도 중요한 요소입니다.
          </p>

          <div className="rounded-[14px] bg-[#F5F7FA] p-4">
            <ul className="space-y-2">
              <li>• 평균 송금 시간이 5~10분 이내인지 확인</li>
              <li>• 업체 명의 계좌를 사용하는지 확인</li>
              <li>• 개인 명의 계좌 사용 여부는 주의</li>
              <li>• 24시간 입금 가능 여부 확인</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#0565FF] text-[15px] font-bold text-white">
            4
          </div>

          <p className="text-[18px] font-bold text-[#111827]">
            고객 후기와 평판 확인
          </p>
        </div>

        <div className="space-y-3 text-[15px] leading-[1.9] text-[#374151]">
          <p>
            거래 전에는 업체명 검색을 통해 후기와 평판을 확인하는 것이 좋습니다.
            단일 후기만 보기보다 여러 채널을 함께 비교해보는 것이 중요합니다.
          </p>

          <div className="rounded-[14px] bg-[#FFF7ED] p-4">
            <ul className="space-y-2 text-[#7C2D12]">
              <li>• 구글·네이버·커뮤니티·SNS 후기 검색</li>
              <li>• 거래 속도와 응대 관련 리뷰 확인</li>
              <li>• 실제 거래 인증 캡처 포함 여부 확인</li>
              <li>• 광고성 후기만 반복되는 업체는 추가 검토 필요</li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <div className="mt-6 rounded-[18px] bg-[#EEF5FF] p-5">
      <p className="mb-2 text-[16px] font-bold text-[#1D4ED8]">
        체크 포인트 요약
      </p>

      <p className="text-[15px] leading-[1.9] text-[#334155]">
        거래 전에는 수수료·사업자 정보·실제 거래 여부·입금 계좌·후기 등을
        반드시 확인하고, 지나치게 좋은 조건만 강조하는 경우에는
        추가 검토 후 진행 여부를 판단하는 것이 좋습니다.
      </p>
    </div>

  </div>
</div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="mt-7 h-[52px] w-full rounded-[14px] bg-[#0565FF] text-[16px] font-semibold text-white transition hover:bg-[#0454D1]"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
