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
import { Linkedin, Mail, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';

// Use the validation schema from ValidationUtils
const formSchema = ValidationUtils.schemas.login;
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Clear any previous login errors when component mounts
  useEffect(() => {
    setLoginError(null);
  }, []);

  // Update local error state when auth context error changes
  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
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

      // Call login function with rememberMe option
      await login(
        {
          email: sanitizedEmail,
          password: values.password
        },
        values.rememberMe
      );

      // Show success toast
      toast({
        title: 'Login Successful',
        description: 'Welcome back! You have been successfully logged in.',
        variant: 'default'
      });

      // Navigate to the intended page or dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error?.message || 'Invalid email or password. Please try again.';
      setLoginError(errorMessage);

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='min-h-screen flex bg-background'>
      {/* Left Side - Branding with Gradient */}
      <div className='hidden lg:flex lg:flex-1 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent px-[30px]'></div>

        {/* Animated background elements */}
        <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-soft'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float'></div>

        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white'>
          <div className='mb-8'>
            <Link to='/' className='inline-block'>
              <h1 className='tracking-tight mb-2 font-semibold text-9xl text-white'>Synapses</h1>
            </Link>
            <div className='w-52 h-1.5 rounded-full bg-white'></div>
          </div>

          <h2 className='leading-tight mb-6 text-shadow-md text-7xl font-normal text-white'>
            Welcome to the
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100'>
              Future of GRC
            </span>
          </h2>

          <p className='leading-relaxed mb-8 max-w-md text-lg font-medium text-white'>
            Leverage AI-driven insights to transform your governance, risk, and compliance
            operations.
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
          <div className='bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl p-8 space-y-8 rounded-2xl py-[162px] px-[72px] mx-0 my-0'>
            <div className='text-center space-y-2'>
              <h3 className='text-foreground font-semibold text-4xl'>Sign In</h3>
              <p className='text-muted-foreground font-extralight'>
                Enter your email and password to sign in!
              </p>
            </div>

            {/* Email Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-foreground'>Email*</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input
                            placeholder='mail@example.com'
                            className='pl-10 h-12 border-2 focus:border-primary transition-colors'
                            {...field}
                          />
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
                      <FormLabel className='text-sm font-medium text-foreground'>
                        Password*
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Min. 8 characters'
                            className='pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors'
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4 text-muted-foreground' />
                            ) : (
                              <Eye className='h-4 w-4 text-muted-foreground' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex items-center justify-between'>
                  <FormField
                    control={form.control}
                    name='rememberMe'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className='text-sm font-normal text-foreground cursor-pointer'>
                          Keep me logged in
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Link
                    to='/forgot-password'
                    className='text-sm font-medium text-primary hover:underline'
                  >
                    Forgot Password?
                  </Link>
                </div>

                {loginError && (
                  <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2'>
                    <AlertTriangle size={16} />
                    <span className='text-sm'>{loginError}</span>
                  </div>
                )}

                <Button
                  type='submit'
                  disabled={isSubmitting || isLoading}
                  className='bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white gap-x-20 shadow-md hover:drop-shadow-md transition-all duration-200 px-[125px] font-normal text-lg w-full'
                >
                  {isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>

            {/* Sign up link */}
            <div className='text-center pt-4'>
              <p className='text-muted-foreground text-base'>
                Not registered yet?{' '}
                <Link to='/register' className='font-medium text-primary hover:underline'>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
