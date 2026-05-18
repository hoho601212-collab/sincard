'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from './core';

// ===== Types =====
export interface UserInfo {
  email: string;
  name: string;
  phone: string;
}

export interface ChangePasswordRequest {
  originPassword: string;
  newPassword: string;
}

// ===== API Functions =====
const userApi = {
  // 내 정보 조회
  getUserInfo: () => api.get<UserInfo>('/v1/api/users/info'),

  // 비밀번호 변경
  changePassword: (data: ChangePasswordRequest) =>
    api.put<void>('/v1/api/users/password', data),

  // 회원 탈퇴
  withdraw: () => api.post<void>('/v1/api/users/withdraw'),
};

// ===== React Query Hooks =====

// 내 정보 조회
export const useUserInfoAPI = () => {
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => userApi.getUserInfo(),
    enabled: typeof window !== 'undefined', // 클라이언트에서만 실행
  });
};

// 비밀번호 변경
export const useChangePasswordAPI = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => userApi.changePassword(data),
    onSuccess: () => {
      console.log('비밀번호 변경 성공');
    },
    onError: (error: Error) => {
      console.error('비밀번호 변경 실패:', error);
    },
  });
};

// 회원 탈퇴
export const useWithdrawAPI = () => {
  return useMutation({
    mutationFn: () => userApi.withdraw(),
    onSuccess: () => {
      console.log('회원 탈퇴 성공');
    },
    onError: (error: Error) => {
      console.error('회원 탈퇴 실패:', error);
    },
  });
};
