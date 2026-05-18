/**
 * Multi PG 결제 시스템 타입 정의
 */

// ===== PG 제공자 =====
export type PgProvider = 'BILLGATE' | 'DANAL' | 'INICIS';

export interface PgProviderInfo {
  code: PgProvider;
  name: string;
  feeRate: number; // 수수료율 (%)
  supportedPaymentMethods: PaymentMethodCode[];
}

// ===== 결제 수단 =====
export type PaymentMethodCode = 'CARD' | 'PHONE' | 'DEPOSIT_WITHOUT_BANKBOOK';

export interface PaymentMethodInfo {
  code: PaymentMethodCode;
  displayName: string;
  description?: string;
  additionalFeeRate?: number; // 추가 수수료율 (예: 휴대폰 10%)
  supportedPgProviders: PgProvider[];
}

// ===== 통신사 (휴대폰 결제용) =====
export type TelecomCode = 'SKT' | 'SK7MOBILE' | 'KT' | 'KCT' | 'LGU' | 'HELLO_MOBILE';

export interface TelecomInfo {
  code: TelecomCode;
  displayName: string;
}

// ===== 수수료 정책 =====
export type FeePolicy = 'INCLUDED' | 'SEPARATE';

export interface FeePolicyInfo {
  code: FeePolicy;
  displayName: string;
  description: string;
}

// ===== 수수료 계산 결과 =====
export interface FeeCalculation {
  voucherAmount: number; // 상품권 금액
  feeAmount: number; // 수수료 금액
  totalAmount: number; // 사용자 결제 금액
  actualVoucherAmount: number; // 실제 발급될 상품권 금액
}

// ===== Billgate 결제 데이터 (문서 기준) =====
export interface BillgatePaymentData {
  SERVICE_ID: string;       // PG 서비스 ID
  SERVICE_CODE: string;     // 결제 수단별 코드 (0900: 카드, 1100: 휴대폰)
  SERVICE_TYPE: string;     // 결제 종류 ('0000': 일반결제)
  ORDER_ID: string;         // 주문번호
  ORDER_DATE: string;       // 주문 일시 (yyyyMMddHHmmss)
  AMOUNT: number;           // 결제 금액
  RETURN_URL: string;       // 결제 완료 후 콜백 URL
  CHECK_SUM: string;        // 체크섬 (보안)
  CHECK_SUM_HP: string;     // 휴대폰용 체크섬
  ITEM_CODE: string;        // 상품 코드
  ITEM_NAME: string;        // 상품명
  ORDERER_TEL: string;      // 주문자 전화번호
  USER_ID: string;          // 사용자 ID
  LOGO: string;             // 로고 URL
  RESERVED1: string;        // 예비변수 (결제 완료 후 리다이렉트 URI)
  MOBILE_NUMBER?: string;   // 결제창 UI에 표기할 휴대폰번호 사전 전달 (휴대폰 결제 시)
  READONLY_HP?: string;     // 사전전달 휴대폰번호 수정 가능 여부 (Y: 수정불가, N: 수정가능)
}

// ===== Danal 결제 데이터 =====
export interface DanalPaymentData {
  CPID: string; // 상점 ID
  ORDERID: string; // 주문번호
  PRODUCTNAME: string; // 상품명
  AMOUNT: number; // 결제 금액
  USERID: string; // 사용자 ID
  USERNAME: string; // 사용자 이름
  USERPHONE: string; // 사용자 전화번호
  USEREMAIL: string; // 사용자 이메일
  RETURNURL: string; // 결제 완료 후 리다이렉트 URI
  CANCELURL: string; // 결제 취소 시 리다이렉트 URI
  BYPASSVALUE: string; // 체크섬
  TELECOM?: string; // 통신사 (휴대폰 결제 시)
}

// ===== INICIS 결제 데이터 =====
export interface InicisPaymentData {
  mid: string; // 상점 ID
  oid: string; // 주문번호
  goodname: string; // 상품명
  price: number; // 결제 금액
  buyername: string; // 구매자 이름
  buyertel: string; // 구매자 전화번호
  buyeremail: string; // 구매자 이메일
  returnUrl: string; // 결제 완료 후 리다이렉트 URI
  signature: string; // 서명
  timestamp: string; // 타임스탬프
  mKey: string; // 상점 키
  carrier?: string; // 통신사 (휴대폰 결제 시)
}

// ===== PG사별 결제 데이터 유니온 타입 =====
export type PgPaymentData = BillgatePaymentData | DanalPaymentData | InicisPaymentData;
