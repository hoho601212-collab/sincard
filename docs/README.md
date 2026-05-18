# 프로젝트 기술 문서

다른 프로젝트로 이식하기 위한 전체 기술 스펙 정리 문서입니다.

**중요:** 이 프로젝트는 **관리자 기능**, **고객센터/QNA**, **장바구니 기능이 제거**되었습니다. 상품 상세에서 바로 구매만 가능합니다.

---

## 📚 문서 목록

### 1. [도메인별 플로우 문서](#도메인별-플로우-문서)
각 도메인의 사용자 플로우 및 상세 기능 설명

### 2. [API 엔드포인트 문서](./API-ENDPOINTS.md)
백엔드 API 전체 목록 및 Request/Response 예시

### 3. [컴포넌트 가이드](./COMPONENTS-GUIDE.md)
재사용 가능한 컴포넌트 구조 및 이식 가이드

---

## 도메인별 플로우 문서

### [1. 인증 & 회원가입](./1-authentication-flow.md)
- 일반 로그인 (이메일/비밀번호)
- OAuth 소셜 로그인 (카카오, 네이버)
- 회원가입 + NICE 본인인증
- 아이디 찾기 / 비밀번호 재설정
- 토큰 관리 및 자동 재발급

**주요 기능:**
- React Hook Form + Zod 폼 검증
- AuthContext 전역 인증 관리
- NICE API 본인인증 연동
- OAuth 리다이렉트 처리

---

### [2. 상품](./2-product-flow.md)
- 상품 목록 조회 (홈, 인기 상품, 할인 상품)
- 상품 상세 조회
- 권종(가격 카테고리) 선택
- 수량 선택
- **바로 결제만 가능** (장바구니 제거됨)

**주요 기능:**
- 할인율 계산
- 재고 확인
- React Query 데이터 캐싱

---

### [3. 주문](./3-order-flow.md)
- 주문 생성 (상품 상세에서 바로 구매)
- 주문 목록 조회 (검색, 필터링, 페이지네이션)
- 주문 상세 조회
- 주문 상태 관리

**주요 기능:**
- 결제 수단 선택 (CARD, PHONE, DEPOSIT)
- 페이지네이션
- 주문 상태별 필터링

**주의:** 장바구니 기능이 제거되어 한 번에 하나의 상품만 구매 가능합니다.

---

### [4. 결제](./4-payment-flow.md)
- 결제 프로세스 전체 플로우
- PG 연동 (갤럭시아)
- 결제 수단별 처리
  - 신용카드/체크카드
  - 휴대폰 소액결제
  - 무통장입금 (가상계좌)
- 결제 결과 처리

**주요 기능:**
- 외부 PG 스크립트 동적 로드
- postMessage를 통한 결제 결과 수신
- 결제 성공/실패 분기 처리

---

### [5. 마이페이지 & 회원 관리](./5-mypage-user-flow.md)
- 회원 정보 조회 및 수정
- 비밀번호 변경
- 전화번호 변경 (NICE 재인증)
- 회원 탈퇴
- 로그인 타입별 제한사항

**주요 기능:**
- OAuth 로그인 사용자 vs 이메일 로그인 사용자 분기
- 정보 수정 낙관적 업데이트
- 비밀번호 변경 후 자동 로그아웃

---

## 프로젝트 아키텍처

### 기술 스택
```
Frontend Framework:  Next.js 14 (App Router)
Language:            TypeScript
Styling:             Vanilla Extract (CSS-in-JS)
State Management:    React Query, Context API, Zustand
Form Management:     React Hook Form + Zod
Authentication:      JWT Token (Bearer)
Payment Gateway:     갤럭시아 (Billgate)
OAuth:               카카오, 네이버
본인인증:            NICE API
```

---

### 폴더 구조
```
src/
├── app/                    # Next.js 14 App Router 페이지
│   ├── (auth)/             # 인증 라우트 그룹
│   ├── (user)/             # 사용자 라우트 그룹
│   ├── (privacy)/          # 개인정보/이용약관
│   ├── order/              # 주문
│   ├── payments/           # 결제
│   └── product/            # 상품
│
├── components/             # 도메인별 컴포넌트
│   ├── auth/               # 인증
│   ├── product/            # 상품
│   ├── order/              # 주문
│   ├── payment/            # 결제
│   ├── user/               # 사용자
│   ├── home/               # 홈
│   ├── nav/                # 네비게이션
│   └── footer/             # 푸터
│
├── shared/                 # 재사용 가능한 공통 컴포넌트
│   ├── components/
│   │   ├── layout/         # Box, Flex, Grid 등
│   │   ├── button/         # Button
│   │   ├── input/          # Input
│   │   ├── alert/          # Alert (모달)
│   │   ├── pagination/     # Pagination
│   │   ├── spinner/        # Spinner
│   │   └── back-drop/      # BackDrop
│   └── styles/             # 공통 스타일
│       ├── theme.css.ts
│       ├── common.css.ts
│       └── animations.css.ts
│
├── controllers/            # API 호출 함수
│   ├── auth/
│   ├── product/
│   ├── order/
│   ├── user/
│   └── new-api-service.ts  # API 클라이언트
│
├── contexts/               # React Context
│   ├── AuthContext.tsx     # 인증 상태 관리
│   └── AlertContext.tsx    # 알림 모달 관리
│
├── hooks/                  # Custom Hooks
│   ├── useAlertContext.ts
│   ├── useOrder.tsx
│   ├── useRedirect.ts
│   └── useScrollAnimation.ts
│
├── store/                  # Zustand 상태 관리
│   └── useOAuthStore.ts    # OAuth 임시 데이터
│
├── react-query/            # React Query 설정
│   └── Providers.tsx
│
├── models/                 # 데이터 모델
├── types/                  # TypeScript 타입
└── utils/                  # 유틸리티 함수
    └── fetchApi.ts         # API Wrapper
```

---

## 재사용 가능한 공통 컴포넌트

### 레이아웃 시스템
```tsx
// Box: 다형성 컴포넌트
<Box as="div" padding={20} backgroundColor="gray">
  Content
</Box>

// Flex: Flexbox 레이아웃
<Flex direction="row" justify="space-between" align="center" gap={10}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Grid: Grid 레이아웃
<Grid columns={3} gap={20}>
  <GridItem>Item 1</GridItem>
  <GridItem colSpan={2}>Item 2</GridItem>
</Grid>
```

**위치:** `src/shared/components/layout/`

---

### 폼 컴포넌트
```tsx
// Button
<Button
  backgroundColor="blue"
  hoverBackgroundColor="darkblue"
  onClick={handleClick}
>
  클릭
</Button>

// Input
<Input
  type="email"
  placeholder="이메일 입력"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

**위치:** `src/shared/components/button/`, `src/shared/components/input/`

---

### Alert 시스템
```tsx
const { open } = useAlertContext();

open({
  title: '확인',
  description: '정말 삭제하시겠습니까?',
  leftButtonLabel: '취소',
  rightButtonLabel: '삭제',
  onClickRightButton: handleDelete,
});
```

**위치:**
- `src/shared/components/alert/Alert.tsx`
- `src/contexts/AlertContext.tsx`
- `src/hooks/useAlertContext.ts`

---

## 상태 관리 전략

### 전역 상태: Context API
```tsx
// 인증
const { isAuthenticated, user, login, logout } = useAuth();

// 알림
const { open, close } = useAlertContext();
```

---

### 서버 상태: React Query
```tsx
// 쿼리
const { data: orders } = useQuery(['orderList', filters], fetchOrderList);

// 뮤테이션
const mutation = useMutation(fetchCreateOrder, {
  onSuccess: () => queryClient.invalidateQueries(['orderList']),
});
```

---

### 로컬 상태: useState, React Hook Form
```tsx
// 간단한 상태
const [count, setCount] = useState(0);

// 폼 상태
const { register, handleSubmit, formState: { errors } } = useForm();
```

---

## 주요 사용자 플로우

### 구매 플로우 (장바구니 없음)
```
1. 상품 목록 (홈페이지)
   ↓
2. 상품 상세 페이지
   └─ 권종 선택 (10,000원, 50,000원 등)
   └─ 수량 선택
   └─ 결제 수단 선택 (CARD, PHONE, DEPOSIT)
   ↓
3. "바로 결제하기" 버튼 클릭
   ↓
4. 로그인 확인
   └─ 비로그인: 로그인 페이지
   └─ 로그인: 계속 진행
   ↓
5. 주문 생성 (POST /api/orders)
   ↓
6. PG 결제 창 오픈
   ↓
7. 결제 완료/실패
   ↓
8. /payments/result 결과 페이지
   └─ 성공: 주문 내역으로 이동
   └─ 실패: 상품 페이지로 복귀
   ↓
9. 주문 내역에서 상품권 확인
   └─ 바코드, 상품권 번호, 유효기간
```

---

## 인증 플로우

### 토큰 관리
```
1. 로그인 성공
   └─ accessToken을 localStorage에 저장

2. API 요청
   └─ Authorization: Bearer {token} 헤더 자동 추가

3. 401 에러 발생
   └─ POST /api/auth/reissue (토큰 재발급)
       ├─ 성공: 새 토큰 저장 → 원래 요청 재시도
       └─ 실패: 로그아웃 → 로그인 페이지 이동
```

---

## 다른 프로젝트로 이식하기

### Step 1: 공통 컴포넌트 복사
```bash
cp -r src/shared/components /new-project/src/
```

**재사용 가능:**
- Box, Flex, Grid (레이아웃)
- Button, Input (폼)
- Alert, Pagination (피드백)

---

### Step 2: Context 복사
```bash
cp src/contexts/AlertContext.tsx /new-project/src/contexts/
cp src/contexts/AuthContext.tsx /new-project/src/contexts/
```

**주의:** AuthContext는 API 엔드포인트 수정 필요

---

### Step 3: API 계층 수정
```typescript
// BASE_URL 변경
const API_BASE_URL = 'https://new-api.com';

// 엔드포인트 매핑
POST /api/auth/login        → POST /api/v1/auth/signin
GET  /api/orders            → GET  /api/v1/orders
...
```

---

### Step 4: 도메인 컴포넌트 이식
```bash
# 필요한 도메인만 선택적으로 복사
cp -r src/components/auth /new-project/src/components/
cp -r src/components/product /new-project/src/components/
```

**주의:** API 호출 부분 수정 필요

---

## 필수 패키지

```json
{
  "dependencies": {
    "next": "^14.2.24",
    "react": "^18",
    "react-dom": "^18",
    "@vanilla-extract/css": "^1.13.0",
    "@vanilla-extract/dynamic": "^2.0.3",
    "@tanstack/react-query": "^5.66.0",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.2",
    "zustand": "^5.0.5",
    "clsx": "^2.0.0",
    "react-icons": "^4.11.0"
  }
}
```

---

## 디자인만 변경하기

### Vanilla Extract 스타일 수정
```typescript
// src/shared/styles/theme.css.ts
export const colors = {
  primary: '#007bff',      // 변경: 메인 컬러
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  // ...
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  // ...
};
```

---

### 컴포넌트 스타일 교체
```typescript
// 기존 Vanilla Extract
import * as styles from './Button.css';

// Tailwind CSS로 교체
<button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click
</button>
```

---

## 제거된 기능

### 1. 장바구니
- **제거 이유**: 구매 플로우 단순화
- **대체**: 상품 상세에서 바로 구매
- **영향**: 여러 상품 동시 구매 불가능 → 한 번에 하나씩만 구매

### 2. 관리자 페이지
- **제거 항목**:
  - 상품 관리
  - 주문 관리
  - 회원 관리
  - 게시판 관리
  - 배너 관리
- **영향**: 프론트엔드에서 관리 기능 없음 (백엔드 API로 직접 관리)

### 3. 고객센터/QNA
- **제거 항목**:
  - 공지사항
  - FAQ
  - 1:1 문의
  - 게시판
- **영향**: 정적 페이지 (개인정보처리방침, 이용약관)만 유지

---

## 요약

### 재사용 우선순위

**⭐⭐⭐ 바로 사용 가능**
- Shared 레이아웃 컴포넌트 (Box, Flex, Grid)
- Alert 시스템
- Pagination
- Hooks (useAlertContext, useScrollAnimation)

**⭐⭐ API 수정 필요**
- 인증 플로우
- 주문 컴포넌트

**⭐ 디자인 변경 필요**
- 홈 페이지 컴포넌트
- 상품 목록/상세 컴포넌트

---

### 핵심 플로우

```
사용자 플로우:
홈 → 상품 상세 → 바로 결제 → 주문 완료

제거된 플로우:
❌ 장바구니 → 여러 상품 선택 → 결제
❌ 관리자 페이지에서 상품/주문 관리
❌ 고객센터 게시판
```

---

### 문서 바로가기
- [API 엔드포인트](./API-ENDPOINTS.md)
- [컴포넌트 가이드](./COMPONENTS-GUIDE.md)
- [인증 플로우](./1-authentication-flow.md)
- [상품 플로우](./2-product-flow.md)
- [주문 플로우](./3-order-flow.md)
- [결제 플로우](./4-payment-flow.md)
- [마이페이지 플로우](./5-mypage-user-flow.md)
