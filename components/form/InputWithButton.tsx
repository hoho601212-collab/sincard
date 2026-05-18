'use client';

interface InputWithButtonProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  helpText?: string;
  buttonText: string;
  buttonDisabled?: boolean;
  buttonCompleted?: boolean;
  onButtonClick: () => void;
  onRetry?: () => void; // 재시도 콜백
}

export function InputWithButton({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  helpText,
  buttonText,
  buttonDisabled = false,
  buttonCompleted = false,
  onButtonClick,
  onRetry,
}: InputWithButtonProps) {
  // 중복 확인 완료 시 input을 readOnly로 만듦
  const isInputReadOnly = readOnly || buttonCompleted;

  return (
    <div>
      <label className="block text-[14px] font-medium text-[#212121] mb-2">
        {label} {required && <span className="text-[#FF6B6B]">*</span>}
      </label>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={isInputReadOnly}
          className={`w-full md:flex-1 h-12 bg-[#F5F5F5] rounded-[10px] px-6 text-[16px] text-[#212121] placeholder:text-[#9E9E9E] ${
            (disabled || isInputReadOnly) ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
        <button
          type="button"
          onClick={buttonCompleted && onRetry ? onRetry : onButtonClick}
          disabled={buttonDisabled || (buttonCompleted && !onRetry)}
          className="w-full md:w-auto px-6 h-12 bg-[#0565FF] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#044CBF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {buttonCompleted ? (onRetry ? '재시도' : '확인완료') : buttonText}
        </button>
      </div>
      {helpText && (
        <p className="text-[12px] text-[#757575] mt-1">{helpText}</p>
      )}
    </div>
  );
}
