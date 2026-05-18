'use client';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  helpText?: string;
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  helpText,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-[#212121] mb-2">
        {label}{' '}
        {required && <span className="text-[#FF6B6B]">*</span>}
        {optional && <span className="text-[#757575]">(선택)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full h-12 bg-[#F5F5F5] rounded-[10px] px-6 text-[16px] text-[#212121] placeholder:text-[#9E9E9E] ${
          (disabled || readOnly) ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      />
      {helpText && (
        <p className="text-[12px] text-[#757575] mt-1">{helpText}</p>
      )}
    </div>
  );
}
