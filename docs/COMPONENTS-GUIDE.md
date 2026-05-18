# 컴포넌트 구조 가이드

다른 프로젝트로 이식하기 위한 컴포넌트 구조 및 역할 정리 문서입니다.

---

## 목차
1. [도메인별 컴포넌트](#1-도메인별-컴포넌트)
2. [재사용 가능한 공통 컴포넌트](#2-재사용-가능한-공통-컴포넌트)
3. [컴포넌트 계층 구조](#3-컴포넌트-계층-구조)
4. [상태 관리](#4-상태-관리)
5. [Hooks](#5-hooks)
6. [프로젝트 이식 가이드](#6-프로젝트-이식-가이드)

---

## 1. 도메인별 컴포넌트

### 1.1 인증 (src/components/auth/)

#### 로그인
```
auth/login/
├── LoginMain.tsx              # 로그인 메인 컨테이너
├── LoginInputBox.tsx          # 이메일/비밀번호 입력
├── LoginButtons.tsx           # 로그인/OAuth 버튼
└── SocialLoginRedirect.tsx    # OAuth 콜백 처리
```

**역할:**
- React Hook Form + Zod 폼 검증
- OAuth 소셜 로그인 (카카오, 네이버)
- AuthContext를 통한 인증 상태 관리

**의존성:**
- Context: `AuthContext`, `AlertContext`
- API: `fetchLogin`, `POST /api/auth/login`
- Store: `useOAuthStore` (OAuth 임시 데이터)

---

#### 회원가입
```
auth/register/
├── RegisterMain.tsx               # 회원가입 메인 컨테이너
├── RegisterAccountInfo.tsx        # 이메일/비밀번호 입력
├── RegisterPersonalInfo.tsx       # 이름/전화번호 입력 + NICE 인증
├── RegisterAcceptTermsInfo.tsx    # 약관 동의
├── ValidationMessages.tsx         # 유효성 검증 메시지
└── NiceRedirectHandler.tsx        # NICE 본인인증 콜백
```

**역할:**
- NICE 본인인증 연동
- 이메일/전화번호 중복 확인
- 약관 동의 체크

**의존성:**
- API: `fetchRegister`, `fetchCheckId`, `fetchCheckPhone`
- NICE API: `GET /api/nice/encrypted-data`

---

#### 아이디/비밀번호 찾기
```
auth/find/
├── FindIdMain.tsx             # 아이디 찾기
└── FindIdInputBox.tsx         # 이름/전화번호 입력

auth/reset/
└── PasswordResetPersonalInfo.tsx  # 비밀번호 재설정 + NICE 인증
```

**API:**
- `GET /api/auth/find_id`
- `POST /api/auth/reset-password`

---

### 1.2 상품 (src/components/product/)

```
product/
├── ProductDetailMain.tsx                      # 상품 상세 메인
├── ProductDetailInfoBox.tsx                   # 상품 정보 박스
├── ProductSelectBox.tsx                       # 권종 선택 드롭다운
├── QuantitySelectBox.tsx                      # 수량 +/- 버튼
└── components/
    └── ProductDetailSelectAndPayBox.tsx       # 선택 및 결제 박스

hooks/
├── usePaymentScript.tsx       # 결제 스크립트 로드
├── useSaleRate.tsx            # 할인율 계산
└── useTotalAmount.tsx         # 총 금액 계산
```

**역할:**
- 상품 상세 정보 표시
- 권종(가격 카테고리)별 선택
- 할인율 적용 및 금액 계산
- 장바구니 추가 / 바로구매

**의존성:**
- React Query: 상품 데이터 페칭
- Hook: `useOrder` (주문 생성)
- API: `GET /api/voucher-issuer/{id}`

---

### 1.3 주문 & 장바구니 (src/components/order/)

#### 주문 목록
```
order/
├── OrderMain.tsx              # 주문 목록 메인
├── OrderFilterBox.tsx         # 검색/날짜/상태 필터
├── OrderListInfoBox.tsx       # 주문 리스트 컨테이너
└── OrderListItem.tsx          # 개별 주문 아이템
```

**역할:**
- 주문 목록 조회 및 필터링
- 페이지네이션
- 주문 상세 페이지 이동

**API:**
- `GET /api/orders?page=1&size=10&search=...&status=...`

---

#### 장바구니
```
order/
├── CartMain.tsx                   # 장바구니 메인
├── CartOrderListInfoBox.tsx       # 장바구니 상품 목록
├── CartPaymentInfoBox.tsx         # 결제 정보 (총 금액, 결제 수단)
├── PaymentMethodSelectBox.tsx     # 결제 수단 선택 (CARD/PHONE/DEPOSIT)
└── ConfirmAndPayTheAmountBox.tsx  # 결제 확인 버튼
```

**역할:**
- 장바구니 CRUD (조회, 추가, 수정, 삭제)
- 체크박스로 상품 선택
- 결제 수단 선택
- 주문 생성 및 결제

**API:**
- `GET /api/carts/items`
- `POST /api/carts/items`
- `PATCH /api/carts/items/{id}`
- `DELETE /api/carts/items/{id}`

---

### 1.4 결제 (src/components/payment/)

```
payment/
└── PaymentResultContent.tsx   # 결제 결과 (성공/실패)
```

**역할:**
- PG 결제 후 결과 표시
- 성공: 주문번호, 금액 표시 → 주문 내역 이동
- 실패: 에러 메시지 표시 → 장바구니 복귀

**라우트:**
- `/payments/result?isSuccess=true&orderId=xxx`

---

### 1.5 마이페이지 (src/components/user/)

```
user/
├── MyPageMain.tsx             # 마이페이지 메인
├── MemberInfoBox.tsx          # 회원 정보 (이름, 이메일, 전화번호, 주소)
├── AuthenticationInfoBox.tsx  # 인증 정보 (로그인 타입, 가입일)
├── ChangePasswordForm.tsx     # 비밀번호 변경
└── SnsInfoBox.tsx             # SNS 연동 정보
```

**역할:**
- 회원 정보 조회 및 수정
- 비밀번호 변경 (이메일 로그인만)
- 회원 탈퇴

**API:**
- `GET /api/users/info`
- `PATCH /api/users/info`
- `POST /api/users/change-password`
- `POST /api/auth/deactivate`

---

### 1.6 관리자 (src/components/admin/)

```
admin/
├── AdminMainSection.tsx       # 관리자 메인
├── AdminSideBar.tsx           # 사이드바 네비게이션
├── AdminProductMain.tsx       # 상품 관리 (CRUD)
├── AdminOrderMain.tsx         # 주문 관리
├── AdminUserMain.tsx          # 회원 관리
├── AdminBoardMain.tsx         # 게시판 관리
├── AdminBannerMain.tsx        # 배너 관리
└── AdminFAQsMain.tsx          # FAQ 관리
```

**역할:**
- 관리자 전용 CRUD 기능
- 이미지 업로드 (Cloudinary)

---

### 1.7 홈 (src/components/home/)

```
home/
├── HomeBanner.tsx                # Swiper 배너
├── HomePopularProducts.tsx       # 인기 상품 목록
├── HomeProductsOnSale.tsx        # 할인 상품 목록
├── HomeAnnouncementsBoard.tsx    # 공지사항
├── HomeServiceInfoBox.tsx        # 서비스 안내
└── HomeRecruitingBanner.tsx      # 채용 배너
```

**의존성:**
- Swiper 라이브러리
- React Query

---

### 1.8 네비게이션 & 푸터 (src/components/nav/, footer/)

```
nav/
├── NavBarTop.tsx                  # 상단 네비게이션
├── NavBarTopMenuBox.tsx           # 메뉴 박스
├── SideNavBar.tsx                 # 모바일 사이드 메뉴
└── SideNavBarProductsForSale.tsx  # 판매 상품 네비

footer/
└── Footer.tsx                     # 푸터 (고객센터, 약관 링크)
```

**역할:**
- 글로벌 네비게이션
- 반응형 모바일 메뉴
- 로그인 상태에 따른 조건부 렌더링

**의존성:**
- `useAuth` 훅

---

## 2. 재사용 가능한 공통 컴포넌트

### 2.1 레이아웃 (src/shared/components/layout/)

#### Box
```tsx
// 다형성 컴포넌트 (Polymorphic Component)
<Box as="div" padding={20} backgroundColor="gray">
  Content
</Box>

<Box as="section" margin={10}>
  Section Content
</Box>
```

**특징:**
- `as` prop으로 HTML 태그 변경 가능
- TypeScript 타입 안전성
- 동적 스타일링 (Vanilla Extract)

**파일:** `src/shared/components/layout/Box.tsx`

---

#### Flex
```tsx
<Flex direction="row" justify="space-between" align="center" gap={10}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

**Props:**
- `direction`: row | column
- `justify`: flex-start | center | space-between | space-around
- `align`: flex-start | center | flex-end | stretch
- `gap`: number (px)

**파일:** `src/shared/components/layout/Flex.tsx`

---

#### Grid / GridItem
```tsx
<Grid columns={3} gap={20}>
  <GridItem>Item 1</GridItem>
  <GridItem colSpan={2}>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
</Grid>
```

**파일:**
- `src/shared/components/layout/Grid.tsx`
- `src/shared/components/layout/GridItem.tsx`

---

#### 기타 레이아웃
- `Spacing.tsx`: 여백 컴포넌트
- `Divider.tsx`: 구분선 (수평/수직)
- `Text.tsx`: 텍스트 스타일링
- `List.tsx`, `ListItem.tsx`: 리스트
- `OrderedList.tsx`, `UnorderedList.tsx`: 순서/비순서 리스트

---

### 2.2 폼 컴포넌트 (src/shared/components/)

#### Button
```tsx
<Button
  backgroundColor="blue"
  hoverBackgroundColor="darkblue"
  onClick={handleClick}
  disabled={false}
>
  클릭
</Button>
```

**Props:**
- `backgroundColor`: 동적 색상
- `hoverBackgroundColor`: 호버 색상
- `activeBackgroundColor`: 클릭 색상
- `disabled`: boolean
- `forwardRef` 지원

**파일:** `src/shared/components/button/Button.tsx`

---

#### Input
```tsx
<Input
  type="text"
  placeholder="이메일 입력"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  focusBorderColor="blue"
/>
```

**Props:**
- `type`: text | password | email | number 등
- `error`: 에러 메시지 (표시 시 빨간 테두리)
- `focusBorderColor`: 포커스 시 테두리 색상
- React Hook Form 통합 가능

**파일:** `src/shared/components/input/Input.tsx`

---

### 2.3 피드백 컴포넌트

#### Alert (모달)
```tsx
// AlertContext 사용
const { open } = useAlertContext();

open({
  title: '확인',
  description: '정말 삭제하시겠습니까?',
  leftButtonLabel: '취소',
  rightButtonLabel: '삭제',
  onClickRightButton: handleDelete,
});
```

**특징:**
- React Portal을 사용한 렌더링
- BackDrop 지원
- 좌/우 버튼 커스터마이징
- 전역 Context로 관리

**파일:**
- `src/shared/components/alert/Alert.tsx`
- `src/contexts/AlertContext.tsx`

---

#### Spinner
```tsx
<Spinner size={40} color="blue" />
```

**파일:** `src/shared/components/spinner/Spinner.tsx`

---

### 2.4 페이지네이션 (src/shared/components/pagination/)

```tsx
<Pagination
  currentPage={1}              // 1-based (UI)
  totalPages={10}
  onPageChange={(page) => setPage(page - 1)}  // 0-based (API)
/>
```

**특징:**
- 10페이지씩 그룹화
- 첫/마지막 페이지 이동 버튼
- 0-based (API) ↔ 1-based (UI) 자동 변환

**파일:** `src/shared/components/pagination/Pagination.tsx`

---

### 2.5 BackDrop

```tsx
<BackDrop onClick={handleClose} />
```

**역할:** 모달 배경 (클릭 시 닫기)

**파일:** `src/shared/components/back-drop/BackDrop.tsx`

---

## 3. 컴포넌트 계층 구조

### 전체 구조
```
App (Next.js)
├── Providers (React Query, Auth, Alert, Recoil)
├── Layout
│   ├── NavBarTop
│   ├── Main
│   │   └── Page Component
│   │       └── Domain Container (예: OrderMain)
│   │           ├── Domain Sub-Container (예: OrderListInfoBox)
│   │           │   └── Domain Item (예: OrderListItem)
│   │           └── Shared Components (Flex, Button, Input 등)
│   └── Footer
└── Portal (Alert, Modal)
```

---

### 예시: 주문 페이지 계층

```
1. Page
   └── app/order/list/page.tsx

2. Container
   └── OrderMain.tsx
       ├── OrderFilterBox.tsx (검색/필터)
       │   ├── Flex (레이아웃)
       │   ├── Input (검색어)
       │   └── Button (검색 버튼)
       │
       ├── OrderListInfoBox.tsx (주문 목록)
       │   └── OrderListItem.tsx (개별 주문)
       │       ├── Flex (레이아웃)
       │       ├── Text (주문 정보)
       │       └── Button (상세보기)
       │
       └── Pagination (페이지네이션)
```

---

## 4. 상태 관리

### 4.1 Context API

#### AuthContext
```tsx
const { isAuthenticated, user, login, logout } = useAuth();
```

**역할:**
- 사용자 인증 상태 전역 관리
- 토큰 자동 갱신
- localStorage 토큰 관리

**파일:** `src/contexts/AuthContext.tsx`

**상태:**
- `isAuthenticated`: boolean
- `user`: { id, email, name, ... } | null
- `loading`: boolean

**메서드:**
- `login(token)`: 로그인 처리
- `logout()`: 로그아웃 처리
- `getUserInfo()`: 사용자 정보 조회

---

#### AlertContext
```tsx
const { open, close } = useAlertContext();

open({
  title: '알림',
  description: '저장되었습니다.',
  rightButtonLabel: '확인',
});
```

**역할:** 전역 알림 모달 관리

**파일:**
- `src/contexts/AlertContext.tsx`
- `src/hooks/useAlertContext.ts`

---

### 4.2 Zustand

#### useOAuthStore
```tsx
const { email, loginType, setOAuthState, resetOAuthState } = useOAuthStore();
```

**역할:** OAuth 소셜 로그인 임시 데이터 저장

**파일:** `src/store/useOAuthStore.ts`

**사용 시나리오:**
1. OAuth 로그인 시도 (신규 회원)
2. `/login/social?email=xxx&loginType=KAKAO`
3. `setOAuthState({ email, loginType })`
4. `/register` 페이지로 이동
5. 회원가입 폼에 이메일 자동 입력

---

### 4.3 React Query

#### 설정
```tsx
// src/react-query/Providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 60초
      retry: 1,
    },
  },
});
```

---

#### 주요 쿼리 키
```tsx
// 주문 목록
useQuery(['orderList', { page, status, search }], fetchOrderList);

// 상품 목록
useQuery(['productList'], fetchProductList);

// 사용자 정보
useQuery(['user', 'info'], fetchUserInfo);

// 장바구니
useQuery(['cart', 'items'], fetchCartItems);
```

---

#### Mutation 예시
```tsx
const mutation = useMutation(fetchCreateOrder, {
  onSuccess: (data) => {
    // 성공 시 주문 목록 재조회
    queryClient.invalidateQueries(['orderList']);
  },
  onError: (error) => {
    open({ description: '주문 생성 실패' });
  },
});

mutation.mutate({ orderItems, paymentMethod });
```

---

## 5. Hooks

### 5.1 전역 Hooks (src/hooks/)

#### useAlertContext
```tsx
import { useAlertContext } from '@/hooks/useAlertContext';

const { open } = useAlertContext();
open({ title: '알림', description: '완료되었습니다.' });
```

**파일:** `src/hooks/useAlertContext.ts`

---

#### useOrder
```tsx
import { useOrder } from '@/hooks/useOrder';

const { createOrder } = useOrder();

const handlePayment = async () => {
  await createOrder({
    orderItems: [{ voucherId: 1, quantity: 2, price: 9500 }],
    paymentMethod: 'CARD',
  });
};
```

**역할:**
- 로그인 확인
- 주문 생성 API 호출
- 결제 게이트웨이 연동
- postMessage로 결제 결과 수신

**파일:** `src/hooks/useOrder.tsx`

---

#### useRedirect
```tsx
import { useRedirect } from '@/hooks/useRedirect';

const redirect = useRedirect();
redirect('/login');
```

**파일:** `src/hooks/useRedirect.ts`

---

#### useScrollAnimation
```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ref = useScrollAnimation<HTMLDivElement>({
  threshold: 0.1,
  triggerOnce: true,
});

return <div ref={ref} className={isVisible ? 'fade-in' : ''}>Content</div>;
```

**역할:** Intersection Observer 기반 스크롤 애니메이션

**파일:** `src/hooks/useScrollAnimation.ts`

---

### 5.2 도메인별 Hooks (src/components/product/hooks/)

#### usePaymentScript
```tsx
import { usePaymentScript } from '@/components/product/hooks/usePaymentScript';

const { isLoaded, executePayment } = usePaymentScript();

useEffect(() => {
  if (isLoaded) {
    executePayment({ orderNo, totalPrice });
  }
}, [isLoaded]);
```

**역할:** PG 결제 스크립트 동적 로드

**파일:** `src/components/product/hooks/usePaymentScript.tsx`

---

#### useSaleRate
```tsx
import { useSaleRate } from '@/components/product/hooks/useSaleRate';

const saleRate = useSaleRate(selectedType, product);
// 예: CARD → 5%, PHONE → 3%
```

**파일:** `src/components/product/hooks/useSaleRate.tsx`

---

#### useTotalAmount
```tsx
import { useTotalAmount } from '@/components/product/hooks/useTotalAmount';

const { totalAmount, finalAmount } = useTotalAmount(
  cartItems,
  priceCategories,
  saleRate,
  selectedType
);
```

**역할:**
- 장바구니 총 금액 계산
- 할인율 적용
- 휴대폰 결제 시 10% 추가

**파일:** `src/components/product/hooks/useTotalAmount.tsx`

---

## 6. 프로젝트 이식 가이드

### 6.1 재사용 우선순위

#### ⭐⭐⭐ 높음 (프레임워크 독립적, 바로 사용 가능)

**1. Shared 레이아웃 컴포넌트**
```
복사할 경로:
src/shared/components/layout/
  ├── Box.tsx
  ├── Flex.tsx
  ├── Grid.tsx
  ├── GridItem.tsx
  ├── Spacing.tsx
  ├── Divider.tsx
  └── Text.tsx
```

**의존성:** Vanilla Extract (다른 CSS-in-JS로 교체 가능)

---

**2. Shared 폼 컴포넌트**
```
src/shared/components/
  ├── button/Button.tsx
  └── input/Input.tsx
```

---

**3. Alert 시스템**
```
src/shared/components/alert/Alert.tsx
src/shared/components/back-drop/BackDrop.tsx
src/contexts/AlertContext.tsx
src/hooks/useAlertContext.ts
```

**의존성:** React Portal만 필요

---

**4. Pagination**
```
src/shared/components/pagination/Pagination.tsx
```

**의존성:** React Icons (선택적)

---

#### ⭐⭐ 중간 (API 계층 수정 필요)

**1. 인증 플로우**
```
src/components/auth/
src/contexts/AuthContext.tsx
```

**주의사항:**
- API 엔드포인트 교체 필요
- OAuth 설정 변경
- NICE 본인인증 (선택적)

---

**2. 주문/장바구니 컴포넌트**
```
src/components/order/
```

**주의사항:**
- 비즈니스 로직 포함
- API 계층 수정 필요

---

#### ⭐ 낮음 (도메인 특화, 커스터마이징 필요)

**1. 관리자 컴포넌트**
- 프로젝트별 요구사항이 다름

**2. 홈 페이지 컴포넌트**
- 디자인 커스터마이징 필요

---

### 6.2 이식 체크리스트

#### Step 1: 공통 컴포넌트 복사
```bash
# 필수
src/shared/components/layout/
src/shared/components/button/
src/shared/components/input/
src/shared/components/alert/
src/shared/components/pagination/
src/shared/components/spinner/
src/shared/components/back-drop/
```

---

#### Step 2: Context 복사
```bash
src/contexts/AlertContext.tsx
src/contexts/AuthContext.tsx  # (선택적, API 수정 필요)
```

---

#### Step 3: Hooks 복사
```bash
src/hooks/useAlertContext.ts
src/hooks/useRedirect.ts
src/hooks/useScrollAnimation.ts
```

---

#### Step 4: 스타일 시스템 복사 (Vanilla Extract)
```bash
src/shared/styles/theme.css.ts
src/shared/styles/common.css.ts
src/shared/styles/animations.css.ts
```

**대체 가능:**
- Tailwind CSS
- Emotion
- Styled-Components
- CSS Modules

---

### 6.3 필수 패키지

```json
{
  "dependencies": {
    "@vanilla-extract/css": "^1.13.0",
    "@vanilla-extract/dynamic": "^2.0.3",
    "clsx": "^2.0.0",
    "react": "^18",
    "react-dom": "^18"
  }
}
```

---

### 6.4 선택적 패키지

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.66.0",  // API 호출 (권장)
    "react-hook-form": "^7.54.2",         // 폼 관리
    "zod": "^3.24.2",                     // 스키마 검증
    "zustand": "^5.0.5",                  // 상태 관리 (간단)
    "next": "^14.2.24",                   // Next.js (교체 가능)
    "react-icons": "^4.11.0"              // 아이콘
  }
}
```

---

### 6.5 컴포넌트별 의존성 맵

#### Alert 시스템
```
Alert
├── BackDrop
├── Button
├── Flex
└── Portal (react-dom)

AlertContext (Provider)
└── useAlertContext (Hook)
```

---

#### 인증 시스템
```
LoginMain
├── LoginInputBox
│   └── Input
├── LoginButtons
│   └── Button
└── AlertContext

AuthContext
├── fetchLogin (API)
├── localStorage (토큰)
└── React Query (선택)
```

---

#### 주문 시스템
```
OrderMain
├── OrderFilterBox
│   ├── Input
│   └── Button
├── OrderListInfoBox
│   └── OrderListItem
│       ├── Flex
│       ├── Text
│       └── Button
└── Pagination

useOrder (Hook)
└── fetchCreateOrder (API)
```

---

## 7. 아키텍처 패턴

### 7.1 Container/Presenter 패턴
```
OrderMain (Container)
└── 비즈니스 로직 (API 호출, 상태 관리)
    └── OrderListInfoBox (Presenter)
        └── UI 렌더링
            └── OrderListItem (Presenter)
                └── 순수 UI
```

---

### 7.2 Polymorphic 컴포넌트
```tsx
// Box를 div, section, article 등으로 변환
<Box as="div">Content</Box>
<Box as="section">Section</Box>
<Box as="article">Article</Box>

// TypeScript 타입 안전성 유지
```

---

### 7.3 Compound 컴포넌트
```tsx
<List>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
</List>

<Grid columns={3}>
  <GridItem>Item 1</GridItem>
  <GridItem colSpan={2}>Item 2</GridItem>
</Grid>
```

---

## 8. 파일 명명 규칙

### 컴포넌트
- PascalCase: `LoginMain.tsx`, `Button.tsx`
- 도메인별 폴더: `auth/`, `product/`, `order/`

### 스타일
- Vanilla Extract: `.css.ts` 확장자
- 예: `Button.css.ts`, `theme.css.ts`

### Hooks
- `use` 접두사: `useOrder.tsx`, `useAuth.ts`

### API Controller
- `fetch` 접두사: `fetchLogin.ts`, `fetchOrderList.ts`

---

## 9. 다른 프로젝트로 이식 시 주의사항

### 변경 필요
1. **API 엔드포인트**
   - `src/controllers/` 폴더의 모든 API 호출
   - BASE_URL 변경

2. **인증 방식**
   - JWT 토큰 방식이면 재사용 가능
   - OAuth 설정 (카카오, 네이버 클라이언트 ID)

3. **스타일 시스템**
   - Vanilla Extract → 다른 CSS-in-JS 교체 가능
   - `*.css.ts` 파일들 변환

### 그대로 사용 가능
1. **Shared 레이아웃 컴포넌트** (Box, Flex, Grid 등)
2. **Alert 시스템**
3. **Pagination**
4. **Hooks** (useAlertContext, useScrollAnimation 등)

---

## 10. 추천 이식 순서

### Phase 1: 기본 인프라
1. Shared 레이아웃 컴포넌트
2. Alert 시스템
3. 스타일 시스템 (theme)

### Phase 2: 인증
1. AuthContext
2. 로그인/회원가입 컴포넌트
3. API 계층 수정

### Phase 3: 도메인 기능
1. 상품 컴포넌트
2. 주문/장바구니 컴포넌트
3. 마이페이지 컴포넌트

### Phase 4: 관리자 (선택)
1. 관리자 레이아웃
2. 관리자 CRUD 컴포넌트

---

## 요약

### 핵심 재사용 컴포넌트
- `Box`, `Flex`, `Grid` (레이아웃)
- `Button`, `Input` (폼)
- `Alert`, `BackDrop` (피드백)
- `Pagination` (네비게이션)

### 핵심 상태 관리
- `AuthContext` (인증)
- `AlertContext` (알림)
- React Query (서버 상태)

### 핵심 Hooks
- `useAlertContext`
- `useOrder`
- `useScrollAnimation`

이 구조는 **모듈화**가 잘 되어 있어 다른 프로젝트로 이식이 용이합니다.
특히 `src/shared/` 디렉토리는 **의존성이 최소화**되어 있어 독립적으로 사용 가능합니다.
