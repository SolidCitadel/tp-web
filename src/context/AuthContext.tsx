'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import axios from 'axios';
import { usePathname } from "next/navigation";
import { PROTECTED_ROUTES } from '@/config/routes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const pathname = usePathname();
  const shouldCheckAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  useEffect(() => {
    if (shouldCheckAuth) {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  // 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    if (isChecking) return; // 이미 체크 중이면 중복 호출 방지
    
    setIsChecking(true);
    setIsLoading(true);
    try {
      const response = await axios.get('/api/user/me'); 
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // 401이면 reissue 시도
        try {
          const reissueRes = await fetch('/api/user/reissue', { method: 'POST', credentials: 'include' });
          if (reissueRes.ok) {
            // 재인증 성공: 다시 me 호출
            try {
              const retryRes = await axios.get('/api/user/me');
              if (retryRes.status === 200) {
                setUser(retryRes.data);
                setIsLoading(false);
                setIsChecking(false);
                return;
              }
            } catch {
              // 재시도 실패: 에러 페이지 이동
              window.location.href = `/error/401`;
            }
          } else {
            // 재인증 실패: 에러 페이지 이동
            window.location.href = `/error/401`;
          }
        } catch {
          window.location.href = `/error/401`;
        }
      } else if (axios.isAxiosError(error)) {
        window.location.href = `/error/${error.response?.status || 500}`;
      } else {
        window.location.href = `/error/500`;
      }
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  // 로그인 함수
  const login = (userData: User) => {
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await axios.post('/api/user/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
    }
  };

  const value = { user, isLoading, login, logout, checkAuthStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. useAuth 커스텀 훅 생성
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}