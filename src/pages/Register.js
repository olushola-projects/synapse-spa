import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
import { Linkedin, Mail, Lock, User, AlertTriangle, ShieldCheck } from 'lucide-react';
import ValidationUtils from '@/utils/validation';
import SecurityUtils from '@/utils/security';
// Use the validation schema from ValidationUtils
const formSchema = ValidationUtils.schemas.register;
const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithLinkedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    errors: []
  });
  // Clear any previous registration errors when component mounts
  useEffect(() => {
    setRegisterError(null);
  }, []);
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
  const onSubmit = async values => {
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
      await register({ email: sanitizedEmail, password: values.password, name: sanitizedName });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setRegisterError(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
              children: 'Create your account'
            }),
            _jsxs('p', {
              className: 'mt-2 text-sm text-gray-600',
              children: [
                'Or',
                ' ',
                _jsx(Link, {
                  to: '/login',
                  className: 'font-medium text-blue-600 hover:text-blue-500',
                  children: 'sign in to your existing account'
                })
              ]
            })
          ]
        }),
        _jsxs('div', {
          className: 'flex flex-col space-y-4',
          children: [
            _jsxs(Button, {
              variant: 'outline',
              type: 'button',
              className: 'w-full flex items-center justify-center gap-2',
              onClick: () => loginWithLinkedIn(),
              children: [_jsx(Linkedin, { size: 16 }), 'Sign up with LinkedIn']
            }),
            _jsxs(Button, {
              variant: 'outline',
              type: 'button',
              className: 'w-full flex items-center justify-center gap-2',
              onClick: () => loginWithGoogle(),
              children: [
                _jsxs('svg', {
                  width: '16',
                  height: '16',
                  viewBox: '0 0 24 24',
                  xmlns: 'http://www.w3.org/2000/svg',
                  children: [
                    _jsx('path', {
                      d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
                      fill: '#4285F4'
                    }),
                    _jsx('path', {
                      d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z',
                      fill: '#34A853'
                    }),
                    _jsx('path', {
                      d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z',
                      fill: '#FBBC05'
                    }),
                    _jsx('path', {
                      d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
                      fill: '#EA4335'
                    })
                  ]
                }),
                'Sign up with Google'
              ]
            })
          ]
        }),
        _jsxs('div', {
          className: 'relative my-6',
          children: [
            _jsx('div', {
              className: 'absolute inset-0 flex items-center',
              children: _jsx(Separator, { className: 'w-full' })
            }),
            _jsx('div', {
              className: 'relative flex justify-center text-sm',
              children: _jsx('span', {
                className: 'px-2 text-gray-500 bg-white',
                children: 'Or continue with'
              })
            })
          ]
        }),
        _jsx(Form, {
          ...form,
          children: _jsxs('form', {
            onSubmit: form.handleSubmit(onSubmit),
            className: 'space-y-6',
            children: [
              _jsx(FormField, {
                control: form.control,
                name: 'name',
                render: ({ field }) =>
                  _jsxs(FormItem, {
                    children: [
                      _jsx(FormLabel, { children: 'Full Name' }),
                      _jsx(FormControl, {
                        children: _jsxs('div', {
                          className: 'relative',
                          children: [
                            _jsx(User, {
                              className: 'absolute left-3 top-2.5 h-5 w-5 text-gray-400'
                            }),
                            _jsx(Input, { placeholder: 'John Doe', className: 'pl-10', ...field })
                          ]
                        })
                      }),
                      _jsx(FormMessage, {})
                    ]
                  })
              }),
              _jsx(FormField, {
                control: form.control,
                name: 'email',
                render: ({ field }) =>
                  _jsxs(FormItem, {
                    children: [
                      _jsx(FormLabel, { children: 'Email' }),
                      _jsx(FormControl, {
                        children: _jsxs('div', {
                          className: 'relative',
                          children: [
                            _jsx(Mail, {
                              className: 'absolute left-3 top-2.5 h-5 w-5 text-gray-400'
                            }),
                            _jsx(Input, {
                              placeholder: 'you@example.com',
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
              _jsx(FormField, {
                control: form.control,
                name: 'password',
                render: ({ field }) =>
                  _jsxs(FormItem, {
                    children: [
                      _jsx(FormLabel, { children: 'Password' }),
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
                      _jsx(FormLabel, { children: 'Confirm Password' }),
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
              _jsx(FormField, {
                control: form.control,
                name: 'acceptTerms',
                render: ({ field }) =>
                  _jsxs(FormItem, {
                    className: 'flex flex-row items-start space-x-3 space-y-0',
                    children: [
                      _jsx(FormControl, {
                        children: _jsx(Checkbox, {
                          checked: field.value,
                          onCheckedChange: field.onChange
                        })
                      }),
                      _jsxs('div', {
                        className: 'space-y-1 leading-none',
                        children: [
                          _jsxs(FormLabel, {
                            className: 'text-sm',
                            children: [
                              'I accept the',
                              ' ',
                              _jsx(Link, {
                                to: '/legal/terms',
                                className: 'text-blue-600 hover:text-blue-500',
                                children: 'Terms of Service'
                              }),
                              ' ',
                              'and',
                              ' ',
                              _jsx(Link, {
                                to: '/legal/privacy',
                                className: 'text-blue-600 hover:text-blue-500',
                                children: 'Privacy Policy'
                              })
                            ]
                          }),
                          _jsx(FormMessage, {})
                        ]
                      })
                    ]
                  })
              }),
              registerError &&
                _jsxs('div', {
                  className:
                    'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2',
                  children: [
                    _jsx(AlertTriangle, { size: 16 }),
                    _jsx('span', { children: registerError })
                  ]
                }),
              _jsx(Button, {
                type: 'submit',
                className: 'w-full',
                disabled: isSubmitting,
                children: isSubmitting ? 'Creating account...' : 'Create account'
              })
            ]
          })
        })
      ]
    })
  });
};
export default Register;
