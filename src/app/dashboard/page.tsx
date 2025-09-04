'use client';

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/auth/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">대시보드</h1>
            <p className="text-gray-600">안녕하세요, {user.name || user.email}님!</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>계정 정보</CardTitle>
                <CardDescription>현재 로그인된 계정 정보</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">이메일:</span>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                {user.name && (
                  <div className="text-sm">
                    <span className="font-medium">이름:</span>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium">로그인 타입:</span>
                  <p className="text-gray-600">{user.loginType}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>인증 상태</CardTitle>
                <CardDescription>계정 인증 및 보안 상태</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">이메일 인증:</span>
                  <p className={`${user.emailCertified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.emailCertified ? '인증됨' : '미인증'}
                  </p>
                </div>
                <div className="text-sm">
                  <span className="font-medium">마케팅 수신:</span>
                  <p className="text-gray-600">
                    {user.marketingAgreed ? '동의' : '거부'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {(user.gender || user.birthDate || user.phone) && (
              <Card>
                <CardHeader>
                  <CardTitle>추가 정보</CardTitle>
                  <CardDescription>선택적으로 입력된 정보</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.gender && (
                    <div className="text-sm">
                      <span className="font-medium">성별:</span>
                      <p className="text-gray-600">
                        {user.gender === 'male' ? '남성' : '여성'}
                      </p>
                    </div>
                  )}
                  {user.birthDate && (
                    <div className="text-sm">
                      <span className="font-medium">생년월일:</span>
                      <p className="text-gray-600">{user.birthDate}</p>
                    </div>
                  )}
                  {user.phone && (
                    <div className="text-sm">
                      <span className="font-medium">전화번호:</span>
                      <p className="text-gray-600">{user.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}