import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Mail, Lock, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';

// Use the validation schema from ValidationUtils
const formSchema = ValidationUtils.schemas.login;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginWithLinkedIn, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check for redirect path from protected routes
  useEffect(() => {
    // Clear any previous login errors when component mounts
    setLoginError(null);
  }, []);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);

      // Sanitize inputs to prevent XSS
      const sanitizedEmail = SecurityUtils.sanitizeInput(values.email);

      // Generate CSRF token for form submission
      const csrfToken = SecurityUtils.generateCsrfToken();

      // Call login function
      await login({
        email: sanitizedEmail,
        password: values.password,
        rememberMe: values.rememberMe || false,
        csrfToken
      });

      // Get redirect path if available, otherwise go to dashboard
      const redirectPath = SecurityUtils.storage.get<string>('redirectPath') || '/dashboard';
      SecurityUtils.storage.remove('redirectPath'); // Clear after use

      navigate(redirectPath);
    } catch (error: any) {
      console.error('Login failed:', error);
      setLoginError(error?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
        <div className='text-center'>
          <Link to='/' className='inline-block'>
            <h1 className='text-xl font-bold text-blue-700 tracking-tight mb-2'>Synapse</h1>
          </Link>
          <h2 className='text-2xl font-bold text-gray-900'>Sign in to your account</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Or{' '}
            <Link to='/register' className='font-medium text-blue-600 hover:text-blue-500'>
              create a new account
            </Link>
          </p>
        </div>

        <div className='flex flex-col space-y-4'>
          <Button
            variant='outline'
            type='button'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => loginWithLinkedIn()}
          >
            <Linkedin size={16} />
            Sign in with LinkedIn
          </Button>
          <Button
            variant='outline'
            type='button'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => loginWithGoogle()}
          >
            <svg width='16' height='16' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Sign in with Google
          </Button>
        </div>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <Separator className='w-full' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 text-gray-500 bg-white'>Or continue with</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                      <Input placeholder='you@example.com' className='pl-10' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                      <Input type='password' placeholder='******' className='pl-10' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='rememberMe'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 py-1'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm font-normal'>Remember me for 7 days</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between'>
              <div className='text-sm'>
                <Link
                  to='/forgot-password'
                  className='font-medium text-blue-600 hover:text-blue-500'
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {loginError && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2'>
                <AlertTriangle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
