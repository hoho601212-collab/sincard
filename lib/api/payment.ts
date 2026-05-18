"use client";

import { useMutation } from "@tanstack/react-query";
import { api, ApiResponse } from "./core";
import type {
  PgProvider,
  PaymentMethodCode,
  TelecomCode,
  FeePolicy,
  BillgatePaymentData,
  DanalPaymentData,
  InicisPaymentData,
  FeeCalculation,
} from "@/lib/types/payment";

// ===== API 요청 타입 (백엔드 명세) =====
export interface CreatePaymentRequest {
  orderNo: string;
  paymentMethod: "CARD" | "PHONE" | "BANK_TRANSFER"; // 백엔드는 BANK_TRANSFER 사용
}

// ===== API 응답 타입 (백엔드 명세) =====
// 빌게이트 응답
export interface BillgatePaymentResponse {
  serviceId: string;
  orderNo: string;
  ordererId: number;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  serviceCode: string;
  price: number;
  productName: string;
  orderDate: string;
  checkSum: string;
  checkSumHp: string;
  protocolType: string; // ex. https_tpay, https_pay
}

// 다날 응답
export interface DanalPaymentResponse {
  orderName: string;
  orderId: string;
  userId: number;
  amount: number;
  merchantId: string;
  userEmail: string;
  userName: string;
  paymentMethod: string;
  successUrl: string;
  failUrl: string;
  itemCode: string;
  itemType: string;
  clientKey: string;
}

// KG이니시스 (PortOne) 응답
export interface InicisPaymentResponse {
  storeId: string;
  channelKey: string;
  orderId: string; // PortOne paymentId로 사용
  orderName: string;
  totalAmount: number;
  currency: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  noticeUrls: string[];
}

// 통합 응답 타입 (모든 PG사 응답의 유니온)
export type PaymentResponse = BillgatePaymentResponse | DanalPaymentResponse | InicisPaymentResponse;

// deprecated - 개별 타입 사용 권장
export type CreatePaymentResponse = BillgatePaymentResponse;

// ===== 프론트엔드 내부 타입 (PG 선택 등) =====
export interface PaymentOptions {
  orderNo: string;
  pgProvider: PgProvider;
  paymentMethod: PaymentMethodCode;
  telecom?: TelecomCode;
  feePolicy: FeePolicy;
}

// 프론트엔드 PaymentMethodCode → 백엔드 paymentMethod 변환
function toBackendPaymentMethod(
  code: PaymentMethodCode
): "CARD" | "PHONE" | "BANK_TRANSFER" {
  switch (code) {
    case "CARD":
      return "CARD";
    case "PHONE":
      return "PHONE";
    case "DEPOSIT_WITHOUT_BANKBOOK":
      return "BANK_TRANSFER";
    default:
      return "CARD";
  }
}

// ===== API Functions =====
const paymentApi = {
  // 빌게이트 결제 생성
  createBillgatePayment: (data: CreatePaymentRequest) =>
    api.post<BillgatePaymentResponse>("/api/payments/billgate", data),
  // 다날 결제 생성
  createDanalPayment: (data: CreatePaymentRequest) =>
    api.post<DanalPaymentResponse>("/api/payments/danal", data),
  // KG이니시스 (PortOne) 결제 생성
  createInicisPayment: (data: CreatePaymentRequest) =>
    api.post<InicisPaymentResponse>("/api/payments/kg-inicis", data),
};

// ===== React Query Hooks =====

// 결제 생성 (프론트엔드 옵션 → 백엔드 요청 변환, PG사별 분기)
export const useCreatePaymentAPI = () => {
  return useMutation<ApiResponse<PaymentResponse>, Error, PaymentOptions>({
    mutationFn: async (options: PaymentOptions) => {
      // 백엔드 요청 형식으로 변환
      const request: CreatePaymentRequest = {
        orderNo: options.orderNo,
        paymentMethod: toBackendPaymentMethod(options.paymentMethod),
      };

      // PG사별 API 호출 분기
      switch (options.pgProvider) {
        case "DANAL":
          return paymentApi.createDanalPayment(request);
        case "INICIS":
          return paymentApi.createInicisPayment(request);
        case "BILLGATE":
        default:
          return paymentApi.createBillgatePayment(request);
      }
    },
    onSuccess: () => {
      console.log("결제 정보 생성 성공");
    },
    onError: (error: Error) => {
      console.error("결제 생성 실패:", error);
    },
  });
};

// ===== 백엔드 응답 → 빌게이트 폼 데이터 변환 =====
export function toBillgatePaymentData(
  response: CreatePaymentResponse,
  paymentMethod: PaymentMethodCode
): BillgatePaymentData {
  // 결제수단별 SERVICE_CODE 결정
  const serviceCode = paymentMethod === "PHONE" ? "1100" : "0900";

  const baseData = {
    SERVICE_ID: response.serviceId,
    SERVICE_CODE: serviceCode,
    SERVICE_TYPE: "0000", // 일반결제
    ORDER_ID: response.orderNo,
    ORDER_DATE: response.orderDate,
    AMOUNT: response.price,
    RETURN_URL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/billgate/callback`,
    CHECK_SUM: response.checkSum,
    CHECK_SUM_HP: response.checkSumHp,
    ITEM_CODE: "VOUCHER",
    ITEM_NAME: response.productName,
    ORDERER_TEL: response.ordererPhone,
    USER_ID: String(response.ordererId),
    LOGO: "",
    RESERVED1: typeof window !== "undefined" ? window.location.origin : "",
  };

  // 휴대폰 결제 시 휴대폰번호 고정 옵션 추가
  if (paymentMethod === "PHONE") {
    return {
      ...baseData,
      MOBILE_NUMBER: response.ordererPhone,
      READONLY_HP: "Y", // 휴대폰번호 수정 불가
    };
  }

  return baseData;
}

// ===== 백엔드 응답 → 다날 폼 데이터 변환 =====
export function toDanalPaymentData(
  response: CreatePaymentResponse,
  paymentMethod: PaymentMethodCode
): DanalPaymentData {
  return {
    CPID: response.serviceId,
    ORDERID: response.orderNo,
    PRODUCTNAME: response.productName,
    AMOUNT: response.price,
    USERID: String(response.ordererId),
    USERNAME: response.ordererName,
    USERPHONE: response.ordererPhone,
    USEREMAIL: response.ordererEmail,
    RETURNURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/danal/callback`,
    CANCELURL: typeof window !== "undefined" ? `${window.location.origin}/order` : "",
    BYPASSVALUE: paymentMethod === "PHONE" ? response.checkSumHp : response.checkSum,
  };
}

// 타입 re-export
export type {
  PgProvider,
  PaymentMethodCode,
  TelecomCode,
  FeePolicy,
  BillgatePaymentData,
  DanalPaymentData,
  InicisPaymentData,
  FeeCalculation,
};
