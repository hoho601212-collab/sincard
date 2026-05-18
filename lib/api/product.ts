'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from './core';

// ===== Types =====
export interface ContactInfo {
  homePageUrl: string;
  csCenterNumber: string;
}

export interface PaymentMethodInfo {
  type: 'CARD' | 'PHONE' | 'DEPOSIT_WITHOUT_BANKBOOK';
  displayName: string;
  discountRate: number;
}

export interface VoucherIssuer {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  publisher: string;
  contactInfo: ContactInfo;
  paymentMethods: PaymentMethodInfo[];
  note?: string;
  descriptionImageUrl?: string;
  vouchers?: Voucher[]; // voucher-issuer detail에만 포함됨
}

export interface Voucher {
  id: number;
  name: string;
  issuerName: string;
  price: number;
  createdAt: string;
}

// ===== API Functions =====
const productApi = {
  // 상품 발급자 목록 조회
  getVoucherIssuers: () => api.get<VoucherIssuer[]>('/api/voucher-issuer'),

  // 상품 발급자 상세 조회 (vouchers 포함)
  getVoucherIssuerDetail: (id: number) => api.get<VoucherIssuer>(`/api/voucher-issuer/${id}`),
};

// ===== React Query Hooks =====

// 상품 발급자 목록 조회
export const useVoucherIssuersAPI = () => {
  return useSuspenseQuery({
    queryKey: ['voucher-issuers'],
    queryFn: () => productApi.getVoucherIssuers(),
  });
};

// 상품 발급자 상세 조회 (vouchers 포함)
export const useVoucherIssuerDetailAPI = (id: number) => {
  return useSuspenseQuery({
    queryKey: ['voucher-issuer', id],
    queryFn: () => productApi.getVoucherIssuerDetail(id),
  });
};
