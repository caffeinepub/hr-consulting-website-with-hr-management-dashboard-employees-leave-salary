import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';

interface RoleProtectedRouteProps {
  children: ReactNode;
}

export default function RoleProtectedRoute({ children }: RoleProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();

  // Show loading while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!identity) {
    return <AccessDeniedScreen reason="unauthenticated" />;
  }

  // Authenticated user - render protected content
  return <>{children}</>;
}
