# 2. 상품 (Product)

## 개요
상품권 조회 및 상세 정보 확인, 구매 옵션 선택을 담당하는 도메인입니다.
홈페이지에서 상품 목록을 표시하고, 상품 상세 페이지에서 권종 및 수량을 선택할 수 있습니다.

---

## 주요 기능

### 2.1 상품 목록 조회
- **홈페이지 상품 노출**
- **인기 상품 표시**
- **할인 상품 표시**

#### 2.1.1 홈페이지 상품 목록 플로우
```
사용자
  ↓
[/] HomePage
  ↓
HomeProductsOnSale (할인 상품)
  ↓
fetchProductsSimple (GET /api/products/simple)
  ↓
상품 목록 표시 (ProductBox)
  ↓
ProductBox 클릭
  ↓
/product/[id] 상세 페이지로 이동
```

**관련 파일:**
- `src/app/page.tsx`
- `src/components/home/HomeProductsOnSale.tsx:1`
- `src/components/product/ProductBox.tsx:1`
- `src/controllers/product/product.ts:1`

**API:**
- `GET /api/products/simple`
  - Response: `Array<{ id, name, imageUrl, discountRate, price }>`

---

#### 2.1.2 인기 상품 조회 플로우
```
사용자
  ↓
[/] HomePage
  ↓
HomePopularProducts (인기 상품)
  ↓
fetchPopularProducts (GET /api/products/popular)
  ↓
인기 상품 목록 표시 (ProductBox)
```

**관련 파일:**
- `src/components/home/HomePopularProducts.tsx:1`
- `src/controllers/product/product.ts:1`

**API:**
- `GET /api/products/popular`
  - Response: `Array<{ id, name, imageUrl, discountRate, price }>`

---

### 2.2 상품 상세 조회

#### 2.2.1 상품 상세 페이지 플로우
```
사용자
  ↓
ProductBox 클릭 또는 URL 직접 접근
  ↓
[/product/[id]] ProductDetailPage
  ↓
fetchVoucherIssuerDetail (GET /api/voucher-issuer/{id})
  ↓
ProductDetailMain 렌더링
  ↓
┌─────────────────────────────────────────┐
│ ProductDetailImageBox                   │
│ - 상품 이미지                           │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ ProductDetailInfoBox                    │
│ - 상품명                                │
│ - 할인율                                │
│ - 가격                                  │
│ - 설명                                  │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ ProductDetailSelectAndPayBox            │
│ - 권종 선택 (10,000원, 50,000원 등)    │
│ - 수량 선택                             │
│ - 총 가격 표시                          │
│ - 장바구니 담기 / 바로 결제 버튼       │
└─────────────────────────────────────────┘
```

**관련 파일:**
- `src/app/product/[id]/page.tsx`
- `src/components/product/ProductDetailMain.tsx:1`
- `src/components/product/components/ProductDetailImageBox.tsx:1`
- `src/components/product/components/ProductDetailInfoBox.tsx:1`
- `src/components/product/components/ProductDetailSelectAndPayBox.tsx:1`
- `src/controllers/product/product.ts:1`

**API:**
- `GET /api/voucher-issuer/{id}`
  - Response:
    ```json
    {
      "id": 1,
      "name": "스타벅스",
      "imageUrl": "...",
      "discountRate": 5,
      "description": "...",
      "vouchers": [
        {
          "id": 1,
          "faceValue": 10000,
          "price": 9500,
          "stock": 100
        },
        {
          "id": 2,
          "faceValue": 50000,
          "price": 47500,
          "stock": 50
        }
      ]
    }
    ```

---

### 2.3 권종 및 수량 선택

#### 2.3.1 상품 옵션 선택 플로우
```
사용자
  ↓
ProductDetailSelectAndPayBox
  ↓
┌─────────────────────────────────────────┐
│ 1. 권종 선택 (Voucher)                  │
│    - 10,000원 (9,500원)                 │
│    - 50,000원 (47,500원)                │
│    - 100,000원 (95,000원)               │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 2. 수량 선택 (Quantity)                 │
│    - [ - ] [ 1 ] [ + ]                  │
│    - 최소 1개, 최대 재고 수량까지       │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 3. 총 가격 계산                         │
│    - 권종 가격 × 수량                   │
│    - 예: 9,500원 × 2 = 19,000원         │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 4. 액션 선택                            │
│    ① 장바구니 담기                      │
│    ② 바로 결제하기                      │
└─────────────────────────────────────────┘
```

**상태 관리:**
- `selectedVoucher`: 선택된 권종 정보
- `quantity`: 선택된 수량
- `totalPrice`: 권종 가격 × 수량

**관련 파일:**
- `src/components/product/components/ProductDetailSelectAndPayBox.tsx:1`

---

### 2.4 장바구니 담기

#### 2.4.1 장바구니 추가 플로우
```
사용자
  ↓
ProductDetailSelectAndPayBox
  ↓
권종/수량 선택
  ↓
"장바구니 담기" 버튼 클릭
  ↓
┌─────────────────────────────────────────┐
│ 로그인 여부 확인                        │
├─────────────────────────────────────────┤
│ 비로그인: 로그인 페이지로 이동          │
│ 로그인: 계속 진행                       │
└─────────────────────────────────────────┘
  ↓
fetchAddToCart (POST /api/carts/items)
  ↓
┌─────────────────────────────────────────┐
│ 성공: "장바구니에 추가되었습니다"       │
│       - 계속 쇼핑하기                   │
│       - 장바구니로 이동                 │
└─────────────────────────────────────────┘
```

**관련 파일:**
- `src/components/product/components/ProductDetailSelectAndPayBox.tsx:1`
- `src/controllers/cart/cart.ts:1`

**API:**
- `POST /api/carts/items`
  - Request:
    ```json
    {
      "voucherId": 1,
      "quantity": 2
    }
    ```
  - Response:
    ```json
    {
      "cartItemId": 123
    }
    ```

---

### 2.5 바로 결제하기

#### 2.5.1 즉시 구매 플로우
```
사용자
  ↓
ProductDetailSelectAndPayBox
  ↓
권종/수량 선택
  ↓
"바로 결제하기" 버튼 클릭
  ↓
┌─────────────────────────────────────────┐
│ 로그인 여부 확인                        │
├─────────────────────────────────────────┤
│ 비로그인: 로그인 페이지로 이동          │
│ 로그인: 계속 진행                       │
└─────────────────────────────────────────┘
  ↓
임시 주문 데이터 생성
{
  voucherId: 1,
  quantity: 2,
  price: 9500
}
  ↓
결제 페이지로 이동 또는
결제 모달 오픈
  ↓
[결제 도메인으로 이어짐]
```

**관련 파일:**
- `src/components/product/components/ProductDetailSelectAndPayBox.tsx:1`

**특징:**
- 장바구니를 거치지 않고 즉시 결제
- 선택한 1개 상품만 주문
- 결제 성공 시 주문 완료

---

## 상품 정보 구조

### VoucherIssuer (상품권 발행사)
- **역할**: 상품권 브랜드 (예: 스타벅스, CU, GS25)
- **필드**:
  - `id`: 발행사 ID
  - `name`: 브랜드 명
  - `imageUrl`: 브랜드 이미지
  - `discountRate`: 할인율 (%)
  - `description`: 상품 설명
  - `vouchers`: 하위 권종 목록

### Voucher (권종)
- **역할**: 실제 구매 가능한 상품권 (예: 10,000원권, 50,000원권)
- **필드**:
  - `id`: 권종 ID
  - `faceValue`: 액면가 (10000, 50000 등)
  - `price`: 판매가 (할인 적용 후)
  - `stock`: 재고 수량
  - `issuerId`: 상위 발행사 ID

**관계:**
```
VoucherIssuer (1) ──── (N) Voucher
   스타벅스                ├─ 10,000원권 (9,500원)
                           ├─ 50,000원권 (47,500원)
                           └─ 100,000원권 (95,000원)
```

---

## 상태 관리

### React Query
상품 데이터는 React Query로 캐싱 및 관리

#### 주요 쿼리
- `useQuery(['products', 'simple'])`: 상품 목록
- `useQuery(['products', 'popular'])`: 인기 상품
- `useQuery(['voucher-issuer', id])`: 상품 상세

**파일:** `src/hooks/useProductQuery.ts` (추정)

---

## 라우팅 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | HomePage | 상품 목록 (홈) |
| `/product/[id]` | ProductDetailPage | 상품 상세 |

---

## UI 컴포넌트

### ProductBox
- **역할**: 상품 카드 UI
- **표시 정보**:
  - 상품 이미지
  - 브랜드명
  - 할인율 (할인 시)
  - 가격
- **클릭**: 상품 상세 페이지로 이동

**파일:** `src/components/product/ProductBox.tsx:1`

---

### ProductDetailMain
- **역할**: 상품 상세 페이지 메인 컨테이너
- **하위 컴포넌트**:
  - `ProductDetailImageBox`: 상품 이미지
  - `ProductDetailInfoBox`: 상품 정보
  - `ProductDetailSelectAndPayBox`: 권종/수량 선택 및 구매

**파일:** `src/components/product/ProductDetailMain.tsx:1`

---

### ProductDetailSelectAndPayBox
- **역할**: 상품 구매 옵션 선택 및 액션
- **기능**:
  - 권종 선택 (드롭다운 또는 버튼)
  - 수량 조절 (+/- 버튼)
  - 총 가격 계산 및 표시
  - 장바구니 담기 버튼
  - 바로 결제 버튼

**파일:** `src/components/product/components/ProductDetailSelectAndPayBox.tsx:1`

---

## 가격 계산 로직

### 할인가 계산
```typescript
// 할인율이 있는 경우
const discountedPrice = faceValue * (1 - discountRate / 100);

// 예시: 10,000원권, 5% 할인
// discountedPrice = 10000 * (1 - 5 / 100) = 9,500원
```

### 총 가격 계산
```typescript
const totalPrice = voucher.price * quantity;

// 예시: 9,500원 권종, 2개 구매
// totalPrice = 9500 * 2 = 19,000원
```

---

## 에러 처리

### 재고 부족
```
사용자가 재고보다 많은 수량 선택 시
  ↓
수량 조절 버튼 비활성화
  ↓
"재고가 부족합니다" 메시지 표시
```

### 상품 조회 실패
```
GET /api/voucher-issuer/{id} 실패 시
  ↓
404 Not Found
  ↓
"상품을 찾을 수 없습니다" 페이지 표시
```

### 장바구니 추가 실패
```
POST /api/carts/items 실패 시
  ↓
에러 메시지 표시
  ↓
AlertContext로 알림
```

---

## 검색 및 필터링 (미구현 가능성)

현재 탐색된 코드에서는 상품 검색 기능이 명확하지 않습니다.
구현되어 있다면 다음과 같은 구조일 것으로 추정:

```
HomeProductsOnSale
  ↓
검색바 또는 필터 UI
  ↓
GET /api/products/simple?search=스타벅스&category=카페
  ↓
필터링된 상품 목록 표시
```

---

## 성능 최적화

### 이미지 최적화
- Next.js `<Image>` 컴포넌트 사용
- Lazy loading
- 적절한 이미지 크기 (thumbnail, detail)

### 데이터 캐싱
- React Query로 상품 데이터 캐싱
- Stale time 설정으로 불필요한 재요청 방지

### 상품 목록 페이지네이션
- 무한 스크롤 또는 페이지네이션
- 한 번에 로드하는 상품 수 제한

---

## 관련 도메인 연결

### → 장바구니 도메인
- 장바구니 담기 버튼 클릭 시
- `POST /api/carts/items`

### → 결제 도메인
- 바로 결제 버튼 클릭 시
- 주문 생성 및 결제 프로세스

### ← 인증 도메인
- 로그인 여부 확인
- 비로그인 시 로그인 페이지로 리다이렉트
