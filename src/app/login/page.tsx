'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { browserApiClient } from '@/lib/api-client';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await browserApiClient.post('/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        console.log('로그인 성공:', response.data);
        await checkAuthStatus(); // 인증 상태 재확인, 전역 상태 업데이트
        router.push('/'); 
      }
    } catch (err) {
        console.error('로그인 실패:', err);

        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data as string); 
          } else {
            setError('서버에 연결할 수 없습니다.');
          }
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* 헤더 */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600 text-sm">계정에 로그인하여 서비스를 이용하세요</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                아이디
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                placeholder="아이디를 입력하세요"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* 추가 링크 */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              계정이 없으신가요?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}