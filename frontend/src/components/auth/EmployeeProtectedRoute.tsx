import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsEmployeeAssociated } from '@/hooks/useQueries';
import AccessDeniedScreen from './AccessDeniedScreen';

interface EmployeeProtectedRouteProps {
  children: ReactNode;
}

export default function EmployeeProtectedRoute({ children }: EmployeeProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isEmployee, isLoading: isCheckingEmployee } = useIsEmployeeAssociated();

  // Show loading state while checking authentication and employee association
  if (isInitializing || isCheckingEmployee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!identity) {
    return <AccessDeniedScreen reason="unauthenticated" />;
  }

  // Authenticated but not associated with an employee
  if (!isEmployee) {
    return <AccessDeniedScreen reason="unauthorized" />;
  }

  // Authenticated and associated with an employee
  return <>{children}</>;
}
