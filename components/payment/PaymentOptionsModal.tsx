'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import type {
  PgProvider,
  PaymentMethodCode,
  TelecomCode,
  FeePolicy,
} from '@/lib/types/payment';
import {
  PAYMENT_METHODS,
  TELECOMS,
  FEE_POLICIES,
  getPgProvidersByPaymentMethod,
  getPgProvider,
} from '@/lib/config/payment';
import { calculateFee, formatCurrency } from '@/lib/utils/payment';

interface PaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherAmount: number;
  onConfirm: (options: {
    pgProvider: PgProvider;
    paymentMethod: PaymentMethodCode;
    telecom?: TelecomCode;
    feePolicy: FeePolicy;
  }) => void;
}

export function PaymentOptionsModal({
  isOpen,
  onClose,
  voucherAmount,
  onConfirm,
}: PaymentOptionsModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode>('CARD');
  const [pgProvider, setPgProvider] = useState<PgProvider>('BILLGATE');
  const [telecom, setTelecom] = useState<TelecomCode>('SKT');
  const [feePolicy, setFeePolicy] = useState<FeePolicy>('SEPARATE');

  // 모달 열릴 때 외부 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // 모달 닫힐 때 스크롤 복원
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // 결제 수단별 PG사 목록
  const availablePgProviders = useMemo(
    () => getPgProvidersByPaymentMethod(paymentMethod),
    [paymentMethod]
  );

  // 수수료 계산 (휴대폰 결제 시 10% 추가)
  const feeCalculation = useMemo(() => {
    const selectedPg = getPgProvider(pgProvider);
    const selectedMethod = PAYMENT_METHODS[paymentMethod];

    // 휴대폰 결제 시 10% 추가 수수료
    const additionalFeeRate = selectedMethod.additionalFeeRate || 0;
    const baseAmount = paymentMethod === 'PHONE'
      ? Math.round(voucherAmount * (1 + additionalFeeRate / 100))
      : voucherAmount;

    return calculateFee(baseAmount, selectedPg.feeRate, feePolicy);
  }, [voucherAmount, pgProvider, feePolicy, paymentMethod]);

  // 휴대폰 결제 추가 수수료 금액
  const phoneFeeAmount = useMemo(() => {
    if (paymentMethod !== 'PHONE') return 0;
    return Math.round(voucherAmount * 0.1);
  }, [voucherAmount, paymentMethod]);

  // 결제 수단 변경 시 PG사 자동 선택
  const handlePaymentMethodChange = (method: PaymentMethodCode) => {
    setPaymentMethod(method);
    const providers = getPgProvidersByPaymentMethod(method);
    if (providers.length > 0) {
      setPgProvider(providers[0].code);
    }
  };

  // 확인 버튼
  const handleConfirm = () => {
    if (paymentMethod === 'PHONE' && !telecom) {
      toast.error('통신사를 선택해주세요');
      return;
    }

    onConfirm({
      pgProvider,
      paymentMethod,
      telecom: paymentMethod === 'PHONE' ? telecom : undefined,
      feePolicy,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4">
      <div className="bg-white rounded-t-[20px] md:rounded-[10px] w-full md:w-[640px] max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#E0E0E0] shrink-0">
          {/* 모바일 드래그 핸들 */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#E0E0E0] rounded-full md:hidden" />
          <h2 className="text-lg md:text-2xl font-bold text-[#212121]">결제 옵션 선택</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#757575] hover:text-[#212121] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 본문 - 스크롤 영역 */}
        <div className="p-4 md:p-6 space-y-5 md:space-y-6 overflow-y-auto flex-1">
          {/* 1. 결제 수단 선택 */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#212121] mb-2 md:mb-3">1. 결제 수단</h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {Object.values(PAYMENT_METHODS).map((method) => (
                <button
                  key={method.code}
                  onClick={() => handlePaymentMethodChange(method.code)}
                  className={`px-3 md:px-4 py-2.5 md:py-3 rounded-[10px] text-sm md:text-base font-semibold transition-colors ${
                    paymentMethod === method.code
                      ? 'bg-[#0565FF] text-white'
                      : 'bg-neutral-50 text-[#757575] hover:bg-[#E0E0E0]'
                  }`}
                >
                  {method.displayName}
                </button>
              ))}
            </div>
          </div>

          {/* 2. PG사 선택 */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#212121] mb-2 md:mb-3">2. 결제대행사 (PG)</h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {availablePgProviders.map((provider) => (
                <button
                  key={provider.code}
                  onClick={() => setPgProvider(provider.code)}
                  className={`px-3 md:px-4 py-2.5 md:py-3 rounded-[10px] transition-colors ${
                    pgProvider === provider.code
                      ? 'bg-[#0565FF] text-white'
                      : 'bg-neutral-50 text-[#757575] hover:bg-[#E0E0E0]'
                  }`}
                >
                  <div className="text-sm md:text-base font-semibold">{provider.name}</div>
                  <div className="text-xs mt-0.5 md:mt-1 opacity-80">수수료 {provider.feeRate}%</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. 통신사 선택 (휴대폰 결제 시만) */}
          {paymentMethod === 'PHONE' && (
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#212121] mb-2 md:mb-3">3. 통신사</h3>
              <div className="grid grid-cols-3 gap-2">
                {TELECOMS.map((t) => (
                  <button
                    key={t.code}
                    onClick={() => setTelecom(t.code)}
                    className={`px-2 md:px-3 py-2 rounded-[10px] text-xs md:text-sm font-medium transition-colors ${
                      telecom === t.code
                        ? 'bg-[#0565FF] text-white'
                        : 'bg-neutral-50 text-[#757575] hover:bg-[#E0E0E0]'
                    }`}
                  >
                    {t.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. 수수료 정책 선택 */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#212121] mb-2 md:mb-3">
              {paymentMethod === 'PHONE' ? '4' : '3'}. 수수료 정책
            </h3>
            <div className="space-y-2">
              {FEE_POLICIES.map((policy) => (
                <button
                  key={policy.code}
                  onClick={() => setFeePolicy(policy.code)}
                  className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-[10px] text-left transition-colors ${
                    feePolicy === policy.code
                      ? 'bg-[#E6F9FF] border-2 border-[#03C3FF]'
                      : 'bg-neutral-50 border-2 border-transparent hover:bg-[#E0E0E0]'
                  }`}
                >
                  <div className="text-sm md:text-base font-semibold text-[#212121] mb-0.5 md:mb-1">
                    {policy.displayName}
                  </div>
                  <div className="text-xs text-[#757575]">{policy.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 무통장입금 안내 */}
          {paymentMethod === 'DEPOSIT_WITHOUT_BANKBOOK' && (
            <div className="bg-[#FFF4E6] border border-[#FFA500] rounded-[10px] p-3 md:p-4">
              <p className="text-sm text-[#FF6B00] font-medium mb-1">
                무통장입금 안내
              </p>
              <p className="text-xs text-[#757575]">
                무통장입금은 현재 준비 중입니다. 신용카드 또는 휴대폰 결제를 이용해주세요.
              </p>
            </div>
          )}

          {/* 최종 금액 요약 */}
          <div className="bg-neutral-50 rounded-[10px] p-3 md:p-4 space-y-2">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-[#757575]">상품권 금액</span>
              <span className="text-[#212121] font-medium">
                {formatCurrency(voucherAmount)}
              </span>
            </div>
            {/* 휴대폰 결제 10% 수수료 */}
            {paymentMethod === 'PHONE' && (
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-[#757575]">통신사 수수료 (10%)</span>
                <span className="text-[#FF292D] font-medium">
                  +{formatCurrency(phoneFeeAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-[#757575]">
                PG 수수료 ({getPgProvider(pgProvider).feeRate}%)
              </span>
              <span className="text-[#FF292D] font-medium">
                {feePolicy === 'INCLUDED' ? '포함' : `+${formatCurrency(feeCalculation.feeAmount)}`}
              </span>
            </div>
            <div className="border-t border-dashed border-[#E0E0E0] pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-bold text-[#212121]">총 결제 금액</span>
                <span className="text-lg md:text-xl font-bold text-[#0565FF]">
                  {formatCurrency(feeCalculation.totalAmount)}
                </span>
              </div>
            </div>
            {feePolicy === 'INCLUDED' && (
              <div className="text-xs text-[#FF292D] mt-2">
                * 실제 발급 금액: {formatCurrency(feeCalculation.actualVoucherAmount)}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex gap-3 p-4 md:p-6 border-t border-[#E0E0E0] shrink-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 h-11 md:h-12 bg-white text-[#757575] border-[1.5px] border-[#E0E0E0] rounded-[10px] text-sm md:text-base font-semibold hover:bg-[#F5F5F5] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-11 md:h-12 bg-[#0565FF] text-white rounded-[10px] text-sm md:text-base font-semibold hover:bg-[#044CBF] transition-colors"
          >
            결제 진행
          </button>
        </div>
      </div>
    </div>
  );
}
