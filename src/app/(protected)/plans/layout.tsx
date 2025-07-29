'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useRequireAuth({ requiredRole: 'USER' });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // 리디렉션 중
  }

  return <div className="flex-1">{children}</div>;
} 