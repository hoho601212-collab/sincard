import { getNiceEncryptedData as getNiceEncryptedDataAPI } from '@/apis/nice';

// NICE 본인인증 암호화 데이터 요청
export async function getNiceEncryptedData(purpose: 'SIGNUP' | 'PASSWORD_RESET'): Promise<{
  token_version_id: string;
  enc_data: string;
  integrity_value: string;
}> {
  try {
    return await getNiceEncryptedDataAPI(purpose);
  } catch (error) {
    console.error('NICE 암호화 데이터 요청 실패:', error);
    throw error;
  }
}

// NICE 본인인증 팝업 열기
export function openNiceVerificationPopup(
  encryptedData: {
    token_version_id: string;
    enc_data: string;
    integrity_value: string;
  }
) {
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    '',
    'nicePopup',
    `width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    return;
  }

  // Form 생성 및 제출
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb'; // NICE 서버 URL
  form.target = 'nicePopup';

  const fields = {
    m: 'service',
    token_version_id: encryptedData.token_version_id,
    enc_data: encryptedData.enc_data,
    integrity_value: encryptedData.integrity_value,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
