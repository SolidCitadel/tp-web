import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8081';

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}
export async function POST(req: NextRequest) {
  return proxyRequest(req);
}
export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}
export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}
export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

async function proxyRequest(req: NextRequest) {
  const url = BACKEND_URL + req.nextUrl.pathname + (req.nextUrl.search || '');

  // 헤더와 바디를 별도 파싱 없이 그대로 전달
  const apiRes = await fetch(url, {
    method: req.method,
    headers: {
      ...Object.fromEntries(req.headers),
      host: new URL(BACKEND_URL).host,
    },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text(),
    redirect: 'manual',
  });

  // 응답도 그대로 전달
  const resHeaders = new Headers(apiRes.headers);
  const setCookie = apiRes.headers.get('set-cookie');
  if (setCookie) {
    if (Array.isArray(setCookie)) {
      setCookie.forEach(cookie => resHeaders.append('set-cookie', cookie));
    } else {
      resHeaders.set('set-cookie', String(setCookie));
    }
  }

  return new NextResponse(apiRes.body, {
    status: apiRes.status,
    headers: resHeaders,
  });
}