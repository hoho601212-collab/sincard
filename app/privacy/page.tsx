"use client";

import Link from "next/link";
import { MainHeader } from "@/components/layout";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MainHeader />

      {/* 본문 */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm md:p-10">
          <h1 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">
            개인정보처리방침
          </h1>

          <div className="prose prose-gray max-w-none text-sm leading-relaxed text-gray-700 md:text-base">
            <p className="mb-6 text-gray-600">
              핀토스은(는) 이용자들의 개인정보보호를 매우 중요시하며, 이용자가
              회사의 서비스를 이용함과 동시에 온라인상에서 회사에 제공한
              개인정보가 보호 받을 수 있도록 최선을 다하고 있습니다.
            </p>

            <p className="mb-6 text-gray-600">
              이에 핀토스몰는 통신비밀보호법, 전기통신사업법, 정보통신망
              이용촉진 및 정보보호 등에 관한 법률 등 정보통신서비스제공자가
              준수하여야 할 관련 법규상의 개인정보보호 규정 및 정보통신부가
              제정한 개인정보보호지침을 준수하고 있습니다.
            </p>

            {/* 목차 */}
            <div className="mb-8 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                목차
              </h2>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-600">
                <li>개인정보 수집에 대한 동의</li>
                <li>개인정보의 수집목적 및 이용목적</li>
                <li>수집하는 개인정보 항목 및 수집방법</li>
                <li>수집하는 개인정보의 보유 및 이용기간</li>
                <li>수집한 개인정보의 공유 및 제공</li>
                <li>
                  이용자 자신의 개인정보 관리(열람,정정,삭제 등)에 관한 사항
                </li>
                <li>쿠키(Cookie)의 운용 및 거부</li>
                <li>비회원 고객의 개인정보 관리</li>
                <li>개인정보의 위탁처리</li>
                <li>개인정보관련 의견수렴 및 불만처리에 관한 사항</li>
                <li>개인정보 관리책임자 및 담당자의 소속-성명 및 연락처</li>
                <li>아동의 개인정보보호</li>
                <li>고지의 의무</li>
              </ol>
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                1. 개인정보 수집에 대한 동의
              </h2>
              <p>
                핀토스몰는 이용자들이 회사의 개인정보 처리방침 또는 이용약관의
                내용에 대하여 「동의」버튼 또는 「취소」버튼을 클릭할 수 있는
                절차를 마련하여, 「동의」버튼을 클릭하면 개인정보 수집에 대해
                동의한 것으로 봅니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                2. 개인정보의 수집목적 및 이용목적
              </h2>
              <p className="mb-4">
                &quot;개인정보&quot;라 함은 생존하는 개인에 관한 정보로서 당해
                정보에 포함되어 있는 성명등의 사항에 의하여 당해 개인을 식별할
                수 있는 정보를 말합니다.
              </p>
              <p className="mb-4">
                핀토스몰는 이용자의 사전 동의 없이는 이용자의 개인 정보를
                공개하지 않으며, 수집된 정보는 아래와 같이 이용하고 있습니다.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>성명, 아이디, 비밀번호:</strong> 회원제 서비스 이용에
                  따른 본인 확인 절차에 이용
                </li>
                <li>
                  <strong>이메일주소, 전화번호:</strong> 고지사항 전달, 불만처리
                  등을 위한 원활한 의사소통 경로의 확보, 새로운 서비스 및
                  신상품이나 이벤트 정보 등의 안내
                </li>
                <li>
                  <strong>은행계좌정보, 신용카드정보:</strong> 서비스 및 부가
                  서비스 이용에 대한 요금 결제
                </li>
                <li>
                  <strong>주소, 전화번호:</strong> 청구서, 물품배송시 정확한
                  배송지의 확보
                </li>
                <li>
                  <strong>IP Address:</strong> 불량회원의 부정 이용 방지와
                  비인가 사용 방지
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                3. 수집하는 개인정보 항목 및 수집방법
              </h2>
              <p className="mb-4">
                핀토스몰는 이용자들이 회원서비스를 이용하기 위해 회원으로
                가입하실 때 서비스 제공을 위한 필수적인 정보들을 온라인상에서
                입력 받고 있습니다.
              </p>
              <p className="mb-4">
                회원 가입 시에 받는 필수적인 정보는 이름, 이메일 주소 등입니다.
                또한 양질의 서비스 제공을 위하여 이용자들이 선택적으로 입력할 수
                있는 사항으로서 전화번호 등을 입력 받고 있습니다.
              </p>
              <p>
                이용자의 기본적 인권 침해의 우려가 있는 민감한 개인정보(인종 및
                민족, 사상 및 신조, 출신지 및 본적지, 정치적 성향 및 범죄기록,
                건강상태 및 성생활 등)는 수집하지 않습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                4. 수집하는 개인정보의 보유 및 이용기간
              </h2>
              <p className="mb-4">
                이용자가 쇼핑몰 회원으로서 회사에 제공하는 서비스를 이용하는
                동안 핀토스몰는 이용자들의 개인정보를 계속적으로 보유하며 서비스
                제공 등을 위해 이용합니다.
              </p>
              <p className="mb-4">
                관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              </ul>
              <h3 className="mb-2 mt-4 font-medium text-gray-800">
                개인정보 파기 방법
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
                  파기합니다.
                </li>
                <li>
                  전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는
                  기술적 방법을 사용하여 삭제합니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                5. 수집한 개인정보의 공유 및 제공
              </h2>
              <p className="mb-4">
                핀토스몰는 이용자들의 개인정보를 &quot;2. 개인정보의 수집목적 및
                이용목적&quot;에서 고지한 범위 내에서 사용하며, 이용자의 사전
                동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의
                개인정보를 외부에 공개하지 않습니다.
              </p>
              <p>다만, 아래의 경우에는 예외로 합니다:</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>이용자들이 사전에 공개에 동의한 경우</li>
                <li>서비스 제공에 따른 요금정산을 위하여 필요한 경우</li>
                <li>서비스 이용 약관을 위반한 경우</li>
                <li>법에 의해 요구된다고 선의로 판단되는 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                6. 이용자 자신의 개인정보 관리
              </h2>
              <p className="mb-4">
                회원님이 원하실 경우 언제라도 당사에서 개인정보를 열람하실 수
                있으며 보관된 필수 정보를 수정하실 수 있습니다.
              </p>
              <h3 className="mb-2 font-medium text-gray-800">
                이용자 및 법정대리인의 권리
              </h3>
              <ol className="list-decimal space-y-2 pl-5">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ol>
              <p className="mt-4">
                권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을
                통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                7. 쿠키(Cookie)의 운용 및 거부
              </h2>
              <h3 className="mb-2 font-medium text-gray-800">
                가. 쿠키의 사용 목적
              </h3>
              <ol className="mb-4 list-decimal space-y-2 pl-5">
                <li>
                  회사는 개인 맞춤 서비스를 제공하기 위해서 이용자에 대한 정보를
                  저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를
                  사용합니다.
                </li>
                <li>
                  회사는 쿠키의 사용을 통해서만 가능한 특정된 맞춤형 서비스를
                  제공할 수 있습니다.
                </li>
                <li>
                  회사는 회원을 식별하고 회원의 로그인 상태를 유지하기 위해
                  쿠키를 사용할 수 있습니다.
                </li>
              </ol>
              <h3 className="mb-2 font-medium text-gray-800">
                나. 쿠키의 설치/운용 및 거부
              </h3>
              <p className="mb-2">
                이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다.
                웹브라우저에서 옵션을 조정함으로써 모든 쿠키를 허용/거부하거나,
                쿠키가 저장될 때마다 확인을 거치도록 할 수 있습니다.
              </p>
              <p className="text-sm text-gray-600">
                ※ 쿠키의 저장을 거부할 경우에는 개인 맞춤서비스 등 회사가
                제공하는 일부 서비스는 이용이 어려울 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                11. 개인정보 관리책임자 및 담당자
              </h2>
              <div className="rounded-lg bg-gray-50 p-4">
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>이름:</strong> 조문국
                  </li>
                  <li>
                    <strong>소속/직위:</strong> 대표
                  </li>
                  <li>
                    <strong>E-MAIL:</strong> c0810@naver.com
                  </li>
                  <li>
                    <strong>전화번호:</strong> 010-9300-4202
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                12. 아동의 개인정보보호
              </h2>
              <p>
                핀토스몰는 온라인 환경에서 만 14세 미만 어린이의 개인정보를
                보호하는 것 역시 중요한 일이라고 생각하고 있습니다. 핀토스몰는
                만 14세 미만의 어린이들은 법정대리인의 동의가 없는 한 회원으로
                가입할 수 없게 하고 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                13. 고지의 의무
              </h2>
              <p>
                현 개인정보처리방침의 내용은 정부의 정책 또는 보안기술의 변경에
                따라 내용의 추가 삭제 및 수정이 있을 시에는 홈페이지의
                &apos;공지사항&apos;을 통해 고지할 것입니다.
              </p>
            </section>

            <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
              <p>
                <strong>개인정보처리방침 시행일자:</strong> 2024-01-01
              </p>
              <p>
                <strong>개인정보처리방침 변경일자:</strong> 2024-01-01
              </p>
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:justify-between">
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-primary hover:underline"
            >
              이용약관 보기
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:underline"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
