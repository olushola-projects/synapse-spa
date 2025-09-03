import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/features/dashboard/DashboardLayout';

// Define the jurisdictions available
const jurisdictions = [
  { id: 'eu', label: 'European Union (EU)' },
  { id: 'uk', label: 'United Kingdom (UK)' },
  { id: 'us', label: 'United States (US)' },
  { id: 'sg', label: 'Singapore' },
  { id: 'hk', label: 'Hong Kong' },
  { id: 'au', label: 'Australia' },
  { id: 'ca', label: 'Canada' }
];

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  jurisdictions: z.array(z.string()).optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      jurisdictions: user?.preferences?.jurisdictions || []
    }
  });

  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        jurisdictions: user.preferences?.jurisdictions || []
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        preferences: {
          ...user?.preferences,
          jurisdictions: data.jurisdictions
        }
      };
      await updateProfile(updateData);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-full'>
          <div className='animate-pulse'>Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='container max-w-4xl py-8'>
        <h1 className='text-3xl font-bold mb-6'>Profile Settings</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-1'>
            <Card>
              <CardHeader className='text-center'>
                <Avatar className='w-24 h-24 mx-auto mb-4'>
                  <AvatarImage
                    src={user.avatar_url || '/placeholder.svg'}
                    alt={user.displayName || `${user.firstName} ${user.lastName}` || user.username}
                  />
                  <AvatarFallback>
                    {(user.displayName || user.firstName || user.username).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>
                  {user.displayName || `${user.firstName} ${user.lastName}` || user.username}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground'>
                  <div className='flex justify-between mb-2'>
                    <span>Member since:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Last login:</span>
                    <span>
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className='flex justify-between mt-2'>
                    <span>Email verified:</span>
                    <span className={user.emailVerified ? 'text-green-600' : 'text-orange-600'}>
                      {user.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className='flex justify-between mt-2'>
                    <span>Role:</span>
                    <span className='capitalize'>{user.role}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' className='w-full'>
                  Change Avatar
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className='md:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='username'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>This is your unique username</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>You cannot change your email address</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className='my-6' />

                    <div>
                      <h3 className='text-lg font-medium mb-3'>Jurisdictional Interests</h3>
                      <p className='text-sm text-muted-foreground mb-4'>
                        Select the jurisdictions you're interested in for content and regulatory
                        updates
                      </p>

                      <FormField
                        control={form.control}
                        name='jurisdictions'
                        render={() => (
                          <FormItem>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                              {jurisdictions.map(item => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name='jurisdictions'
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className='flex flex-row items-start space-x-3 space-y-0'
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={checked => {
                                              return checked
                                                ? field.onChange([...(field.value || []), item.id])
                                                : field.onChange(
                                                    field.value?.filter(value => value !== item.id)
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className='font-normal'>{item.label}</FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type='submit'>Save changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
