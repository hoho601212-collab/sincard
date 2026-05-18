'use client';

import React, { Suspense } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/design-system';
import { MainHeader } from '@/components/layout';
import { useOrderDetailAPI, useCancelOrderAPI, useRefundOrderAPI, OrderStatus, PaymentMethodType } from '@/lib/api/order';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth';

// 주문 상태 한글 표시
const statusLabels: Record<OrderStatus, string> = {
  PENDING: '대기 중',
  ISSUED: '발급완료',
  COMPLETED: '완료',
  CANCELLED: '취소됨',
  CANCELED: '취소됨',
  REFUNDED: '환불됨',
  ISSUE_FAILED: '발급실패',
};

// 주문 상태별 배경/텍스트/테두리 스타일 (Tailwind JIT를 위해 명시적 클래스)
const statusStyles: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-[#FFF3E0]', text: 'text-[#FF9800]', border: 'border-[#FF9800]' },
  ISSUED: { bg: 'bg-[#E8F5E9]', text: 'text-[#4CAF50]', border: 'border-[#4CAF50]' },
  COMPLETED: { bg: 'bg-[#E8F5E9]', text: 'text-[#4CAF50]', border: 'border-[#4CAF50]' },
  CANCELLED: { bg: 'bg-[#FFEBEE]', text: 'text-[#FF6B6B]', border: 'border-[#FF6B6B]' },
  CANCELED: { bg: 'bg-[#FFEBEE]', text: 'text-[#FF6B6B]', border: 'border-[#FF6B6B]' },
  REFUNDED: { bg: 'bg-[#F5F5F5]', text: 'text-[#9E9E9E]', border: 'border-[#9E9E9E]' },
  ISSUE_FAILED: { bg: 'bg-[#FFEBEE]', text: 'text-[#FF6B6B]', border: 'border-[#FF6B6B]' },
};

// 결제 수단 한글 표시
const paymentMethodLabels: Record<PaymentMethodType, string> = {
  CARD: '신용카드/체크카드',
  PHONE: '휴대폰 소액결제',
  BANK_TRANSFER: '무통장입금',
};

// 상품권 아이템 상태
type VoucherItemStatus = 'PENDING' | 'ISSUED' | 'USED' | 'EXPIRED' | 'CANCELED' | 'ISSUE_FAILED';

const itemStatusLabels: Record<VoucherItemStatus, string> = {
  PENDING: '대기 중',
  ISSUED: '발급완료',
  USED: '사용완료',
  EXPIRED: '만료됨',
  CANCELED: '취소됨',
  ISSUE_FAILED: '발급실패',
};

const itemStatusStyles: Record<VoucherItemStatus, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-[#FFF3E0]', text: 'text-[#FF9800]' },
  ISSUED: { bg: 'bg-[#E8F5E9]', text: 'text-[#4CAF50]' },
  USED: { bg: 'bg-[#E3F2FD]', text: 'text-[#2196F3]' },
  EXPIRED: { bg: 'bg-[#F5F5F5]', text: 'text-[#9E9E9E]' },
  CANCELED: { bg: 'bg-[#FFEBEE]', text: 'text-[#FF6B6B]' },
  ISSUE_FAILED: { bg: 'bg-[#FFEBEE]', text: 'text-[#FF6B6B]' },
};

// PIN 복사 함수
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('PIN 번호가 복사되었습니다.');
  } catch {
    // fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success('PIN 번호가 복사되었습니다.');
  }
};

function OrderDetailContent({ orderId }: { orderId: number }) {
  const router = useRouter();
  const { data: response } = useOrderDetailAPI(orderId);
  const cancelMutation = useCancelOrderAPI();
  const refundMutation = useRefundOrderAPI();
  const order = response.data;

  const handleCancel = async () => {
    if (!confirm('주문을 취소하시겠습니까?')) return;

    try {
      await cancelMutation.mutateAsync(order.orderNo);
      toast.success('주문이 취소되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('주문 취소 실패:', error);
      toast.error('주문 취소에 실패했습니다.');
    }
  };

  const handleRefund = async () => {
    if (!confirm('환불을 요청하시겠습니까?')) return;

    try {
      await refundMutation.mutateAsync(order.orderNo);
      toast.success('환불이 요청되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('환불 요청 실패:', error);
      toast.error('환불 요청에 실패했습니다.');
    }
  };

  const statusStyle = statusStyles[order.orderStatus];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 상단 상태 카드 */}
      <div className={`${statusStyle.bg} rounded-xl p-4 md:p-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
              {statusLabels[order.orderStatus]}
            </span>
            <p className="mt-2 text-sm md:text-base text-[#424242]">
              {order.orderStatus === 'ISSUED' || order.orderStatus === 'COMPLETED'
                ? '상품권이 정상적으로 발급되었습니다.'
                : order.orderStatus === 'PENDING'
                ? '결제 대기 중입니다.'
                : order.orderStatus === 'CANCELLED' || order.orderStatus === 'CANCELED'
                ? '주문이 취소되었습니다.'
                : '환불이 완료되었습니다.'}
            </p>
          </div>
          <p className="text-xs md:text-sm text-[#757575]">
            {new Date(order.orderDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[#E0E0E0] bg-[#FAFAFA]">
          <h2 className="text-base md:text-lg font-bold text-[#212121]">주문 상품</h2>
        </div>
        <div className="divide-y divide-[#F0F0F0]">
          {order.items?.map((item, index) => {
            const itemStyle = itemStatusStyles[item.status as VoucherItemStatus] || { bg: 'bg-[#F5F5F5]', text: 'text-[#757575]' };
            return (
              <div key={index} className="p-4 md:p-6">
                <div className="flex flex-col gap-3">
                  {/* 상품 정보 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-[#757575]">{item.voucherIssuerName}</p>
                      <p className="text-sm md:text-base font-semibold text-[#212121] mt-0.5">{item.voucherName}</p>
                    </div>
                    <span className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${itemStyle.bg} ${itemStyle.text}`}>
                      {itemStatusLabels[item.status as VoucherItemStatus] || item.status}
                    </span>
                  </div>

                  {/* 금액 */}
                  <p className="text-base md:text-lg font-bold text-[#0565FF]">
                    {item.price.toLocaleString()}원
                  </p>

                  {/* PIN 번호 */}
                  {item.pinNum && (
                    <div className="bg-[#F5F7FA] rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#757575] mb-1">PIN 번호</p>
                          <p className="text-base md:text-lg font-mono font-bold text-[#212121] break-all select-all">
                            {item.pinNum}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.pinNum!)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-[#0565FF] text-white rounded-lg text-xs md:text-sm font-medium hover:bg-[#044CBF] transition-colors active:scale-95"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span className="hidden sm:inline">복사</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 주문 정보 */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[#E0E0E0] bg-[#FAFAFA]">
          <h2 className="text-base md:text-lg font-bold text-[#212121]">주문 정보</h2>
        </div>
        <div className="p-4 md:p-6 space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-sm md:text-base text-[#757575]">주문번호</span>
            <span className="text-sm md:text-base font-medium text-[#212121]">{order.orderNo}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-[#F0F0F0]">
            <span className="text-sm md:text-base text-[#757575]">주문자</span>
            <span className="text-sm md:text-base font-medium text-[#212121]">{order.ordererName}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-[#F0F0F0]">
            <span className="text-sm md:text-base text-[#757575]">연락처</span>
            <span className="text-sm md:text-base font-medium text-[#212121]">{order.ordererPhone}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-[#F0F0F0]">
            <span className="text-sm md:text-base text-[#757575]">결제 수단</span>
            <span className="text-sm md:text-base font-medium text-[#212121]">
              {order.paymentMethodType ? paymentMethodLabels[order.paymentMethodType] : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="bg-[#212121] rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm md:text-base font-medium text-white">총 결제 금액</span>
          <span className={`text-xl md:text-2xl font-bold ${
            order.orderStatus === 'CANCELLED' || order.orderStatus === 'CANCELED'
              ? 'text-[#9E9E9E] line-through'
              : 'text-white'
          }`}>
            {order.totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/order')}
          className="flex-1 bg-white text-[#0565FF] border-2 border-[#0565FF] px-4 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold hover:bg-[#F5F7FA] transition-colors"
        >
          목록으로
        </button>

        {/* 취소 버튼 (PENDING 상태일 때만) */}
        {order.orderStatus === 'PENDING' && (
          <button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="flex-1 bg-[#FF6B6B] text-white px-4 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold hover:bg-[#E53935] transition-colors disabled:bg-[#BDBDBD]"
          >
            {cancelMutation.isPending ? '처리 중...' : '주문 취소'}
          </button>
        )}

        {/* 환불 버튼 (COMPLETED 상태일 때만) */}
        {order.orderStatus === 'COMPLETED' && (
          <button
            onClick={handleRefund}
            disabled={refundMutation.isPending}
            className="flex-1 bg-[#FF9800] text-white px-4 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold hover:bg-[#F57C00] transition-colors disabled:bg-[#BDBDBD]"
          >
            {refundMutation.isPending ? '처리 중...' : '환불 요청'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return (
    <ProtectedRoute>
      <OrderDetailPageContent params={params} />
    </ProtectedRoute>
  );
}

function OrderDetailPageContent({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <MainHeader />

      {/* 메인 컨텐츠 */}
      <div className="px-4 py-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-12">
        <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold text-[#212121] mb-6 md:mb-8">주문 상세</h1>

        <Suspense
          fallback={
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white rounded-xl p-4 md:p-6 h-24 animate-pulse" />
              <div className="bg-white rounded-xl p-4 md:p-6 h-48 animate-pulse" />
              <div className="bg-white rounded-xl p-4 md:p-6 h-40 animate-pulse" />
            </div>
          }
        >
          <OrderDetailContent orderId={parseInt(orderId)} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
