import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { LoginRequest, LoginResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Supabase를 사용한 로그인
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      );
    }

    // user_profiles 테이블에서 추가 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // LoginResponse 형식으로 변환
    const loginResponse: LoginResponse = {
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

    return NextResponse.json(loginResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}