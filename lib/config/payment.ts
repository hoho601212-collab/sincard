/**
 * 결제 옵션 설정 (클라이언트 하드코딩 방식)
 */

import type {
  PgProviderInfo,
  PaymentMethodInfo,
  TelecomInfo,
  FeePolicyInfo,
  PgProvider,
  PaymentMethodCode,
} from '@/lib/types/payment';

// ===== PG 제공자 설정 =====
export const PG_PROVIDERS: Record<PgProvider, PgProviderInfo> = {
  BILLGATE: {
    code: 'BILLGATE',
    name: '빌게이트',
    feeRate: 2.8,
    supportedPaymentMethods: ['CARD', 'PHONE', 'DEPOSIT_WITHOUT_BANKBOOK'],
  },
  DANAL: {
    code: 'DANAL',
    name: '다날',
    feeRate: 3.0,
    supportedPaymentMethods: ['CARD', 'PHONE'],
  },
  INICIS: {
    code: 'INICIS',
    name: '이니시스',
    feeRate: 3.2,
    supportedPaymentMethods: ['PHONE'],
  },
};

// ===== 결제 수단 설정 =====
export const PAYMENT_METHODS: Record<PaymentMethodCode, PaymentMethodInfo> = {
  CARD: {
    code: 'CARD',
    displayName: '신용카드/체크카드',
    description: '신용카드 또는 체크카드로 결제',
    supportedPgProviders: ['BILLGATE', 'DANAL'],
  },
  PHONE: {
    code: 'PHONE',
    displayName: '휴대폰 소액결제',
    description: '통신사 수수료 10% 추가',
    additionalFeeRate: 10,
    supportedPgProviders: ['BILLGATE', 'DANAL'],
  },
  DEPOSIT_WITHOUT_BANKBOOK: {
    code: 'DEPOSIT_WITHOUT_BANKBOOK',
    displayName: '무통장입금',
    description: '가상계좌로 입금',
    supportedPgProviders: ['BILLGATE'],
  },
};

// ===== 통신사 설정 =====
export const TELECOMS: TelecomInfo[] = [
  { code: 'SKT', displayName: 'SKT' },
  { code: 'SK7MOBILE', displayName: 'SK7mobile' },
  { code: 'KT', displayName: 'KT' },
  { code: 'KCT', displayName: 'KCT' },
  { code: 'LGU', displayName: 'LG U+' },
  { code: 'HELLO_MOBILE', displayName: '헬로모바일' },
];

// ===== 수수료 정책 설정 =====
export const FEE_POLICIES: FeePolicyInfo[] = [
  {
    code: 'INCLUDED',
    displayName: '상품권안 결제',
    description: '수수료를 상품권 금액에서 차감합니다. 사용자는 상품권 가격만 지불하지만, 실제 발급되는 상품권 금액이 줄어듭니다.',
  },
  {
    code: 'SEPARATE',
    displayName: '수수료 일괄 결제',
    description: '수수료를 별도로 청구합니다. 사용자는 상품권 가격 + 수수료를 지불하며, 상품권 금액은 그대로 발급됩니다.',
  },
];

// ===== 헬퍼 함수 =====

/**
 * 결제 수단에 맞는 PG사 목록 조회
 */
export function getPgProvidersByPaymentMethod(
  paymentMethod: PaymentMethodCode
): PgProviderInfo[] {
  const supportedPgCodes = PAYMENT_METHODS[paymentMethod].supportedPgProviders;
  return supportedPgCodes.map((code) => PG_PROVIDERS[code]);
}

/**
 * PG사 정보 조회
 */
export function getPgProvider(pgProvider: PgProvider): PgProviderInfo {
  return PG_PROVIDERS[pgProvider];
}

/**
 * 결제 수단 정보 조회
 */
export function getPaymentMethod(paymentMethod: PaymentMethodCode): PaymentMethodInfo {
  return PAYMENT_METHODS[paymentMethod];
}

/**
 * 수수료 정책 정보 조회
 */
export function getFeePolicy(feePolicy: 'INCLUDED' | 'SEPARATE'): FeePolicyInfo {
  return FEE_POLICIES.find((policy) => policy.code === feePolicy)!;
}
