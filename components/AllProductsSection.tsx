"use client";

import { useState } from "react";
import Image from "next/image";

export function AllProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const voucherIssuers = [
    {
      id: 1,
      name: "신용카드 현금화란?",
      imageUrl: "/placeholder.png",
    },
    {
      id: 2,
      name: "구글플레이",
      imageUrl: "/placeholder.png",
    },
    {
      id: 3,
      name: "도서문화상품권",
      imageUrl: "/placeholder.png",
    },
    {
      id: 4,
      name: "에그머니",
      imageUrl: "/placeholder.png",
    },
  ];

  return (
    <>
      <h2 className="mb-4 text-[18px] font-semibold text-[#212121] md:mb-5 md:text-[20px] lg:mb-6 lg:text-[24px]">
        전체 상품 보기{" "}
        <span className="text-[#0565FF]">{voucherIssuers.length}</span>
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {voucherIssuers.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedProduct(item)}
            className="h-[200px] rounded-[16px] border border-[#E5E7EB] bg-white p-6 text-left transition duration-200 hover:border-[#0565FF] hover:shadow-lg"
          >
            <div className="mb-12 flex justify-center">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <p className="text-[18px] font-semibold leading-[1.5] text-[#212121]">
              {item.name}
            </p>
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
