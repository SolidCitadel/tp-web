import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface UseRequireAuthOptions {
  requiredRole?: 'USER' | 'ADMIN';
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { requiredRole, redirectTo = '/' } = options;

  useEffect(() => {
    if (!isLoading) {
      // 로그인되지 않은 경우
      if (!user) {
        router.push('/login');
        return;
      }

      // 특정 권한이 필요한 경우
      if (requiredRole && user.role !== requiredRole) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, isLoading, requiredRole, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthorized: !isLoading && user && (!requiredRole || user.role === requiredRole)
  };
} 