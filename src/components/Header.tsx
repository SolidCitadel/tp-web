'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <h1>
          <Link 
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition duration-200" 
            href="/"
          >
            Transit Planner
          </Link>
        </h1>

        {/* 네비게이션 */}
        <nav>
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ) : user ? (
            // 로그인 상태일 때
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                안녕하세요, <span className="font-medium text-gray-900">{user.username}</span>님!
              </span>
              <Link 
                href="/mypage" 
                className="text-sm text-gray-600 hover:text-blue-600 transition duration-200 font-medium"
              >
                마이페이지
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 transition duration-200 font-medium cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그아웃 상태일 때
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-sm text-gray-600 hover:text-blue-600 transition duration-200 font-medium"
              >
                로그인
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition duration-200"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}