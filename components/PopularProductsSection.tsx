"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useVoucherIssuersAPI } from "@/lib/api/product";

export function PopularProductsSection() {
  const router = useRouter();
  const { data: response } = useVoucherIssuersAPI();

  const voucherIssuers = response?.data ?? [];
  const defaultPrices = [10000, 5000, 5000, 10000];

  if (voucherIssuers.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 md:gap-8">
      {voucherIssuers.slice(0, 4).map((issuer, index) => (
        <div
          key={issuer.id}
          className="bg-white rounded-[10px] border-[1.5px] border-[#E0E0E0] p-4 flex flex-col items-center min-w-[150px] md:p-6 md:min-w-[236px]"
        >
          <div className="relative w-[70px] h-[70px] rounded-[10px] overflow-hidden md:w-[104px] md:h-[104px]">
            <Image
              src={issuer.imageUrl || "/placeholder.png"}
              alt={issuer.name || "상품권 이미지"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 70px, 104px"
            />
          </div>

          <div className="text-center mt-3 md:mt-4 flex-1 flex flex-col justify-center">
            <p className="text-[14px] font-medium text-[#757575] md:text-[18px] line-clamp-2 min-h-[40px] md:min-h-[52px]">
              {issuer.name}
            </p>

            <p className="text-[16px] font-semibold text-[#212121] md:text-[20px] mt-1">
              {(defaultPrices[index] ?? 0).toLocaleString()}원
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/product/${issuer.id}`)}
            className="w-full border-[1.5px] border-[#0565FF] rounded-[10px] py-2.5 text-[14px] font-semibold text-[#0565FF] hover:bg-[#E6F0FF] transition-colors md:py-3 md:text-[18px] mt-3 md:mt-4"
          >
            구매하기
          </button>
        </div>
      ))}
    </div>
  );
}
