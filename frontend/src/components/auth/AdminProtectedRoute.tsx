import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import AccessDeniedScreen from './AccessDeniedScreen';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  if (isInitializing || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen reason="unauthenticated" />;
  }

  if (isFetched && !isAdmin) {
    return <AccessDeniedScreen reason="unauthorized" />;
  }

  return <>{children}</>;
}
