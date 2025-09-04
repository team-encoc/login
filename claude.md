# Login System Project

로그인, 로그아웃, 회원가입 기능이 있는 React 기반 웹 애플리케이션

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Session storage for token management
- **Database**: Supabase
- **Framework**: Next.js App Router

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx     # 로그인 페이지
│   │   └── register/
│   │       └── page.tsx     # 회원가입 페이지
│   ├── dashboard/
│   │   └── page.tsx         # 대시보드 페이지
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── auth/                # Authentication components
├── lib/
│   ├── api.ts               # API client
│   └── auth.ts              # Authentication utilities
├── utils/
│   └── session.ts           # Session storage management
├── types/
│   └── auth.ts              # Authentication types
├── context/
│   └── AuthContext.tsx      # Authentication context
└── middleware.ts            # Next.js middleware for route protection

```

## Required Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

### shadcn/ui 컴포넌트 설치

프로젝트에 필요한 shadcn/ui 컴포넌트들:

```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert
```

## Key Features

1. **일반 회원가입 (Register)**

   - 이메일, 비밀번호 입력 (필수)
   - 마케팅 수신 동의 (필수)
   - 선택 정보: 이름, 성별, 생년월일(YYMMDD), 전화번호
   - 이메일 인증 시스템

2. **일반 로그인 (Login)**

   - 이메일, 비밀번호 인증
   - 완전한 사용자 정보 반환 (LoginResponse)
   - 토큰을 세션스토리지에 저장
   - 로그인 상태 관리

3. **로그아웃 (Logout)**
   - 세션스토리지에서 토큰 및 사용자 정보 제거
   - 로그인 페이지로 리다이렉트

## Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api  # API 서버 URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url           # Supabase URL (필요시)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key # Supabase Key (필요시)
```

## Commands

- `npm run dev` - Next.js 개발 서버 실행
- `npm run build` - Next.js 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행
- `npm run typecheck` - TypeScript 타입 체크

## Implementation Notes

### UI 컴포넌트 구성

- **shadcn/ui 우선 사용**: 모든 UI 컴포넌트는 shadcn/ui를 최대한 활용
- **Form 컴포넌트**: react-hook-form + Zod validation과 연동된 shadcn/ui Form 사용
- **Input 컴포넌트**: Email, Password 입력을 위한 shadcn/ui Input 사용
- **Button 컴포넌트**: Submit, Cancel 등 모든 버튼에 shadcn/ui Button 사용
- **Checkbox 컴포넌트**: 마케팅 동의 체크박스에 shadcn/ui Checkbox 사용
- **Card 컴포넌트**: 로그인/회원가입 폼을 감싸는 컨테이너로 shadcn/ui Card 사용
- **Toast/Alert**: 성공/에러 메시지 표시에 shadcn/ui Toast, Alert 사용

### 인증 시스템

- 모든 인증 상태는 React Context로 관리
- 토큰 만료 시 자동 로그아웃 처리
- 보호된 라우트는 인증 체크 후 접근
- API 통신은 fetch 사용
- 회원가입 시 이메일과 비밀번호만으로 가능, 추가 정보는 선택사항
- 마케팅 동의는 필수 항목으로 체크박스 제공

### 디자인 시스템

- Tailwind CSS를 활용한 responsive design
- shadcn/ui의 기본 테마 및 스타일 적용
- 다크모드 지원 (shadcn/ui 기본 제공)
- 접근성(A11y) 고려된 컴포넌트 사용

## API Specifications

### Authentication Endpoints

#### 1. 일반 회원가입

**`POST /api/auth/register`**

```typescript
RegisterRequest {
  email: string;           // 사용자 이메일 (필수)
  password: string;        // 비밀번호 8~20자, 특수문자 포함 (필수)
  type?: "default"|"kakao"|"google"|"naver"; // 기본 "default" (필수)
  name?: string;           // 사용자 이름 (선택)
  gender?: "male" | "female"; // 성별 (선택)
  birthDate?: string;      // 생년월일 YYMMDD 형식 (선택)
  phone?: string;         // 전화번호 (선택)
  marketingAgreed: boolean; // 마케팅 수신 동의 (필수)
  emailCertification?: boolean; // 기본 false (선택)
}
```

**필수 필드**: email, password, type, marketingAgreed

#### 2. 일반 로그인

**`POST /api/auth/login`**

```typescript
LoginRequest {
  email: string;    // 이메일 (필수)
  password: string; // 비밀번호 (필수)
}
```

**공통 로그인 응답 데이터**:

```typescript
LoginResponse {
  loginType: "default" | "kakao" | "google" | "naver";
  email: string;
  name: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;     // YYMMDD 형식
  phone: string | null;
  marketingAgreed: boolean;
  token: string;
  emailCertified: boolean;
  connectedDeviceId: string | null;
}
```

## Authentication Flow

### 일반 회원가입 Flow

1. 사용자가 이메일, 비밀번호, 마케팅 동의 입력 (필수)
2. 클라이언트에서 유효성 검증 (이메일 형식, 비밀번호 8~20자 특수문자 포함)
3. `POST /api/auth/register` 호출
4. type은 "default"로 설정
5. 성공 시 이메일 인증 발송 안내
6. 이메일 인증 후 로그인 페이지로 이동

### 일반 로그인 Flow

1. 사용자가 이메일, 비밀번호 입력
2. `POST /api/auth/login` 호출
3. 성공 시 LoginResponse 데이터 수신
4. 토큰을 세션스토리지에 저장
5. AuthContext에 사용자 정보 저장
6. 대시보드 페이지로 리다이렉트

### 로그아웃 Flow

1. 로그아웃 버튼 클릭
2. 세션스토리지에서 토큰 및 사용자 정보 제거
3. AuthContext 상태 초기화
4. 로그인 페이지로 리다이렉트

## Session Management

### 세션스토리지 키

- `auth.token` - 액세스 토큰
- `auth.user` - 사용자 정보 (LoginResponse)

### 토큰 및 사용자 정보 관리

```typescript
// 로그인 정보 저장
const saveAuthToSession = (loginResponse: LoginResponse) => {
  sessionStorage.setItem("auth.token", loginResponse.token);
  sessionStorage.setItem("auth.user", JSON.stringify(loginResponse));
};

// 토큰 가져오기
const getTokenFromSession = (): string | null => {
  return sessionStorage.getItem("auth.token");
};

// 사용자 정보 가져오기
const getUserFromSession = (): LoginResponse | null => {
  const userStr = sessionStorage.getItem("auth.user");
  return userStr ? JSON.parse(userStr) : null;
};

// 인증 정보 제거
const clearAuthFromSession = () => {
  sessionStorage.removeItem("auth.token");
  sessionStorage.removeItem("auth.user");
};
```

## Form Validation

### 이메일 검증

- 유효한 이메일 형식 확인
- 중복 이메일 체크는 API에서 처리

### 비밀번호 검증

- 8~20자 길이
- 특수문자 포함 필수
- 대문자, 소문자, 숫자 포함 권장

## Error Handling

### 일반적인 에러 케이스

- `Invalid login credentials` - 잘못된 로그인 정보
- `Email already registered` - 이미 등록된 이메일
- `Weak password` - 취약한 비밀번호 (8~20자, 특수문자 미포함)
- `Email not confirmed` - 이메일 미인증
- `Network error` - 네트워크 연결 오류

## Security Considerations

- 토큰은 세션스토리지에만 저장 (XSS 공격 방지를 위해 httpOnly 쿠키 사용 고려)
- 비밀번호 유효성 검증 (최소 8자, 특수문자 포함 등)
- CSRF 보호
- Rate limiting 고려
