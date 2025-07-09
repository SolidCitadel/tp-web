'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/signup', {
        username,
        password,
      });

      if (response.status === 200) {
        alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
        router.push('/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // 백엔드에서 보낸 에러 메시지(중복, 유효성 검사 등)를 표시
        setError(err.response.data);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600 text-sm">새로운 계정을 만들어 서비스를 이용하세요</p>
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
                placeholder="사용할 아이디를 입력하세요"
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
                <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>
              </div>
            )}

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  가입 중...
                </div>
              ) : (
                '가입하기'
              )}
            </button>
          </form>

          {/* 추가 링크 */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}