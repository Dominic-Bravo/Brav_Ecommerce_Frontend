// src/features/auth/components/role-guard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthSession } from '@/features/auth/providers/auth-provider';
// If using Option 1 (the hook), you can import useCurrentUser instead:
// import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackUrl?: string; // Where to redirect if unauthorized (for pages)
  fallbackComponent?: React.ReactNode; // What to show if unauthorized (for inline components)
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackUrl = '/unauthorized',
  fallbackComponent = null,
}: RoleGuardProps) {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAuthSession();
  
  // Assuming you added `user` or are using `useCurrentUser()`:
  // const { data: user, isLoading } = useCurrentUser();
  // For this example, let's assume your auth session or user hook exposes `user`:
  const { user, isLoadingUser } = useAuthSession(); 

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  // 1. Show loading state while checking session/user
  if (!isInitialized || isLoadingUser) {
    return <div>Loading permissions...</div>;
  }

  // 2. If user is authenticated but doesn't have the required role
  if (user && !allowedRoles.includes(user.role ?? '')) {
    // If used as a component guard, render fallback UI instead of redirecting
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    // Otherwise redirect to fallback page
    router.replace(fallbackUrl);
    return null;
  }

  // 3. Authorized! Render children
  return <>{children}</>;
}