/**
 * ForgotPassword Component
 *
 * Provides functionality for users to request a password reset
 * Uses security utilities for secure token generation and validation
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';

/**
 * ForgotPassword component for requesting password reset
 *
 * @returns The ForgotPassword component
 */
const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Use the validation schema from ValidationUtils
  const formSchema = ValidationUtils.schemas.passwordResetRequest;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  /**
   * Handles form submission for password reset request
   *
   * @param values - The form values
   */
  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setResetError(null);
      setResetSuccess(false);

      // Sanitize inputs to prevent XSS
      SecurityUtils.sanitizeInput(values.email);

      // Generate CSRF token for form submission
      SecurityUtils.generateCsrfToken();

      // In a real application, this would call an API endpoint
      // For demo purposes, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a secure reset token
      const resetToken = SecurityUtils.generateSecureToken();
      console.log('Reset token generated:', resetToken);

      setResetSuccess(true);
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      setResetError(error?.message || 'Failed to send reset email. Please try again.');
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
          <h2 className='text-2xl font-bold text-gray-900'>Reset your password</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {resetSuccess ? (
          <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded relative flex flex-col items-center gap-2 text-center'>
            <CheckCircle size={40} className='text-green-500 mb-2' />
            <h3 className='font-medium'>Reset link sent!</h3>
            <p className='text-sm'>
              We've sent a password reset link to your email address. Please check your inbox and
              follow the instructions.
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

              {resetError && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2'>
                  <AlertTriangle size={16} />
                  <span>{resetError}</span>
                </div>
              )}

              <div className='flex flex-col space-y-4'>
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                  {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
                </Button>

                <div className='text-center'>
                  <Link
                    to='/login'
                    className='text-sm font-medium text-blue-600 hover:text-blue-500'
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
