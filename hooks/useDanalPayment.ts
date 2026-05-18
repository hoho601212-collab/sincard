'use client';

import { useEffect, useState, useCallback } from 'react';
import { loadDanalPaymentsSDK, type DanalPayments } from '@danalpay/javascript-sdk';

export interface DanalPaymentParams {
  // 공통 필수 파라미터
  orderName: string;
  orderId: string;
  userId: string;
  amount: number;
  merchantId: string;
  successUrl: string;
  failUrl: string;
  // 선택 파라미터
  userName?: string;
  userEmail?: string;
}

export interface DanalCardPaymentParams extends DanalPaymentParams {
  paymentMethod: 'CARD';
  taxAmount?: number;
  taxFreeAmount?: number;
}

export interface DanalMobilePaymentParams extends DanalPaymentParams {
  paymentMethod: 'MOBILE';
  itemType: string;
  itemCode: string;
}

export type DanalPaymentRequest = DanalCardPaymentParams | DanalMobilePaymentParams;

/**
 * 다날 결제 SDK 훅
 * @param clientKey 다날 Client Key (서버 응답에서 받음)
 */
export function useDanalPayment(clientKey?: string) {
  const [danalPayments, setDanalPayments] = useState<DanalPayments | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // SDK 로드
  useEffect(() => {
    if (!clientKey) {
      return;
    }

    loadDanalPaymentsSDK({ clientKey })
      .then((sdk) => {
        setDanalPayments(sdk);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('다날 SDK 로드 실패:', err);
        setError(err);
      });
  }, [clientKey]);

  // 카드 결제 요청
  const requestCardPayment = useCallback(
    async (params: Omit<DanalCardPaymentParams, 'paymentMethod'>) => {
      if (!danalPayments) {
        throw new Error('다날 SDK가 로드되지 않았습니다.');
      }

      await danalPayments.requestPayment({
        paymentsMethod: 'CARD',
        orderName: params.orderName,
        orderId: params.orderId,
        userId: params.userId,
        amount: params.amount,
        merchantId: params.merchantId,
        successUrl: params.successUrl,
        failUrl: params.failUrl,
        userName: params.userName,
        userEmail: params.userEmail,
        taxAmount: params.taxAmount,
        taxFreeAmount: params.taxFreeAmount,
      });
    },
    [danalPayments]
  );

  // 휴대폰 결제 요청
  const requestMobilePayment = useCallback(
    async (params: Omit<DanalMobilePaymentParams, 'paymentMethod'>) => {
      if (!danalPayments) {
        throw new Error('다날 SDK가 로드되지 않았습니다.');
      }

      await danalPayments.requestPayment({
        paymentsMethod: 'MOBILE',
        orderName: params.orderName,
        orderId: params.orderId,
        userId: params.userId,
        amount: params.amount,
        merchantId: params.merchantId,
        successUrl: params.successUrl,
        failUrl: params.failUrl,
        userName: params.userName,
        userEmail: params.userEmail,
        itemType: params.itemType,
        itemCode: params.itemCode,
      });
    },
    [danalPayments]
  );

  return {
    isLoaded,
    error,
    requestCardPayment,
    requestMobilePayment,
  };
}
