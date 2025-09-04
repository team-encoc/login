"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">어군탐지기 로그인</CardTitle>
          <CardDescription>로그인하거나 새 계정을 만드세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login">
            <Button className="w-full" size="lg">
              <LogIn className="h-4 w-4 mr-2" />
              로그인
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="w-full" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              회원가입
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
