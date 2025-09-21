import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // API 요청을 위한 CORS 헤더 설정
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          // Mixed Content 문제 해결을 위한 CSP 헤더
          {
            key: "Content-Security-Policy",
            value: "upgrade-insecure-requests; connect-src 'self' http://54.180.100.99:8080 https://54.180.100.99:8080;",
          },
        ],
      },
    ];
  },
  // 외부 API 호출을 위한 설정
  images: {
    domains: ["54.180.100.99"],
  },
};

export default nextConfig;
