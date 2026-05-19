"use client";

import { useState } from "react";
import Image from "next/image";

export function AllProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const voucherIssuers = [
    {
      id: 1,
      name: "모바일 문화상품권",
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
      <h2 className="text-[18px] font-semibold text-[#212121] mb-4 md:text-[20px] lg:text-[24px] md:mb-5 lg:mb-6">
        전체 상품 보기{" "}
        <span className="text-[#0565FF]">{voucherIssuers.length}</span>
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {voucherIssuers.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedProduct(item)}
            className="h-[200px] rounded-[10px] border border-[#E0E0E0] bg-white p-6 text-left transition hover:border-[#0565FF] hover:shadow-md"
          >
            <div className="mb-12 flex justify-center">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={80}
                height={80}
              />
            </div>

            <p className="text-[18px] font-semibold text-[#212121]">
              {item.name}
            </p>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="relative w-full max-w-[420px] rounded-[20px] bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-[22px] text-[#777]"
            >
              ×
            </button>

            <div className="mb-5 flex justify-center">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                width={90}
                height={90}
              />
            </div>

            <h3 className="mb-3 text-center text-[22px] font-bold text-[#212121]">
              {selectedProduct.name}
            </h3>

            <p className="mb-6 text-center text-[15px] leading-[1.7] text-[#555]">
              선택하신 상품권의 이용 가능 여부와 결제 진행 정보를 확인할 수 있습니다.
            </p>

            <div className="rounded-[14px] bg-[#F5F8FF] p-4 text-[14px] leading-[1.7] text-[#333]">
              <p>상품명: {selectedProduct.name}</p>
              <p>진행 방식: 상품권 선택 후 결제 안내</p>
              <p>확인 사항: 한도, 정책, 결제 가능 여부</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="mt-6 h-[48px] w-full rounded-[12px] bg-[#0565FF] text-[16px] font-semibold text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
