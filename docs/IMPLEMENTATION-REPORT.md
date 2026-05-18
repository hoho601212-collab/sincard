# 핀토스 프론트엔드 구현 현황 보고서

**작성일:** 2025-11-14
**Base URL:** `https://pin-toss.com`

---

## 목차

1. [구현 완료 페이지](#1-구현-완료-페이지)
2. [세부 정책 결정 필요 사항](#2-세부-정책-결정-필요-사항)

---

# 1. 구현 완료 페이지

총 **14개 페이지** 구현 완료

---

## 1.1 인증 관련 페이지 (6개)

### 로그인 페이지 (`/login`)

**구현 기능:**
- 이메일/비밀번호 입력 폼
- 일반 로그인 처리
- 카카오/네이버 소셜 로그인 버튼
- 로그인 성공 시 Zustand store에 토큰 저장 (localStorage persist)
- 아이디 찾기, 비밀번호 재설정 링크

**사용된 API:**
```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken }
```

**OAuth 리다이렉트:**
```
GET /api/oauth/login?loginType=KAKAO
GET /api/oauth/login?loginType=NAVER
```

---

### 소셜 로그인 콜백 페이지 (`/login/social`)

**구현 기능:**
- OAuth 인증 결과 처리
- 기존 회원: 토큰 저장 후 홈으로 이동
- 신규 회원: OAuth 정보 저장 후 회원가입 페이지로 이동
- 실패 시 로그인 페이지로 리다이렉트

**처리 로직:**
- `isSuccess=true & accessToken & refreshToken` → 로그인 완료
- `isSuccess=true & email & loginType` → 회원가입 필요

---

### 회원가입 페이지 (`/signup`)

**구현 기능:**
- 이메일, 비밀번호, 비밀번호 확인 입력
- 이메일 중복 확인 (실시간 검증)
- 전화번호 중복 확인
- NICE 휴대폰 본인인증 팝업 연동
- 본인인증 완료 시 이름/전화번호 자동 입력
- OAuth 회원가입 지원 (이메일 자동 입력, 비밀번호 불필요)
- 회원가입 완료 후 로그인 페이지 이동

**사용된 API:**
```
GET  /api/auth/check-id?email={email}
Response: { isDuplicate: boolean }

GET  /api/auth/check-phone?phoneNumber={phoneNumber}
Response: { isDuplicate: boolean }

GET  /api/nice/encrypted-data?purpose=SIGNUP
Response: { token_version_id, enc_data, integrity_value }

POST /api/auth/register
Body: { email, password, name, phoneNumber }
Response: { userId }
```

---

### 회원가입 NICE 콜백 페이지 (`/signup/nice`)

**구현 기능:**
- NICE 본인인증 결과 수신
- postMessage로 부모 창(회원가입 페이지)에 인증 정보 전달
- 인증 정보: 이름, 전화번호
- 인증 완료 후 팝업 자동 닫기

**처리 쿼리:**
```
?success=true&name={name}&tel={phoneNumber}
```

---

### 아이디 찾기 페이지 (`/find-id`)

**구현 기능:**
- 이름, 전화번호 입력
- 아이디(이메일) 조회
- 조회 결과 카드 표시
- 로그인 페이지, 비밀번호 재설정 페이지 이동 버튼

**사용된 API:**
```
GET /api/auth/find_id?name={name}&phoneNumber={phoneNumber}
Response: { email }
```

---

### 비밀번호 재설정 페이지 (`/password-reset`)

**구현 기능:**
- 이메일 입력
- NICE 휴대폰 본인인증
- 본인인증 완료 시 이름/전화번호 자동 입력
- 새 비밀번호, 비밀번호 확인 입력
- 비밀번호 일치 여부 실시간 검증
- 재설정 완료 후 로그인 페이지 이동

**사용된 API:**
```
GET  /api/nice/encrypted-data?purpose=PASSWORD_RESET
Response: { token_version_id, enc_data, integrity_value }

PATCH /api/auth/reset-password
Body: { email, newPassword, name, phoneNumber }
```

---

### 비밀번호 재설정 NICE 콜백 페이지 (`/password-reset/nice`)

**구현 기능:**
- NICE 본인인증 결과 수신
- postMessage로 부모 창에 인증 정보 전달
- 인증 완료 후 팝업 자동 닫기

---

## 1.2 상품 관련 페이지 (2개)

### 홈페이지 (`/`)

**구현 기능:**
- Hero 섹션 (메인 배너)
- 전체 상품 목록 표시 (최대 8개)
- 각 상품별 최대 할인율 계산 및 표시
- 상품 클릭 시 상품 상세 페이지 이동
- 안심 이용 이유 섹션
- Footer (회사 정보, 고객센터)

**사용된 API:**
```
GET /api/voucher-issuer
Response: VoucherIssuer[]
  - id, name, imageUrl, description
  - publisher, contactInfo, paymentMethods
```

---

### 상품 상세 페이지 (`/product/[productId]`)

**구현 기능:**
- 상품 이미지 및 상품명 표시
- 권종(5천원권, 1만원권 등) 목록 및 가격 표시
- 수량 선택 (+/-, +10/-10 버튼, 직접 입력)
- 결제수단 선택 (카드/휴대폰/무통장입금)
- 선택된 상품 최종 확인 (권종 × 수량 = 금액)
- 총 결제 금액 표시
- **바로 구매 기능**
  1. 주문 생성 (`POST /api/orders`)
  2. 결제 생성 (`POST /api/payments`)
  3. 결제 페이지로 리다이렉트
- 상품 설명 탭 (HTML 렌더링)
- 유의사항 탭 (보이스피싱 주의)
- 판매자 정보 (발행업체, 홈페이지, 고객센터)
- **에러 처리:**
  - 401 Unauthorized: Toast 알림 + 1.5초 후 로그인 페이지 이동
  - 기타 에러: Toast 에러 메시지 표시

**사용된 API:**
```
GET /api/voucher-issuer/{id}
Response: {
  id, name, imageUrl, description, publisher
  contactInfo: { homePageUrl, csCenterNumber }
  paymentMethods: [{ type, displayName, discountRate }]
  vouchers: [{ id, name, issuerName, price, createdAt }]
  note, descriptionImageUrl
}

POST /api/orders
Body: {
  orderItems: [{ voucherId, quantity, price }]
  paymentMethod: "CARD" | "PHONE" | "DEPOSIT_WITHOUT_BANKBOOK"
}
Response: { orderNo, totalPrice }

POST /api/payments
Body: { orderNo, paymentMethod }
Response: { paymentUrl }
```

**웹 고정 레이아웃:**
- 최소 너비: 1440px
- 반응형 제거 (데스크톱 전용)

---

## 1.3 주문 관련 페이지 (3개)

### 주문 내역 페이지 (`/order`)

**구현 기능:**
- 주문 목록 조회 (페이지네이션)
- 검색 기능 (키워드)
- 상태별 필터링 (전체/결제완료/발급완료/취소환불)
- 날짜 범위 필터링
- 정렬 (주문일시 desc)
- 각 주문 카드:
  - 주문번호, 주문일시, 상태, 총 금액
  - 주문 상품 목록 (상품명, 수량, 가격)
  - 주문 상세 버튼

**사용된 API:**
```
GET /api/orders?page={page}&size={size}&keyword={keyword}&statuses={statuses}&sortKey=orderDate&sort=desc
Response: {
  content: Order[]
  totalElements, totalPages, currentPage
}
```

---

### 주문 상세 페이지 (`/order/[orderId]`)

**구현 기능:**
- 주문 상세 정보 표시
- 주문 상품 목록
- 결제 정보 (결제수단, 결제일시)
- 상품권 정보 (발급 완료 시)
  - 바코드 이미지
  - 상품권 번호
  - 유효기간
- 주문 상태별 UI 분기

**사용된 API:**
```
GET /api/orders/{orderId}
Response: {
  id, orderNo, orderDate, status, totalPrice
  paymentMethod, paymentDate
  orderItems: [{
    voucherId, voucherName, quantity, price
    imageUrl, barcodeUrl, voucherNumber, expiryDate
  }]
}
```

---

### 결제 결과 페이지 (`/payments/result`)

**구현 기능:**
- 결제 성공/실패 분기 처리
- **성공 시:**
  - 초록색 체크 아이콘
  - "결제가 완료되었습니다" 메시지
  - 주문번호 표시
  - 주문 내역 확인 버튼
  - 홈으로 버튼
- **실패 시:**
  - 빨간색 X 아이콘
  - "결제에 실패했습니다" 메시지
  - 에러 메시지 표시
  - 다시 시도 버튼 (이전 페이지)
  - 홈으로 버튼

**쿼리 파라미터:**
```
?isSuccess=true&orderId={orderId}
?isSuccess=false&errorMessage={errorMessage}
```

---

## 1.4 마이페이지 관련 페이지 (2개)

### 마이페이지 (`/mypage`)

**구현 기능:**
- 사용자 정보 조회 및 표시
  - 이름, 이메일, 휴대폰 번호
  - 주소 (있는 경우)
  - 로그인 유형 (일반/카카오/네이버)
  - 가입일
- 메뉴 버튼
  - 주문 내역 버튼
  - 비밀번호 변경 버튼 (일반 로그인만 표시)
- 로그아웃 버튼
  - Zustand store에서 토큰 삭제
  - localStorage 자동 삭제 (persist)
  - 로그인 페이지 이동

**사용된 API:**
```
GET /api/users/info
Response: {
  id, email, name, phoneNumber
  address, loginType, createdAt, isVerified
}
```

---

### 비밀번호 변경 페이지 (`/mypage/change-password`)

**구현 기능:**
- 현재 비밀번호 입력
- 새 비밀번호 입력
- 새 비밀번호 확인 입력
- 비밀번호 일치 여부 실시간 검증 (초록/빨강 텍스트)
- 최소 8자 검증
- 변경 완료 후 마이페이지 이동
- 취소 버튼 (마이페이지 이동)

**사용된 API:**
```
PUT /api/users/password
Body: { currentPassword, newPassword }
```

---

# 2. 세부 정책 결정 필요 사항

## 2.1 토큰 관리 정책

### 현재 구현 상태
- ✅ 로그인 시 accessToken, refreshToken 저장 (Zustand persist)
- ✅ 모든 API 요청에 `Authorization: Bearer {accessToken}` 자동 추가
- ✅ 401 에러 시 Toast 알림 + 로그인 페이지 이동
- ❌ **토큰 자동 갱신 미구현**

### 결정 필요 사항

**1) 토큰 만료 시 처리 방식**
```
옵션 A: 자동 갱신 구현
- accessToken 만료 시 refreshToken으로 자동 재발급
- POST /api/auth/reissue 호출
- 재발급 성공 시 원래 요청 재시도
- 재발급 실패 시 로그아웃

옵션 B: 현재 방식 유지
- 토큰 만료 시 무조건 로그인 페이지 이동
- 사용자가 재로그인 필요

👉 추천: 옵션 A (자동 갱신)
   - 사용자 경험 개선
   - 구매 중 토큰 만료 시에도 끊김 없이 처리
```

**2) 토큰 유효기간**
- accessToken 유효기간: ?(서버 정책 확인 필요)
- refreshToken 유효기간: ?(서버 정책 확인 필요)

**3) 토큰 갱신 시점**
```
옵션 A: 401 에러 발생 시점
- API 호출 실패 후 재시도

옵션 B: 사전 갱신 (Proactive Refresh)
- accessToken 만료 5분 전 자동 갱신
- setInterval로 주기적 체크

👉 추천: 옵션 A (간단하고 효율적)
```

---

## 2.2 구매 정책

### 결정 필요 사항

**1) 비회원 구매 가능 여부**
```
현재: 불가능 (Authorization 필수)
변경 여부: ?

- 비회원 구매 허용 시: 결제 후 회원가입 유도
- 회원 전용 유지 시: 현재 구현 그대로 유지
```

**2) 구매 한도 정책**
```
문서상 한도:
- 문화상품권(컬쳐랜드, 해피머니): 일일 20만원
- 구글기프트카드 외 상품권: 일일 50만원
- 서류 본인인증 후: 한도 없음

프론트엔드 구현 필요 여부:
- 현재 구매 금액 표시?
- 한도 초과 시 경고 메시지?
- 서류 본인인증 페이지 구현?

👉 현재: 백엔드에서만 검증 (프론트 별도 구현 없음)
```

**3) 장바구니 기능**
```
현재: 미구현
필요 여부: ?

- 장바구니 담기 버튼은 있지만 동작하지 않음
- 바로 구매만 가능
```

---

## 2.3 주문/결제 정책

**1) 결제 취소/환불 정책**
```
현재: 주문 내역 조회만 가능
구현 필요 기능:
- 결제 취소 버튼?
- 환불 요청 버튼?
- 환불 가능 기간 제한?

👉 현재: 고객센터 문의로 처리 (별도 UI 없음)
```

**2) 상품권 핀번호 노출 정책**
```
현재: 주문 상세에서 barcodeUrl, voucherNumber 표시
보안 정책:
- 핀번호 마스킹 필요?
- "보기" 버튼 클릭 시 노출?
- 복사 방지?

👉 현재: 전체 노출 (보안 처리 없음)
```

**3) 주문 내역 보관 기간**
```
주문 내역 영구 보관?
또는 기간 제한? (예: 1년)
```

---

## 2.4 보안 정책

**1) NICE 본인인증**
```
현재 사용처:
- 회원가입
- 비밀번호 재설정

추가 사용처:
- 서류 본인인증 (한도 상승)?
- 회원 탈퇴?
```

**2) 비밀번호 정책**
```
현재: 최소 8자
강화 필요 여부:
- 영문/숫자/특수문자 조합?
- 최소 길이 증가?
- 비밀번호 변경 주기?
```

**3) 로그인 시도 제한**
```
현재: 제한 없음
구현 필요 여부:
- N회 실패 시 계정 잠금?
- CAPTCHA 추가?
```

---

## 2.5 UI/UX 정책

**1) 반응형 디자인**
```
현재:
- 상품 상세: 웹 고정 (1440px)
- 기타 페이지: 일부 반응형

통일 필요:
- 전체 웹 고정?
- 전체 반응형?
- 페이지별 분리?
```

**2) 에러 메시지 표시 방식**
```
현재:
- alert() 사용 (일부)
- toast 사용 (상품 상세)

통일 필요:
- 전체 toast로 변경?
- 중요 에러는 모달?
```

**3) 로딩 상태 표시**
```
현재:
- Suspense fallback (페이지 로딩)
- "처리 중..." 텍스트 (버튼)

개선 필요:
- 스피너 추가?
- 스켈레톤 UI?
- Progress bar?
```

---

## 2.6 기능 추가 우선순위

### 우선순위 1 (필수)
- [ ] 토큰 자동 갱신 구현 (`POST /api/auth/reissue`)
- [ ] 전체 페이지 에러 처리 Toast로 통일

### 우선순위 2 (중요)
- [ ] 주문 상세 페이지 개선 (바코드, 핀번호 UI)
- [ ] 회원 탈퇴 기능 (`POST /api/auth/deactivate`)
- [ ] 장바구니 기능 (필요 시)

### 우선순위 3 (향후)
- [ ] 서류 본인인증 (한도 상승)
- [ ] 결제 취소/환불 UI
- [ ] 고객센터/FAQ 페이지

---

## 3. 기술 스택 요약

### 프론트엔드
- **Framework:** Next.js 14 (App Router)
- **언어:** TypeScript
- **상태 관리:** Zustand + persist
- **데이터 페칭:** @tanstack/react-query (v5)
- **스타일링:** Tailwind CSS
- **알림:** Sonner (toast)
- **폼:** React Hook Form (예정)

### 인증
- **토큰 저장:** Zustand persist (localStorage)
- **본인인증:** NICE 평가정보 (팝업 방식)
- **OAuth:** 카카오, 네이버

### API 통신
- **Base URL:** https://pin-toss.com
- **인증 방식:** Bearer Token (자동 주입)
- **에러 처리:** Custom ApiError 클래스

---

## 4. 다음 작업 항목

1. **토큰 자동 갱신 로직 구현** (우선)
2. **전체 페이지 Toast 통일**
3. **정책 결정 후 추가 기능 구현**
4. **E2E 테스트 작성**
5. **배포 환경 설정**

---

**작성:** AI Assistant
**검토 필요:** 개발팀장, 기획팀
