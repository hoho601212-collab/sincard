'use client';

interface AddressInputProps {
  label: string;
  address: string;
  detailAddress: string;
  onDetailAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
  required?: boolean;
}

export function AddressInput({
  label,
  address,
  detailAddress,
  onDetailAddressChange,
  onSearchClick,
  required = false,
}: AddressInputProps) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-[#212121] mb-2">
        {label} {required && <span className="text-[#FF6B6B]">*</span>}
      </label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            readOnly
            placeholder="주소 검색 버튼을 클릭하세요"
            className="flex-1 h-12 bg-[#F5F5F5] rounded-[10px] px-6 text-[16px] text-[#212121] placeholder:text-[#9E9E9E] cursor-not-allowed"
          />
          <button
            type="button"
            onClick={onSearchClick}
            className="px-6 h-12 bg-[#757575] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#616161] transition-colors whitespace-nowrap"
          >
            주소 검색
          </button>
        </div>
        <input
          type="text"
          name="detailAddress"
          value={detailAddress}
          onChange={onDetailAddressChange}
          placeholder="상세 주소를 입력하세요"
          className="w-full h-12 bg-[#F5F5F5] rounded-[10px] px-6 text-[16px] text-[#212121] placeholder:text-[#9E9E9E]"
        />
      </div>
    </div>
  );
}
