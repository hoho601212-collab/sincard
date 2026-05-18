# API 엔드포인트 정리

실제로 사용 중인 API 엔드포인트 전체 목록입니다.

**Base URL:** `https://pin-toss.com`

---

## 1. 인증 & 회원가입 (Authentication)

### 로그인/로그아웃

```
POST   /api/auth/login              # 일반 로그인
       Body: { email, password }
       Response: { accessToken, refreshToken }

POST   /api/auth/logout             # 로그아웃

POST   /api/auth/reissue            # 토큰 재발급
       Response: { accessToken, refreshToken }
```

### 회원가입

```
POST   /api/auth/register           # 회원가입
       Body: { email, password, name, phoneNumber }

GET    /api/auth/check-id           # 이메일 중복 확인
       ?email=test@example.com

GET    /api/auth/check-phone        # 전화번호 중복 확인
       ?phoneNumber=01012345678
```

### OAuth 소셜 로그인

```
GET    /api/oauth/login             # OAuth 로그인 시작
       ?loginType=KAKAO|NAVER
       Response: Redirect to OAuth provider

POST   /api/auth/connect_naver      # 네이버 계정 연동
       Body: { email }

POST   /api/oauth/naver/connect     # 네이버 계정 연동 (신규)
```

#### OAuth 콜백 (프론트엔드 라우트)

```
GET    /login/social                # OAuth 콜백 처리
       ?isSuccess=true&accessToken=xxx
       ?isSuccess=true&email=xxx&loginType=KAKAO
```

### 아이디/비밀번호 찾기

```
GET    /api/auth/find_id            # 아이디 찾기
       ?name=홍길동&phoneNumber=01012345678
       Response: { email }

PATCH  /api/auth/reset-password     # 비밀번호 재설정
       Body: { email, newPassword, name, phoneNumber }

POST   /api/password-recovery/reset # 임시 비밀번호 발급
       Body: { email, name, phoneNumber }
```

### NICE 본인인증

```
GET    /api/nice/encrypted-data     # NICE 암호화 데이터 요청
       ?purpose=SIGNUP|PASSWORD_RESET
       Response: { token_version_id, enc_data, integrity_value }

POST   /api/nice/callback           # NICE 본인인증 콜백 처리
       Body: { enc_data, integrity_value, token_version_id }
       Response: { name, phoneNumber, birthDate, gender }
```

#### NICE 외부 서비스

```
POST   https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb
       # NICE 본인인증 팝업
```

### 회원 탈퇴

```
POST   /api/auth/deactivate         # 회원 탈퇴
       Body: { password? }          # 이메일 로그인인 경우만
```

---

## 2. 상품 (Product)

### 상품 조회

```
GET    /api/voucher-issuer          # 상품 발급자 목록
       Response: [{
         id, name, imageUrl, description, publisher,
         contactInfo: { homePageUrl, csCenterNumber },
         paymentMethods: [{ type, displayName, discountRate }]
       }]

GET    /api/voucher-issuer/{id}     # 상품 상세 (권종 포함)
       Response: {
         id, name, imageUrl, description, publisher,
         contactInfo: { homePageUrl, csCenterNumber },
         note,
         paymentMethods: [{ type, displayName, discountRate }]
       }

GET    /api/vouchers                # 상품권 목록 조회
       ?providerId={providerId}
       Response: [{
         id, voucherIssuerId, faceValue, price, stock,
         discountRate, issuedDate, expiryDate
       }]
```

---

## 3. 주문 (Order)

### 주문 생성 및 조회

```
POST   /api/orders                  # 주문 생성
       Body: {
         orderItems: [{ voucherId, quantity, price }],
         paymentMethod: "CARD"|"PHONE"|"DEPOSIT_WITHOUT_BANKBOOK"
       }
       Response: { orderNo, totalPrice }

GET    /api/orders                  # 주문 목록 (페이징)
       ?page=1&size=10&keyword=스타벅스
       &statuses=PAID,COMPLETED
       &startDate=2024-12-14&endDate=2025-01-14
       &sortKey=CREATED_AT&sort=DESC
       &offset=0
       Response: {
         content: [{
           id, orderNo, orderDate, status, totalPrice,
           orderItems: [{ voucherId, voucherName, quantity, price }]
         }],
         totalElements, totalPages, currentPage, size
       }

GET    /api/orders/{id}             # 주문 상세
       Response: {
         id, orderNo, orderDate, status, totalPrice,
         paymentMethod, paymentDate,
         orderItems: [{
           voucherId, voucherName, quantity, price,
           barcodeUrl, voucherNumber, expiryDate
         }]
       }
```

### 주문 상태

```
상태 값:
- PENDING: 주문 생성 (결제 대기)
- PAID: 결제 완료
- PROCESSING: 상품권 발급 중
- COMPLETED: 발급 완료
- CANCELED: 주문 취소
- REFUNDED: 환불 완료
```

---

## 4. 결제 (Payment)

### 결제 생성

```
POST   /api/payments                # 결제 생성
       Body: {
         orderNo: "string",
         paymentMethod: "CARD"|"PHONE"|"DEPOSIT_WITHOUT_BANKBOOK"
       }
       Response: {
         paymentUrl: "string"       # GX_pay 결제 URL
       }
```

### 결제 콜백

```
POST   /api/payments/callback       # 결제 완료 후 콜백 (GX_pay → 서버)
       Body: { orderNo, paymentStatus, pgTransactionId, ... }
```

### 결제 결과 (프론트엔드 라우트)

```
GET    /payments/result             # 결제 결과 페이지
       ?isSuccess=true&orderId=xxx
       ?isSuccess=false&errorMessage=xxx
```

---

## 5. 마이페이지 & 회원 관리 (User)

### 회원 정보

```
GET    /api/users/info              # 내 정보 조회
       Response: {
         id, email, name, phoneNumber, address,
         loginType, createdAt, isVerified
       }

PUT    /api/users/password          # 비밀번호 변경
       Body: { currentPassword, newPassword }
```

---

## 6. 이미지 업로드 (Cloudinary)

### Cloudinary API (외부 서비스)

```
POST   https://api.cloudinary.com/v1_1/{cloudName}/image/upload
       Body: FormData { file, upload_preset }
       Response: { secure_url, public_id }

POST   https://api.cloudinary.com/v1_1/{cloudName}/image/destroy
       Body: { public_id }
       Response: { result: "ok" }
```

---

## API 공통 사항

### 인증 헤더

```
Authorization: Bearer {accessToken}
```

### 에러 응답 형식

```json
{
  "code": 1234,
  "status": "BAD_REQUEST",
  "message": "에러 메시지",
  "data": null
}
```

### 페이지네이션 형식

```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 1,
  "size": 10
}
```

### 토큰 재발급 로직

모든 API 요청에서 401 Unauthorized 발생 시 자동으로 처리됩니다:

1. `POST /api/auth/reissue` 자동 호출
2. 재발급 성공: 새 accessToken으로 원래 요청 재시도
3. 재발급 실패: 로그아웃 처리 → 로그인 페이지 이동

위치: `/src/utils/fetchApi.ts`

---

## 프론트엔드 라우트

### 인증

- `/login` - 로그인
- `/login/social` - OAuth 콜백 처리
- `/register` - 회원가입
- `/register/nice` - NICE 본인인증 콜백 (회원가입)
- `/find-id` - 아이디 찾기
- `/password-reset` - 비밀번호 재설정
- `/password-reset/nice` - NICE 본인인증 콜백 (비밀번호 재설정)

### 상품

- `/` - 홈 (상품 목록)
- `/product/[id]` - 상품 상세

### 주문 & 결제

- `/order/list` - 주문 내역
- `/order/detail/[id]` - 주문 상세
- `/payments/result` - 결제 결과

### 마이페이지

- `/my-page` - 마이페이지 (내 정보, 주문 내역)
- `/my-page/change-password` - 비밀번호 변경

### 기타

- `/privacy` - 개인정보처리방침
- `/usepolicy` - 이용약관

---

## 사용 중인 외부 서비스

### 1. NICE 본인인증

- **URL:** `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb`
- **용도:** 회원가입, 비밀번호 재설정 시 본인인증
- **연동 방식:** 팝업 창으로 NICE 인증 페이지 호출 → 콜백으로 인증 데이터 수신

### 2. Cloudinary

- **URL:** `https://api.cloudinary.com/v1_1/{cloudName}/`
- **용도:** 이미지 업로드 및 관리
- **API:**
  - `POST /image/upload` - 이미지 업로드
  - `POST /image/destroy` - 이미지 삭제

### 3. GX_pay (결제 게이트웨이)

- **용도:** 신용카드, 휴대폰, 무통장입금 결제 처리
- **연동 방식:** 서버에서 결제 URL 생성 → 클라이언트에서 결제 진행 → 콜백으로 결제 결과 수신

---

## 기술 스택

- **API 호출:** fetch API 기반 `fetchApi` 유틸리티 (`/src/utils/fetchApi.ts`)
- **상태 관리:** Zustand
- **라우팅:** Next.js App Router
- **인증:** JWT (Access Token + Refresh Token)
