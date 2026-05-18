'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function WithdrawModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: WithdrawModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleConfirm = () => {
    if (isAgreed) {
      onConfirm();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsAgreed(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl lg:text-[24px] font-bold text-[#FF6B6B]">
            회원 탈퇴
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* 안내문 */}
          <div className="bg-[#FFF5F5] rounded-[10px] p-4 md:p-6">
            <p className="text-sm md:text-base text-[#212121] leading-relaxed">
              회원 탈퇴를 요청하실 경우, 아래 내용을 확인하신 후 신청해 주세요.
              <br />
              탈퇴가 완료되면 계정 정보는 관련 법령에 의해 보관이 필요한 정보를 제외하고 즉시 삭제됩니다.
            </p>
          </div>

          {/* 주의사항 */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-[#212121]">
              주의사항
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {[
                '보유 하신 상품권 핀번호는 복원할 수 없습니다.',
                '이미 구매하신 상품권 핀번호는 탈퇴와 무관하게 이용이 가능합니다.',
                '탈퇴로 인해 구매하신 상품권을 사용하지 못하는 상황이 발생하더라도, 이는 이용자 본인의 책임임을 유의해 주세요.',
                '탈퇴 신청이 완료되면 모든 개인정보가 즉시 삭제되며 복원이 불가능하므로, 신청 전 꼭 이용 여부를 신중히 확인하시기 바랍니다.',
                '탈퇴전 구매하신 상품권 핀번호가 있는경우 별도로 보관하시기 바랍니다.',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-[#757575]">
                  <span className="text-[#FF6B6B] mt-0.5">{index + 1})</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 추가 안내 */}
          <div className="bg-[#F5F7FA] rounded-[10px] p-4 md:p-5">
            <p className="text-xs md:text-sm text-[#757575] leading-relaxed">
              회원 탈퇴는 이용자의 요청 시 즉시 처리됩니다.
              <br />
              탈퇴 시 보유한 계정 데이터는 관련 법령에 따라 보관 의무가 있는 항목을 제외하고 모두 삭제되며, 삭제된 데이터는 복구할 수 없습니다.
            </p>
          </div>

          {/* 필수 동의 체크박스 */}
          <div className="border-t border-[#E0E0E0] pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 md:w-5 md:h-5 accent-[#FF6B6B] cursor-pointer"
              />
              <span className="flex-1 text-xs md:text-sm text-[#212121] leading-relaxed">
                <span className="text-[#FF6B6B] font-semibold">(필수)</span> 결제하신 상품권 핀번호가 있는 경우 탈퇴 시 일괄 삭제 후 복구가 불가능합니다.
              </span>
            </label>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
          <button
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:flex-1 h-11 md:h-12 bg-white text-[#757575] border border-[#E0E0E0] rounded-[10px] text-sm md:text-base font-medium hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isAgreed || isLoading}
            className="w-full sm:flex-1 h-11 md:h-12 bg-[#FF6B6B] text-white rounded-[10px] text-sm md:text-base font-semibold hover:bg-[#FF5252] transition-colors disabled:bg-[#BDBDBD] disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '회원 탈퇴하기'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
