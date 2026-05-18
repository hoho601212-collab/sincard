'use client';

import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiResponse } from './core';

// ===== Types =====
export type OrderStatus =
  | 'PENDING'       // 대기 중
  | 'ISSUED'        // 발급완료
  | 'COMPLETED'     // 완료
  | 'CANCELLED'     // 취소됨 (API 명세)
  | 'CANCELED'      // 취소됨 (실제 백엔드 응답)
  | 'REFUNDED'      // 환불됨
  | 'ISSUE_FAILED'; // 발급실패

export type PaymentMethodType = 'BANK_TRANSFER' | 'CARD' | 'PHONE';

export interface CreateOrderRequest {
  orderItems: {
    voucherId: number;
    price: number;
    quantity: number;
  }[];
}

export interface OrderListItem {
  orderId: number;
  orderNo: string;
  status: OrderStatus;
  paymentMethodType: PaymentMethodType;
  orderDate: string;
  price: number;
}

export interface OrderDetailItem {
  voucherIssuerName: string;
  voucherName: string;
  price: number;
  pinNum: string;
  status: string;
}

export interface OrderDetail {
  orderId: number;
  orderNo: string;
  paymentMethodType: PaymentMethodType;
  orderStatus: OrderStatus;
  totalPrice: number;
  ordererName: string;
  ordererPhone: string;
  orderDate: string;
  items: OrderDetailItem[];
}

export interface OrderListResponse {
  items: OrderListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface OrderListParams {
  page?: number;
  size?: number;
  keyword?: string;
  statuses?: OrderStatus[];
  startDate?: string;
  endDate?: string;
  sortKey?: 'CREATED_AT';
  sort?: 'ASC' | 'DESC';
}

// ===== API Functions =====
const orderApi = {
  // 주문 생성
  createOrder: (data: CreateOrderRequest) =>
    api.post<string>('/api/orders', data), // 주문번호 반환

  // 주문 목록 조회 - GET 방식으로 변경
  getOrders: (params: OrderListParams) => {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.set('page', String(params.page));
    if (params.size !== undefined) searchParams.set('size', String(params.size));
    if (params.keyword) searchParams.set('keyword', params.keyword);
    if (params.statuses?.length) {
      params.statuses.forEach(status => searchParams.append('statuses', status));
    }
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortKey) searchParams.set('sortKey', params.sortKey);
    if (params.sort) searchParams.set('sort', params.sort);

    const queryString = searchParams.toString();
    return api.get<OrderListResponse>(`/api/orders${queryString ? `?${queryString}` : ''}`);
  },

  // 주문 상세 조회
  getOrderDetail: (orderId: number) =>
    api.get<OrderDetail>(`/api/orders/${orderId}`),

  // 주문 취소
  cancelOrder: (orderNo: string) =>
    api.put<null>(`/api/orders/${orderNo}/cancel`),

  // 주문 환불
  refundOrder: (orderNo: string) =>
    api.post<null>(`/api/orders/${orderNo}/refund`),
};

// ===== React Query Hooks =====

// 주문 생성
export const useCreateOrderAPI = () => {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (response: ApiResponse<string>) => {
      console.log('주문 생성 성공:', response.data);
    },
    onError: (error: Error) => {
      console.error('주문 생성 실패:', error);
    },
  });
};

// 주문 목록 조회
export const useOrdersAPI = (params: OrderListParams) => {
  return useSuspenseQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
  });
};

// 주문 상세 조회
export const useOrderDetailAPI = (orderId: number) => {
  return useSuspenseQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderDetail(orderId),
  });
};

// 주문 취소
export const useCancelOrderAPI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderNo: string) => orderApi.cancelOrder(orderNo),
    onSuccess: () => {
      console.log('주문 취소 성공');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
    onError: (error: Error) => {
      console.error('주문 취소 실패:', error);
    },
  });
};

// 주문 환불
export const useRefundOrderAPI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderNo: string) => orderApi.refundOrder(orderNo),
    onSuccess: () => {
      console.log('주문 환불 성공');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
    onError: (error: Error) => {
      console.error('주문 환불 실패:', error);
    },
  });
};
