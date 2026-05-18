# 3. 주문 (Order)

## 개요
상품을 바로 구매하여 주문을 생성하고, 주문 내역을 조회하는 도메인입니다.
상품 상세 페이지에서 직접 결제하여 주문할 수 있습니다.

**주의:** 장바구니 기능은 제거되었습니다. 상품 상세에서 바로 구매만 가능합니다.

---

## 주요 기능

### 3.1 주문 생성 (바로 구매)

#### 3.1.1 상품 상세에서 바로 구매 플로우
```
사용자
  ↓
[/product/[id]] ProductDetailPage
  ↓
ProductDetailSelectAndPayBox
  ↓
권종/수량 선택
  ↓
결제 수단 선택 (CARD/PHONE/DEPOSIT_WITHOUT_BANKBOOK)
  ↓
"바로 결제하기" 버튼 클릭
  ↓
┌─────────────────────────────────────────┐
│ 로그인 여부 확인                        │
├─────────────────────────────────────────┤
│ 비로그인: 로그인 페이지로 리다이렉트    │
│ 로그인: 계속 진행                       │
└─────────────────────────────────────────┘
  ↓
주문 데이터 생성
{
  orderItems: [
    { voucherId: 10, quantity: 2, price: 9500 }
  ],
  paymentMethod: "CARD"
}
  ↓
fetchCreateOrder (POST /api/orders)
  ↓
응답 수신
{
  orderNo: "ORD-20250114-001",
  totalPrice: 19000
}
  ↓
외부 결제 PG 호출
  ↓
결제 완료/실패
  ↓
/payments/result로 리다이렉트
```

**관련 파일:**
- `src/components/product/components/ProductDetailSelectAndPayBox.tsx:1`
- `src/controllers/order/order.ts:1`
- `src/hooks/useOrder.tsx:1`

**API:**
- `POST /api/orders`
  - Request:
    ```json
    {
      "orderItems": [
        {
          "voucherId": 10,
          "quantity": 2,
          "price": 9500
        }
      ],
      "paymentMethod": "CARD"
    }
    ```
  - Response:
    ```json
    {
      "orderNo": "ORD-20250114-001",
      "totalPrice": 19000
    }
    ```

---

### 3.2 주문 목록 조회

#### 3.2.1 주문 목록 페이지 플로우
```
사용자
  ↓
헤더의 "주문 내역" 클릭 또는
마이페이지에서 "주문 내역" 클릭
  ↓
[/order/list] OrderPage
  ↓
OrderMain
  ↓
┌─────────────────────────────────────────┐
│ OrderFilterBox                          │
│ - 검색 필터 (주문번호, 상품명)         │
│ - 기간 선택 (최근 1개월, 3개월, 전체)  │
│ - 주문 상태 필터 (전체, 결제완료 등)   │
└─────────────────────────────────────────┘
  ↓
fetchOrders (GET /api/orders)
  ↓
┌─────────────────────────────────────────┐
│ OrderListInfoBox                        │
│ - 주문 목록 표시                        │
│ - 각 주문별:                            │
│   - 주문번호                            │
│   - 주문일시                            │
│   - 상품 정보 (이미지, 이름, 수량)     │
│   - 결제 금액                           │
│   - 주문 상태                           │
│   - "상세보기" 버튼                     │
└─────────────────────────────────────────┘
  ↓
페이지네이션 (Pagination)
```

**관련 파일:**
- `src/app/order/list/page.tsx`
- `src/components/order/OrderMain.tsx:1`
- `src/components/order/OrderFilterBox.tsx:1`
- `src/components/order/OrderListInfoBox.tsx:1`
- `src/controllers/order/order.ts:1`

**API:**
- `GET /api/orders?page=1&size=10&search=스타벅스&status=PAID`
  - Query Parameters:
    - `page`: 페이지 번호 (1부터 시작)
    - `size`: 페이지 크기
    - `search`: 검색어 (주문번호, 상품명)
    - `status`: 주문 상태 필터
  - Response:
    ```json
    {
      "content": [
        {
          "id": 1,
          "orderNo": "ORD-20250114-001",
          "orderDate": "2025-01-14T10:30:00",
          "status": "PAID",
          "totalPrice": 19000,
          "orderItems": [
            {
              "voucherName": "스타벅스 10,000원권",
              "quantity": 2,
              "price": 9500,
              "imageUrl": "..."
            }
          ]
        }
      ],
      "totalElements": 50,
      "totalPages": 5,
      "currentPage": 1
    }
    ```

---

#### 3.2.2 주문 상세 조회 플로우
```
사용자
  ↓
OrderListInfoBox
  ↓
특정 주문의 "상세보기" 버튼 클릭
  ↓
[/order/detail/{orderId}] OrderDetailPage
  ↓
OrderDetailMain
  ↓
fetchOrderDetail (GET /api/orders/{id})
  ↓
┌─────────────────────────────────────────┐
│ 주문 정보                               │
│ - 주문번호                              │
│ - 주문일시                              │
│ - 주문 상태                             │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 주문 상품 목록                          │
│ - 상품 이미지                           │
│ - 상품명 (권종)                         │
│ - 수량                                  │
│ - 가격                                  │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 결제 정보                               │
│ - 결제 수단                             │
│ - 총 결제 금액                          │
│ - 결제 일시                             │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 상품권 정보 (결제 완료 시)              │
│ - 바코드 이미지                         │
│ - 상품권 번호                           │
│ - 유효기간                              │
│ - 사용 방법                             │
└─────────────────────────────────────────┘
```

**관련 파일:**
- `src/app/order/detail/[id]/page.tsx`
- `src/components/order/OrderDetailMain.tsx:1`
- `src/controllers/order/order.ts:1`

**API:**
- `GET /api/orders/{id}`
  - Response:
    ```json
    {
      "id": 1,
      "orderNo": "ORD-20250114-001",
      "orderDate": "2025-01-14T10:30:00",
      "status": "PAID",
      "totalPrice": 19000,
      "paymentMethod": "CARD",
      "paymentDate": "2025-01-14T10:31:00",
      "orderItems": [
        {
          "voucherId": 10,
          "voucherName": "스타벅스 10,000원권",
          "quantity": 2,
          "price": 9500,
          "imageUrl": "...",
          "barcodeUrl": "...",
          "voucherNumber": "1234-5678-9012",
          "expiryDate": "2025-12-31"
        }
      ]
    }
    ```

---

### 3.3 주문 상태 (Order Status)

#### 주문 상태 종류
```
PENDING        → 주문 생성 (결제 대기)
  ↓
PAID           → 결제 완료
  ↓
PROCESSING     → 상품권 발급 중
  ↓
COMPLETED      → 발급 완료 (사용 가능)
  ↓
CANCELED       → 주문 취소
REFUNDED       → 환불 완료
```

#### 상태별 표시
- **PENDING**: "결제 대기 중"
- **PAID**: "결제 완료"
- **PROCESSING**: "상품권 발급 중"
- **COMPLETED**: "발급 완료"
- **CANCELED**: "주문 취소"
- **REFUNDED**: "환불 완료"

---

### 3.4 주문 검색 및 필터링

#### 3.4.1 검색 기능
```
OrderFilterBox
  ↓
검색어 입력 (주문번호 또는 상품명)
  ↓
"검색" 버튼 클릭
  ↓
GET /api/orders?search={검색어}
  ↓
검색 결과 표시
```

#### 3.4.2 기간 필터
```
OrderFilterBox
  ↓
기간 선택
- 최근 1개월
- 최근 3개월
- 최근 6개월
- 전체
  ↓
GET /api/orders?startDate=2024-12-14&endDate=2025-01-14
  ↓
기간 내 주문 목록 표시
```

#### 3.4.3 상태 필터
```
OrderFilterBox
  ↓
주문 상태 선택
- 전체
- 결제 완료
- 발급 완료
- 취소/환불
  ↓
GET /api/orders?status=PAID
  ↓
해당 상태 주문만 표시
```

---

## 결제 수단 (Payment Method)

### 지원 결제 수단
1. **CARD**: 신용카드/체크카드
2. **PHONE**: 휴대폰 소액결제
3. **DEPOSIT_WITHOUT_BANKBOOK**: 무통장입금

### PaymentMethodSelectBox
```
상품 상세 페이지
  ↓
ProductDetailSelectAndPayBox
  ↓
PaymentMethodSelectBox
  ↓
라디오 버튼으로 결제 수단 선택
  ↓
선택된 결제 수단이 주문 생성 시 전달됨
```

**관련 파일:**
- `src/components/order/PaymentMethodSelectBox.tsx:1`

---

## 주문 상태 관리

### React Query
- `useQuery(['orders', page, filters])`: 주문 목록 조회 (페이지네이션)
- `useQuery(['order', orderId])`: 주문 상세 조회
- `useMutation(fetchCreateOrder)`: 주문 생성

### Local State (useState)
- `searchKeyword`: 검색어
- `dateRange`: 조회 기간
- `statusFilter`: 주문 상태 필터

---

## 라우팅 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/order/list` | OrderPage | 주문 목록 |
| `/order/detail/[id]` | OrderDetailPage | 주문 상세 |

---

## UI 컴포넌트

### OrderMain
- **역할**: 주문 목록 페이지 메인 컨테이너
- **하위 컴포넌트**:
  - `OrderFilterBox`: 검색 및 필터
  - `OrderListInfoBox`: 주문 목록
  - `Pagination`: 페이지네이션

**파일:** `src/components/order/OrderMain.tsx:1`

---

### OrderFilterBox
- **역할**: 주문 검색 및 필터링 UI
- **기능**:
  - 검색어 입력
  - 기간 선택
  - 주문 상태 필터
  - 초기화 버튼

**파일:** `src/components/order/OrderFilterBox.tsx:1`

---

### OrderListInfoBox
- **역할**: 주문 목록 표시
- **각 주문 항목 표시**:
  - 주문번호
  - 주문일시
  - 상품 정보 (이미지, 이름, 수량)
  - 총 금액
  - 주문 상태
  - 상세보기 버튼

**파일:** `src/components/order/OrderListInfoBox.tsx:1`

---

## 가격 계산 로직

### 주문 총 금액
```typescript
const totalPrice = orderItems.reduce((sum, item) => {
  return sum + (item.price * item.quantity);
}, 0);

// 예시:
// 스타벅스 10,000원권 (9,500원) x 2 = 19,000원
```

---

## 에러 처리

### 주문 생성 실패
```
POST /api/orders 실패 시
  ↓
에러 메시지 표시
  ↓
"주문 생성에 실패했습니다. 다시 시도해주세요."
```

### 주문 조회 실패
```
GET /api/orders 실패 시
  ↓
빈 목록 표시
  ↓
"주문 내역이 없습니다."
```

### 재고 부족
```
주문 생성 시 재고 부족 에러 발생
  ↓
AlertContext로 에러 메시지
  ↓
"재고가 부족합니다. 최대 {stock}개까지 구매 가능합니다."
```

---

## 페이지네이션

### 주문 목록 페이지네이션
```
OrderMain
  ↓
Pagination 컴포넌트
  ↓
페이지 번호 클릭
  ↓
GET /api/orders?page={pageNumber}&size=10
  ↓
해당 페이지 주문 목록 표시
```

**페이지네이션 정보:**
- 한 페이지당 10개 주문 표시
- 총 페이지 수 표시
- 이전/다음 페이지 버튼
- 페이지 번호 직접 클릭

---

## 성능 최적화

### React Query 캐싱
- 주문 목록 캐싱 (1분)
- 주문 상세 캐싱 (10분)

```typescript
// 주문 목록
useQuery(['orders', page, filters], fetchOrders, {
  staleTime: 60 * 1000,  // 1분
});

// 주문 상세
useQuery(['order', orderId], fetchOrderDetail, {
  staleTime: 10 * 60 * 1000,  // 10분
});
```

---

## 관련 도메인 연결

### ← 상품 도메인
- 상품 상세에서 "바로 구매" 시
- 주문 생성 API 호출

### → 결제 도메인
- 주문 생성 후 결제 프로세스
- 결제 완료 후 주문 상태 변경

### → 마이페이지 도메인
- 헤더 또는 마이페이지에서 "주문 내역" 접근

### ← 인증 도메인
- 주문 기능 모두 로그인 필수
- 비로그인 시 로그인 페이지로 리다이렉트

---

## 바로 구매 플로우 상세

### 상품 상세 → 결제 → 주문 완료
```
1. 상품 상세 페이지
   ↓
   ProductDetailSelectAndPayBox
   └─ 권종 선택 (10,000원, 50,000원 등)
   └─ 수량 선택 (1, 2, 3...)
   └─ 결제 수단 선택 (CARD, PHONE, DEPOSIT)

2. "바로 결제하기" 버튼 클릭
   ↓
   로그인 확인
   └─ 비로그인: /login으로 리다이렉트
   └─ 로그인: 계속 진행

3. 주문 생성
   ↓
   POST /api/orders
   {
     orderItems: [{ voucherId, quantity, price }],
     paymentMethod: "CARD"
   }
   └─ Response: { orderNo, totalPrice }

4. 결제 처리
   ↓
   usePaymentScript 훅 사용
   └─ PG 스크립트 로드
   └─ 결제 창 오픈
   └─ 결제 완료/실패

5. 결제 결과
   ↓
   /payments/result?isSuccess=true&orderId=xxx
   └─ 성공: "확인" 버튼 → /order/list
   └─ 실패: "다시 시도" → 상품 페이지 복귀

6. 주문 내역 확인
   ↓
   /order/list
   └─ 주문 목록에서 확인 가능
   └─ 상세보기 → /order/detail/{id}
       └─ 상품권 바코드, 번호 확인
```

---

## 장바구니 기능 제거에 따른 변경사항

### 제거된 기능
- 장바구니 추가 버튼
- 장바구니 페이지 (`/order/cart`)
- 장바구니 API (`/api/carts/*`)
- 여러 상품 동시 구매

### 대체 플로우
```
기존: 상품 → 장바구니 → 여러 상품 선택 → 결제
현재: 상품 → 바로 결제 (1개 상품만)
```

### 사용자 경험
- 더 빠른 구매 프로세스
- 단계 축소 (장바구니 단계 제거)
- 하나씩 구매하는 간단한 플로우

---

## 미래 개선 사항 (선택적)

### 여러 상품 동시 구매
- 장바구니 없이 임시 주문 목록 기능
- 세션 스토리지 활용

### 주문 취소 기능
- 주문 상세에서 취소 버튼
- `POST /api/orders/{id}/cancel`

### 주문 내역 엑셀 다운로드
- 기간별 주문 내역 다운로드
- CSV/Excel 파일 생성
