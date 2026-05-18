# 1. 인증 & 회원가입 (Authentication)

## 개요
사용자 인증 및 회원가입 관련 기능을 담당하는 도메인입니다.
일반 이메일/비밀번호 로그인, OAuth 소셜 로그인, NICE 본인인증을 지원합니다.

---

## 주요 기능

### 1.1 로그인 (Login)
- **일반 로그인**: 이메일/비밀번호 기반 인증
- **OAuth 소셜 로그인**: 카카오, 네이버 연동

#### 1.1.1 일반 로그인 플로우
```
사용자
  ↓
[/login] LoginMain
  ↓
이메일/비밀번호 입력
  ↓
fetchLogin (POST /api/auth/login)
  ↓
accessToken 수신
  ↓
AuthContext.login (토큰 저장)
  ↓
홈페이지 이동
```

**관련 파일:**
- `src/app/(auth)/login/page.tsx`
- `src/components/auth/login/LoginMain.tsx:1`
- `src/controllers/auth/login.ts:1`
- `src/contexts/AuthContext.tsx:1`

**API:**
- `POST /api/auth/login`
  - Request: `{ email, password }`
  - Response: `{ accessToken }`

---

#### 1.1.2 OAuth 소셜 로그인 플로우
```
사용자
  ↓
[/login] LoginButtons
  ↓
카카오/네이버 버튼 클릭
  ↓
백엔드 OAuth URL로 리다이렉트
(https://pin-toss.com/api/oauth/login?loginType=KAKAO)
  ↓
OAuth 인증 서버 (카카오/네이버)
  ↓
백엔드에서 OAuth 처리
  ↓
┌─────────────────────────────────┐
│ 케이스 1: 기존 회원             │
│ /login/social?isSuccess=true    │
│   &accessToken=xxx               │
└─────────────────────────────────┘
  ↓
SocialLoginRedirect
  ↓
AuthContext.login (토큰 저장)
  ↓
홈페이지 이동

┌─────────────────────────────────┐
│ 케이스 2: 신규 회원             │
│ /login/social?isSuccess=true    │
│   &email=xxx&loginType=KAKAO     │
└─────────────────────────────────┘
  ↓
SocialLoginRedirect
  ↓
useOAuthStore에 email, loginType 저장
  ↓
회원가입 페이지(/register)로 이동
```

**관련 파일:**
- `src/components/auth/login/LoginButtons.tsx:1`
- `src/app/(auth)/login/social/page.tsx`
- `src/components/auth/login/SocialLoginRedirect.tsx:1`
- `src/store/useOAuthStore.ts:1`

**지원 OAuth:**
- 카카오 (KAKAO)
- 네이버 (NAVER)

---

### 1.2 회원가입 (Register)
- **필수 절차**: NICE 본인인증
- **선택 절차**: OAuth 연동 가입

#### 1.2.1 일반 회원가입 + NICE 인증 플로우
```
사용자
  ↓
[/register] RegisterMain
  ↓
RegisterPersonalInfo (개인정보 입력)
  ↓
휴대폰 인증 버튼 클릭
  ↓
┌──────────────────────────────────────────┐
│ NICE 본인인증 프로세스                   │
├──────────────────────────────────────────┤
│ 1. GET /api/nice/encrypted-data          │
│    ?purpose=SIGNUP                        │
│    Response: {                            │
│      token_version_id,                    │
│      enc_data,                            │
│      integrity_value                      │
│    }                                      │
│                                           │
│ 2. NICE 팝업 창 오픈                     │
│    → NICE 인증 서버로 POST               │
│                                           │
│ 3. 본인인증 완료                         │
│    → /register/nice?name=홍길동          │
│       &tel=01012345678&success=true      │
│                                           │
│ 4. NiceRedirectHandler                   │
│    → postMessage로 부모창에 데이터 전달  │
└──────────────────────────────────────────┘
  ↓
RegisterMain에서 데이터 수신
  ↓
setValue('name', name)
setValue('phone', tel)
  ↓
fetchCheckPhone (GET /api/auth/check-phone)
  ↓
휴대폰 중복 확인 완료
  ↓
이메일, 비밀번호, 주소 등 추가 입력
  ↓
fetchRegister (POST /api/auth/register)
  ↓
회원가입 완료
  ↓
로그인 페이지로 이동
```

**관련 파일:**
- `src/app/(auth)/register/page.tsx`
- `src/components/auth/register/RegisterMain.tsx:1`
- `src/components/auth/register/RegisterPersonalInfo.tsx:1`
- `src/app/(auth)/register/nice/page.tsx`
- `src/components/auth/register/NiceRedirectHandler.tsx:1`
- `src/controllers/auth/register.ts:1`
- `src/controllers/niceid/nice-id.ts:1`

**API:**
- `GET /api/nice/encrypted-data?purpose=SIGNUP`
  - Response: `{ token_version_id, enc_data, integrity_value }`
- `GET /api/auth/check-phone?phoneNumber=01012345678`
  - Response: `{ isDuplicate: boolean }`
- `GET /api/auth/check-id?email=test@example.com`
  - Response: `{ isDuplicate: boolean }`
- `POST /api/auth/register`
  - Request: `{ email, password, name, phoneNumber, address, loginType }`
  - Response: `{ userId }`

---

#### 1.2.2 OAuth 연동 회원가입 플로우
```
사용자
  ↓
OAuth 로그인 시도 (신규 회원)
  ↓
SocialLoginRedirect
  ↓
useOAuthStore에 email, loginType 저장
  ↓
[/register] RegisterMain
  ↓
이메일 자동 입력 (변경 불가)
loginType 자동 설정 (KAKAO/NAVER)
  ↓
NICE 본인인증 (위와 동일)
  ↓
이름, 전화번호, 주소 입력
비밀번호 입력 (선택)
  ↓
fetchRegister
  ↓
회원가입 완료
  ↓
로그인 페이지로 이동
```

**특징:**
- OAuth 이메일은 자동으로 채워지고 수정 불가
- `loginType`이 `KAKAO` 또는 `NAVER`로 설정됨
- 비밀번호는 선택 사항 (OAuth 로그인만 사용 가능)

---

### 1.3 아이디 찾기 (Find ID)

```
사용자
  ↓
[/find-id] FindIdMain
  ↓
이름, 전화번호 입력
  ↓
fetchFindId (GET /api/auth/find_id)
  ↓
이메일 표시 (일부 마스킹)
```

**관련 파일:**
- `src/app/(auth)/find-id/page.tsx`
- `src/components/auth/find-id/FindIdMain.tsx:1`
- `src/controllers/auth/findId.ts:1`

**API:**
- `GET /api/auth/find_id?name=홍길동&phoneNumber=01012345678`
  - Response: `{ email: "test***@example.com" }`

---

### 1.4 비밀번호 재설정 (Password Reset)
- **NICE 본인인증 필수**

```
사용자
  ↓
[/password-reset] PasswordResetMain
  ↓
이메일 입력
  ↓
NICE 본인인증 버튼 클릭
  ↓
┌──────────────────────────────────────────┐
│ NICE 본인인증 프로세스                   │
├──────────────────────────────────────────┤
│ 1. GET /api/nice/encrypted-data          │
│    ?purpose=PASSWORD_RESET                │
│                                           │
│ 2. NICE 팝업 → 본인인증                 │
│                                           │
│ 3. /password-reset/nice로 리다이렉트     │
│                                           │
│ 4. postMessage로 데이터 전달             │
└──────────────────────────────────────────┘
  ↓
새 비밀번호 입력
  ↓
fetchResetPassword (POST /api/auth/reset-password)
  ↓
비밀번호 재설정 완료
  ↓
로그인 페이지로 이동
```

**관련 파일:**
- `src/app/(auth)/password-reset/page.tsx`
- `src/components/auth/password-reset/PasswordResetMain.tsx:1`
- `src/app/(auth)/password-reset/nice/page.tsx`
- `src/controllers/auth/passwordReset.ts:1`

**API:**
- `POST /api/auth/reset-password`
  - Request: `{ email, newPassword, name, phoneNumber }`
  - Response: `{ success: boolean }`

---

### 1.5 로그아웃 (Logout)

```
사용자
  ↓
로그아웃 버튼 클릭
  ↓
AuthContext.logout
  ↓
localStorage에서 accessToken 삭제
  ↓
AuthContext 상태 초기화
  ↓
홈페이지로 이동
```

**관련 파일:**
- `src/contexts/AuthContext.tsx:1`

---

## 인증 토큰 관리

### 토큰 저장
- `localStorage`에 `accessToken` 저장
- 모든 API 요청 시 `Authorization: Bearer {token}` 헤더 포함

### 토큰 재발급 (Auto Refresh)
```
API 요청
  ↓
401 Unauthorized 에러 발생
  ↓
fetchApi (utils/fetchApi.ts)에서 자동 감지
  ↓
POST /api/auth/reissue (토큰 재발급)
  ↓
┌─────────────────────────────────┐
│ 성공: 새 토큰 저장              │
│ → 원래 요청 재시도              │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 실패: 로그아웃 처리             │
│ → 로그인 페이지로 이동          │
└─────────────────────────────────┘
```

**관련 파일:**
- `src/utils/fetchApi.ts:1`
- `src/controllers/auth/reissue.ts:1`

**API:**
- `POST /api/auth/reissue`
  - Request: `{ accessToken }`
  - Response: `{ accessToken }`

---

## 상태 관리

### AuthContext
- **역할**: 전역 인증 상태 관리
- **상태**:
  - `isLoggedIn`: 로그인 여부
  - `userInfo`: 사용자 정보 (이름, 이메일 등)
- **메서드**:
  - `login(token)`: 로그인 처리
  - `logout()`: 로그아웃 처리
  - `checkAuth()`: 인증 상태 확인

**파일:** `src/contexts/AuthContext.tsx:1`

### useOAuthStore (Zustand)
- **역할**: OAuth 임시 데이터 저장
- **상태**:
  - `email`: OAuth에서 받은 이메일
  - `loginType`: 'KAKAO' | 'NAVER'
- **사용 시나리오**: 신규 OAuth 사용자가 회원가입 페이지로 이동 시 데이터 전달

**파일:** `src/store/useOAuthStore.ts:1`

---

## 라우팅 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/login` | LoginMain | 일반/OAuth 로그인 |
| `/login/social` | SocialLoginRedirect | OAuth 리다이렉트 처리 |
| `/register` | RegisterMain | 회원가입 |
| `/register/nice` | NiceRedirectHandler | NICE 본인인증 콜백 |
| `/find-id` | FindIdMain | 아이디 찾기 |
| `/password-reset` | PasswordResetMain | 비밀번호 재설정 |
| `/password-reset/nice` | NiceRedirectHandler | NICE 본인인증 콜백 |

---

## NICE 본인인증 상세

### 인증 용도 (Purpose)
- `SIGNUP`: 회원가입 시
- `PASSWORD_RESET`: 비밀번호 재설정 시

### 플로우
1. **암호화 데이터 요청**
   - `GET /api/nice/encrypted-data?purpose=SIGNUP`
   - 응답: `{ token_version_id, enc_data, integrity_value }`

2. **NICE 팝업 오픈**
   - Form을 동적으로 생성하여 NICE 서버로 POST
   - 팝업 창에서 본인인증 진행

3. **인증 결과 수신**
   - 인증 완료 시: `/register/nice?name=홍길동&tel=01012345678&success=true`
   - 인증 실패 시: `success=false`

4. **부모 창에 데이터 전달**
   - `window.opener.postMessage({ name, phoneNumber }, '*')`
   - 부모 창에서 `useEffect` + `addEventListener('message')`로 수신

**관련 파일:**
- `src/app/api_n/nice/route.ts:1` (NICE API 프록시)
- `src/controllers/niceid/nice-id.ts:1`
- `src/components/auth/register/NiceRedirectHandler.tsx:1`

---

## 보안 고려사항

1. **비밀번호 관리**
   - 프론트엔드에서 평문 전송 (HTTPS 필수)
   - 백엔드에서 해싱 처리

2. **토큰 관리**
   - `localStorage` 사용 (XSS 취약점 주의)
   - 401 에러 시 자동 재발급
   - 재발급 실패 시 즉시 로그아웃

3. **NICE 인증**
   - 암호화된 데이터 사용
   - 백엔드에서 검증 후 사용자 정보 반환

4. **OAuth**
   - 백엔드에서 OAuth 처리
   - 프론트는 리다이렉트 결과만 처리

---

## 에러 처리

### 로그인 실패
- 이메일/비밀번호 불일치
- 계정 비활성화
- → AlertContext로 에러 메시지 표시

### 회원가입 실패
- 이메일 중복
- 전화번호 중복
- NICE 인증 실패
- → 각 단계별 검증 및 에러 메시지

### 토큰 만료
- 자동 재발급 시도
- 재발급 실패 시 로그인 페이지로 이동
