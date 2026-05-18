# 4. 결제 (Payment)

## 개요
주문 생성 후 외부 PG사를 통해 결제를 진행하고, 결제 결과를 처리하는 도메인입니다.
갤럭시아 PG를 사용하여 신용카드, 휴대폰, 무통장입금 결제를 지원합니다.

---

## 주요 기능

### 4.1 결제 프로세스 전체 플로우

```
사용자
  ↓
장바구니 또는 상품 상세
  ↓
결제 수단 선택 (CARD/PHONE/DEPOSIT_WITHOUT_BANKBOOK)
  ↓
"결제하기" 버튼 클릭
  ↓
┌─────────────────────────────────────────┐
│ 1. 주문 생성                            │
├─────────────────────────────────────────┤
│ fetchCreateOrder (POST /api/orders)     │
│                                          │
│ Request:                                 │
│ {                                        │
│   orderItems: [                          │
│     {                                    │
│       voucherId: 10,                     │
│       quantity: 2,                       │
│       price: 9500                        │
│     }                                    │
│   ],                                     │
│   paymentMethod: "CARD"                  │
│ }                                        │
│                                          │
│ Response:                                │
│ {                                        │
│   orderNo: "ORD-20250114-001",          │
│   totalPrice: 19000                      │
│ }                                        │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 2. PG 스크립트 로드 및 실행              │
├─────────────────────────────────────────┤
│ usePaymentScript 훅 사용                │
│ - 갤럭시아 PG 스크립트 동적 로드        │
│ - window.galaxia_payment() 호출         │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 3. 외부 PG 결제 창 오픈                  │
├─────────────────────────────────────────┤
│ 갤럭시아 결제 팝업 또는 리다이렉트      │
│ - 카드 정보 입력 (CARD)                 │
│ - 휴대폰 인증 (PHONE)                   │
│ - 계좌 정보 안내 (DEPOSIT)              │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 4. 결제 완료/실패                        │
├─────────────────────────────────────────┤
│ PG사에서 결제 처리                      │
│ → 백엔드로 결제 결과 전달               │
│ → 프론트로 리다이렉트                   │
└─────────────────────────────────────────┘
  ↓
/payments/result?isSuccess=true&orderId=xxx
또는
/payments/result?isSuccess=false&errorMessage=xxx
  ↓
┌─────────────────────────────────────────┐
│ 5. 결제 결과 표시                        │
├─────────────────────────────────────────┤
│ PaymentResultContent                    │
│ - 성공: 주문번호, 금액, 확인 버튼       │
│ - 실패: 실패 사유, 고객센터 안내        │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 6. 후속 처리                             │
├─────────────────────────────────────────┤
│ 성공: 주문 내역 페이지로 이동           │
│ 실패: 장바구니 또는 상품 페이지로 복귀  │
└─────────────────────────────────────────┘
```

---

## 지원 결제 수단

### 4.2.1 신용카드/체크카드 (CARD)
- **결제 방식**: PG 팝업에서 카드 정보 입력
- **지원 카드사**:
  - 국내 주요 카드사 (신한, 삼성, 현대, KB국민 등)
  - 체크카드 포함
- **할부**: 2~12개월 할부 가능 (일정 금액 이상)

### 4.2.2 휴대폰 소액결제 (PHONE)
- **결제 방식**: 휴대폰 번호 및 인증번호 입력
- **지원 통신사**: SKT, KT, LG U+
- **한도**: 통신사별 월 한도 적용

### 4.2.3 무통장입금 (DEPOSIT_WITHOUT_BANKBOOK)
- **결제 방식**: 가상계좌 발급
- **플로우**:
  1. 주문 생성 시 가상계좌 발급
  2. 입금 계좌 정보 표시
  3. 고객이 계좌로 입금
  4. 입금 확인 후 주문 상태 변경 (PAID)

---

## 결제 관련 파일 및 컴포넌트

### 4.3.1 usePaymentScript 훅
- **역할**: PG 스크립트 동적 로드 및 결제 실행
- **파일**: `src/components/product/hooks/usePaymentScript.tsx:1`

**주요 기능:**
```typescript
const usePaymentScript = () => {
  // 1. 스크립트 로드
  const loadPaymentScript = () => {
    const script = document.createElement('script');
    script.src = 'https://galaxia-pg.com/payment.js';
    script.async = true;
    document.body.appendChild(script);
  };

  // 2. 결제 실행
  const executePayment = (orderData) => {
    if (window.galaxia_payment) {
      window.galaxia_payment({
        orderNo: orderData.orderNo,
        amount: orderData.totalPrice,
        paymentMethod: orderData.paymentMethod,
        returnUrl: `${window.location.origin}/payments/result`
      });
    }
  };

  return { loadPaymentScript, executePayment };
};
```

---

### 4.3.2 PaymentResultContent 컴포넌트
- **역할**: 결제 결과 표시
- **파일**: `src/components/payment/PaymentResultContent.tsx:1`

**성공 화면:**
```
┌─────────────────────────────────────────┐
│          결제가 완료되었습니다!         │
├─────────────────────────────────────────┤
│ 주문번호: ORD-20250114-001              │
│ 결제금액: 19,000원                      │
│ 결제수단: 신용카드                      │
│ 결제일시: 2025-01-14 10:31:00           │
├─────────────────────────────────────────┤
│        [확인] (주문 내역으로 이동)      │
└─────────────────────────────────────────┘
```

**실패 화면:**
```
┌─────────────────────────────────────────┐
│          결제에 실패했습니다            │
├─────────────────────────────────────────┤
│ 실패 사유:                              │
│ 카드 한도 초과                          │
│                                          │
│ 고객센터: 1588-1234                     │
│ 운영시간: 평일 09:00 - 18:00            │
├─────────────────────────────────────────┤
│   [다시 시도]    [고객센터 문의]        │
└─────────────────────────────────────────┘
```

---

### 4.3.3 PaymentMethodSelectBox 컴포넌트
- **역할**: 결제 수단 선택 UI
- **파일**: `src/components/order/PaymentMethodSelectBox.tsx:1`

```
┌─────────────────────────────────────────┐
│ 결제 수단 선택                          │
├─────────────────────────────────────────┤
│ ○ 신용카드/체크카드                     │
│ ○ 휴대폰 소액결제                       │
│ ○ 무통장입금                            │
└─────────────────────────────────────────┘
```

**상태 관리:**
```typescript
const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PHONE' | 'DEPOSIT_WITHOUT_BANKBOOK'>('CARD');
```

---

## 결제 API

### 4.4.1 결제 생성 (주문 생성과 통합)
- **엔드포인트**: `POST /api/orders`
- **설명**: 주문 생성 시 결제 정보도 함께 생성
- **Request**:
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
- **Response**:
  ```json
  {
    "orderNo": "ORD-20250114-001",
    "totalPrice": 19000
  }
  ```

---

### 4.4.2 결제 결과 조회
- **엔드포인트**: `GET /api/payments/{orderId}`
- **설명**: 결제 상태 및 결과 조회
- **Response**:
  ```json
  {
    "orderId": 1,
    "orderNo": "ORD-20250114-001",
    "paymentMethod": "CARD",
    "paymentStatus": "SUCCESS",
    "paymentAmount": 19000,
    "paymentDate": "2025-01-14T10:31:00",
    "pgTransactionId": "PG-12345678"
  }
  ```

**결제 상태:**
- `PENDING`: 결제 대기
- `SUCCESS`: 결제 성공
- `FAILED`: 결제 실패
- `CANCELED`: 결제 취소
- `REFUNDED`: 환불 완료

---

## 결제 플로우 상세

### 4.5.1 장바구니에서 결제
```
CartPaymentInfoBox
  ↓
결제 수단 선택
  ↓
체크된 상품 확인
  ↓
"결제하기" 버튼 클릭
  ↓
┌─────────────────────────────────────────┐
│ 주문 데이터 준비                        │
├─────────────────────────────────────────┤
│ {                                        │
│   orderItems: [                          │
│     { voucherId: 10, quantity: 2, ... }, │
│     { voucherId: 20, quantity: 1, ... }  │
│   ],                                     │
│   paymentMethod: "CARD"                  │
│ }                                        │
└─────────────────────────────────────────┘
  ↓
fetchCreateOrder (POST /api/orders)
  ↓
orderNo, totalPrice 수신
  ↓
usePaymentScript.executePayment({
  orderNo,
  totalPrice,
  paymentMethod
})
  ↓
PG 결제 창 오픈
  ↓
결제 완료
  ↓
/payments/result?isSuccess=true&orderId=xxx
  ↓
PaymentResultContent (성공)
  ↓
"확인" 버튼 클릭
  ↓
/order/list (주문 내역으로 이동)
  ↓
장바구니에서 결제된 상품 자동 삭제
```

---

### 4.5.2 상품 상세에서 바로 결제
```
ProductDetailSelectAndPayBox
  ↓
권종/수량 선택
  ↓
"바로 결제하기" 버튼 클릭
  ↓
결제 수단 선택 모달 또는 페이지
  ↓
결제 수단 선택 (CARD/PHONE/DEPOSIT)
  ↓
┌─────────────────────────────────────────┐
│ 주문 데이터 준비                        │
├─────────────────────────────────────────┤
│ {                                        │
│   orderItems: [                          │
│     { voucherId: 10, quantity: 2, ... }  │
│   ],                                     │
│   paymentMethod: "CARD"                  │
│ }                                        │
└─────────────────────────────────────────┘
  ↓
fetchCreateOrder (POST /api/orders)
  ↓
[이하 장바구니 결제와 동일]
```

---

### 4.5.3 무통장입금 결제 플로우
```
결제 수단으로 "무통장입금" 선택
  ↓
"결제하기" 버튼 클릭
  ↓
fetchCreateOrder (POST /api/orders)
  ↓
응답: {
  orderNo,
  totalPrice,
  virtualAccount: {
    bank: "신한은행",
    accountNumber: "110-123-456789",
    accountHolder: "핀토스",
    depositDeadline: "2025-01-15 23:59:59"
  }
}
  ↓
/payments/result?isSuccess=true&orderId=xxx&method=DEPOSIT
  ↓
PaymentResultContent (무통장입금)
  ↓
┌─────────────────────────────────────────┐
│      입금 계좌 안내                     │
├─────────────────────────────────────────┤
│ 은행: 신한은행                          │
│ 계좌번호: 110-123-456789                │
│ 예금주: 핀토스                          │
│ 입금금액: 19,000원                      │
│ 입금기한: 2025-01-15 23:59:59           │
├─────────────────────────────────────────┤
│ ※ 입금기한 내 미입금 시 자동 취소됩니다 │
│                                          │
│        [계좌번호 복사]  [확인]          │
└─────────────────────────────────────────┘
  ↓
사용자가 계좌로 입금
  ↓
백엔드에서 입금 확인 (가상계좌 콜백)
  ↓
주문 상태 변경: PENDING → PAID
  ↓
사용자에게 알림 (이메일, SMS 등)
```

---

## 결제 결과 페이지

### 라우팅
- **경로**: `/payments/result`
- **파일**: `src/app/payments/result/page.tsx`

### Query Parameters
- `isSuccess`: 결제 성공 여부 (true/false)
- `orderId`: 주문 ID
- `orderNo`: 주문번호 (선택)
- `errorMessage`: 실패 시 에러 메시지 (선택)
- `method`: 결제 수단 (선택, DEPOSIT일 때 가상계좌 정보 표시)

---

### 4.6.1 결제 성공 처리
```typescript
const PaymentResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSuccess = searchParams.get('isSuccess') === 'true';
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (isSuccess && orderId) {
      // 결제 성공 로그 전송
      logPaymentSuccess(orderId);

      // 장바구니에서 결제된 상품 삭제
      clearCartItems();
    }
  }, [isSuccess, orderId]);

  return (
    <PaymentResultContent
      isSuccess={isSuccess}
      orderId={orderId}
    />
  );
};
```

---

### 4.6.2 결제 실패 처리
```typescript
const PaymentResultContent = ({ isSuccess, errorMessage }) => {
  if (!isSuccess) {
    return (
      <div>
        <h2>결제에 실패했습니다</h2>
        <p>실패 사유: {errorMessage || '알 수 없는 오류'}</p>
        <button onClick={() => router.push('/order/cart')}>
          다시 시도
        </button>
        <button onClick={() => window.open('tel:1588-1234')}>
          고객센터 문의
        </button>
      </div>
    );
  }

  return <SuccessContent />;
};
```

---

## 에러 처리

### 4.7.1 주문 생성 실패
```
POST /api/orders 실패 시
  ↓
에러 응답 확인
  ↓
┌─────────────────────────────────────────┐
│ 재고 부족                               │
│ → "재고가 부족합니다" 알림              │
│ → 장바구니 또는 상품 페이지 복귀        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ 네트워크 오류                           │
│ → "네트워크 오류가 발생했습니다" 알림   │
│ → 재시도 버튼 표시                      │
└─────────────────────────────────────────┘
```

---

### 4.7.2 PG 스크립트 로드 실패
```
usePaymentScript.loadPaymentScript() 실패 시
  ↓
AlertContext로 에러 메시지
  ↓
"결제 모듈을 불러오는데 실패했습니다.
페이지를 새로고침 해주세요."
```

---

### 4.7.3 결제 취소 (사용자가 PG 창에서 취소)
```
PG 팝업에서 "취소" 버튼 클릭
  ↓
/payments/result?isSuccess=false&errorMessage=USER_CANCELED
  ↓
PaymentResultContent
  ↓
"결제가 취소되었습니다"
  ↓
장바구니 또는 상품 페이지로 복귀
```

---

### 4.7.4 결제 타임아웃
```
PG 결제 창에서 일정 시간 내 결제 미완료 시
  ↓
/payments/result?isSuccess=false&errorMessage=TIMEOUT
  ↓
"결제 시간이 초과되었습니다.
다시 시도해주세요."
```

---

## 보안 고려사항

### 4.8.1 결제 데이터 암호화
- **HTTPS 필수**: 모든 결제 관련 통신은 HTTPS
- **PG사 제공 암호화**: 갤럭시아 PG에서 제공하는 암호화 함수 사용
- **카드 정보 미저장**: 프론트엔드에서 카드 정보 직접 처리 안 함

---

### 4.8.2 주문 검증
```
백엔드에서 주문 생성 시 검증:
1. 사용자 인증 확인
2. 상품 재고 확인
3. 가격 검증 (프론트에서 전달된 가격과 DB 가격 비교)
4. 중복 주문 방지 (orderNo 중복 체크)
```

---

### 4.8.3 결제 결과 검증
```
/payments/result로 리다이렉트 시:
1. orderId 유효성 확인
2. 백엔드에서 PG사로부터 결제 결과 재확인
3. 프론트에서 받은 결과와 백엔드 결과 일치 여부 확인
4. 불일치 시 주문 취소 및 환불 처리
```

---

## 성능 최적화

### 4.9.1 PG 스크립트 지연 로드
```typescript
// 결제 페이지에서만 PG 스크립트 로드
useEffect(() => {
  if (isPaymentPage) {
    loadPaymentScript();
  }
}, [isPaymentPage]);
```

---

### 4.9.2 결제 결과 캐싱 방지
```typescript
// /payments/result 페이지는 캐싱 안 함
export const dynamic = 'force-dynamic';
```

---

## 사용자 경험 개선

### 4.10.1 결제 진행 상태 표시
```
결제하기 버튼 클릭
  ↓
로딩 스피너 표시
  ↓
"주문을 생성하고 있습니다..."
  ↓
주문 생성 완료
  ↓
"결제 창을 여는 중입니다..."
  ↓
PG 팝업 오픈
```

---

### 4.10.2 결제 성공 후 자동 페이지 이동
```typescript
// 결제 성공 후 5초 뒤 자동으로 주문 내역으로 이동
useEffect(() => {
  if (isSuccess) {
    const timer = setTimeout(() => {
      router.push('/order/list');
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [isSuccess]);
```

**참고:** 최근 커밋에서 자동 종료 문구가 제거되고 "확인" 버튼이 추가되었습니다.
- 커밋: `93dc248 feat(payment): 결제 성공 화면에 확인 버튼 추가 및 자동 종료 문구 제거`

---

### 4.10.3 모바일 결제 최적화
- **반응형 결제 UI**: 모바일 화면에 최적화된 결제 버튼 크기
- **모바일 PG 연동**: 모바일 앱 결제 (카카오페이, 네이버페이 등) 지원 가능

---

## 관련 도메인 연결

### ← 장바구니 & 주문 도메인
- 장바구니에서 "결제하기" 클릭 시
- 주문 생성 API 호출

### → 마이페이지 & 주문 내역
- 결제 완료 후 주문 내역으로 이동
- 주문 상세에서 결제 정보 조회

### ← 인증 도메인
- 결제는 로그인 필수
- 비로그인 시 로그인 페이지로 리다이렉트

---

## 미래 개선 사항

### 4.11.1 추가 결제 수단
- 카카오페이
- 네이버페이
- 토스페이
- 페이코

### 4.11.2 정기 결제 (구독)
- 월간 상품권 구독 서비스
- 자동 결제 설정

### 4.11.3 포인트/쿠폰 결제
- 적립 포인트 사용
- 할인 쿠폰 적용
- 포인트 + 카드 혼합 결제

### 4.11.4 결제 내역 PDF 다운로드
- 영수증 PDF 생성
- 이메일 전송
