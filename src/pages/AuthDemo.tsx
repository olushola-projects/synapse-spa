import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { AuthGuard } from '@/services/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Shield,
  Clock,
  Mail,
  Key,
  CheckCircle,
  XCircle,
  Info,
  Settings,
  Crown,
  Users
} from 'lucide-react';

const AuthDemo: React.FC = () => {
  const { user, session, isAuthenticated, logout, updateProfile, refreshSession } = useAuth();

  const guard = useAuthGuard();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      await updateProfile({
        name: `${user.name} (Updated)`,
        jurisdiction: ['EU', 'US']
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const testPermissions = ['read', 'write', 'delete', 'admin'];
  const testRoles = ['user', 'moderator', 'admin'];

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-background p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold'>Authentication Demo</h1>
            <p className='text-lg text-muted-foreground'>
              Please log in to see the authentication features in action.
            </p>
          </div>

          <Alert>
            <Info className='h-4 w-4' />
            <AlertDescription>
              This demo page showcases the enhanced authentication system with role-based access
              control, permission management, and session handling.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold'>Authentication Demo</h1>
          <p className='text-lg text-muted-foreground'>
            Interactive demonstration of the enhanced authentication system
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <User className='h-5 w-5' />
                <span>User Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src={guard.userAvatarUrl} />
                  <AvatarFallback>{guard.userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{guard.displayName}</p>
                  <p className='text-sm text-muted-foreground'>{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>User ID:</span>
                  <code className='text-xs bg-muted p-1 rounded'>{user?.id}</code>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Role:</span>
                  <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                    {user?.role}
                  </Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Email Verified:</span>
                  {guard.isVerified ? (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  ) : (
                    <XCircle className='h-4 w-4 text-red-500' />
                  )}
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Last Login:</span>
                  <span className='text-sm text-muted-foreground'>
                    {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Unknown'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className='space-y-2'>
                <p className='text-sm font-medium'>Permissions:</p>
                <div className='flex flex-wrap gap-1'>
                  {user?.permissions?.map(permission => (
                    <Badge key={permission} variant='outline' className='text-xs'>
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={isUpdating} className='w-full'>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Session Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Clock className='h-5 w-5' />
                <span>Session Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Status:</span>
                  <Badge variant={guard.isExpired ? 'destructive' : 'default'}>
                    {guard.isExpired ? 'Expired' : 'Active'}
                  </Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Time Left:</span>
                  <span className='text-sm font-mono'>{guard.timeLeft}</span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Expires At:</span>
                  <span className='text-sm text-muted-foreground'>
                    {session ? new Date(session.expires_at).toLocaleString() : 'Unknown'}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Token:</span>
                  <code className='text-xs bg-muted p-1 rounded max-w-32 truncate'>
                    {session?.access_token || 'None'}
                  </code>
                </div>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Button onClick={refreshSession} variant='outline' className='w-full'>
                  <Key className='h-4 w-4 mr-2' />
                  Refresh Session
                </Button>

                <Button onClick={logout} variant='destructive' className='w-full'>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Permission Tests */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Shield className='h-5 w-5' />
                <span>Permission Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Permission Checks:</p>
                {testPermissions.map(permission => (
                  <div key={permission} className='flex items-center justify-between'>
                    <span className='text-sm'>{permission}:</span>
                    {guard.hasPermission(permission) ? (
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='h-4 w-4 text-red-500' />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className='space-y-2'>
                <p className='text-sm font-medium'>Role Checks:</p>
                {testRoles.map(role => (
                  <div key={role} className='flex items-center justify-between'>
                    <span className='text-sm'>{role}:</span>
                    {guard.hasRole(role) ? (
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='h-4 w-4 text-red-500' />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className='space-y-2'>
                <p className='text-sm font-medium'>Computed Properties:</p>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <span>Can Write:</span>
                    {guard.canWrite ? (
                      <CheckCircle className='h-3 w-3 text-green-500' />
                    ) : (
                      <XCircle className='h-3 w-3 text-red-500' />
                    )}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>Can Delete:</span>
                    {guard.canDelete ? (
                      <CheckCircle className='h-3 w-3 text-green-500' />
                    ) : (
                      <XCircle className='h-3 w-3 text-red-500' />
                    )}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>Is Admin:</span>
                    {guard.isAdmin() ? (
                      <Crown className='h-3 w-3 text-yellow-500' />
                    ) : (
                      <XCircle className='h-3 w-3 text-red-500' />
                    )}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>Is Moderator:</span>
                    {guard.isModerator() ? (
                      <Users className='h-3 w-3 text-blue-500' />
                    ) : (
                      <XCircle className='h-3 w-3 text-red-500' />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Access Tests */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Settings className='h-5 w-5' />
                <span>Resource Access Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Admin Dashboard:</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Access:</span>
                    {guard.canAccess({ roles: ['admin'] }) ? (
                      <Badge className='text-xs'>Allowed</Badge>
                    ) : (
                      <Badge variant='destructive' className='text-xs'>
                        Denied
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <p className='text-sm font-medium'>User Settings:</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Access:</span>
                    {guard.canAccess({ permissions: ['write'] }) ? (
                      <Badge className='text-xs'>Allowed</Badge>
                    ) : (
                      <Badge variant='destructive' className='text-xs'>
                        Denied
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Verified User Content:</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Access:</span>
                    {guard.canAccess({ requireEmailVerification: true }) ? (
                      <Badge className='text-xs'>Allowed</Badge>
                    ) : (
                      <Badge variant='destructive' className='text-xs'>
                        Denied
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Moderator Tools:</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Access:</span>
                    {guard.canAccess({
                      roles: ['admin', 'moderator'],
                      permissions: ['write'],
                      requireEmailVerification: true
                    }) ? (
                      <Badge className='text-xs'>Allowed</Badge>
                    ) : (
                      <Badge variant='destructive' className='text-xs'>
                        Denied
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Validation Demo */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Key className='h-5 w-5' />
              <span>Password Validation Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[
                { password: 'weak', label: 'Weak Password' },
                { password: 'Medium123!', label: 'Medium Password' },
                { password: 'StrongPassword123!@#', label: 'Strong Password' }
              ].map(({ password, label }) => {
                const validation = AuthGuard.validatePassword(password);
                return (
                  <div key={password} className='space-y-2'>
                    <p className='text-sm font-medium'>{label}:</p>
                    <code className='text-xs bg-muted p-2 rounded block'>{password}</code>
                    <Badge
                      variant={
                        validation.strength === 'strong'
                          ? 'default'
                          : validation.strength === 'medium'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className='text-xs'
                    >
                      {validation.strength.toUpperCase()}
                    </Badge>
                    {validation.errors.length > 0 && (
                      <ul className='text-xs text-red-500 space-y-1'>
                        {validation.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDemo;


