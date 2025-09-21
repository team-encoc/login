# BlueSonix Login Web App

BlueSonix 프로젝트를 위한 Next.js 기반 로그인 웹 애플리케이션입니다.

## 개요

이 웹 애플리케이션은 BlueSonix 백엔드 API (http://54.180.100.99:8080)와 연동하여 사용자 인증을 처리합니다.

## 기능

- 사용자 로그인
- 사용자 회원가입
- 세션 관리
- 대시보드

## 기술 스택

- **Framework**: Next.js 15
- **UI**: Tailwind CSS, Radix UI
- **Forms**: React Hook Form + Zod
- **Authentication**: BlueSonix Backend API
- **State Management**: React Context
- **Notifications**: Sonner

## 환경 설정

`.env.local` 파일에 다음 환경변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://54.180.100.99:8080
```

## 시작하기

### 개발 서버 실행

```bash
npm install
npm run dev
```

또는

```bash
yarn install
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## API 연동

이 애플리케이션은 BlueSonix 백엔드와 다음 API 엔드포인트를 사용합니다:

- `POST /api/auth/login` - 사용자 로그인
- `POST /api/auth/register` - 사용자 회원가입
- `POST /api/auth/logout` - 사용자 로그아웃

## 프로젝트 구조

```
src/
├── app/               # Next.js App Router 페이지
├── components/        # UI 컴포넌트
├── context/           # React Context (인증)
├── lib/               # 유틸리티 라이브러리 (API 클라이언트)
├── types/             # TypeScript 타입 정의
└── utils/             # 유틸리티 함수
```

## 배포

Vercel, Netlify 또는 다른 Next.js 지원 플랫폼에 배포할 수 있습니다.
