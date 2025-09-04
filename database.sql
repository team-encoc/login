-- 사용자 프로필 테이블 (auth.users의 확장 정보)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  birth_date VARCHAR(6), -- YYMMDD 형식
  phone VARCHAR(20),
  marketing_agreed BOOLEAN NOT NULL DEFAULT false,
  login_type VARCHAR(20) NOT NULL DEFAULT 'default' CHECK (login_type IN ('default', 'kakao', 'google', 'naver')),
  email_certified BOOLEAN NOT NULL DEFAULT false,
  connected_device_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 데이터만 읽기/수정 가능
CREATE POLICY "Users can read own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 회원가입 시 자동으로 user_profiles 레코드 생성하는 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    name, 
    gender, 
    birth_date, 
    phone, 
    marketing_agreed, 
    login_type,
    email_certified
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'birthDate',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'marketingAgreed')::boolean, false),
    COALESCE(NEW.raw_user_meta_data->>'type', 'default'),
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성: auth.users에 새 사용자 생성 시 user_profiles에도 레코드 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 이메일 인증 상태 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- 이메일 인증 상태가 변경된 경우 user_profiles 테이블도 업데이트
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.user_profiles 
    SET email_certified = true, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성: auth.users의 이메일 인증 상태 변경 시 user_profiles도 업데이트
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_phone ON public.user_profiles(phone);
CREATE INDEX idx_user_profiles_login_type ON public.user_profiles(login_type);