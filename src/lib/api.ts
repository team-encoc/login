import { LoginRequest, RegisterRequest, LoginResponse } from '@/types/auth';
import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<void> => {
    // Supabase를 사용한 회원가입
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate,
          phone: data.phone,
          marketingAgreed: data.marketingAgreed,
          type: 'default',
        },
      },
    });

    if (error) {
      throw new ApiError(error.message, 400);
    }
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Supabase를 사용한 로그인
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (authError) {
      throw new ApiError(authError.message, 401);
    }

    if (!authData.user || !authData.session) {
      throw new ApiError('Login failed', 401);
    }

    // user_profiles 테이블에서 추가 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      throw new ApiError('Failed to fetch user profile', 500);
    }

    // LoginResponse 형식으로 변환
    return {
      loginType: profile.login_type as "default" | "kakao" | "google" | "naver",
      email: profile.email,
      name: profile.name,
      gender: profile.gender,
      birthDate: profile.birth_date,
      phone: profile.phone,
      marketingAgreed: profile.marketing_agreed,
      token: authData.session.access_token,
      emailCertified: profile.email_certified,
      connectedDeviceId: profile.connected_device_id,
    };
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new ApiError(error.message, 400);
    }
  },
};