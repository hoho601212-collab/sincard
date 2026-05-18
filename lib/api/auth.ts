'use client';

import { useMutation } from '@tanstack/react-query';
import { api, ApiResponse } from './core';

// ===== Types =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  // refreshToken은 HttpOnly Cookie로 전달됨
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  loginType: 'LOCAL' | 'KAKAO' | 'NAVER';
}

export interface OAuthSignupRequest {
  oauthSignupUuid: string;
  name: string;
  phone: string;
}

export interface OAuthSignupResponse {
  accessToken: string;
}

// 중복확인 응답은 data: boolean 직접 반환
export type CheckDuplicateResponse = boolean;

export interface AccountInfo {
  account: string;
  loginType: string;
}

export type FindIdResponse = AccountInfo[];

export interface ResetPasswordRequest {
  email: string;
  verifySessionId: string;
  newPassword: string;
}

// ===== API Functions =====
const authApi = {
  // 로그인
  login: (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data),

  // 이메일 중복 확인 - data: true(중복), false(사용가능)
  checkEmailDuplicate: (email: string) =>
    api.get<CheckDuplicateResponse>(`/api/auth/check-id?email=${encodeURIComponent(email)}`),

  // 전화번호 중복 확인 - data: true(중복), false(사용가능)
  checkPhoneDuplicate: (phone: string) =>
    api.get<CheckDuplicateResponse>(
      `/api/auth/check-phone?phone=${encodeURIComponent(phone)}`
    ),

  // 회원가입
  register: (data: RegisterRequest) => api.post<null>('/api/auth/register', data),

  // OAuth 회원가입
  oauthSignup: (data: OAuthSignupRequest) =>
    api.post<OAuthSignupResponse>('/api/oauth/signup', data),

  // 아이디 찾기 - phone 파라미터 사용
  findId: (name: string, phone: string) =>
    api.get<FindIdResponse>(
      `/api/auth/find_id?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`
    ),

  // 비밀번호 재설정 - POST /api/auth/reset-password
  resetPassword: (data: ResetPasswordRequest) =>
    api.post<null>('/api/auth/reset-password', data),
};

// ===== React Query Hooks =====

// 로그인
export const useLoginAPI = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      console.log('로그인 성공:', response.data);
    },
    onError: (error: Error) => {
      console.error('로그인 실패:', error);
    },
  });
};

// 이메일 중복 확인 (수동 트리거)
export const useCheckEmailAPI = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.checkEmailDuplicate(email),
  });
};

// 전화번호 중복 확인 (수동 트리거)
export const useCheckPhoneAPI = () => {
  return useMutation({
    mutationFn: (phone: string) => authApi.checkPhoneDuplicate(phone),
  });
};

// 회원가입
export const useRegisterAPI = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response: ApiResponse<null>) => {
      console.log('회원가입 성공:', response);
    },
    onError: (error: Error) => {
      console.error('회원가입 실패:', error);
    },
  });
};

// OAuth 회원가입
export const useOAuthSignupAPI = () => {
  return useMutation({
    mutationFn: (data: OAuthSignupRequest) => authApi.oauthSignup(data),
    onSuccess: (response: ApiResponse<OAuthSignupResponse>) => {
      console.log('OAuth 회원가입 성공:', response);
    },
    onError: (error: Error) => {
      console.error('OAuth 회원가입 실패:', error);
    },
  });
};

// 아이디 찾기
export const useFindIdAPI = () => {
  return useMutation({
    mutationFn: ({ name, phone }: { name: string; phone: string }) =>
      authApi.findId(name, phone),
  });
};

// 비밀번호 재설정
export const useResetPasswordAPI = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      console.log('비밀번호 재설정 요청 성공');
    },
    onError: (error: Error) => {
      console.error('비밀번호 재설정 실패:', error);
    },
  });
};
