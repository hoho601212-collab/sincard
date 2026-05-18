"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PortableText } from "@/sanity/components/PortableText";
import type { FAQ } from "@/sanity/types";

export function FaqAccordion({ items }: { items: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {items.map((item) => {
        const isOpen = openId === item._id;

        return (
          <div
            key={item._id}
            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
              isOpen
                ? "border-[#0565FF] shadow-md"
                : "border-[#E0E0E0] hover:border-[#9E9E9E]"
            }`}
          >
            {/* Question Button */}
            <button
              onClick={() => toggleItem(item._id)}
              className="w-full flex justify-between items-center gap-4 p-4 md:p-5 lg:p-6 text-left bg-white hover:bg-[#FAFAFA] transition-colors"
              aria-expanded={isOpen}
            >
              <span className={`font-semibold text-[14px] md:text-[16px] lg:text-[17px] leading-relaxed ${
                isOpen ? "text-[#0565FF]" : "text-[#212121]"
              }`}>
                Q. {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 md:h-6 md:w-6 shrink-0 transition-transform duration-200 ${
                  isOpen
                    ? "rotate-180 text-[#0565FF]"
                    : "text-[#757575]"
                }`}
              />
            </button>

            {/* Answer Content */}
            {isOpen && (
              <div className="border-t border-[#E0E0E0] bg-gradient-to-b from-[#F5F9FF] to-white animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
                  <div className="flex gap-2 md:gap-3">
                    <span className="text-[#0565FF] font-bold text-[14px] md:text-[16px] lg:text-[17px] shrink-0">
                      A.
                    </span>
                    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-[#424242] leading-relaxed">
                      <PortableText value={item.answer} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
