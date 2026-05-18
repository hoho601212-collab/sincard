"use client";

import Image from "next/image";

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
  {
    id: 5,
    name: "틴캐시",
    imageUrl: "/placeholder.png",
  },
  {
    id: 6,
    name: "퍼니카드",
    imageUrl: "/placeholder.png",
  },
  {
    id: 7,
    name: "스팀월렛",
    imageUrl: "/placeholder.png",
  },
  {
    id: 8,
    name: "캐시플러스",
    imageUrl: "/placeholder.png",
  },
];

export function AllProductsSection() {
  return (
    <>
      <h2 className="text-[18px] font-semibold text-[#212121] mb-4 md:text-[20px] lg:text-[24px] md:mb-5 lg:mb-6">
        전체 상품 보기{" "}
        <span className="text-[#0565FF]">
          {voucherIssuers.length}
        </span>
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-8">
        {voucherIssuers.map((issuer) => (
          <div
            key={issuer.id}
            className="bg-white rounded-[10px] border-[1.5px] border-[#E0E0E0] p-4 flex flex-col items-center gap-3 hover:border-[#0565FF] transition-colors md:p-6 md:gap-4"
          >
            <div className="relative w-[70px] h-[70px] rounded-[10px] overflow-hidden md:w-[104px] md:h-[104px]">
              <Image
                src={issuer.imageUrl}
                alt={issuer.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 70px, 104px"
              />
            </div>

            <p className="text-[14px] font-semibold text-[#212121] text-center md:text-[20px]">
              {issuer.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
