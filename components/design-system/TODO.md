# 📋 핀토스 디자인 시스템 - 다음 작업 목록

## ✅ 완료된 작업

- [x] Button 컴포넌트 (크기, 스타일, 상태별)
- [x] Icon 컴포넌트 (8가지 아이콘)
- [x] Sidebar 컴포넌트 (네비게이션 메뉴)
- [x] DateInput 컴포넌트 (날짜 입력 필드)
- [x] TextInputSection 컴포넌트 (제목/부제목 입력)
- [x] Header 컴포넌트 (로고 + 네비게이션)
- [x] 메인 페이지에 모든 컴포넌트 데모 추가

---

## 🚀 당신이 해야 할 작업 (우선순위 순)

### 1️⃣ **필수: 이미지 추출**
**우선순위: 🔴 높음**

```bash
# 작업 순서
1. Figma 디자인 파일 열기
2. 각 이미지 선택
3. 우클릭 > Export > PNG (2x 추천)
4. 다운로드한 파일을 /public/에 저장
```

**필요한 이미지:**
- `/public/logo.png` - Header 로고
- `/public/hero-image.png` - HeroSection 일러스트레이션
- `/public/brand-logo.png` - ProductCard 브랜드 로고

**현재 상태:** ❌ 누락

---

### 2️⃣ **선택: Sidebar 아이콘 SVG 추출**
**우선순위: 🟡 중간**

현재는 코드로 작성된 아이콘을 사용 중입니다. 더 정확한 디자인을 원한다면:

```bash
# 작업 순서
1. Figma에서 각 아이콘 선택 (결제내역, 공지사항, FAQ, 문의, 전체상품, TOP)
2. 우클릭 > Copy as SVG
3. /public/icons/ 폴더 생성
4. 각 SVG를 파일로 저장
   - card.svg (결제내역)
   - notice.svg (공지사항)
   - faq.svg
   - message.svg (문의)
   - menu.svg (전체상품)
   - top.svg
```

**위치:** `/public/icons/`
**현재 상태:** ⚠️ 선택사항 (현재는 SVG 코드 사용 중)

---

### 3️⃣ **페이지 라우팅 설정**
**우선순위: 🔴 높음**

각 메뉴 항목에 해당하는 페이지를 생성해야 합니다.

```bash
# 생성할 페이지 구조
app/
├── payment/          # 결제내역
│   └── page.tsx
├── notice/           # 공지사항
│   └── page.tsx
├── faq/              # FAQ
│   └── page.tsx
├── inquiry/          # 문의
│   └── page.tsx
└── products/         # 전체 상품
    └── page.tsx
```

**예시 코드 (app/payment/page.tsx):**

```tsx
'use client';

import { Header, Sidebar } from '@/components/design-system';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        logoSrc="/logo.png"
        navItems={[
          { label: '상품', href: '/products', active: false },
          { label: '문의', href: '/inquiry', active: false },
          { label: 'FAQ', href: '/faq', active: false },
        ]}
      />

      <div className="flex">
        <Sidebar activeItem="payment" />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">결제내역</h1>
          {/* 결제내역 컨텐츠 */}
        </main>
      </div>
    </div>
  );
}
```

---

### 4️⃣ **상태 관리 설정**
**우선순위: 🟢 낮음** (페이지가 단순하면 필요 없을 수도 있음)

전역 상태가 필요한 경우 (예: 사용자 정보, 장바구니 등):

**Option A: Zustand (추천)**

```bash
npm install zustand
```

```tsx
// store/useUserStore.ts
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**Option B: Jotai**

```bash
npm install jotai
```

**Option C: Context API** (내장, 설치 불필요)

---

### 5️⃣ **API 연동**
**우선순위: 🔴 높음**

백엔드 API와 연결이 필요하면:

**Step 1: React Query 설치**

```bash
npm install @tanstack/react-query
```

**Step 2: QueryClient 설정**

```tsx
// app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**Step 3: API 함수 작성**

```tsx
// lib/api.ts
export async function fetchPayments() {
  const response = await fetch('/api/payments');
  return response.json();
}
```

**Step 4: 페이지에서 사용**

```tsx
import { useQuery } from '@tanstack/react-query';
import { fetchPayments } from '@/lib/api';

export default function PaymentPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  if (isLoading) return <div>로딩 중...</div>;

  return <div>{/* 결제내역 표시 */}</div>;
}
```

---

## 📝 체크리스트

- [ ] 1. 이미지 추출 및 저장
  - [ ] `/public/logo.png` - Header 로고
  - [ ] `/public/hero-image.png` - HeroSection 일러스트
  - [ ] `/public/brand-logo.png` - ProductCard 브랜드 로고
- [ ] 2. (선택) Sidebar 아이콘 SVG 추출 (`/public/icons/`)
- [ ] 3. 페이지 라우팅 설정
  - [ ] `/app/payment/page.tsx`
  - [ ] `/app/notice/page.tsx`
  - [ ] `/app/faq/page.tsx`
  - [ ] `/app/inquiry/page.tsx`
  - [ ] `/app/products/page.tsx`
- [ ] 4. 상태 관리 설정 (필요시)
- [ ] 5. API 연동 설정

---

## 💡 추가 권장 사항

### 6️⃣ **반응형 디자인 추가**
현재 컴포넌트들은 데스크톱 기준입니다. 모바일 대응이 필요하면:

```tsx
// Tailwind breakpoints 사용
<div className="px-4 md:px-8 lg:px-[200px]">
```

### 7️⃣ **에러 바운더리 추가**

```tsx
// components/ErrorBoundary.tsx
'use client';

export function ErrorBoundary({ children }) {
  // 에러 처리 로직
}
```

### 8️⃣ **로딩 상태 컴포넌트**

```tsx
// app/loading.tsx
export default function Loading() {
  return <div>로딩 중...</div>;
}
```

---

## 🎯 빠른 시작 가이드

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 브라우저에서 확인
# http://localhost:3000

# 3. 모든 컴포넌트 데모 확인 가능
# - Button, Icon, Sidebar, DateInput, TextInputSection 등
```

---

## 🆘 도움이 필요하면?

- Figma 디자인 파일: [링크 제공 필요]
- 컴포넌트 문서: `/components/design-system/README.md`
- 질문이 있으면 개발팀에 문의하세요!
