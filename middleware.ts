import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PROTECTED_ROUTES } from '@/config/routes';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const token = cookies.get('Authorization')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // exp는 초 단위
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 정상 토큰이면 통과
    return NextResponse.next();
  } catch (e) {
    // 토큰 파싱 실패 시 로그인으로
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: PROTECTED_ROUTES.map(route => `${route}/:path*`),
}; 