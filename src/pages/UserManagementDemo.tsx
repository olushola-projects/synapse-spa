import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApiService } from '@/services/user-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Shield,
  Key,
  Mail,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Clock
} from 'lucide-react';
import type { UserSession } from '@/types/user-api';

const UserManagementDemo: React.FC = () => {
  const {
    user,
    isAuthenticated,
    updateProfile,
    changePassword,
    refreshSession,
    getUserSessions,
    logoutAllSessions,
    resendVerificationEmail,
    forgotPassword,
    isLoading
  } = useAuth();

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [currentPasswordData, setCurrentPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: ''
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }, [user]);

  // Load user sessions
  const loadSessions = async () => {
    if (!isAuthenticated) return;

    setIsLoadingSessions(true);
    try {
      const userSessions = await getUserSessions();
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleChangePassword = async () => {
    if (currentPasswordData.newPassword !== currentPasswordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePassword(currentPasswordData.currentPassword, currentPasswordData.newPassword);
      setCurrentPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(forgotPasswordEmail);
      setForgotPasswordEmail('');
    } catch (error) {
      console.error('Failed to send forgot password email:', error);
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      await logoutAllSessions();
    } catch (error) {
      console.error('Failed to logout all sessions:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-background p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold'>User Management Demo</h1>
            <p className='text-lg text-muted-foreground'>
              Please log in to see the user management features.
            </p>
          </div>

          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              This demo page showcases the real backend user management integration with the
              ai-chat-backend API, including profile management, session handling, and password
              management.
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
          <h1 className='text-4xl font-bold'>User Management Demo</h1>
          <p className='text-lg text-muted-foreground'>
            Real backend integration with ai-chat-backend user management API
          </p>

          <div className='flex justify-center space-x-2'>
            <Badge variant='default' className='flex items-center space-x-1'>
              <Shield className='h-3 w-3' />
              <span>Backend API</span>
            </Badge>
            <Badge variant='outline' className='flex items-center space-x-1'>
              <User className='h-3 w-3' />
              <span>Real Authentication</span>
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue='profile' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
            <TabsTrigger value='sessions'>Sessions</TabsTrigger>
            <TabsTrigger value='admin'>Admin</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value='profile' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <User className='h-5 w-5' />
                  <span>User Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username'>Username</Label>
                    <Input
                      id='username'
                      value={profileData.username}
                      onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' value={user?.email || ''} disabled className='bg-muted' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      value={profileData.firstName}
                      onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      value={profileData.lastName}
                      onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Role:</span>
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Email Verified:</span>
                    {user?.emailVerified ? (
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='h-4 w-4 text-red-500' />
                    )}
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Account Status:</span>
                    <Badge variant='outline'>{user?.status}</Badge>
                  </div>
                </div>

                <div className='flex space-x-2'>
                  <Button onClick={handleUpdateProfile} disabled={isLoading}>
                    Update Profile
                  </Button>
                  {!user?.emailVerified && (
                    <Button
                      variant='outline'
                      onClick={resendVerificationEmail}
                      disabled={isLoading}
                    >
                      <Mail className='h-4 w-4 mr-2' />
                      Resend Verification
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value='security' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Key className='h-5 w-5' />
                    <span>Change Password</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='currentPassword'>Current Password</Label>
                    <Input
                      id='currentPassword'
                      type='password'
                      value={currentPasswordData.currentPassword}
                      onChange={e =>
                        setCurrentPasswordData({
                          ...currentPasswordData,
                          currentPassword: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <Input
                      id='newPassword'
                      type='password'
                      value={currentPasswordData.newPassword}
                      onChange={e =>
                        setCurrentPasswordData({
                          ...currentPasswordData,
                          newPassword: e.target.value
                        })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                    <Input
                      id='confirmPassword'
                      type='password'
                      value={currentPasswordData.confirmPassword}
                      onChange={e =>
                        setCurrentPasswordData({
                          ...currentPasswordData,
                          confirmPassword: e.target.value
                        })
                      }
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={isLoading} className='w-full'>
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Forgot Password */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Mail className='h-5 w-5' />
                    <span>Password Reset</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-sm text-muted-foreground'>
                    Send a password reset email to any email address.
                  </p>
                  <div className='space-y-2'>
                    <Label htmlFor='forgotEmail'>Email Address</Label>
                    <Input
                      id='forgotEmail'
                      type='email'
                      value={forgotPasswordEmail}
                      onChange={e => setForgotPasswordEmail(e.target.value)}
                      placeholder='Enter email address'
                    />
                  </div>
                  <Button
                    onClick={handleForgotPassword}
                    disabled={isLoading || !forgotPasswordEmail}
                    className='w-full'
                    variant='outline'
                  >
                    Send Reset Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value='sessions' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Shield className='h-5 w-5' />
                    <span>Active Sessions</span>
                  </div>
                  <div className='flex space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={loadSessions}
                      disabled={isLoadingSessions}
                    >
                      <RefreshCw className='h-4 w-4 mr-2' />
                      Refresh
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={refreshSession}
                      disabled={isLoading}
                    >
                      Refresh Current
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={handleLogoutAllSessions}
                      disabled={isLoading}
                    >
                      Logout All
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isLoadingSessions ? (
                  <div className='text-center py-4'>Loading sessions...</div>
                ) : sessions.length === 0 ? (
                  <div className='text-center py-4 text-muted-foreground'>
                    No sessions found or session loading not implemented
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {sessions.map(session => (
                      <div key={session.id} className='border rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <div className='flex items-center space-x-2'>
                              <Badge variant={session.isActive ? 'default' : 'secondary'}>
                                {session.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <span className='text-sm font-medium'>
                                {session.deviceInfo || 'Unknown Device'}
                              </span>
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              IP: {session.ipAddress || 'Unknown'} • Created:{' '}
                              {new Date(session.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3 inline mr-1' />
                            Expires: {new Date(session.expiresAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value='admin' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Users className='h-5 w-5' />
                  <span>Admin Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {user?.role === 'admin' ? (
                  <div className='space-y-4'>
                    <Alert>
                      <Settings className='h-4 w-4' />
                      <AlertDescription>
                        Admin features like user management, role assignment, and system monitoring
                        would be implemented here. The backend provides endpoints for:
                        <ul className='mt-2 space-y-1'>
                          <li>• GET /users - List all users</li>
                          <li>• GET /users/:id - Get user by ID</li>
                          <li>• PUT /users/:id - Update user</li>
                          <li>• DELETE /users/:id - Delete user</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                    <Button variant='outline' disabled>
                      User Management (Coming Soon)
                    </Button>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                      Admin access required. Your current role is "{user?.role}".
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagementDemo;


