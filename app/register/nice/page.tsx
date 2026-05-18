'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RegisterNiceRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const name = searchParams.get('name');
    const tel = searchParams.get('tel');

    console.log('NICE 본인인증 결과:', { success, name, tel });

    if (success === 'true' && name && tel) {
      // 부모 창에 데이터 전달
      if (window.opener) {
        window.opener.postMessage(
          {
            name,
            phoneNumber: tel,
          },
          window.location.origin
        );
        window.close();
      }
    } else {
      alert('본인인증에 실패했습니다.');
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[16px] text-[#757575]">본인인증 처리 중...</p>
    </div>
  );
}
