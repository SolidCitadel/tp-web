import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. 미들웨어가 실행될 특정 경로를 지정하는 Matcher 설정
export const config = {
  matcher: [
    /*
     * 아래와 일치하는 경로를 제외한 모든 요청 경로와 일치합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - /login (로그인 페이지 자체)
     * - /signup (회원가입 페이지 자체)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
};

// 2. 미들웨어 함수
export function middleware(request: NextRequest) {
  // 3. 요청 헤더에서 쿠키를 가져옵니다.
  const accessToken = request.cookies.get('Authorization')?.value;

  // 4. 접근하려는 페이지의 URL을 가져옵니다.
  const { pathname } = request.nextUrl;

  // 5. 보호된 경로 배열을 정의합니다.
  const protectedPaths = ['/mypage', '/dashboard', '/admin'];

  // 6. 현재 경로가 보호된 경로인지 확인합니다.
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // 7. 보호된 경로에 접근하려는데 토큰(로그인 상태)이 없는 경우
  if (isProtectedPath && !accessToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 8. 그 외의 경우는 요청을 그대로 통과시킵니다.
  return NextResponse.next();
}