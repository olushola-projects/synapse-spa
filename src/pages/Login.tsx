import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  const {
    login,
    loginWithGoogle,
    loginWithLinkedIn
  } = useAuth();
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
      SecurityUtils.generateCsrfToken();

      // Call login function
      await login({
        email: sanitizedEmail,
        password: values.password
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
  return <div className='min-h-screen flex bg-background'>
      {/* Left Side - Branding with Gradient */}
      <div className='hidden lg:flex lg:flex-1 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent'></div>
        
        {/* Animated background elements */}
        <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-soft'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float'></div>
        
        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white'>
          <div className='mb-8'>
            <Link to='/' className='inline-block'>
              <h1 className="tracking-tight mb-2 text-white font-semibold text-9xl">Synapses</h1>
            </Link>
            <div className="w-32 h-1 bg-white/60 rounded-full"></div>
          </div>
          
          <h2 className="leading-tight mb-6 text-shadow-md text-7xl font-normal">
            Welcome to the
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100'>
              Future of GRC
            </span>
          </h2>
          
          <p className="text-white/80 leading-relaxed mb-8 max-w-md text-lg font-medium">
            Leverage AI-driven insights to transform your governance, risk, and compliance operations.
          </p>
          
          <div className='flex items-center gap-4 text-white/60'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='text-sm'>99.9% Uptime</span>
            </div>
            <div className='w-1 h-4 bg-white/20'></div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
              <span className='text-sm'>SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/30'>
        <div className='w-full max-w-md space-y-8'>
          {/* Mobile Logo */}
          <div className='lg:hidden text-center mb-8'>
            <Link to='/' className='inline-block'>
              <h1 className='text-3xl font-bold text-primary mb-2'>Synapse</h1>
            </Link>
          </div>

          {/* Form Card */}
          <div className='bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8 space-y-8'>
            <div className='text-center space-y-2'>
              <h3 className='text-2xl font-bold text-foreground'>Sign In</h3>
              <p className='text-muted-foreground'>
                Enter your email and password to sign in!
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className='space-y-3'>
              <Button variant='outline' type='button' className='w-full h-12 flex items-center justify-center gap-3 border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02]' onClick={() => loginWithGoogle()}>
                <svg width='20' height='20' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
                  <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
                  <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
                  <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
                </svg>
                Sign in with Google
              </Button>
              
              <Button variant='outline' type='button' className='w-full h-12 flex items-center justify-center gap-3 border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02]' onClick={() => loginWithLinkedIn()}>
                <Linkedin size={20} className='text-blue-600' />
                Sign in with LinkedIn
              </Button>
            </div>

            {/* Divider */}
            <div className='relative my-8'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 text-muted-foreground bg-card'>or</span>
              </div>
            </div>

            {/* Email Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField control={form.control} name='email' render={({
                field
              }) => <FormItem>
                      <FormLabel className='text-sm font-medium text-foreground'>Email*</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input placeholder='mail@example.com' className='pl-10 h-12 border-2 focus:border-primary transition-colors' {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name='password' render={({
                field
              }) => <FormItem>
                      <FormLabel className='text-sm font-medium text-foreground'>Password*</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input type='password' placeholder='Min. 8 characters' className='pl-10 h-12 border-2 focus:border-primary transition-colors' {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <div className='flex items-center justify-between'>
                  <FormField control={form.control} name='rememberMe' render={({
                  field
                }) => <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className='text-sm font-normal text-foreground cursor-pointer'>
                          Keep me logged in
                        </FormLabel>
                      </FormItem>} />
                  
                  <Link to='/forgot-password' className='text-sm font-medium text-primary hover:underline'>
                    Forgot Password?
                  </Link>
                </div>

                {loginError && <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2'>
                    <AlertTriangle size={16} />
                    <span className='text-sm'>{loginError}</span>
                  </div>}

                <Button type='submit' className='w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02]' disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>

            {/* Sign up link */}
            <div className='text-center pt-4'>
              <p className='text-sm text-muted-foreground'>
                Not registered yet?{' '}
                <Link to='/register' className='font-medium text-primary hover:underline'>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Login;