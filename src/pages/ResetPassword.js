import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [, setToken] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
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
  const onSubmit = async values => {
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
      SecurityUtils.generateCsrfToken();
      // In a real application, this would call an API endpoint with the token and new password
      // For demo purposes, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResetSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setResetError(error?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // If token is invalid, show error message
  if (resetError && !tokenValid) {
    return _jsx('div', {
      className:
        'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8',
      children: _jsxs('div', {
        className: 'max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg',
        children: [
          _jsxs('div', {
            className: 'text-center',
            children: [
              _jsx(Link, {
                to: '/',
                className: 'inline-block',
                children: _jsx('h1', {
                  className: 'text-xl font-bold text-blue-700 tracking-tight mb-2',
                  children: 'Synapse'
                })
              }),
              _jsx('h2', {
                className: 'text-2xl font-bold text-gray-900',
                children: 'Reset your password'
              })
            ]
          }),
          _jsxs('div', {
            className:
              'bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded relative flex flex-col items-center gap-2 text-center',
            children: [
              _jsx(AlertTriangle, { size: 40, className: 'text-red-500 mb-2' }),
              _jsx('h3', { className: 'font-medium', children: 'Invalid Reset Link' }),
              _jsx('p', { className: 'text-sm', children: resetError }),
              _jsx(Button, {
                asChild: true,
                className: 'mt-4',
                children: _jsx(Link, { to: '/forgot-password', children: 'Request New Reset Link' })
              })
            ]
          })
        ]
      })
    });
  }
  return _jsx('div', {
    className:
      'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8',
    children: _jsxs('div', {
      className: 'max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg',
      children: [
        _jsxs('div', {
          className: 'text-center',
          children: [
            _jsx(Link, {
              to: '/',
              className: 'inline-block',
              children: _jsx('h1', {
                className: 'text-xl font-bold text-blue-700 tracking-tight mb-2',
                children: 'Synapse'
              })
            }),
            _jsx('h2', {
              className: 'text-2xl font-bold text-gray-900',
              children: 'Reset your password'
            }),
            _jsx('p', {
              className: 'mt-2 text-sm text-gray-600',
              children: 'Enter your new password below.'
            })
          ]
        }),
        resetSuccess
          ? _jsxs('div', {
              className:
                'bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded relative flex flex-col items-center gap-2 text-center',
              children: [
                _jsx(CheckCircle, { size: 40, className: 'text-green-500 mb-2' }),
                _jsx('h3', { className: 'font-medium', children: 'Password Reset Successful!' }),
                _jsx('p', {
                  className: 'text-sm',
                  children:
                    'Your password has been successfully reset. You will be redirected to the login page shortly.'
                }),
                _jsx(Button, {
                  asChild: true,
                  className: 'mt-4',
                  children: _jsx(Link, { to: '/login', children: 'Return to login' })
                })
              ]
            })
          : _jsx(Form, {
              ...form,
              children: _jsxs('form', {
                onSubmit: form.handleSubmit(onSubmit),
                className: 'space-y-6',
                children: [
                  _jsx(FormField, {
                    control: form.control,
                    name: 'password',
                    render: ({ field }) =>
                      _jsxs(FormItem, {
                        children: [
                          _jsx(FormLabel, { children: 'New Password' }),
                          _jsx(FormControl, {
                            children: _jsxs('div', {
                              className: 'relative',
                              children: [
                                _jsx(Lock, {
                                  className: 'absolute left-3 top-2.5 h-5 w-5 text-gray-400'
                                }),
                                _jsx(Input, {
                                  type: 'password',
                                  placeholder: '******',
                                  className: 'pl-10',
                                  ...field,
                                  onChange: e => {
                                    field.onChange(e);
                                    // Check password strength as user types
                                    setPasswordStrength(
                                      SecurityUtils.validatePasswordStrength(e.target.value)
                                    );
                                  }
                                })
                              ]
                            })
                          }),
                          _jsx(FormMessage, {}),
                          field.value &&
                            field.value.length > 0 &&
                            _jsxs('div', {
                              className: 'mt-2',
                              children: [
                                _jsxs('div', {
                                  className: 'flex items-center gap-1 text-xs',
                                  children: [
                                    _jsx(ShieldCheck, {
                                      size: 14,
                                      className: passwordStrength.isValid
                                        ? 'text-green-500'
                                        : 'text-gray-400'
                                    }),
                                    _jsx('span', {
                                      className: passwordStrength.isValid
                                        ? 'text-green-500'
                                        : 'text-gray-500',
                                      children: passwordStrength.isValid
                                        ? 'Password meets security requirements'
                                        : 'Password strength'
                                    })
                                  ]
                                }),
                                !passwordStrength.isValid &&
                                  passwordStrength.errors.length > 0 &&
                                  _jsx('ul', {
                                    className: 'text-xs text-amber-600 mt-1 list-disc pl-5',
                                    children: passwordStrength.errors.map((error, index) =>
                                      _jsx('li', { children: error }, index)
                                    )
                                  })
                              ]
                            })
                        ]
                      })
                  }),
                  _jsx(FormField, {
                    control: form.control,
                    name: 'confirmPassword',
                    render: ({ field }) =>
                      _jsxs(FormItem, {
                        children: [
                          _jsx(FormLabel, { children: 'Confirm New Password' }),
                          _jsx(FormControl, {
                            children: _jsxs('div', {
                              className: 'relative',
                              children: [
                                _jsx(Lock, {
                                  className: 'absolute left-3 top-2.5 h-5 w-5 text-gray-400'
                                }),
                                _jsx(Input, {
                                  type: 'password',
                                  placeholder: '******',
                                  className: 'pl-10',
                                  ...field
                                })
                              ]
                            })
                          }),
                          _jsx(FormMessage, {})
                        ]
                      })
                  }),
                  resetError &&
                    _jsxs('div', {
                      className:
                        'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2',
                      children: [
                        _jsx(AlertTriangle, { size: 16 }),
                        _jsx('span', { children: resetError })
                      ]
                    }),
                  _jsx(Button, {
                    type: 'submit',
                    className: 'w-full',
                    disabled: isSubmitting || !tokenValid,
                    children: isSubmitting ? 'Resetting password...' : 'Reset password'
                  })
                ]
              })
            })
      ]
    })
  });
};
export default ResetPassword;
