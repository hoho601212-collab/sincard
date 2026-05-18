'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Footer } from '@/components/design-system';
import { MainHeader } from '@/components/layout';
import { useOrdersAPI, OrderStatus } from '@/lib/api/order';
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

// 주문 상태별 스타일 (Tailwind JIT를 위해 전체 클래스 문자열 사용)
const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-[#FFF3E0] text-[#FF9800]',
  ISSUED: 'bg-[#E8F5E9] text-[#4CAF50]',
  COMPLETED: 'bg-[#E8F5E9] text-[#4CAF50]',
  CANCELLED: 'bg-[#FFEBEE] text-[#FF6B6B]',
  CANCELED: 'bg-[#FFEBEE] text-[#FF6B6B]',
  REFUNDED: 'bg-[#F5F5F5] text-[#9E9E9E]',
  ISSUE_FAILED: 'bg-[#FFEBEE] text-[#FF6B6B]',
};

// 필터 탭 데이터
const filterTabs = [
  { label: '전체', value: '' },
  { label: '대기 중', value: 'PENDING' },
  { label: '발급완료', value: 'ISSUED' },
  { label: '취소/환불', value: 'CANCELED,REFUNDED' },
];

function OrderListContent({
  page,
  keyword,
  statuses
}: {
  page: number;
  keyword: string;
  statuses: string;
}) {
  const router = useRouter();

  // 페이지 이동 시 현재 필터 유지
  const buildPageUrl = (pageNum: number) => {
    const query = new URLSearchParams();
    query.append('page', String(pageNum));
    if (keyword) query.append('keyword', keyword);
    if (statuses) query.append('statuses', statuses);
    return `/order?${query.toString()}`;
  };

  const { data: response } = useOrdersAPI({
    page,
    size: 10,
    keyword,
    statuses: statuses ? statuses.split(',') as OrderStatus[] : undefined,
    sortKey: 'CREATED_AT',
    sort: 'DESC'
  });
  const orders = response.data;

  if (orders.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#BDBDBD]">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-base md:text-lg font-medium text-[#757575]">주문 내역이 없습니다</p>
        <p className="text-sm text-[#9E9E9E] mt-1">상품을 구매하면 여기에 표시됩니다</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-6 py-3 bg-[#0565FF] text-white rounded-xl text-sm font-semibold hover:bg-[#044CBF] transition-colors"
        >
          상품 둘러보기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.items.map((order) => {
        const style = statusStyles[order.status] || 'bg-[#F5F5F5] text-[#757575]';
        const isCancelled = order.status === 'CANCELLED' || order.status === 'CANCELED';

        return (
          <div
            key={order.orderId}
            onClick={() => router.push(`/order/${order.orderId}`)}
            className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden hover:border-[#0565FF] hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
          >
            {/* 상단: 상태 + 날짜 */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
                {statusLabels[order.status] || order.status}
              </span>
              <span className="text-xs text-[#9E9E9E]">
                {new Date(order.orderDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* 본문 */}
            <div className="p-4">
              {/* 주문번호 */}
              <p className="text-xs text-[#9E9E9E] mb-1">주문번호</p>
              <p className="text-sm font-medium text-[#424242] mb-3">{order.orderNo}</p>

              {/* 금액 + 화살표 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#9E9E9E] mb-0.5">결제 금액</p>
                  <p className={`text-lg md:text-xl font-bold ${isCancelled ? 'text-[#9E9E9E] line-through' : 'text-[#0565FF]'}`}>
                    {order.price.toLocaleString()}원
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* 페이지네이션 */}
      {orders.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {/* 이전 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (orders.page > 1) {
                router.push(buildPageUrl(orders.page - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={orders.page <= 1}
            className="w-9 h-9 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#424242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 페이지 번호 */}
          {Array.from({ length: Math.min(5, orders.totalPages) }, (_, i) => {
            let pageNum;
            if (orders.totalPages <= 5) {
              pageNum = i + 1;
            } else if (orders.page <= 3) {
              pageNum = i + 1;
            } else if (orders.page >= orders.totalPages - 2) {
              pageNum = orders.totalPages - 4 + i;
            } else {
              pageNum = orders.page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(buildPageUrl(pageNum));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  pageNum === orders.page
                    ? 'bg-[#0565FF] text-white'
                    : 'bg-white border border-[#E0E0E0] text-[#424242] hover:bg-[#F5F7FA]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* 다음 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (orders.page < orders.totalPages) {
                router.push(buildPageUrl(orders.page + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={orders.page >= orders.totalPages}
            className="w-9 h-9 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#424242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <ProtectedRoute>
      <OrderPageContent />
    </ProtectedRoute>
  );
}

function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get('page');
  const keywordParam = searchParams.get('keyword');
  const statusesParam = searchParams.get('statuses');

  const [keywordInput, setKeywordInput] = useState(keywordParam || '');
  const currentPage = parseInt(pageParam || '1');
  const currentStatus = statusesParam || '';

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (keywordInput) query.append('keyword', keywordInput);
    if (currentStatus) query.append('statuses', currentStatus);
    router.push(`/order?${query.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    const query = new URLSearchParams();
    if (keywordInput) query.append('keyword', keywordInput);
    if (value) query.append('statuses', value);
    router.push(`/order?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <MainHeader />
  {/* 메인 컨텐츠 */}
  <div className="px-4 py-6 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-12">
    {/* 타이틀 */}
    <div className="mb-6">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#212121]">
        주문 내역
      </h1>

      <p className="text-sm text-[#757575] mt-1">
        구매하신 상품권 내역을 확인하세요
      </p>

      {/* 추가 안내 */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-[#424242]">
          상품권 판매를 원하시나요?
          <span className="font-semibold text-[#1976d2]"> 핀토스몰 공식 매입처</span>
        </p>

        <a
          href="https://ksdl.kr/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#1976d2] rounded-lg shadow-sm hover:bg-[#1565c0] transition duration-200 w-fit"
        >
          상품권 판매하러 가기
        </a>
      </div>
    </div>

        {/* 검색바 */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-3 md:p-4 mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="주문번호로 검색"
                className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg bg-[#F5F7FA] text-sm text-[#212121] placeholder:text-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#0565FF]/20"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-[#0565FF] text-white rounded-lg text-sm font-semibold hover:bg-[#044CBF] transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentStatus === tab.value
                  ? 'bg-[#0565FF] text-white'
                  : 'bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#F5F7FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 주문 목록 */}
        <Suspense
          fallback={
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-[140px] animate-pulse" />
              ))}
            </div>
          }
        >
          <OrderListContent
            page={currentPage}
            keyword={keywordParam || ''}
            statuses={currentStatus}
          />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
