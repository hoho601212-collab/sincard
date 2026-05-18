import { useAuthStore } from "@/store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API 응답 타입
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  status: string;
  errorMessage: string;
  timestamp: string;
  errors: unknown;
  code: string;
  errorCodeMessage: string;
}

// 커스텀 에러 클래스
export class ApiError extends Error {
  status: number;
  errorMessage: string;
  code: string;

  constructor(status: number, errorMessage: string, code: string) {
    super(errorMessage);
    this.status = status;
    this.errorMessage = errorMessage;
    this.code = code;
    this.name = "ApiError";
  }
}

// ===== 토큰 재발급 싱글톤 =====
// 여러 API 요청이 동시에 401 에러를 받을 때, 재발급 요청이 한 번만 실행되도록 보장
let isReissuing = false;
let reissuePromise: Promise<string> | null = null;

async function reissueToken(): Promise<string> {
  if (reissuePromise) {
    return reissuePromise;
  }

  isReissuing = true;

  const executeReissue = async (): Promise<string> => {
    try {
      // 현재 accessToken 가져오기
      const accessToken = useAuthStore.getState().accessToken;

      const response = await fetch(`${BASE_URL}/api/auth/reissue`, {
        method: "POST",
        credentials: "include", // HttpOnly Cookie로 refreshToken 전송
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Token reissue failed");
      }

      const data = await response.json();
      const newAccessToken = data.data?.reissueAccessToken;

      if (!newAccessToken) {
        throw new Error("No access token in response");
      }

      // 새 토큰 저장
      const { setAuth } = useAuthStore.getState();
      setAuth(newAccessToken);

      return newAccessToken;
    } catch (error) {
      // 재발급 실패 = Refresh Token 만료 → 로그아웃 처리
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
      throw error;
    } finally {
      isReissuing = false;
      reissuePromise = null;
    }
  };

  reissuePromise = executeReissue();
  return reissuePromise;
}

// API 요청 함수
async function request<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry: boolean = false
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  // Zustand store에서 accessToken 가져오기
  const accessToken = useAuthStore.getState().accessToken;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // accessToken이 있으면 Authorization 헤더 추가
  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...options,
    credentials: "include", // 쿠키 포함
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    // 에러 응답 파싱
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // JSON 파싱 실패 시 무시
    }

    // 401 에러 → 토큰 재발급 시도
    if (response.status === 401 && !isRetry) {
      try {
        // 토큰 재발급
        if (!isReissuing) {
          reissueToken();
        }
        await reissuePromise;

        // 재발급 성공 → 원래 요청 재시도
        return request<T>(endpoint, options, true);
      } catch {
        // 재발급 실패 → 로그인 세션 만료 에러
        throw new ApiError(
          401,
          "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
          "LOGIN_SESSION_EXPIRED"
        );
      }
    }

    // 그 외 에러
    throw new ApiError(
      response.status,
      errorData?.errorMessage || `API Error: ${response.status}`,
      errorData?.code || String(response.status)
    );
  }

  return response.json();
}

// API 객체
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
