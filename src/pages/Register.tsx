import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Lock,
  User,
  AlertTriangle,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';

// Use the validation schema from ValidationUtils
const formSchema = ValidationUtils.schemas.register;

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: false,
    errors: []
  });

  // Clear any previous registration errors when component mounts
  useEffect(() => {
    setRegisterError(null);
  }, []);

  // Update local error state when auth context error changes
  useEffect(() => {
    if (error) {
      setRegisterError(error);
    }
  }, [error]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setRegisterError(null);

      // Validate password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(values.password);
      if (!passwordValidation.isValid) {
        setPasswordStrength(passwordValidation);
        throw new Error('Password does not meet security requirements');
      }

      // Sanitize inputs to prevent XSS
      const sanitizedName = SecurityUtils.sanitizeInput(values.name);
      const sanitizedEmail = SecurityUtils.sanitizeInput(values.email);

      // Generate CSRF token for form submission
      SecurityUtils.generateCsrfToken();

      const registerData = {
        email: sanitizedEmail,
        password: values.password,
        username: sanitizedName.toLowerCase().replace(/\s+/g, ''),
        firstName: sanitizedName.split(' ')[0] || sanitizedName,
        lastName: sanitizedName.split(' ').slice(1).join(' ') || '',
        acceptTerms: values.acceptTerms
      };

      await register(registerData);

      // Show success message
      setRegistrationSuccess(true);

      toast({
        title: 'Registration Successful!',
        description:
          'Your account has been created. Please check your email to verify your account, then sign in.',
        variant: 'default'
      });

      // Redirect to login page after a brief delay
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Account created successfully! Please verify your email and sign in.'
          }
        });
      }, 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      setRegisterError(errorMessage);

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success screen
  if (registrationSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl p-8 rounded-2xl text-center'>
          <div className='w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-8 h-8 text-green-600' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-foreground mb-2'>
              Account Created Successfully!
            </h2>
            <p className='text-muted-foreground'>
              Please check your email to verify your account, then sign in to continue.
            </p>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className='w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

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
              <h1 className='tracking-tight mb-2 font-semibold text-9xl text-white'>Synapse</h1>
            </Link>
            <div className='w-52 h-1.5 rounded-full bg-white'></div>
          </div>

          <h2 className='leading-tight mb-6 text-shadow-md text-7xl font-normal text-white'>
            Join the
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100'>
              GRC Revolution
            </span>
          </h2>

          <p className='leading-relaxed mb-8 max-w-md text-lg font-medium text-white'>
            Create your account and start leveraging AI-powered insights for governance, risk, and
            compliance operations.
          </p>

          <div className='flex items-center gap-4 text-white/60'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='text-sm'>Secure Registration</span>
            </div>
            <div className='w-1 h-4 bg-white/20'></div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
              <span className='text-sm'>Email Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/30'>
        <div className='w-full max-w-md space-y-8'>
          {/* Mobile Logo */}
          <div className='lg:hidden text-center mb-8'>
            <Link to='/' className='inline-block'>
              <h1 className='text-3xl font-bold text-primary mb-2'>Synapse</h1>
            </Link>
          </div>

          {/* Form Card */}
          <div className='bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl p-8 space-y-8 rounded-2xl'>
            <div className='text-center space-y-2'>
              <h3 className='text-foreground font-semibold text-4xl'>Create Account</h3>
              <p className='text-muted-foreground font-extralight'>
                Enter your information to create your account
              </p>
              <p className='text-sm text-muted-foreground'>
                Already have an account?{' '}
                <Link to='/login' className='font-medium text-primary hover:underline'>
                  Sign in here
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-foreground'>
                        Full Name*
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <User className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input
                            placeholder='John Doe'
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
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-foreground'>
                        Email Address*
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input
                            placeholder='you@example.com'
                            className='pl-10 h-12 border-2 focus:border-primary transition-colors'
                            type='email'
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
                            onChange={e => {
                              field.onChange(e);
                              // Check password strength as user types
                              setPasswordStrength(
                                SecurityUtils.validatePasswordStrength(e.target.value)
                              );
                            }}
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
                      {field.value && field.value.length > 0 && (
                        <div className='mt-2'>
                          <div className='flex items-center gap-1 text-xs'>
                            <ShieldCheck
                              size={14}
                              className={
                                passwordStrength.isValid
                                  ? 'text-green-500'
                                  : 'text-muted-foreground'
                              }
                            />
                            <span
                              className={
                                passwordStrength.isValid
                                  ? 'text-green-500'
                                  : 'text-muted-foreground'
                              }
                            >
                              {passwordStrength.isValid
                                ? 'Password meets security requirements'
                                : 'Password strength'}
                            </span>
                          </div>
                          {!passwordStrength.isValid && passwordStrength.errors.length > 0 && (
                            <ul className='text-xs text-amber-600 mt-1 list-disc pl-5'>
                              {passwordStrength.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-foreground'>
                        Confirm Password*
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm your password'
                            className='pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors'
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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

                <FormField
                  control={form.control}
                  name='acceptTerms'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel className='text-sm text-foreground cursor-pointer'>
                          I accept the{' '}
                          <Link
                            to='/legal/terms'
                            className='text-primary hover:underline font-medium'
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            to='/legal/privacy'
                            className='text-primary hover:underline font-medium'
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {registerError && (
                  <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2'>
                    <AlertTriangle size={16} />
                    <span className='text-sm'>{registerError}</span>
                  </div>
                )}

                <Button
                  type='submit'
                  className='w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md hover:drop-shadow-md transition-all duration-200 font-normal text-lg'
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
