export interface RegisterRequest {
  // 필수 입력 필드
  email: string;
  password: string;
  marketingAgreed: boolean;
  
  // 선택적 입력 필드 (없으면 랜덤값 생성)
  name?: string;
  gender?: "MALE" | "FEMALE";
  birthDate?: string; // YYYYMMDD 형식 (8자리)
  phone?: string;
  
  // 시스템에서 처리하는 필드 (사용자 입력 불필요)
  type?: "default" | "kakao" | "google" | "naver"; // 항상 "default"
  profileImg?: string; // 항상 ""
  emailCertification?: boolean; // 항상 false
  role?: "ADMIN" | "USER"; // 항상 "USER"
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  loginType: "default" | "kakao" | "google" | "naver";
  email: string;
  name: string | null;
  gender: "MALE" | "FEMALE" | null;
  birthDate: string | null; // YYMMDD 형식
  phone: string | null;
  marketingAgreed: boolean;
  token: string;
  emailCertified: boolean;
  connectedDeviceId: string | null;
}

export interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<LoginResponse>;
  logout: () => void;
}

// BlueSonix API 응답 구조
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  value?: T;
}