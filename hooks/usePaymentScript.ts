'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    GX_pay?: (formId: string, viewType: 'popup' | 'submit', protocolType: string) => void;
  }
}

const BILLGATE_SCRIPT_URL = 'https://pay.billgate.net/paygate/plugin/gx_web_client.js';

/**
 * 빌게이트 PG 스크립트 로더 훅
 */
export function usePaymentScript() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 이미 로드되어 있는지 확인
    if (window.GX_pay) {
      setIsLoaded(true);
      return;
    }

    // 이미 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector(`script[src="${BILLGATE_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    // 스크립트 로드
    const script = document.createElement('script');
    script.src = BILLGATE_SCRIPT_URL;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError(new Error('빌게이트 결제 스크립트 로드에 실패했습니다.'));
    };

    document.head.appendChild(script);

    return () => {
      // cleanup은 하지 않음 (다른 컴포넌트에서 사용할 수 있음)
    };
  }, []);

  return { isLoaded, error };
}
