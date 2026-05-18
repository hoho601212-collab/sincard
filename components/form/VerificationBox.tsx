'use client';

interface VerificationBoxProps {
  title: string;
  buttonText: string;
  completedText?: string;
  description?: string;
  verified: boolean;
  onVerify: () => void;
}

export function VerificationBox({
  title,
  buttonText,
  completedText = '✓ 인증 완료',
  description,
  verified,
  onVerify,
}: VerificationBoxProps) {
  return (
    <div className="bg-[#FAFAFA] rounded-[10px] p-6 border border-[#E0E0E0]">
      <h3 className="text-[16px] font-semibold text-[#212121] mb-3">{title}</h3>
      <button
        type="button"
        onClick={onVerify}
        disabled={verified}
        className="w-full h-12 bg-[#03C3FF] text-white rounded-[10px] text-[16px] font-semibold hover:bg-[#0292BF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {verified ? completedText : buttonText}
      </button>
      {description && (
        <p className="text-[12px] text-[#757575] mt-2">{description}</p>
      )}
    </div>
  );
}
