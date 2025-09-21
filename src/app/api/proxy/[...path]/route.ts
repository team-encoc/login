import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://54.180.100.99:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams.path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join('/');
    const targetUrl = `${API_BASE_URL}/${path}`;
    
    // 요청 본문 가져오기
    let body = undefined;
    if (method !== 'GET') {
      try {
        body = await request.text();
      } catch {
        body = undefined;
      }
    }

    // 헤더 복사 (필요한 것만)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Authorization 헤더가 있으면 복사
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // 외부 API 호출
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const responseData = await response.text();
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}