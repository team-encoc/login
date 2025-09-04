export interface RegisterRequest {
  email: string;
  password: string;
  type?: "default" | "kakao" | "google" | "naver";
  name?: string;
  gender?: "male" | "female";
  birthDate?: string; // YYMMDD 형식
  phone?: string;
  marketingAgreed: boolean;
  emailCertification?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  loginType: "default" | "kakao" | "google" | "naver";
  email: string;
  name: string | null;
  gender: "male" | "female" | null;
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
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}