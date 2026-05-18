'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Footer } from '@/components/design-system';
import { MainHeader } from '@/components/layout';

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPopup, setIsPopup] = useState(false);

  // PortOne: code=FAILURE_TYPE_PG, 빌게이트: isSuccess=true/false, 다날: status=success/fail
  const code = searchParams.get('code');
  const pg = searchParams.get('pg'); // 'danal' or null (billgate)

  // PortOne 실패 체크
  const isPortOneFailure = code?.startsWith('FAILURE');

  const isSuccess = isPortOneFailure
    ? false
    : pg === 'danal'
      ? searchParams.get('status') === 'success'
      : searchParams.get('isSuccess') === 'true';

  const orderId = searchParams.get('orderId') || searchParams.get('ORDER_ID') || searchParams.get('paymentId');
  const reason = searchParams.get('reason') || searchParams.get('RESULT_MSG') || searchParams.get('message');
  const detailReason = searchParams.get('detailReason') || searchParams.get('pgMessage');

  // 팝업 감지 및 부모 창 처리
  useEffect(() => {
    // 팝업으로 열렸는지 확인 (window.opener가 있고, 같은 origin인 경우)
    if (window.opener && !window.opener.closed) {
      setIsPopup(true);

      // 부모 창에 결제 결과 전송
      const message = isSuccess
        ? { result: 'success', orderId }
        : { result: 'fail', message: reason || '결제에 실패했습니다.' };

      try {
        window.opener.postMessage(message, window.location.origin);
      } catch {
        // cross-origin 에러 시 무시
      }

      // 팝업 닫기
      window.close();
    }
  }, [isSuccess, orderId, reason]);

  // 팝업인 경우 로딩 표시 (곧 닫힘)
  if (isPopup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[14px] md:text-[16px] text-[#757575]">처리 중...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
        <div className="w-full max-w-[640px] text-center">
          {/* 성공 아이콘 */}
          <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] mx-auto mb-6 md:mb-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
            <span className="text-[40px] md:text-[60px] text-white">✓</span>
          </div>

          <h1 className="text-[24px] md:text-[32px] font-bold text-[#212121] mb-3 md:mb-4">결제가 완료되었습니다</h1>
          <p className="text-[14px] md:text-[18px] text-[#757575] mb-6 md:mb-8">
            주문하신 상품권이 정상적으로 결제되었습니다.
          </p>

          {orderId && (
            <div className="bg-[#F5F7FA] rounded-[10px] p-4 md:p-6 mb-6 md:mb-8">
              <p className="text-[12px] md:text-[14px] text-[#757575] mb-1 md:mb-2">주문번호</p>
              <p className="text-[16px] md:text-[20px] font-semibold text-[#212121]">{orderId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.replace('/order')}
              className="flex-1 h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#044CBF] transition-colors"
            >
              주문 내역 확인
            </button>
            <button
              onClick={() => router.replace('/')}
              className="flex-1 h-12 md:h-14 bg-white text-[#0565FF] border-2 border-[#0565FF] rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#F5F7FA] transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 sm:px-8 md:pt-[107px] md:pb-20">
      <div className="w-full max-w-[640px] text-center">
        {/* 실패 아이콘 */}
        <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] mx-auto mb-6 md:mb-8 bg-[#FF6B6B] rounded-full flex items-center justify-center">
          <span className="text-[40px] md:text-[60px] text-white">✕</span>
        </div>

        <h1 className="text-[24px] md:text-[32px] font-bold text-[#212121] mb-3 md:mb-4">결제에 실패했습니다</h1>
        <p className="text-[14px] md:text-[18px] text-[#757575] mb-3 md:mb-4">
          {reason || '결제 승인 요청 처리 중 오류 발생'}
        </p>
        {detailReason && (
          <p className="text-[15px] md:text-[18px] text-[#757575] font-medium mb-3 md:mb-4">
            {detailReason}
          </p>
        )}

        {/* 결제 실패 사유 박스 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 text-left">
          {/* 왼쪽: 휴대폰 결제 실패 사유 */}
          <div className="bg-white border-2 border-[#212121] rounded-[10px] p-4 md:p-6">
            <h3 className="text-[16px] md:text-[20px] font-bold text-[#212121] mb-3 md:mb-4">
              휴대폰 결제 실패 사유
            </h3>
            <ol className="space-y-2 md:space-y-3 text-[14px] md:text-[17px] text-[#424242] font-medium">
              <li>1. 미납,연체 유무</li>
              <li>2. 통신사 가입기간</li>
              <li>3. 결제 대행사 정책</li>
              <li>4. 상품권 구매 한도 초과</li>
            </ol>
          </div>

          {/* 오른쪽: 문의 안내 */}
          <div className="bg-white border-2 border-[#212121] rounded-[10px] p-4 md:p-6">
            <p className="text-[14px] md:text-[17px] font-semibold text-[#212121] mb-3 md:mb-4 leading-relaxed">
              정확한 사유는 각 통신사<br />
              혹은 결제 대행사로 문의 부탁드립니다.
            </p>
            <div className="space-y-1.5 md:space-y-2 text-[13px] md:text-[16px] text-[#424242] font-medium">
              <p className="font-semibold text-[#212121]">이용중인 각 통신사 고객센터</p>
              <p>겔럭시아 : 1588-0123(오전9시 ~ 오후6시)</p>
              <p>다날 : 1566-3355(오전9시 ~ 오후6시)</p>
              <p>이니시스 : 1588-4954 (오전9시 ~ 오후6시)</p>

                {/* 추가 안내 */}
<div className="mt-4 border-t border-[#E0E0E0] pt-4">
  <p className="text-[13px] md:text-[15px] text-[#424242] leading-relaxed mb-3">
    결제 실패 기타 상담은 하단에 배너를 통해서 연락주세요
  </p>

  <a
    href="http://qr.kakao.com/talk/ls_fZvvJsDX93RMoPhc8eB3xFPg-"
    target="_blank"
    rel="noopener noreferrer"
    className="border-animated w-full sm:w-auto"
  >
    결제 실패시 휴대폰 소액결제 문의
  </a>
</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 h-12 md:h-14 bg-[#0565FF] text-white rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#044CBF] transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => router.replace('/')}
            className="flex-1 h-12 md:h-14 bg-white text-[#757575] border-2 border-[#E0E0E0] rounded-[10px] text-[16px] md:text-[18px] font-semibold hover:bg-[#F5F7FA] transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MainHeader />

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-[14px] md:text-[16px] text-[#757575]">처리 중...</p>
            </div>
          }
        >
          <PaymentResultContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
