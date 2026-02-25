import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { ShieldAlert, Lock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface AccessDeniedScreenProps {
  reason?: 'unauthenticated' | 'unauthorized';
}

export default function AccessDeniedScreen({ reason = 'unauthenticated' }: AccessDeniedScreenProps) {
  const { login } = useInternetIdentity();
  const navigate = useNavigate();

  const isUnauthenticated = reason === 'unauthenticated';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            {isUnauthenticated ? (
              <ShieldAlert className="h-8 w-8 text-destructive" />
            ) : (
              <Lock className="h-8 w-8 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isUnauthenticated ? 'Access Denied' : 'Permission Denied'}
          </CardTitle>
          <CardDescription>
            {isUnauthenticated
              ? 'You need to be logged in to access the HR Dashboard.'
              : 'You do not have permission to access this area. Please contact an administrator if you believe this is an error.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isUnauthenticated ? (
            <Button onClick={login} className="w-full">
              Login to Continue
            </Button>
          ) : (
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Return to Home
            </Button>
          )}
          <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
