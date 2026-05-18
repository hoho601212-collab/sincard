'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateOrderAPI } from '@/lib/api/order';
import {
  useCreatePaymentAPI,
  toBillgatePaymentData,
  toDanalPaymentData,
  type BillgatePaymentResponse,
  type PgProvider,
  type PaymentMethodCode,
  type TelecomCode,
  type FeePolicy,
} from '@/lib/api/payment';
import { ApiError } from '@/lib/api/core';
import { submitBillgatePayment, submitDanalPayment } from '@/lib/utils/payment';
import { usePaymentScript } from '@/hooks/usePaymentScript';

interface SelectedVoucher {
  id: number;
  quantity: number;
  price: number;
}

export function usePurchaseFlow() {
  const router = useRouter();
  const createOrderMutation = useCreateOrderAPI();
  const createPaymentMutation = useCreatePaymentAPI();

  // 빌게이트 스크립트 로드
  const { isLoaded: isScriptLoaded } = usePaymentScript();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    orderNo: string;
    totalAmount: number;
  } | null>(null);

  // 결제 결과 수신 (postMessage - 팝업에서 전송)
  const handlePaymentResult = useCallback((event: MessageEvent) => {
    // Origin 검증: 같은 origin에서 오는 메시지만 처리
    if (event.origin !== window.location.origin) {
      return;
    }

    const data = event.data;
    if (data && data.result === 'success') {
      toast.success('결제가 완료되었습니다.');
      setIsPurchasing(false);
      setShowPaymentOptions(false);
      setPendingOrder(null);
      router.push('/order');
    } else if (data && data.result === 'fail') {
      toast.error(data.message || '결제에 실패했습니다.');
      setIsPurchasing(false);
      setShowPaymentOptions(false);
      setPendingOrder(null);
    }
  }, [router]);

  // postMessage 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('message', handlePaymentResult);
    return () => {
      window.removeEventListener('message', handlePaymentResult);
    };
  }, [handlePaymentResult]);

  /**
   * 1단계: 구매 시작 - 주문 생성
   */
  const startPurchase = async (selectedItems: SelectedVoucher[]) => {
    if (selectedItems.length === 0) {
      toast.error('상품을 선택해주세요.');
      return false;
    }

    setIsPurchasing(true);

    try {
      // 주문 생성 (paymentMethod 제거)
      const orderResponse = await createOrderMutation.mutateAsync({
        orderItems: selectedItems.map((item) => ({
          voucherId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // orderResponse.data가 직접 주문번호 문자열임
      const orderNo = orderResponse.data;
      const totalAmount = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // 주문 정보 저장 및 결제 옵션 모달 열기
      setPendingOrder({ orderNo, totalAmount });
      setShowPaymentOptions(true);

      return true;
    } catch (error) {
      console.error('주문 생성 실패:', error);
      setIsPurchasing(false);

      if (error instanceof ApiError) {
        toast.error(error.errorMessage);

        if (error.status === 401) {
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } else {
        toast.error('주문 생성 중 오류가 발생했습니다.');
      }

      return false;
    }
  };

  /**
   * 2단계: 결제 옵션 확인 후 결제 요청
   */
  const confirmPaymentOptions = async (options: {
    pgProvider: PgProvider;
    paymentMethod: PaymentMethodCode;
    telecom?: TelecomCode;
    feePolicy: FeePolicy;
  }) => {
    if (!pendingOrder) {
      toast.error('주문 정보가 없습니다.');
      return;
    }

    // 무통장입금 처리 (별도 로직 없이 안내만)
    if (options.paymentMethod === 'DEPOSIT_WITHOUT_BANKBOOK') {
      toast.info('무통장입금은 현재 준비 중입니다. 다른 결제 수단을 이용해주세요.');
      return;
    }

    // 빌게이트 스크립트 로드 확인
    if (options.pgProvider === 'BILLGATE' && !isScriptLoaded) {
      toast.error('결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      // PG별 분기 처리
      if (options.pgProvider === 'BILLGATE') {
        // 빌게이트: 실제 결제 진행
        const paymentResponse = await createPaymentMutation.mutateAsync({
          orderNo: pendingOrder.orderNo,
          pgProvider: options.pgProvider,
          paymentMethod: options.paymentMethod,
          telecom: options.telecom,
          feePolicy: options.feePolicy,
        });

        // 백엔드 응답 → 빌게이트 폼 데이터 변환
        const billgateData = toBillgatePaymentData(
          paymentResponse.data as unknown as BillgatePaymentResponse,
          options.paymentMethod
        );

        // GX_pay 방식으로 결제창 호출
        submitBillgatePayment(billgateData);
      } else if (options.pgProvider === 'DANAL') {
        // 다날: 실제 결제 진행
        const paymentResponse = await createPaymentMutation.mutateAsync({
          orderNo: pendingOrder.orderNo,
          pgProvider: options.pgProvider,
          paymentMethod: options.paymentMethod,
          telecom: options.telecom,
          feePolicy: options.feePolicy,
        });

        // 백엔드 응답 → 다날 폼 데이터 변환
        const danalData = toDanalPaymentData(
          paymentResponse.data as unknown as BillgatePaymentResponse,
          options.paymentMethod
        );

        // 다날 결제창 호출
        submitDanalPayment(danalData);
      } else if (options.pgProvider === 'INICIS') {
        // 이니시스: console.log만 (테스트용)
        console.log('=== INICIS 결제 요청 (테스트) ===');
        console.log('주문번호:', pendingOrder.orderNo);
        console.log('결제수단:', options.paymentMethod);
        toast.info('이니시스 결제는 현재 준비 중입니다.');
        setIsPurchasing(false);
      }
    } catch (error) {
      console.error('결제 생성 실패:', error);
      setIsPurchasing(false);
      setShowPaymentOptions(false);

      if (error instanceof ApiError) {
        toast.error(error.errorMessage);
      } else {
        toast.error('결제 생성 중 오류가 발생했습니다.');
      }
    }
  };

  /**
   * 결제 취소
   */
  const cancelPayment = () => {
    setShowPaymentOptions(false);
    setPendingOrder(null);
    setIsPurchasing(false);
  };

  return {
    isPurchasing,
    showPaymentOptions,
    pendingOrder,
    startPurchase,
    confirmPaymentOptions,
    cancelPayment,
  };
}
