# Sanity + Next.js 공지사항/FAQ 게시판 구현 가이드

## 프로젝트 개요

비개발자 관리자가 쉽게 콘텐츠를 관리할 수 있는 공지사항/FAQ 게시판 시스템

### 요구사항

- 관리자가 직관적인 UI로 글 작성/수정/삭제
- 리치 텍스트 에디터 + 이미지 삽입 지원
- 백엔드 없이 Next.js + Headless CMS로 구현

---

## 기술 스택

| 역할       | 기술                     |
| ---------- | ------------------------ |
| 프론트엔드 | Next.js 14 (App Router)  |
| CMS        | Sanity v3                |
| 스타일링   | Tailwind CSS             |
| 배포       | Vercel                   |
| 이미지     | Sanity CDN (자동 최적화) |

---

## 플로우

```
[메인페이지] /
    │
    ├── 공지사항 최신 5개 표시
    │       └── "더보기" 클릭 → [목록] /notice
    │                               └── 항목 클릭 → [상세] /notice/[slug]
    │
    └── FAQ 최신 5개 표시
            └── "더보기" 클릭 → [목록] /faq (아코디언)

[관리자 페이지] /studio
    ├── 공지사항 CRUD
    └── FAQ CRUD
```

---

## 폴더 구조

```
project-root/
├── app/
│   ├── page.tsx                    # 메인 (공지사항/FAQ 미리보기)
│   ├── notice/
│   │   ├── page.tsx                # 공지사항 목록
│   │   └── [slug]/
│   │       └── page.tsx            # 공지사항 상세
│   ├── faq/
│   │   └── page.tsx                # FAQ 목록 (아코디언)
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx            # Sanity Studio (관리자)
├── sanity/
│   ├── schemas/
│   │   ├── index.ts
│   │   ├── notice.ts               # 공지사항 스키마
│   │   └── faq.ts                  # FAQ 스키마
│   ├── lib/
│   │   ├── client.ts               # Sanity 클라이언트
│   │   ├── queries.ts              # GROQ 쿼리
│   │   └── image.ts                # 이미지 URL 빌더
│   └── components/
│       └── PortableText.tsx        # 리치텍스트 렌더러
├── sanity.config.ts
├── sanity.cli.ts
└── .env.local
```

---

## 1단계: Sanity 설정

### 1.1 패키지 설치

```bash
npm install next-sanity @sanity/image-url @portabletext/react sanity
```

### 1.2 환경변수 (.env.local)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 1.3 Sanity 설정 파일

```ts
// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "안지향 관리자",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: "/studio",

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
```

---

## 2단계: 스키마 정의

### 2.1 공지사항 스키마

```ts
// sanity/schemas/notice.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "notice",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (Rule) => Rule.required().error("제목을 입력해주세요"),
    }),
    defineField({
      name: "slug",
      title: "URL 슬러그",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "내용",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "본문", value: "normal" },
            { title: "제목1", value: "h2" },
            { title: "제목2", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "대체 텍스트",
            },
            {
              name: "caption",
              type: "string",
              title: "캡션",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "isPublished",
      title: "공개 여부",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "createdAt",
      title: "작성일",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "최신순",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "createdAt",
      published: "isPublished",
    },
    prepare({ title, date, published }) {
      return {
        title: `${published ? "" : "[비공개] "}${title}`,
        subtitle: new Date(date).toLocaleDateString("ko-KR"),
      };
    },
  },
});
```

### 2.2 FAQ 스키마

```ts
// sanity/schemas/faq.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "자주 묻는 질문",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "질문",
      type: "string",
      validation: (Rule) => Rule.required().error("질문을 입력해주세요"),
    }),
    defineField({
      name: "answer",
      title: "답변",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "본문", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "string",
      options: {
        list: [
          { title: "수강 관련", value: "course" },
          { title: "결제 관련", value: "payment" },
          { title: "계정 관련", value: "account" },
          { title: "기타", value: "etc" },
        ],
      },
      initialValue: "etc",
    }),
    defineField({
      name: "order",
      title: "순서",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isPublished",
      title: "공개 여부",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "question",
      category: "category",
      published: "isPublished",
    },
    prepare({ title, category, published }) {
      const categoryMap: Record<string, string> = {
        course: "수강",
        payment: "결제",
        account: "계정",
        etc: "기타",
      };
      return {
        title: `${published ? "" : "[비공개] "}${title}`,
        subtitle: categoryMap[category] || category,
      };
    },
  },
});
```

### 2.3 스키마 인덱스

```ts
// sanity/schemas/index.ts
import notice from "./notice";
import faq from "./faq";

export const schemaTypes = [notice, faq];
```

---

## 3단계: Sanity 클라이언트 및 쿼리

### 3.1 클라이언트 설정

```ts
// sanity/lib/client.ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === "production",
});
```

### 3.2 이미지 URL 빌더

```ts
// sanity/lib/image.ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

### 3.3 GROQ 쿼리

```ts
// sanity/lib/queries.ts

// 공지사항 - 최신 N개
export const noticesQuery = (limit: number = 5) => `
  *[_type == "notice" && isPublished == true] | order(createdAt desc) [0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    createdAt
  }
`;

// 공지사항 - 전체 목록 (페이지네이션)
export const noticesListQuery = (start: number, end: number) => `
  *[_type == "notice" && isPublished == true] | order(createdAt desc) [${start}...${end}] {
    _id,
    title,
    "slug": slug.current,
    createdAt
  }
`;

// 공지사항 - 전체 개수
export const noticesCountQuery = `
  count(*[_type == "notice" && isPublished == true])
`;

// 공지사항 - 상세
export const noticeBySlugQuery = `
  *[_type == "notice" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    content,
    createdAt
  }
`;

// FAQ - 최신 N개
export const faqsQuery = (limit: number = 5) => `
  *[_type == "faq" && isPublished == true] | order(order asc) [0...${limit}] {
    _id,
    question,
    answer,
    category
  }
`;

// FAQ - 전체 (카테고리별)
export const faqsAllQuery = `
  *[_type == "faq" && isPublished == true] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;
```

---

## 4단계: Sanity Studio 페이지

```tsx
// app/studio/[[...tool]]/page.tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

```ts
// app/studio/[[...tool]]/layout.tsx
export const metadata = {
  title: "관리자 페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

---

## 5단계: 프론트엔드 페이지

### 5.1 Portable Text 컴포넌트 (리치텍스트 렌더링)

```tsx
// sanity/components/PortableText.tsx
import { PortableText as PortableTextComponent } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            width={800}
            height={400}
            className="rounded-lg"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
  },
};

export function PortableText({ value }: { value: any }) {
  return <PortableTextComponent value={value} components={components} />;
}
```

### 5.2 메인 페이지 (미리보기)

```tsx
// app/page.tsx
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { noticesQuery, faqsQuery } from "@/sanity/lib/queries";

export const revalidate = 60; // ISR: 60초마다 재생성

export default async function HomePage() {
  const notices = await client.fetch(noticesQuery(5));
  const faqs = await client.fetch(faqsQuery(5));

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 공지사항 섹션 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">공지사항</h2>
          <Link href="/notice" className="text-blue-600 hover:underline">
            더보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {notices.map((notice: any) => (
            <li key={notice._id}>
              <Link
                href={`/notice/${notice.slug}`}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <span className="font-medium">{notice.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">자주 묻는 질문</h2>
          <Link href="/faq" className="text-blue-600 hover:underline">
            더보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {faqs.map((faq: any) => (
            <li key={faq._id} className="p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Q. {faq.question}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

### 5.3 공지사항 목록 페이지

```tsx
// app/notice/page.tsx
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { noticesListQuery, noticesCountQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

const PER_PAGE = 10;

export default async function NoticePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [notices, totalCount] = await Promise.all([
    client.fetch(noticesListQuery(start, end)),
    client.fetch(noticesCountQuery),
  ]);

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">공지사항</h1>

      <ul className="space-y-3 mb-8">
        {notices.map((notice: any) => (
          <li key={notice._id}>
            <Link
              href={`/notice/${notice.slug}`}
              className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <span className="font-medium">{notice.title}</span>
              <span className="text-sm text-gray-500">
                {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/notice?page=${p}`}
            className={`px-4 py-2 rounded ${
              p === page
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>
    </main>
  );
}
```

### 5.4 공지사항 상세 페이지

```tsx
// app/notice/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { noticeBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/sanity/components/PortableText";

export const revalidate = 60;

export default async function NoticeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const notice = await client.fetch(noticeBySlugQuery, { slug: params.slug });

  if (!notice) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/notice"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← 목록으로
      </Link>

      <article>
        <h1 className="text-3xl font-bold mb-4">{notice.title}</h1>
        <p className="text-gray-500 mb-8">
          {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
        </p>

        <div className="prose prose-lg max-w-none">
          <PortableText value={notice.content} />
        </div>
      </article>
    </main>
  );
}
```

### 5.5 FAQ 페이지 (아코디언)

```tsx
// app/faq/page.tsx
import { client } from "@/sanity/lib/client";
import { faqsAllQuery } from "@/sanity/lib/queries";
import { FaqAccordion } from "./FaqAccordion";

export const revalidate = 60;

export default async function FaqPage() {
  const faqs = await client.fetch(faqsAllQuery);

  // 카테고리별 그룹핑
  const grouped = faqs.reduce((acc: any, faq: any) => {
    const category = faq.category || "etc";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {});

  const categoryNames: Record<string, string> = {
    course: "수강 관련",
    payment: "결제 관련",
    account: "계정 관련",
    etc: "기타",
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">자주 묻는 질문</h1>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {categoryNames[category] || category}
          </h2>
          <FaqAccordion items={items as any[]} />
        </section>
      ))}
    </main>
  );
}
```

```tsx
// app/faq/FaqAccordion.tsx
"use client";

import { useState } from "react";
import { PortableText } from "@/sanity/components/PortableText";

interface FaqItem {
  _id: string;
  question: string;
  answer: any;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item._id} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenId(openId === item._id ? null : item._id)}
            className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
          >
            <span className="font-medium">Q. {item.question}</span>
            <span className="text-2xl">{openId === item._id ? "−" : "+"}</span>
          </button>
          {openId === item._id && (
            <div className="p-4 pt-0 border-t bg-gray-50">
              <div className="prose prose-sm max-w-none">
                <PortableText value={item.answer} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 6단계: 배포

### Vercel 배포

```bash
# Vercel CLI로 배포
npx vercel

# 환경변수 설정 (Vercel 대시보드에서)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Sanity 프로젝트 생성

```bash
# Sanity 프로젝트 초기화 (최초 1회)
npx sanity init

# 스키마 배포
npx sanity deploy
```

---

## 관리자 사용 가이드

### 접속 방법

1. 브라우저에서 `https://your-domain.com/studio` 접속
2. Sanity 계정으로 로그인

### 공지사항 작성

1. 좌측 메뉴에서 "공지사항" 클릭
2. 우측 상단 "+" 버튼 클릭
3. 제목 입력
4. "Generate" 버튼으로 URL 슬러그 자동 생성
5. 내용 작성 (이미지는 드래그앤드롭 또는 📷 아이콘)
6. "공개 여부" 체크
7. "Publish" 버튼 클릭

### FAQ 작성

1. 좌측 메뉴에서 "자주 묻는 질문" 클릭
2. 우측 상단 "+" 버튼 클릭
3. 질문/답변 입력
4. 카테고리 선택
5. 순서 번호 입력 (낮을수록 위에 표시)
6. "Publish" 버튼 클릭

### 수정/삭제

- 목록에서 항목 클릭 → 수정 후 "Publish"
- 삭제: 항목 열기 → 우측 상단 "..." → "Delete"

---

## 체크리스트

- [ ] Sanity 프로젝트 생성 (sanity.io에서)
- [ ] 환경변수 설정 (.env.local)
- [ ] 스키마 파일 작성
- [ ] Sanity Studio 페이지 생성
- [ ] 클라이언트 및 쿼리 파일 작성
- [ ] PortableText 컴포넌트 작성
- [ ] 프론트엔드 페이지 구현
- [ ] Vercel 배포
- [ ] CORS 설정 (Sanity 대시보드 → Settings → API)
- [ ] 관리자 계정 초대 (Sanity 대시보드 → Settings → Members)
