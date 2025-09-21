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

// BlueSonix API userProfile 구조
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  profileImage: string;
  phoneNumber: string;
  birthDate: string; // "1990-01-15" 형식
  gender: "MALE" | "FEMALE";
  address: string | null;
  marketingAgreed: boolean;
  emailCertification: boolean;
  type: "default" | "kakao" | "google" | "naver";
  role: "ADMIN" | "USER";
  followingCount: number;
  followerCount: number;
  connectedDeviceId?: string | null;
}

// BlueSonix API 로그인 응답 구조
export interface LoginApiResponse {
  accessToken: string;
  userProfile: UserProfile;
}

// BlueSonix API 응답 구조
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  value?: T;
}