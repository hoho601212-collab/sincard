'use client';

import { useCallback } from 'react';
import PortOne, { type Currency } from '@portone/browser-sdk/v2';

// PortOne Store ID (환경변수에서 가져옴)
const PORTONE_STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '';

export interface PortOnePaymentParams {
  // 필수 파라미터
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: string;
  channelKey: string;
  // 고객 정보
  customer?: {
    customerId?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  // 리다이렉트 URL
  redirectUrl?: string;
  // 웹훅 URL (결제 결과를 백엔드로 전달)
  noticeUrls?: string[];
  // 결제 수단별 옵션
  payMethod?: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE' | 'EASY_PAY';
}

export interface PortOnePaymentResponse {
  code?: string;
  message?: string;
  paymentId?: string;
  transactionType?: string;
}

/**
 * PortOne 결제 SDK 훅
 */
export function usePortOnePayment() {
  // 결제 요청
  const requestPayment = useCallback(
    async (params: PortOnePaymentParams): Promise<PortOnePaymentResponse | undefined> => {
      if (!PORTONE_STORE_ID) {
        throw new Error('PORTONE_STORE_ID가 설정되지 않았습니다.');
      }

      const response = await PortOne.requestPayment({
        storeId: PORTONE_STORE_ID,
        channelKey: params.channelKey,
        paymentId: params.paymentId,
        orderName: params.orderName,
        totalAmount: params.totalAmount,
        currency: params.currency as Currency,
        payMethod: params.payMethod || 'CARD',
        customer: params.customer,
        redirectUrl: params.redirectUrl,
        noticeUrls: params.noticeUrls,
      });

      return response;
    },
    []
  );

  // 카드 결제
  const requestCardPayment = useCallback(
    async (params: Omit<PortOnePaymentParams, 'payMethod'>) => {
      return requestPayment({ ...params, payMethod: 'CARD' });
    },
    [requestPayment]
  );

  // 휴대폰 결제
  const requestMobilePayment = useCallback(
    async (params: Omit<PortOnePaymentParams, 'payMethod'>) => {
      return requestPayment({ ...params, payMethod: 'MOBILE' });
    },
    [requestPayment]
  );

  // 계좌이체
  const requestTransferPayment = useCallback(
    async (params: Omit<PortOnePaymentParams, 'payMethod'>) => {
      return requestPayment({ ...params, payMethod: 'TRANSFER' });
    },
    [requestPayment]
  );

  return {
    requestPayment,
    requestCardPayment,
    requestMobilePayment,
    requestTransferPayment,
  };
}
