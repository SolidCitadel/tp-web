'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { browserApiClient } from '@/lib/api-client';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 애플리케이션 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await browserApiClient.get('/api/me'); 
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = (userData: User) => {
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await browserApiClient.post('/api/logout');
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