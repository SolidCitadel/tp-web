'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // 로그인된 사용자인 경우
        if (user.role === 'ADMIN') {
          // 관리자인 경우 관리자 페이지로
          router.push('/admin');
        } else {
          // 일반 사용자인 경우 메인 페이지로 (나중에 구현)
          router.push('/dashboard');
        }
      } else {
        // 로그인되지 않은 사용자는 로그인 페이지로
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">리디렉션 중...</p>
      </div>
    </div>
  );
}
