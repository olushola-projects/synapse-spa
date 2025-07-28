/**
 * ResetPassword Component
 *
 * Provides functionality for users to reset their password
 * Uses security utilities for secure password validation and reset
 */

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
import { Lock, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';

/**
 * ResetPassword component for setting a new password
 *
 * @returns The ResetPassword component
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: false,
    errors: []
  });

  // Use the validation schema from ValidationUtils
  const formSchema = ValidationUtils.schemas.passwordReset;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Extract and validate token from URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');

    if (!resetToken) {
      setResetError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    // In a real application, you would validate the token with your backend
    // For demo purposes, we'll simulate token validation
    const validateToken = async () => {
      try {
        // Simulate API call to validate token
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo, we'll consider any token with length > 10 as valid
        const isValid = resetToken.length > 10;

        if (isValid) {
          setToken(resetToken);
          setTokenValid(true);
        } else {
          setResetError(
            'Invalid or expired reset token. Please request a new password reset link.'
          );
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        setResetError('Failed to validate reset token. Please try again.');
      }
    };

    validateToken();
  }, [location.search]);

  /**
   * Handles form submission for password reset
   *
   * @param values - The form values
   */
  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setResetError(null);

      // Validate password strength
      const passwordValidation = SecurityUtils.validatePasswordStrength(values.password);
      if (!passwordValidation.isValid) {
        setPasswordStrength(passwordValidation);
        throw new Error('Password does not meet security requirements');
      }

      // Generate CSRF token for form submission
      const csrfToken = SecurityUtils.generateCsrfToken();

      // In a real application, this would call an API endpoint with the token and new password
      // For demo purposes, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      setResetError(error?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If token is invalid, show error message
  if (resetError && !tokenValid) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
          <div className='text-center'>
            <Link to='/' className='inline-block'>
              <h1 className='text-xl font-bold text-blue-700 tracking-tight mb-2'>Synapse</h1>
            </Link>
            <h2 className='text-2xl font-bold text-gray-900'>Reset your password</h2>
          </div>

          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded relative flex flex-col items-center gap-2 text-center'>
            <AlertTriangle size={40} className='text-red-500 mb-2' />
            <h3 className='font-medium'>Invalid Reset Link</h3>
            <p className='text-sm'>{resetError}</p>
            <Button asChild className='mt-4'>
              <Link to='/forgot-password'>Request New Reset Link</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
        <div className='text-center'>
          <Link to='/' className='inline-block'>
            <h1 className='text-xl font-bold text-blue-700 tracking-tight mb-2'>Synapse</h1>
          </Link>
          <h2 className='text-2xl font-bold text-gray-900'>Reset your password</h2>
          <p className='mt-2 text-sm text-gray-600'>Enter your new password below.</p>
        </div>

        {resetSuccess ? (
          <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded relative flex flex-col items-center gap-2 text-center'>
            <CheckCircle size={40} className='text-green-500 mb-2' />
            <h3 className='font-medium'>Password Reset Successful!</h3>
            <p className='text-sm'>
              Your password has been successfully reset. You will be redirected to the login page
              shortly.
            </p>
            <Button asChild className='mt-4'>
              <Link to='/login'>Return to login</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                        <Input
                          type='password'
                          placeholder='******'
                          className='pl-10'
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            // Check password strength as user types
                            setPasswordStrength(
                              SecurityUtils.validatePasswordStrength(e.target.value)
                            );
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    {field.value && field.value.length > 0 && (
                      <div className='mt-2'>
                        <div className='flex items-center gap-1 text-xs'>
                          <ShieldCheck
                            size={14}
                            className={
                              passwordStrength.isValid ? 'text-green-500' : 'text-gray-400'
                            }
                          />
                          <span
                            className={
                              passwordStrength.isValid ? 'text-green-500' : 'text-gray-500'
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
                    <FormLabel>Confirm New Password</FormLabel>
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

              {resetError && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2'>
                  <AlertTriangle size={16} />
                  <span>{resetError}</span>
                </div>
              )}

              <Button type='submit' className='w-full' disabled={isSubmitting || !tokenValid}>
                {isSubmitting ? 'Resetting password...' : 'Reset password'}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
