/**
 * 결제 관련 유틸리티 함수
 */

import type {
  PgProvider,
  FeePolicy,
  FeeCalculation,
  BillgatePaymentData,
  DanalPaymentData,
  InicisPaymentData,
} from "@/lib/types/payment";

// ===== 수수료 계산 =====

/**
 * 수수료 계산 함수
 * @param voucherAmount 상품권 금액
 * @param feeRate 수수료율 (%)
 * @param feePolicy 수수료 정책
 * @returns FeeCalculation
 */
export function calculateFee(
  voucherAmount: number,
  feeRate: number,
  feePolicy: FeePolicy
): FeeCalculation {
  const feeAmount = Math.round(voucherAmount * (feeRate / 100));

  if (feePolicy === "INCLUDED") {
    // 상품권안 결제: 수수료를 상품권 금액에서 차감
    return {
      voucherAmount,
      feeAmount,
      totalAmount: voucherAmount, // 사용자는 상품권 가격만 지불
      actualVoucherAmount: voucherAmount - feeAmount, // 실제 발급 금액 줄어듦
    };
  } else {
    // 수수료 일괄 결제: 수수료를 별도 청구
    return {
      voucherAmount,
      feeAmount,
      totalAmount: voucherAmount + feeAmount, // 사용자는 상품권 + 수수료 지불
      actualVoucherAmount: voucherAmount, // 실제 발급 금액 그대로
    };
  }
}

// ===== PG사별 폼 제출 =====

/**
 * Billgate PG 결제창 호출 (GX_pay 방식)
 * @param paymentData 결제 폼 데이터
 * @param protocolType 프로토콜 타입 (ex. https_tpay, https_pay)
 */
export function submitBillgatePayment(
  paymentData: BillgatePaymentData,
  protocolType: string = "https_tpay"
): void {
  const FORM_ID = "billgatePaymentForm";

  // 기존 폼 제거
  const existingForm = document.getElementById(FORM_ID);
  if (existingForm) {
    existingForm.remove();
  }

  // 폼 생성
  const form = document.createElement("form");
  form.id = FORM_ID;
  form.name = FORM_ID;
  form.method = "POST";
  form.style.display = "none";

  // 폼 필드 추가
  Object.entries(paymentData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);

  // GX_pay 호출 (팝업 또는 submit 방식)
  setTimeout(() => {
    const viewType = window.innerWidth < 768 ? "submit" : "popup";

    if (window.GX_pay) {
      window.GX_pay(FORM_ID, viewType, protocolType);
    } else {
      console.error("빌게이트 스크립트가 로드되지 않았습니다.");
      // 폴백: 직접 form submit
      form.action = "https://pay.billgate.net/credit/certify.jsp";
      form.submit();
    }
  }, 100);
}

/**
 * Danal PG 결제창 호출 (팝업/리다이렉트 방식)
 */
export function submitDanalPayment(paymentData: DanalPaymentData): void {
  const FORM_ID = "danalPaymentForm";
  const DANAL_ACTION_URL = "https://wauth.teledit.com/Danal/WebAuth/Web/Start.php";

  // 기존 폼 제거
  const existingForm = document.getElementById(FORM_ID);
  if (existingForm) {
    existingForm.remove();
  }

  // 폼 생성
  const form = document.createElement("form");
  form.id = FORM_ID;
  form.name = FORM_ID;
  form.method = "POST";
  form.action = DANAL_ACTION_URL;
  form.style.display = "none";

  // 폼 필드 추가
  Object.entries(paymentData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);

  // 모바일/데스크톱에 따라 팝업 또는 리다이렉트
  setTimeout(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // 모바일: 리다이렉트 방식
      form.submit();
    } else {
      // 데스크톱: 팝업 방식
      const popupWidth = 500;
      const popupHeight = 600;
      const left = (window.screen.width - popupWidth) / 2;
      const top = (window.screen.height - popupHeight) / 2;

      const popup = window.open(
        "",
        "danalPayment",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (popup) {
        form.target = "danalPayment";
        form.submit();
      } else {
        // 팝업 차단 시 리다이렉트
        form.submit();
      }
    }
  }, 100);
}

/**
 * INICIS PG 폼 제출
 */
export function submitInicisPayment(
  paymentData: InicisPaymentData,
  formAction: string
): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formAction;

  Object.entries(paymentData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
}

/**
 * PG사별 폼 제출 통합 함수
 */
export function submitPgPayment(
  pgProvider: PgProvider,
  paymentData: BillgatePaymentData | DanalPaymentData | InicisPaymentData,
  formAction?: string
): void {
  switch (pgProvider) {
    case "BILLGATE":
      // 빌게이트는 GX_pay 방식 사용
      submitBillgatePayment(paymentData as BillgatePaymentData);
      break;
    case "DANAL":
      // 다날도 자체 방식 사용
      submitDanalPayment(paymentData as DanalPaymentData);
      break;
    case "INICIS":
      submitInicisPayment(paymentData as InicisPaymentData, formAction || "");
      break;
    default:
      throw new Error(`지원하지 않는 PG사입니다: ${pgProvider}`);
  }
}

// ===== 금액 포맷팅 =====

/**
 * 금액을 천 단위 콤마로 포맷팅
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/**
 * 금액을 원화 형식으로 포맷팅
 */
export function formatCurrency(amount: number): string {
  return `${formatAmount(amount)}원`;
}
