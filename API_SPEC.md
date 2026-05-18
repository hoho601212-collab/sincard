# API 명세서

## 공통 응답 형식

모든 API는 아래의 공통 응답 형식을 따릅니다.

### 성공 응답
```json
{
  "status": "OK",
  "data": { ... },
  "timestamp": "2025-11-21T21:44:03.324982166",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

### 에러 응답
```json
{
  "status": "BAD_REQUEST",
  "errorMessage": "에러 메시지",
  "timestamp": "2025-11-21T21:44:03.324982166",
  "errors": {
    "fieldName": "필드별 에러 메시지"
  },
  "code": "400",
  "errorCodeMessage": "400"
}
```

---

# 인증 (Auth)

## 1. 회원가입 (`POST /api/auth/register`)

**Request**
```json
{
  "email": "user@example.com",       // 필수, 이메일 형식
  "password": "password123",         // 필수
  "name": "홍길동",                   // 필수
  "phone": "01012345678",            // 필수
  "loginType": "LOCAL"               // 필수, "LOCAL" | "NAVER" | "KAKAO"
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 로그인 (`POST /api/auth/login`)

**Request**
```json
{
  "email": "user@example.com",       // 필수, 이메일 형식
  "password": "password123"          // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

> 참고: RefreshToken은 HttpOnly Cookie로 전달됩니다.

---

## 3. 토큰 재발급 (`POST /api/auth/reissue`)

**Request**
- Cookie에 `refreshToken` 필요

**Response**
```json
{
  "status": "OK",
  "data": {
    "reissueAccessToken": "eyJhbGciOiJIUzI1NiIsInR..."
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 4. 이메일 중복 확인 (`GET /api/auth/check-id`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| email | String | 필수 | 확인할 이메일 |

```
GET /api/auth/check-id?email=user@example.com
```

**Response**
```json
{
  "status": "OK",
  "data": true,    // true: 중복, false: 사용 가능
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 5. 휴대폰 번호 중복 확인 (`GET /api/auth/check-phone`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| phone | String | 필수 | 확인할 휴대폰 번호 |

```
GET /api/auth/check-phone?phone=01012345678
```

**Response**
```json
{
  "status": "OK",
  "data": true,    // true: 중복, false: 사용 가능
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 6. 아이디 찾기 (`GET /api/auth/find_id`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| name | String | 필수 | 사용자 이름 |
| phone | String | 필수 | 휴대폰 번호 |

```
GET /api/auth/find_id?name=홍길동&phone=01012345678
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "account": "user@example.com"
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 7. 비밀번호 재설정 (`POST /api/password-recovery/reset`)

**Request**
```json
{
  "email": "user@example.com",       // 필수, 이메일 형식
  "name": "홍길동",                   // 필수
  "phone": "01012345678"             // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# OAuth2

## 1. OAuth2 로그인 URL 요청 (`GET /api/oauth/login`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| loginType | String | 필수 | "naver" 또는 "kakao" |
| clientRedirectUri | String | 필수 | 로그인 완료 후 리다이렉트 URI |

```
GET /api/oauth/login?loginType=naver&clientRedirectUri=https://example.com/callback
```

**Response**
- HTTP 302 Redirect to OAuth Provider

---

## 2. OAuth2 콜백 (`GET /api/oauth/callback/{loginType}`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| code | String | 필수 | OAuth 인증 코드 |
| state | String | 필수 | CSRF 방지 상태값 |

```
GET /api/oauth/callback/naver?code=xxx&state=yyy
```

**Response**
- HTTP 302 Redirect to clientRedirectUri with tokens

---

# NICE 본인인증

## 1. 암호화 데이터 요청 (`GET /api/nice/encrypted-data`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| purpose | String | 필수 | 인증 목적 |
| clientRedirectUri | String | 필수 | 인증 완료 후 리다이렉트 URI |

```
GET /api/nice/encrypted-data?purpose=signup&clientRedirectUri=https://example.com/callback
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "token_version_id": "...",
    "enc_data": "...",
    "integrity_value": "..."
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. NICE 콜백 (`GET /api/nice/callback`)

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| token_version_id | String | 필수 | 토큰 버전 ID |
| enc_data | String | 필수 | 암호화된 데이터 |
| integrity_value | String | 필수 | 무결성 검증 값 |

**Response**
- HTTP 302 Redirect to clientRedirectUri

---

# 사용자 (User)

## 1. 사용자 정보 조회 (`GET /api/users/info`)

**인증**: 필요 없음

**Response**
```json
{
  "status": "OK",
  "data": {
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "01012345678"
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 비밀번호 변경 (`PUT /api/users/password`)

**인증**: USER 권한 필요

**Request**
```json
{
  "originPassword": "oldPassword123",    // 필수
  "newPassword": "newPassword456"        // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 공지사항 (Notice)

## 1. 공지사항 목록 조회 (`GET /api/notice`)

**인증**: 필요 없음

**Response**
```json
{
  "status": "OK",
  "data": [
    {
      "boardId": 1,
      "title": "공지사항 제목",
      "content": "공지사항 내용",
      "creationDate": "2025-11-21 12:00:00",
      "updateDate": "2025-11-21 12:00:00",
      "boardType": "NOTICE"
    }
  ],
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 공지사항 상세 조회 (`GET /api/notice/{noticeId}`)

**인증**: 필요 없음

**Response**
```json
{
  "status": "OK",
  "data": {
    "boardId": 1,
    "title": "공지사항 제목",
    "content": "공지사항 내용",
    "creationDate": "2025-11-21 12:00:00",
    "updateDate": "2025-11-21 12:00:00",
    "boardType": "NOTICE"
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 3. 공지사항 등록 (`POST /api/notice`)

**인증**: ADMIN 권한 필요

**Request**
```json
{
  "title": "공지사항 제목",      // 필수
  "content": "공지사항 내용",    // 필수
  "boardType": "NOTICE"         // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 4. 공지사항 수정 (`PATCH /api/notice/{noticeId}`)

**인증**: ADMIN 권한 필요

**Request**
```json
{
  "title": "수정된 제목",        // 필수
  "content": "수정된 내용"       // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 5. 공지사항 삭제 (`DELETE /api/notice/{noticeId}`)

**인증**: ADMIN 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# Q&A

## 1. Q&A 목록 조회 (`GET /api/qna`)

**인증**: 필요 없음

**Request**
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|-----|------|-------|
| page | Integer | 선택 | 페이지 번호 | 0 |
| size | Integer | 선택 | 페이지 크기 | 10 |

```
GET /api/qna?page=0&size=10
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "items": [
      {
        "boardId": 1,
        "title": "질문 제목",
        "content": "질문 내용",
        "creationDate": "2025-11-21 12:00:00",
        "updateDate": "2025-11-21 12:00:00",
        "boardType": "QNA"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. Q&A 상세 조회 (`GET /api/qna/{qnaId}`)

**인증**: 필요 없음

**Response**
```json
{
  "status": "OK",
  "data": {
    "boardId": 1,
    "title": "질문 제목",
    "content": "질문 내용",
    "creationDate": "2025-11-21 12:00:00",
    "updateDate": "2025-11-21 12:00:00",
    "boardType": "QNA"
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 3. Q&A 등록 (`POST /api/qna`)

**인증**: USER 권한 필요

**Request**
```json
{
  "title": "질문 제목",          // 필수
  "content": "질문 내용",        // 필수
  "boardType": "QNA"            // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 4. Q&A 수정 (`PATCH /api/qna/{qnaId}`)

**인증**: USER 권한 필요

**Request**
```json
{
  "title": "수정된 제목",        // 필수
  "content": "수정된 내용"       // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 5. Q&A 삭제 (`DELETE /api/qna/{qnaId}`)

**인증**: USER 또는 ADMIN 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 장바구니 (Cart)

## 1. 장바구니 목록 조회 (`GET /api/carts/items`)

**인증**: USER 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": [
    {
      "id": 1,
      "productId": 100,
      "quantity": 2,
      "name": "상품명",
      "price": 10000,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 장바구니 상품 추가 (`POST /api/carts/items`)

**인증**: USER 권한 필요

**Request**
```json
[
  {
    "productId": 100,      // 선택
    "quantity": 2          // 선택
  }
]
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 3. 장바구니 상품 수량 수정 (`PATCH /api/carts/items/{cartItemId}`)

**인증**: USER 권한 필요

**Request**
```json
{
  "quantity": 3            // 선택
}
```

**Response**
```json
{
  "status": "OK",
  "data": 3,               // 변경된 수량
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 4. 장바구니 상품 삭제 (`DELETE /api/carts/items/{cartItemId}`)

**인증**: USER 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 주문 (Order)

## 1. 주문 목록 조회 (`GET /api/orders`)

**인증**: USER 권한 필요

**Request**
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|-----|------|-------|
| page | Integer | 선택 | 페이지 번호 | 1 |
| size | Integer | 선택 | 페이지 크기 | 10 |
| keyword | String | 선택 | 검색어 | - |
| statuses | List<OrderStatus> | 선택 | 주문 상태 필터 | - |
| startDate | LocalDate | 선택 | 시작일 | - |
| endDate | LocalDate | 선택 | 종료일 | - |
| sortKey | OrderSortKey | 선택 | 정렬 기준 | CREATED_AT |
| sort | SortDirection | 선택 | 정렬 방향 | DESC |

```
GET /api/orders?page=1&size=10&sortKey=CREATED_AT&sort=DESC
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "items": [
      {
        "orderId": 1,
        "orderNo": "ORD20251121001",
        "status": "COMPLETED",
        "paymentMethodType": "CARD",
        "orderDate": "2025-11-21 12:00:00",
        "price": 50000
      }
    ],
    "page": 1,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 주문 상세 조회 (`GET /api/orders/{orderId}`)

**인증**: USER 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": {
    "orderId": 1,
    "orderNo": "ORD20251121001",
    "paymentMethodType": "CARD",
    "orderStatus": "COMPLETED",
    "totalPrice": 50000,
    "ordererName": "홍길동",
    "ordererPhone": "01012345678",
    "orderDate": "2025-11-21 12:00:00",
    "items": [
      {
        "voucherIssuerName": "상품권 발행처",
        "voucherName": "상품권명",
        "price": 50000,
        "pinNum": "1234-5678-9012",
        "status": "ISSUED"
      }
    ]
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 3. 주문 생성 (`POST /api/orders`)

**인증**: USER 권한 필요

**Request**
```json
{
  "orderItems": [                         // 필수, 최소 1개 이상
    {
      "voucherId": 1,                     // 필수
      "price": 50000,                     // 필수
      "quantity": 1                       // 필수
    }
  ]
}
```

**Response**
```json
{
  "status": "OK",
  "data": "ORD20251121001",               // 주문번호
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 4. 주문 취소 (`PUT /api/orders/{orderNo}/cancel`)

**인증**: USER 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 5. 주문 환불 (`POST /api/orders/{orderNo}/refund`)

**인증**: USER 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 상품권 발행처 (Voucher Issuer)

## 1. 발행처 목록 조회 (`GET /api/voucher-issuer`)

**인증**: 필요 없음

**Response**
```json
{
  "status": "OK",
  "data": [
    {
      "id": 1,
      "name": "발행처명",
      "contactInfo": {
        "homePageUrl": "https://example.com",
        "csCenterNumber": "1588-0000"
      },
      "description": "발행처 설명",
      "publisher": "발행자",
      "imageUrl": "https://example.com/logo.jpg",
      "note": "유의사항",
      "paymentMethods": [
        {
          "type": "CARD",
          "displayName": "카드",
          "discountRate": 3.0
        }
      ]
    }
  ],
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 발행처 상세 조회 (`GET /api/voucher-issuer/{voucherIssuerId}`)

**인증**: 필요 없음

**Response**
```json
{
  "status": "OK",
  "data": {
    "id": 1,
    "name": "발행처명",
    "contactInfo": {
      "homePageUrl": "https://example.com",
      "csCenterNumber": "1588-0000"
    },
    "description": "발행처 설명",
    "publisher": "발행자",
    "imageUrl": "https://example.com/logo.jpg",
    "descriptionImageUrl": "https://example.com/desc.jpg",
    "note": "유의사항",
    "paymentMethods": [
      {
        "type": "CARD",
        "displayName": "카드",
        "discountRate": 3.0
      }
    ],
    "vouchers": [
      {
        "id": 1,
        "name": "상품권명",
        "issuerName": "발행처명",
        "price": 50000,
        "createdAt": "2025-11-21 12:00:00"
      }
    ]
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 결제 (Payment)

## 1. 결제 생성 (`POST /api/payments/billgate`)

**인증**: 필요 없음

**Request**
```json
{
  "orderNo": "ORD20251121001",            // 필수
  "paymentMethod": "CARD"                 // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "serviceId": "SERVICE_001",
    "orderNo": "ORD20251121001",
    "ordererId": 1,
    "ordererName": "홍길동",
    "ordererEmail": "user@example.com",
    "ordererPhone": "01012345678",
    "serviceCode": "SC01",
    "price": 50000,
    "productName": "상품권 구매",
    "orderDate": "20251121120000",
    "checkSum": "abc123...",
    "checkSumHp": "def456..."
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 결제 콜백 (`POST /api/payments/billgate/callback`)

**Request** (Form-encoded)
| 필드 | 타입 | 설명 |
|-----|------|------|
| SERVICE_ID | String | 가맹점 서비스 ID (max 20자) |
| SERVICE_CODE | String | 결제 수단 별 서비스 코드 (4자) |
| ORDER_ID | String | 주문번호 (64자) |
| ORDER_DATE | String | 주문일시 (14자, YYYYMMDDHH24MISS) |
| TRANSACTION_ID | String | 거래번호 (20자) |
| RESPONSE_CODE | String | 응답코드 (4자) |
| RESPONSE_MESSAGE | String | 응답 메시지 (64자) |
| DETAIL_RESPONSE_CODE | String | 상세 응답 코드 (2자) |
| DETAIL_RESPONSE_MESSAGE | String | 상세 응답 메시지 (64자) |
| MESSAGE | String | 암호화 메시지 |
| RESERVED1 | String | 예비 필드 1 |
| RESERVED2 | String | 예비 필드 2 |
| RESERVED3 | String | 예비 필드 3 |
| CERT_TYPE | String | 인증구분 (4자) |

**Response**
- HTTP 302 Redirect

---

# 관리자 - 회원 (Admin Member)

## 1. 회원 검색 (`GET /api/admin/members`)

**인증**: ADMIN 권한 필요

**Request**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|-----|------|
| keyword | String | 선택 | 검색어 |
| page | Integer | 선택 | 페이지 번호 |
| size | Integer | 선택 | 페이지 크기 |

```
GET /api/admin/members?keyword=홍길동&page=0&size=10
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "content": [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "홍길동",
        "phoneNumber": "01012345678",
        "loginType": "LOCAL"
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "number": 0,
    "size": 10
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 관리자 - 상품권 발행처 (Admin Voucher Issuer)

## 1. 발행처 등록 (`POST /admin/voucher-issuers`)

**인증**: ADMIN 권한 필요

**Request**
```json
{
  "name": "발행처명",                      // 필수
  "code": "ISSUER001",                    // 필수
  "homePage": "https://example.com",      // 필수
  "csCenter": "1588-0000",                // 필수
  "description": "발행처 설명",            // 필수
  "publisher": "발행자",                   // 필수
  "imageUrl": "https://example.com/logo.jpg",  // 필수
  "descriptionImageUrl": "https://example.com/desc.jpg",  // 선택
  "note": "유의사항",                      // 필수
  "fee": 0.0,                             // 선택, 기본값: 0.0, 범위: 0.0~100.0
  "availablePaymentMethods": [            // 필수, 최소 1개 이상
    {
      "paymentMethodType": "CARD",        // 필수
      "discountRate": 3.0                 // 필수, 범위: 0.0~100.0
    }
  ]
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 발행처 상세 조회 (`GET /admin/voucher-issuers/{voucherIssuerId}`)

**인증**: ADMIN 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": {
    "id": 1,
    "name": "발행처명",
    "csCenterNumber": "1588-0000",
    "homepageUrl": "https://example.com",
    "description": "발행처 설명",
    "imageUrl": "https://example.com/logo.jpg",
    "descriptionImageUrl": "https://example.com/desc.jpg",
    "note": "유의사항",
    "paymentMethods": [
      {
        "paymentMethodType": "CARD",
        "discountRate": 3.0
      }
    ]
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 3. 결제 수단 추가 (`POST /admin/voucher-issuers/{voucherIssuerId}/payment-methods`)

**인증**: ADMIN 권한 필요

**Request**
```json
{
  "paymentMethods": [                     // 필수
    {
      "paymentMethodType": "BANK_TRANSFER",  // 필수
      "discountRate": 5.0                    // 필수, 범위: 0.0~100.0
    }
  ]
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 4. 이미지 업로드 URL 생성 (`POST /admin/voucher-issuers/images/signed-upload-url`)

**인증**: ADMIN 권한 필요

**Request**
```json
{
  "originalFileName": "logo.jpg",         // 필수
  "contentType": "image/jpeg"             // 필수
}
```

**Response**
```json
{
  "status": "OK",
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/bucket/...",
    "key": "voucher-issuers/abc123.jpg",
    "expiresAt": "2025-11-21T13:00:00"
  },
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 5. 발행처 삭제 (`DELETE /admin/voucher-issuers/{voucherIssuerId}`)

**인증**: ADMIN 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 관리자 - 상품권 (Admin Voucher)

## 1. 상품권 등록 (`POST /admin/voucher-issuers/{voucherIssuerId}/vouchers`)

**인증**: ADMIN 권한 필요

**Request**
```json
{
  "vouchers": [                           // 필수, 최소 1개 이상
    {
      "name": "5만원권",                   // 필수
      "price": 50000                       // 필수, 최소값: 0
    },
    {
      "name": "10만원권",
      "price": 100000
    }
  ]
}
```

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

## 2. 상품권 삭제 (`DELETE /admin/voucher-issuers/{voucherIssuerId}/vouchers/{voucherId}`)

**인증**: ADMIN 권한 필요

**Response**
```json
{
  "status": "OK",
  "data": null,
  "timestamp": "...",
  "errors": null,
  "code": "200",
  "errorCodeMessage": null
}
```

---

# 헬스체크

## 1. 서버 상태 확인 (`GET /api/health`)

**인증**: 필요 없음

**Response**
```
OK
```

---

# Enum 타입 정의

## LoginType
| 값 | 설명 |
|----|------|
| LOCAL | 일반 회원가입 |
| NAVER | 네이버 소셜 로그인 |
| KAKAO | 카카오 소셜 로그인 |

## BoardType
| 값 | 설명 |
|----|------|
| NOTICE | 공지사항 |
| QNA | Q&A |

## OrderStatus
| 값 | 설명 |
|----|------|
| PENDING | 대기 중 |
| COMPLETED | 완료 |
| CANCELLED | 취소됨 |
| REFUNDED | 환불됨 |

## PaymentMethodType
| 값 | 표시명 |
|----|-------|
| BANK_TRANSFER | 무통장입금 |
| CARD | 카드 |
| PHONE | 휴대폰 |

## OrderSortKey
| 값 | 설명 |
|----|------|
| CREATED_AT | 생성일 기준 |

## SortDirection
| 값 | 설명 |
|----|------|
| ASC | 오름차순 |
| DESC | 내림차순 |
