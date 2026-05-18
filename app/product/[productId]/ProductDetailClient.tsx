"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MainHeader } from "@/components/layout";
import {
  useVoucherIssuerDetailAPI,
  type Voucher,
  type VoucherIssuer,
} from "@/lib/api/product";
import { useCreateOrderAPI } from "@/lib/api/order";
import {
  useCreatePaymentAPI,
  toBillgatePaymentData,
  type DanalPaymentResponse,
  type BillgatePaymentResponse,
  type InicisPaymentResponse,
} from "@/lib/api/payment";
import { ApiError } from "@/lib/api/core";
import { submitBillgatePayment } from "@/lib/utils/payment";
import { usePaymentScript } from "@/hooks/usePaymentScript";
import { useDanalPayment } from "@/hooks/useDanalPayment";
import { usePortOnePayment } from "@/hooks/usePortOnePayment";

// 체크 아이콘 컴포넌트
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 6L5 9L10 3"
      stroke="#03C3FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 섹션 타이틀 컴포넌트
const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-base md:text-2xl font-medium text-[#03C3FF] tracking-tight">
      {number}
    </span>
    <span className="text-base md:text-2xl font-semibold text-[#212121] tracking-tight">
      {title}
    </span>
  </div>
);

export default function ProductDetailClient({
  productId,
}: {
  productId: number;
}) {
  const router = useRouter();
  const { data: issuerResponse } = useVoucherIssuerDetailAPI(productId);
  const createOrderMutation = useCreateOrderAPI();
  const createPaymentMutation = useCreatePaymentAPI();
  const { isLoaded: isBillgateLoaded } = usePaymentScript();

  // 다날 clientKey 상태 관리 (서버 응답에서 받음)
  const [danalClientKey, setDanalClientKey] = useState<string>();
  const [pendingDanalPayment, setPendingDanalPayment] = useState<{
    danalData: DanalPaymentResponse;
  } | null>(null);

  const {
    isLoaded: isDanalLoaded,
    requestCardPayment: requestDanalCardPayment,
    requestMobilePayment: requestDanalMobilePayment,
  } = useDanalPayment(danalClientKey);
  const {
    requestCardPayment: requestPortOneCardPayment,
    requestMobilePayment: requestPortOneMobilePayment,
  } = usePortOnePayment();

  const issuer: VoucherIssuer = issuerResponse.data;
  const vouchers: Voucher[] = issuer.vouchers || [];

  // 각 권종별 수량 상태
  const [quantities, setQuantities] = useState<Record<number, number>>(
    vouchers.reduce((acc, voucher) => ({ ...acc, [voucher.id]: 0 }), {})
  );

  const [activeTab, setActiveTab] = useState("description");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "phone">("card");
  const [selectedPG, setSelectedPG] = useState<"galaxia" | "danal" | "inicis">(
    "galaxia"
  );

  // 결제 결과 수신 (postMessage - 팝업에서 전송)
  useEffect(() => {
    const handlePaymentResult = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.result === "success") {
        toast.success("결제가 완료되었습니다.");
        router.push("/order");
      } else if (data?.result === "fail") {
        toast.error(data.message || "결제에 실패했습니다.");
      }
    };
    window.addEventListener("message", handlePaymentResult);
    return () => window.removeEventListener("message", handlePaymentResult);
  }, [router]);

  // 다날 SDK 로드 완료 후 대기 중인 결제를 자동으로 진행
  useEffect(() => {
    if (isDanalLoaded && pendingDanalPayment) {
      const { danalData } = pendingDanalPayment;
      const commonParams = {
        orderName: danalData.orderName,
        orderId: danalData.orderId,
        userId: String(danalData.userId),
        amount: danalData.amount,
        merchantId: danalData.merchantId,
        successUrl: danalData.successUrl,
        failUrl: danalData.failUrl,
        userName: danalData.userName,
        userEmail: danalData.userEmail,
      };

      if (paymentMethod === "card") {
        requestDanalCardPayment(commonParams);
      } else {
        requestDanalMobilePayment({
          ...commonParams,
          itemType: danalData.itemType,
          itemCode: danalData.itemCode,
        });
      }

      setPendingDanalPayment(null);
    }
  }, [
    isDanalLoaded,
    pendingDanalPayment,
    paymentMethod,
    requestDanalCardPayment,
    requestDanalMobilePayment,
  ]);

  // 수량 변경 함수
  const updateQuantity = (voucherId: number, change: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(0, Math.min(100, prev[voucherId] + change));
      return { ...prev, [voucherId]: newQuantity };
    });
  };

  // 휴대폰 결제 선택 시 이니시스가 선택되어 있으면 겔럭시아로 변경
  const handlePaymentMethodChangeInProduct = (method: "card" | "phone") => {
    setPaymentMethod(method);
    if (method === "phone" && selectedPG === "inicis") {
      setSelectedPG("galaxia");
    }
  };

  // 선택된 항목들만 필터링
  const selectedItems = vouchers
    .map((voucher) => ({
      ...voucher,
      quantity: quantities[voucher.id],
    }))
    .filter((item) => item.quantity > 0);

  // 총 금액 계산
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 휴대폰 결제 시 10% 추가 수수료 적용
  const finalAmount =
    paymentMethod === "phone" ? Math.round(totalAmount * 1.1) : totalAmount;

  // 주문 생성 함수
  const createOrder = async () => {
    try {
      const orderResponse = await createOrderMutation.mutateAsync({
        orderItems: selectedItems.map((item) => ({
          voucherId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      return orderResponse.data; // orderNo
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.errorMessage);
        if (error.status === 401) {
          setTimeout(() => router.push("/login"), 1500);
        }
      } else {
        toast.error("주문 생성 중 오류가 발생했습니다.");
      }
      return null;
    }
  };

  // 결제 진행 함수
  const processPayment = async (orderNo: string) => {
    // PG사별 스크립트 로드 확인
    if (selectedPG === "galaxia" && !isBillgateLoaded) {
      toast.error(
        "결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }
    // 다날은 clientKey를 서버에서 받은 후 로드하므로 여기서는 체크하지 않음

    // PG Provider 매핑
    const pgProviderMap = {
      galaxia: "BILLGATE",
      danal: "DANAL",
      inicis: "INICIS",
    } as const;
    const pgProvider = pgProviderMap[selectedPG];
    const paymentMethodCode = paymentMethod === "card" ? "CARD" : "PHONE";

    try {
      const paymentResponse = await createPaymentMutation.mutateAsync({
        orderNo,
        pgProvider,
        paymentMethod: paymentMethodCode,
        feePolicy: "SEPARATE",
      });

      // PG사별 결제 처리
      if (selectedPG === "danal") {
        // 다날 응답 필드 사용
        const danalData =
          paymentResponse.data as unknown as DanalPaymentResponse;

        // clientKey를 서버 응답에서 받아서 설정
        if (!danalClientKey) {
          setDanalClientKey(danalData.clientKey);
          setPendingDanalPayment({ danalData });
          toast.info("결제 시스템을 준비하고 있습니다...");
          return;
        }

        // SDK가 아직 로드되지 않았으면 대기
        if (!isDanalLoaded) {
          setPendingDanalPayment({ danalData });
          toast.info("결제 시스템을 준비하고 있습니다...");
          return;
        }

        // SDK가 로드되었으면 즉시 결제 진행
        const commonParams = {
          orderName: danalData.orderName,
          orderId: danalData.orderId,
          userId: String(danalData.userId),
          amount: danalData.amount,
          merchantId: danalData.merchantId,
          successUrl: danalData.successUrl,
          failUrl: danalData.failUrl,
          userName: danalData.userName,
          userEmail: danalData.userEmail,
        };

        if (paymentMethod === "card") {
          await requestDanalCardPayment(commonParams);
        } else {
          await requestDanalMobilePayment({
            ...commonParams,
            itemType: danalData.itemType,
            itemCode: danalData.itemCode,
          });
        }
      } else if (selectedPG === "inicis") {
        // KG이니시스 (PortOne) 응답 필드 사용
        const inicisData =
          paymentResponse.data as unknown as InicisPaymentResponse;
        const redirectUrl = `${window.location.origin}/payments/result`;

        // 백엔드 orderId를 PortOne paymentId로 사용
        const paymentId = inicisData.orderId;

        const commonParams = {
          paymentId,
          orderName: inicisData.orderName,
          totalAmount: inicisData.totalAmount,
          currency: inicisData.currency || "KRW",
          channelKey: inicisData.channelKey,
          customer: {
            customerId: String(inicisData.customerId),
            fullName: inicisData.customerName,
            email: inicisData.customerEmail,
            phoneNumber: inicisData.customerPhone,
          },
          redirectUrl,
          noticeUrls: inicisData.noticeUrls,
        };

        if (paymentMethod === "card") {
          const response = await requestPortOneCardPayment(commonParams);
          // PortOne 응답: code가 있으면 실패/취소, 없고 paymentId가 있으면 성공
          if (response?.code) {
            // 사용자 취소 또는 실패
            if (!response.code.includes("USER_CANCEL")) {
              toast.error(response.message || "결제에 실패했습니다.");
            }
          } else if (response?.paymentId) {
            toast.success("결제가 완료되었습니다.");
            router.push("/order");
          }
        } else {
          const response = await requestPortOneMobilePayment(commonParams);
          if (response?.code) {
            if (!response.code.includes("USER_CANCEL")) {
              toast.error(response.message || "결제에 실패했습니다.");
            }
          } else if (response?.paymentId) {
            toast.success("결제가 완료되었습니다.");
            router.push("/order");
          }
        }
      } else {
        // 빌게이트 응답 필드 사용
        const billgateResponse =
          paymentResponse.data as unknown as BillgatePaymentResponse;
        const billgateData = toBillgatePaymentData(
          billgateResponse,
          paymentMethodCode
        );
        submitBillgatePayment(billgateData, billgateResponse.protocolType);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.errorMessage);
      } else {
        toast.error("결제 생성 중 오류가 발생했습니다.");
      }
    }
  };

  // 바로 구매 핸들러
  const handlePurchase = async () => {
    if (selectedItems.length === 0) {
      toast.error("상품을 선택해주세요.");
      return;
    }

    const orderNo = await createOrder();
    if (!orderNo) return;

    // 카드/휴대폰 모두 바로 결제 진행
    await processPayment(orderNo);
  };

  const canPurchase = selectedItems.length > 0;

  // 가격을 원권 형태로 포맷 (예: 5000 -> "5,000원권")
  const formatPrice = (price: number) => `${price.toLocaleString()}원권`;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <MainHeader />

      <div className="px-4 lg:px-[120px] xl:px-[200px] py-6 lg:py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 좌측: 상품 정보 */}
          <div className="space-y-4 lg:space-y-9">
            {/* 상품 카드 (Card-Big) */}
            <div
              className="relative rounded-[10px] h-[280px] md:h-[320px] flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255, 57, 58, 0.1) 0%, rgba(255, 57, 58, 0.1) 100%), linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)",
              }}
            >
              <div className="bg-white rounded-[10px] px-6 md:px-10 py-6 md:py-8 flex flex-col items-center gap-3 md:gap-4">
                <div className="relative w-[100px] h-[100px] md:w-[140px] md:h-[140px]">
                  <img
                    src={issuer.imageUrl}
                    alt={issuer.name}
                    className="w-full h-full object-contain rounded-[10px]"
                  />
                </div>
                <h1 className="text-lg md:text-2xl font-semibold text-black text-center tracking-tight">
                  {issuer.name}
                </h1>
              </div>
            </div>

            {/* 안내문구 */}
            <div className="space-y-2">
              {[
                "구매하실 권종과 수량을 선택해주세요.",
                "구매 후 발송되어 노출된 상품권은 교환/환불이 불가능합니다.",
                "신규회원은 구매 제한이 있을 수 있습니다. 카카오채널 고객센터로 문의 바랍니다.",
                "365일 24시간 발송되며 카드/휴대폰 등 다양한 결제수단을 지원합니다.",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">
                    <CheckIcon />
                  </div>
                  <p className="text-xs text-[#757575] leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* 판매자 정보 (Company-detail) */}
            <div className="bg-neutral-50 rounded-[10px] px-6 md:px-9 py-5 md:py-7 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-[#03C3FF]">발행업체</span>
                <span className="flex-1 text-[#BDBDBD]">
                  {issuer.publisher}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-[#03C3FF]">홈페이지</span>
                <a
                  href={
                    issuer.contactInfo.homePageUrl.startsWith("http")
                      ? issuer.contactInfo.homePageUrl
                      : `https://${issuer.contactInfo.homePageUrl}`
                  }
                  className="flex-1 text-[#BDBDBD] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {issuer.contactInfo.homePageUrl}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-[#03C3FF]">고객센터</span>
                <span className="flex-1 text-[#BDBDBD]">
                  {issuer.contactInfo.csCenterNumber}
                </span>
              </div>
            </div>

            {/* 상품 상세 정보 탭 */}
            <div className="bg-neutral-50 rounded-[10px] p-4 md:p-9">
              {/* 탭 버튼 */}
              <div className="flex">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 py-3 md:py-4 text-sm font-medium text-center rounded-tl-[10px] transition-colors ${
                    activeTab === "description"
                      ? "bg-[#03C3FF] text-white"
                      : "bg-[#EEEEEE] text-[#757575]"
                  }`}
                >
                  상세설명
                </button>
                <button
                  onClick={() => setActiveTab("warning")}
                  className={`flex-1 py-3 md:py-4 text-sm font-medium text-center rounded-tr-[10px] transition-colors ${
                    activeTab === "warning"
                      ? "bg-[#03C3FF] text-white"
                      : "bg-[#EEEEEE] text-[#757575]"
                  }`}
                >
                  유의사항
                </button>
              </div>

              {/* 탭 내용 */}
              <div className="bg-white rounded-b-[10px] p-4 md:p-6">
                {activeTab === "description" && (
                  <div className="space-y-4 text-xs text-[#757575] leading-relaxed">
                    {/* 사기 주의 */}
                    <div className="space-y-2">
                      <p className="font-medium text-[#FF292D]">
                        사칭, 보이스피싱, 대리구매 사기 주의
                      </p>
                      <p>
                        · 국가기관을 사칭하여 입금을 유도하는 보이스피싱 사기가
                        급증하고 있습니다.
                      </p>
                      <p>
                        · 카톡 or 문자로 가족, 지인이 대리구매를 요청했다면 즉시
                        거래를 멈추고 112에 신고하세요.
                      </p>
                    </div>

                    {/* 상품권 안내 - API description 사용 */}
                    <div
                      className="space-y-2 [&_p]:text-xs [&_p]:text-[#757575] [&_strong]:text-[#03C3FF] [&_strong]:font-medium"
                      dangerouslySetInnerHTML={{ __html: issuer.description }}
                    />
                  </div>
                )}
                {activeTab === "warning" && (
                  <div className="space-y-4 text-xs text-[#757575] leading-relaxed">
                    <div className="space-y-2">
                      <p className="font-medium text-[#FF292D]">
                        사칭, 보이스피싱, 대리구매 사기 주의
                      </p>
                      <p>
                        · 국가기관을 사칭하여 입금을 유도하는 보이스피싱 사기가
                        급증하고 있습니다.
                      </p>
                      <p>
                        · 카톡 or 문자로 가족, 지인이 대리구매를 요청했다면 즉시
                        거래를 멈추고 112에 신고하세요.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-[#03C3FF]">주의사항</p>
                      <p>· 일일 충전한도는 50만원입니다.</p>
                      <p>
                        · 신규고객은 첫 구매로부터 48시간 동안 일일 50만원까지만
                        구매 가능합니다.
                      </p>
                      <p className="font-semibold">
                        · 구매 후 발송되어 노출된 상품권은 교환/환불이
                        불가능합니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 우측: 구매 정보 */}
          <div className="space-y-6 lg:space-y-9">
            {/* 01 상품 및 수량 선택 */}
            <div className="space-y-4 md:space-y-6">
              <SectionTitle number="01" title="상품 및 수량 선택" />
              <div className="bg-neutral-50 rounded-[10px] p-3 md:p-4 space-y-2">
                {vouchers.map((voucher, idx) => (
                  <div
                    key={voucher.id}
                    className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-3 md:p-4 ${
                      idx !== vouchers.length - 1
                        ? "border-b border-[#E0E0E0]"
                        : ""
                    }`}
                  >
                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-medium text-[#212121]">
                        {formatPrice(voucher.price)}
                      </p>
                    </div>
                    {/* 수량 조절 */}
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={() => updateQuantity(voucher.id, -10)}
                        className="flex items-center gap-1 px-2 md:px-3 py-2 bg-[#EEEEEE] rounded-[10px] text-xs md:text-sm text-[#BDBDBD] hover:bg-[#E0E0E0] transition-colors"
                      >
                        <span>-</span>
                        <span>10</span>
                      </button>
                      <div className="flex items-center gap-2 md:gap-3 bg-white rounded-[10px] px-2 md:px-3 py-2">
                        <button
                          onClick={() => updateQuantity(voucher.id, -1)}
                          className="text-[#03C3FF] text-lg font-medium"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantities[voucher.id]}
                          onChange={(e) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [voucher.id]: Math.max(
                                0,
                                Math.min(100, parseInt(e.target.value) || 0)
                              ),
                            }))
                          }
                          className="w-8 md:w-10 text-center text-sm md:text-base font-medium text-[#212121] bg-transparent"
                        />
                        <button
                          onClick={() => updateQuantity(voucher.id, 1)}
                          className="text-[#03C3FF] text-lg font-medium"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(voucher.id, 10)}
                        className="flex items-center gap-1 px-2 md:px-3 py-2 bg-[#E6F9FF] rounded-[10px] text-xs md:text-sm text-[#03C3FF] hover:bg-[#D9F6FF] transition-colors"
                      >
                        <span>+</span>
                        <span>10</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 02 최종 확인 */}
            <div className="space-y-4 md:space-y-6">
              <SectionTitle number="02" title="최종 확인" />
              <div className="bg-neutral-50 rounded-[10px] px-4 md:px-9 py-6 md:py-8 space-y-4 md:space-y-6">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-[#9E9E9E] text-center py-4">
                    상품을 선택해주세요
                  </p>
                ) : (
                  <>
                    {/* 선택된 상품 목록 (Receipt-card) */}
                    <div className="space-y-3 md:space-y-4">
                      {selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-[10px] px-4 md:px-6 py-4 md:py-5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-sm md:text-base font-medium text-[#212121]">
                              {formatPrice(item.price)}
                            </span>
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              className="mx-1"
                            >
                              <path
                                d="M4.17 4.17L12.83 12.83"
                                stroke="#E0E0E0"
                                strokeWidth="1.65"
                                strokeLinecap="round"
                              />
                              <path
                                d="M12.83 4.17L4.17 12.83"
                                stroke="#E0E0E0"
                                strokeWidth="1.65"
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="text-sm md:text-base font-medium text-[#212121]">
                              {item.quantity}
                            </span>
                          </div>
                          <span className="text-sm md:text-base font-medium text-[#212121]">
                            ₩{(item.price * item.quantity).toLocaleString()}원
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-dashed border-[#E0E0E0]"></div>

                    {/* 결제 정보 */}
                    <div className="space-y-3 md:space-y-4 px-2 md:px-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base text-[#212121]">
                          결제수단
                        </span>
                        <span className="text-sm md:text-base font-semibold text-[#212121]">
                          {paymentMethod === "card" ? "카드결제" : "휴대폰결제"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base text-[#212121]">
                          상품권 금액
                        </span>
                        <span className="text-sm md:text-base font-semibold text-[#212121]">
                          ₩{totalAmount.toLocaleString()}원
                        </span>
                      </div>
                      {paymentMethod === "phone" && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm md:text-base text-[#212121]">
                            수수료 (10%)
                          </span>
                          <span className="text-sm md:text-base font-semibold text-[#212121]">
                            +₩{Math.round(totalAmount * 0.1).toLocaleString()}원
                          </span>
                        </div>
                      )}
                      <div className="border-t border-dashed border-[#E0E0E0] pt-3"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base font-bold text-[#212121]">
                          합계
                        </span>
                        <span className="text-sm md:text-base font-bold text-[#0565FF]">
                          ₩{finalAmount.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 03 결제 수단 선택 */}
            <div className="space-y-4 md:space-y-6">
              <SectionTitle number="03" title="결제 수단 선택" />

              {/* 결제 방법 선택 버튼 */}
              <div className="flex gap-4 md:gap-6">
                <button
                  onClick={() => handlePaymentMethodChangeInProduct("card")}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 md:px-8 py-3 md:py-4 rounded-[10px] transition-all ${
                    paymentMethod === "card"
                      ? "bg-[#0565FF] text-white"
                      : "bg-white text-[#757575] border-2 border-[#E0E0E0] hover:border-[#0565FF] hover:text-[#0565FF]"
                  }`}
                >
                  <span
                    className={`text-sm md:text-lg font-semibold ${paymentMethod === "card" ? "text-[#E6F0FF]" : "text-[#0565FF]"}`}
                  >
                    최대 0%↓
                  </span>
                  <span className="text-lg md:text-2xl font-semibold">
                    카드 결제
                  </span>
                </button>
                <button
                  onClick={() => handlePaymentMethodChangeInProduct("phone")}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 md:px-8 py-3 md:py-4 rounded-[10px] transition-all ${
                    paymentMethod === "phone"
                      ? "bg-[#0565FF] text-white"
                      : "bg-white text-[#757575] border-2 border-[#E0E0E0] hover:border-[#0565FF] hover:text-[#0565FF]"
                  }`}
                >
                  <span
                    className={`text-sm md:text-lg font-semibold ${paymentMethod === "phone" ? "text-[#FFE6E6]" : "text-[#FF292D]"}`}
                  >
                    +10%
                  </span>
                  <span className="text-lg md:text-2xl font-semibold">
                    휴대폰 결제
                  </span>
                </button>
              </div>

              {/* 휴대폰 결제 안내 문구 */}
              {paymentMethod === "phone" && (
                <div className="mb-3 p-3 md:p-4 bg-[#F5F9FF] rounded-[10px] text-sm md:text-lg leading-relaxed">
                  <p className="mb-2">
                    <span
                      className="font-semibold"
                      style={{ color: "#0565FF" }}
                    >
                      KT, LGU
                    </span>{" "}
                    상품권 결제 한도{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#0565FF" }}
                    >
                      10만원/월
                    </span>{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#0565FF" }}
                    >
                      SKT
                    </span>{" "}
                    기존 구매내역이 있는 사용자{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#0565FF" }}
                    >
                      50만원/월 최초{" "}
                    </span>
                    구매자{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#0565FF" }}
                    >
                      10만원/월
                    </span>
                  </p>
                  <p className="text-[#424242]">
                    <span
                      className="font-semibold"
                      style={{ color: "#0565FF" }}
                    >
                      {" "}
                      결제가 실패하는 경우 9만원 이하{" "}
                    </span>{" "}
                    상품으로 이용해보시길 추천 드립니다.
                  </p>
                </div>
              )}

              {/* PG사 선택 */}
              <div className="bg-neutral-50 rounded-[10px] py-3 md:py-4">
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => setSelectedPG("galaxia")}
                    className={`flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-[10px] text-sm md:text-base font-medium transition-all flex items-center justify-center gap-1.5 ${
                      selectedPG === "galaxia"
                        ? "bg-white text-[#0565FF] border-2 border-[#0565FF] shadow-sm"
                        : "bg-[#EEEEEE] text-[#757575] border-2 border-transparent hover:bg-[#E0E0E0]"
                    }`}
                  >
                    {selectedPG === "galaxia" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="8" fill="#0565FF" />
                        <path
                          d="M4.5 8L7 10.5L11.5 5.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    겔럭시아
                  </button>
                  <button
                    onClick={() => setSelectedPG("danal")}
                    className={`flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-[10px] text-sm md:text-base font-medium transition-all flex items-center justify-center gap-1.5 ${
                      selectedPG === "danal"
                        ? "bg-white text-[#0565FF] border-2 border-[#0565FF] shadow-sm"
                        : "bg-[#EEEEEE] text-[#757575] border-2 border-transparent hover:bg-[#E0E0E0]"
                    }`}
                  >
                    {selectedPG === "danal" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="8" fill="#0565FF" />
                        <path
                          d="M4.5 8L7 10.5L11.5 5.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex flex-col items-center gap-0.5">
                      <span>다날</span>
                      {selectedPG === "danal" && paymentMethod === "phone" && (
                        <span className="text-[10px] md:text-xs text-[#0565FF]">
                          (LGU 이용가능, 월 10만원)
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedPG("inicis")}
                    disabled={true}
                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-[10px] text-sm md:text-base font-medium transition-all flex items-center justify-center gap-1.5 bg-[#F5F5F5] text-[#BDBDBD] border-2 border-transparent cursor-not-allowed opacity-60"
                  >
                    KG이니시스 (점검중)
                  </button>
                </div>
              </div>
            </div>

            {/* 총 결제 금액 */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-[#424242] rounded-[10px] px-6 md:px-8 py-5 md:py-6 flex items-center justify-between">
                <span className="text-base md:text-xl font-medium text-neutral-50">
                  총 결제 금액
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xl md:text-2xl font-semibold text-neutral-50">
                    {finalAmount.toLocaleString()}
                  </span>
                  <span className="text-base md:text-xl font-medium text-neutral-50">
                    원
                  </span>
                </div>
              </div>

              {/* 안내 문구 */}
              <p className="text-xs md:text-sm text-[#9E9E9E] leading-relaxed">
                신중한 구매 부탁드립니다. 모바일 상품권 특성상 PIN(핀) 번호 노출
                후 취소/반품이 불가합니다. 구매 후, [주문조회 → 상세보기] 통해
                핀번호를 확인할 수 있습니다.
              </p>
            </div>

            {/* 하단 버튼 */}
            <button
              disabled={!canPurchase}
              onClick={handlePurchase}
              className="w-full bg-[#0565FF] text-white rounded-[10px] px-4 md:px-8 py-4 md:py-5 text-base md:text-2xl font-semibold hover:bg-[#044CBF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              바로 구매
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 bg-neutral-50 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] md:py-10 lg:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end md:gap-8">
          {/* 좌측 */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="w-[100px] h-8 md:w-[142px] md:h-10">
              <img
                src="/logo.png"
                alt="핀토스"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-2 text-[11px] text-[#424242] leading-[1.5] md:gap-4 md:text-[16px]">
              <p>
                상호: 핀토스 l 주소: (47190) 부산광역시 부산진구 당감로17, 7동
                906호(당감동) l 대표 조문국
              </p>
              <p>
                사업자등록번호: 590-95-01527 l 통신판매번호 2024-부산진-1016 l
                Email : admin@pin-toss.com
              </p>
              <p className="hidden md:block">
                고객센터 주소 : 부산광역시 부산진구 당감로17, 7동 906호(당감동)
                l 핀토스 고객센터 Tel: 010-9300-4202
              </p>
              <p className="hidden md:block">
                민원담당자: 조문국 l 연락처: 010-9300-4202
              </p>
              <p className="text-[#BDBDBD] text-[10px] md:text-[16px]">
                해당 사이트에서 판매되는 모든 상품에 환불 및 모든 민원의 책임은
                핀토스 에 있습니다.
              </p>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <button className="bg-[#0565FF] text-white px-4 py-2.5 rounded-[10px] text-[12px] font-semibold md:px-8 md:py-3 md:text-[18px]">
                대량구매/제휴문의 : admin@pin-toss.com
              </button>
              <div className="bg-[#FFFADA] flex items-center gap-2 px-4 py-2.5 rounded-[10px] md:gap-3 md:px-6 md:py-3">
                <img
                  src="/kakao-logo.png"
                  alt="카카오톡"
                  className="w-5 h-5 md:w-[22px] md:h-[22px]"
                />
                <p className="text-[12px] font-medium text-[#3E2723] md:text-[18px]">
                  카카오톡 m4202
                </p>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-[#BDBDBD] md:text-[16px]">
              Copyright © 핀토스 All rights reserved.
            </p>
          </div>

          {/* 우측 */}
          <div className="flex flex-col gap-4 md:gap-8 md:items-end">
            {/* 고객센터 */}
            <div className="flex flex-col gap-2 md:gap-3 md:items-end">
              <p className="text-[14px] font-semibold text-[#212121] md:text-[20px]">
                고객센터
              </p>
              <div className="flex flex-col md:items-end">
                <p className="text-[20px] font-bold text-[#0565FF] leading-[1.3] md:text-[32px]">
                  010-9300-4202
                </p>
                <p className="text-[14px] font-medium text-[#757575] leading-[1.3] md:text-[20px]">
                  10:00 - 18:00
                </p>
              </div>
              <div className="flex gap-4 text-[11px] text-[#757575] md:gap-6 md:text-[16px]">
                <button>개인정보 처리방침</button>
                <button>이용약관</button>
              </div>
            </div>

            {/* 상품권 판매하기 링크 */}
            <a
              href="https://www.ksdl.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-semibold text-[#0565FF] underline md:text-[16px]"
            >
              상품권 판매하기
            </a>

            {/* 결제보안 배너 */}
            <div className="mt-2 md:mt-0">
              <img
                src="/protect-banner.png"
                alt="결제보안 인증"
                className="h-[30px] w-auto md:h-[43px]"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
