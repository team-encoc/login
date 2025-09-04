"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Home } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card className="w-64 h-screen rounded-none border-r">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          사용자 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">이메일:</span>
            <p className="text-gray-600 break-all">{user.email}</p>
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
          <div className="text-sm">
            <span className="font-medium">이메일 인증:</span>
            <p className="text-gray-600">{user.emailCertified ? "인증됨" : "미인증"}</p>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          {/* <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              대시보드
            </Button>
          </Link> */}

          <Button variant="destructive" className="w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
