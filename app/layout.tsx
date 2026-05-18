import type { Metadata } from "next";
import { Toaster } from "sonner";

import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/components/auth";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";

import { pretendard } from "../lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pintoss.co.kr"),
  title: {
    default: "핸드폰 소액결제 | 컬쳐랜드,온라인 문화상품권 구매 다양한 결제 상품권 현금화",
    template: "%s | PINTOSS MALL",
  },
  description:
    "핸드폰 소액결제 신용카드, 핸드폰결제 전용 24시간 실시간발권 신세계상품권,컬쳐랜드상품권,문화상품권등을 실시간 발권합니다",
  keywords: [
  "핸드폰 소액결제",
  "휴대폰 소액결제",
  "소액결제 현금화",
  "소액결제현금화", 
  "휴대폰 결제 구조",
  "소액결제 이용 흐름",
  "휴대폰 소액결제 안내",
  "상품권 결제 방식",
  "상품권 이용 가이드",
  "모바일 결제 정보",
  "휴대폰결제 절차",
  "결제 제한 사유",
  "상품권 사용 흐름",
  "온라인 상품권 정보",
  "모바일상품권 안내",
  "기프트카드 이용 방법",
  "컬쳐랜드 이용 안내",
  "도서문화상품권 사용법",
  "구글 기프트카드 안내",
  "휴대폰 인증 절차",
  "휴대폰결제 기준",
  "상품권 구매 과정",
  "결제 정책 안내",
  "휴대폰 결제 FAQ",
  "상품권 이용 기준",
  "결제 오류 원인",
  "모바일 결제 가이드",
  "온라인 결제 흐름",
  "상품권 정보 페이지",
  "휴대폰 결제 확인사항",
  ],
  authors: [{ name: "PINTOSS MALL" }],
  creator: "PINTOSS MALL",
  publisher: "PINTOSS MALL",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://pintoss.co.kr",
  },
  
  verification: {
    google: "HbcLE5gNg0Ya-TDJRhKtF5UBRKF8-koDk43YBgzxapo",
    other: {
      "naver-site-verification": "37a117ff6475928f6ce764fbddf83ff62f6e2e7a",
    },
  },
  openGraph: {
    title: "핸드폰 소액결제 | 컬쳐랜드,온라인 문화상품권 구매 다양한 결제 상품권 현금화",
    description:
      "핸드폰 소액결제 신용카드, 핸드폰결제 전용 24시간 실시간발권 신세계상품권,컬쳐랜드상품권,문화상품권등을 실시간 발권합니다",
    url: "https://pintoss.co.kr",
    siteName: "핀토스몰 PinToss Mall",
    images: [
      {
        url: "https://pintoss.co.kr/og-image.png",
        width: 1200,
        height: 630,
        alt: "핸드폰 소액결제|컬쳐랜드,온라인 문화상품권 구매 다양한 결제",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "핸드폰 소액결제 | 컬쳐랜드,온라인 문화상품권 구매 다양한 결제 상품권 현금화",
    description:
      "핸드폰 소액결제 신용카드, 핸드폰결제 전용 24시간 실시간발권 신세계상품권,컬쳐랜드상품권,문화상품권등을 실시간 발권합니다",
    images: ["https://pintoss.co.kr/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Hero 이미지 preload (LCP 최적화) */}
        <link
          rel="preload"
          as="image"
          href="/Group 14.png"
          type="image/png"
          fetchPriority="high"
        />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${pretendard.variable}`}>
        <div className="flex min-h-screen flex-col">
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors offset={80} />
            </AuthProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
