import ky, { HTTPError, type Options } from "ky";

import { useAuthStore } from "@/store/auth";

interface DataResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

type ApiSuccess<T> = {
  success: true;
  data: T;
  code: number;
  status: string;
  message: string;
  httpStatus: number;
};

type ApiFail = {
  success: false;
  data: null;
  code: number;
  status: string;
  message: string;
  httpStatus: number;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFail;

// 여러 API 요청이 동시에 401 에러를 받을 때, 재발급 요청이 한 번만 실행되도록 보장하는 장치입니다.
let isReissuing = false;
let reissuePromise: Promise<void> | null = null;

const reissueToken = (): Promise<void> => {
  reissuePromise = new Promise((resolve, reject) => {
    const executeReissue = async () => {
      try {
        const { setAuth } = useAuthStore.getState();
        const response = await ky
          .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reissue`, {
            credentials: "include",
          })
          .json<DataResponse<{ reissueAccessToken: string }>>();

        setAuth(response.data.reissueAccessToken);
        resolve();
      } catch (error) {
        // 재발급 요청 자체가 실패한 경우, 이는 Refresh Token이 만료된 '회생 불가' 상태를 의미합니다.
        // 클라이언트의 인증 정보를 지우고, API 요청은 실패로 처리합니다.
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        reject(error);
      } finally {
        isReissuing = false;
        reissuePromise = null;
      }
    };

    executeReissue();
  });
  return reissuePromise;
};

const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  // 요청 대기 시간
  retry: 1,
  hooks: {
    beforeRequest: [
      (request) => {
        const { accessToken } = useAuthStore.getState();
        request.headers.set(
          "Authorization",
          accessToken ? `Bearer ${accessToken}` : ""
        );
      },
    ],
  },
});

async function customFetch<T>(
  path: string,
  options?: Options
): Promise<ApiResponse<T>> {
  try {
    // 1. 요청 정상 처리
    const response = await apiClient(path, options);
    const { data, code, status, message } =
      (await response.json()) as DataResponse<T>;

    return {
      success: true,
      data: data as T,
      code,
      status,
      message,
      httpStatus: response.status,
    };
  } catch (error) {
    // 2. HTTP 에러 발생 시
    if (error instanceof HTTPError) {
      let errorResponse: DataResponse<null> | null = null;
      try {
        errorResponse = (await error.response.json()) as DataResponse<null>;
      } catch {
        // 의도적으로 비워둔 catch 블록입니다.
        // 서버 응답이 JSON이 아닐 때 발생하는 파싱 에러가 전체 함수의 실행을 중단시키는 것을 방지합니다.
      }

      const errorStatus = errorResponse?.status;
      const errorMessage = errorResponse?.message;

      // 2-1. Access Token 만료 - 재발급을 시도하는 유일한 특수 케이스입니다.
      if (
        error.response.status === 401 &&
        (errorStatus === "EXPIRED_TOKEN" ||
          errorStatus === "UNAUTHORIZED" ||
          errorMessage === "Unauthorized")
      ) {
        if (!isReissuing) {
          isReissuing = true;
          await reissueToken();
        } else {
          // 이미 재발급 중이면 완료될 때까지 대기
          await reissuePromise;
        }

        try {
          // 재발급된 토큰으로 원래 요청을 다시 시도합니다.
          return await customFetch<T>(path, options);
        } catch {
          // window.location을 통해 로그인 페이지로 이동하지만, 모든 요청이 실패하는 것을 방지하기 위해 예외 처리를 합니다.
          return {
            success: false,
            data: null,
            code: 401000,
            status: "LOGIN_SESSION_EXPIRED",
            message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
            httpStatus: 401,
          };
        }
      }

      // 2-2. 그 외 모든 HTTP 에러 (401이지만 토큰 만료가 아닌 경우, 403, 404, 500 등)
      if (errorResponse) {
        // 5xx 서버 에러는 Sentry로 리포팅
        // 서버가 보내준 에러 정보를 담아 실패 응답을 반환합니다.
        return {
          success: false,
          data: null,
          code: errorResponse.code,
          status: errorResponse.status,
          message: errorResponse.message,
          httpStatus: error.response.status,
        };
      } else {
        // 서버가 JSON 형태의 에러 응답을 주지 않은 경우, HTTP 상태로 기본 에러를 만듭니다.
        return {
          success: false,
          data: null,
          code: error.response.status,
          status: `HTTP_ERROR_${error.response.status}`,
          message:
            error.response.statusText || "알 수 없는 서버 에러가 발생했습니다.",
          httpStatus: error.response.status,
        };
      }
    }

    // 3. 네트워크 에러 등 HTTP 통신 자체에 실패한 경우
    return {
      success: false,
      data: null,
      code: 0,
      status: "UNEXPECTED_ERROR",
      message: "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      httpStatus: 0,
    };
  }
}

export const api = {
  get: <T>(path: string, options?: Options) =>
    customFetch<T>(path, { ...options, method: "get" }),
  post: <T>(path: string, options?: Options) =>
    customFetch<T>(path, { ...options, method: "post" }),
  patch: <T>(path: string, options?: Options) =>
    customFetch<T>(path, { ...options, method: "patch" }),
  delete: <T>(path: string, options?: Options) =>
    customFetch<T>(path, { ...options, method: "delete" }),
};
