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
    default: "신카머니존 | 신용카드 현금화 핵심 가이드",
    template: "%s | 신카머니존",
  },
  description:
    "신카머니존에서 신용카드 현금화 구조와 이용 전 확인해야 할 핵심 기준을 안내합니다.",
  keywords: ["신용카드 현금화", "신카 머니존"],
  authors: [{ name: "신카 머니존" }],
  creator: "신카 머니존",
  publisher: "신카 머니존",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://pintoss.co.kr",
  },
  openGraph: {
    title: "신카머니존 | 신용카드 현금화 핵심 가이드",
    description:
      "신카머니존에서 신용카드 현금화 구조와 이용 전 확인해야 할 핵심 기준을 안내합니다.",
    url: "https://pintoss.co.kr",
    siteName: "신카 머니존",
    images: [
      {
        url: "https://pintoss.co.kr/og-image.png",
        width: 1200,
        height: 630,
        alt: "신카머니존 | 신용카드 현금화 핵심 가이드",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "신카머니존 | 신용카드 현금화 핵심 가이드",
    description:
      "신카머니존에서 신용카드 현금화 구조와 이용 전 확인해야 할 핵심 기준을 안내합니다.",
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
