'use client';

interface CheckboxWithLinkProps {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  linkText?: string;
  onLinkClick?: () => void;
}

export function CheckboxWithLink({
  label,
  required = false,
  checked,
  onChange,
  linkText,
  onLinkClick,
}: CheckboxWithLinkProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-3 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded border-[#E0E0E0]"
        />
        <span className="text-[14px] text-[#616161]">
          {label} {required && <span className="text-[#FF6B6B]">(필수)</span>}
        </span>
      </label>
      {linkText && onLinkClick && (
        <button
          type="button"
          className="text-[12px] text-[#03C3FF] underline"
          onClick={onLinkClick}
        >
          {linkText}
        </button>
      )}
    </div>
  );
}
