import { LoginRequest, RegisterRequest, LoginResponse, ApiResponse, LoginApiResponse } from '@/types/auth';
import { generateRandomName, generateRandomBirthDate, generateRandomPhone, generateRandomGender } from '@/utils/randomData';

// BlueSonix 서버 API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://54.180.100.99:8080';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError(
      responseData.message || `API request failed: ${response.statusText}`,
      response.status
    );
  }

  // BlueSonix API 응답 구조에 맞게 처리
  if (responseData.code === 0) {
    return responseData.value || responseData;
  } else {
    throw new ApiError(
      responseData.message || 'API request failed',
      response.status
    );
  }
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    // 1. 회원가입 진행
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        type: 'default', // 고정값
        name: data.name || generateRandomName(), // 입력값 있으면 사용, 없으면 랜덤
        gender: data.gender || generateRandomGender(), // 입력값 있으면 사용, 없으면 랜덤
        birthDate: data.birthDate || generateRandomBirthDate(), // 입력값 있으면 사용, 없으면 랜덤
        phone: data.phone || generateRandomPhone(), // 입력값 있으면 사용, 없으면 랜덤
        profileImg: '', // 고정값
        marketingAgreed: data.marketingAgreed,
        emailCertification: false, // 고정값
        role: 'USER', // 고정값
      }),
    });

    // 2. 회원가입 성공 후 자동 로그인
    return authApi.login({
      email: data.email,
      password: data.password,
    });
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginApiResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // BlueSonix API 응답을 LoginResponse 형식으로 변환
    return {
      loginType: response.userProfile.type,
      email: response.userProfile.email,
      name: response.userProfile.name,
      gender: response.userProfile.gender,
      birthDate: response.userProfile.birthDate,
      phone: response.userProfile.phoneNumber,
      marketingAgreed: response.userProfile.marketingAgreed,
      token: response.accessToken,
      emailCertified: response.userProfile.emailCertification,
      connectedDeviceId: response.userProfile.connectedDeviceId || null,
    };
  },

  logout: async (): Promise<void> => {
    // 실제 서버 로그아웃 API 호출
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // 로그아웃 실패해도 클라이언트에서는 세션 정리
      console.warn('Logout API failed:', error);
    }
  },
};