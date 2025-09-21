'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth';
import { authApi } from '@/lib/api';
import { saveAuthToSession, getUserFromSession, clearAuthFromSession } from '@/utils/session';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = getUserFromSession();
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      setUser(response);
      saveAuthToSession(response);
      
      toast.success('로그인에 성공했습니다.');
      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      // authApi.register가 이제 LoginResponse를 반환함 (자동 로그인)
      const response = await authApi.register(data);
      
      // 자동 로그인된 사용자 정보를 저장
      setUser(response);
      saveAuthToSession(response);
      
      toast.success('회원가입 및 로그인이 완료되었습니다.');
      router.push('/dashboard');
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      clearAuthFromSession();
      toast.success('로그아웃되었습니다.');
      router.push('/login');
    } catch (error) {
      // 로그아웃은 실패해도 로컬 상태는 정리
      setUser(null);
      clearAuthFromSession();
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}