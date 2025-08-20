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
  const { login, loginWithGoogle, loginWithLinkedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  // Check for redirect path from protected routes
  useEffect(() => {
    // Clear any previous login errors when component mounts
    setLoginError(null);
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit = async values => {
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
      const redirectPath = SecurityUtils.storage.get('redirectPath') || '/dashboard';
      SecurityUtils.storage.remove('redirectPath'); // Clear after use
      navigate(redirectPath);
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return _jsxs('div', {
    className: 'min-h-screen flex bg-background',
    children: [
      _jsxs('div', {
        className: 'hidden lg:flex lg:flex-1 relative overflow-hidden',
        children: [
          _jsx('div', {
            className: 'absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent'
          }),
          _jsx('div', {
            className:
              'absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent px-[30px]'
          }),
          _jsx('div', {
            className:
              'absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-soft'
          }),
          _jsx('div', {
            className:
              'absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float'
          }),
          _jsxs('div', {
            className: 'relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white',
            children: [
              _jsxs('div', {
                className: 'mb-8',
                children: [
                  _jsx(Link, {
                    to: '/',
                    className: 'inline-block',
                    children: _jsx('h1', {
                      className: 'tracking-tight mb-2 font-semibold text-9xl text-white',
                      children: 'Synapses'
                    })
                  }),
                  _jsx('div', { className: 'w-52 h-1.5 rounded-full bg-white' })
                ]
              }),
              _jsxs('h2', {
                className: 'leading-tight mb-6 text-shadow-md text-7xl font-normal text-white',
                children: [
                  'Welcome to the',
                  _jsx('span', {
                    className:
                      'block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100',
                    children: 'Future of GRC'
                  })
                ]
              }),
              _jsx('p', {
                className: 'leading-relaxed mb-8 max-w-md text-lg font-medium text-white',
                children:
                  'Leverage AI-driven insights to transform your governance, risk, and compliance operations.'
              }),
              _jsxs('div', {
                className: 'flex items-center gap-4 text-white/60',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      _jsx('div', { className: 'w-2 h-2 bg-green-400 rounded-full animate-pulse' }),
                      _jsx('span', { className: 'text-sm', children: '99.9% Uptime' })
                    ]
                  }),
                  _jsx('div', { className: 'w-1 h-4 bg-white/20' }),
                  _jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      _jsx('div', { className: 'w-2 h-2 bg-blue-400 rounded-full animate-pulse' }),
                      _jsx('span', { className: 'text-sm', children: 'SOC 2 Compliant' })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      _jsx('div', {
        className: 'flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/30',
        children: _jsxs('div', {
          className: 'w-full max-w-md space-y-8',
          children: [
            _jsx('div', {
              className: 'lg:hidden text-center mb-8',
              children: _jsx(Link, {
                to: '/',
                className: 'inline-block',
                children: _jsx('h1', {
                  className: 'text-3xl font-bold text-primary mb-2',
                  children: 'Synapse'
                })
              })
            }),
            _jsxs('div', {
              className:
                'bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl p-8 space-y-8 rounded-2xl py-[162px] px-[72px] mx-0 my-0',
              children: [
                _jsxs('div', {
                  className: 'text-center space-y-2',
                  children: [
                    _jsx('h3', {
                      className: 'text-foreground font-semibold text-4xl',
                      children: 'Sign In'
                    }),
                    _jsx('p', {
                      className: 'text-muted-foreground font-extralight',
                      children: 'Enter your email and password to sign in!'
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    _jsxs(Button, {
                      variant: 'outline',
                      type: 'button',
                      onClick: () => loginWithGoogle(),
                      className:
                        'w-full h-12 flex items-center justify-center gap-3 border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] text-lg font-medium text-center',
                      children: [
                        _jsxs('svg', {
                          width: '20',
                          height: '20',
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
                        'Sign in with Google'
                      ]
                    }),
                    _jsxs(Button, {
                      variant: 'outline',
                      type: 'button',
                      onClick: () => loginWithLinkedIn(),
                      className:
                        'w-full h-12 flex items-center justify-center gap-3 border-2 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] text-lg font-medium text-center',
                      children: [
                        _jsx(Linkedin, { size: 20, className: 'text-blue-600' }),
                        'Sign in with LinkedIn'
                      ]
                    })
                  ]
                }),
                _jsxs('div', {
                  className: 'relative my-8',
                  children: [
                    _jsx('div', {
                      className: 'absolute inset-0 flex items-center',
                      children: _jsx(Separator, { className: 'w-full' })
                    }),
                    _jsx('div', {
                      className: 'relative flex justify-center text-sm',
                      children: _jsx('span', {
                        className: 'px-4 text-muted-foreground bg-card',
                        children: 'or'
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
                        name: 'email',
                        render: ({ field }) =>
                          _jsxs(FormItem, {
                            children: [
                              _jsx(FormLabel, {
                                className: 'text-sm font-medium text-foreground',
                                children: 'Email*'
                              }),
                              _jsx(FormControl, {
                                children: _jsxs('div', {
                                  className: 'relative',
                                  children: [
                                    _jsx(Mail, {
                                      className:
                                        'absolute left-3 top-3 h-5 w-5 text-muted-foreground'
                                    }),
                                    _jsx(Input, {
                                      placeholder: 'mail@example.com',
                                      className:
                                        'pl-10 h-12 border-2 focus:border-primary transition-colors',
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
                              _jsx(FormLabel, {
                                className: 'text-sm font-medium text-foreground',
                                children: 'Password*'
                              }),
                              _jsx(FormControl, {
                                children: _jsxs('div', {
                                  className: 'relative',
                                  children: [
                                    _jsx(Lock, {
                                      className:
                                        'absolute left-3 top-3 h-5 w-5 text-muted-foreground'
                                    }),
                                    _jsx(Input, {
                                      type: 'password',
                                      placeholder: 'Min. 8 characters',
                                      className:
                                        'pl-10 h-12 border-2 focus:border-primary transition-colors',
                                      ...field
                                    })
                                  ]
                                })
                              }),
                              _jsx(FormMessage, {})
                            ]
                          })
                      }),
                      _jsxs('div', {
                        className: 'flex items-center justify-between',
                        children: [
                          _jsx(FormField, {
                            control: form.control,
                            name: 'rememberMe',
                            render: ({ field }) =>
                              _jsxs(FormItem, {
                                className: 'flex flex-row items-center space-x-3 space-y-0',
                                children: [
                                  _jsx(FormControl, {
                                    children: _jsx(Checkbox, {
                                      checked: field.value,
                                      onCheckedChange: field.onChange
                                    })
                                  }),
                                  _jsx(FormLabel, {
                                    className: 'text-sm font-normal text-foreground cursor-pointer',
                                    children: 'Keep me logged in'
                                  })
                                ]
                              })
                          }),
                          _jsx(Link, {
                            to: '/forgot-password',
                            className: 'text-sm font-medium text-primary hover:underline',
                            children: 'Forgot Password?'
                          })
                        ]
                      }),
                      loginError &&
                        _jsxs('div', {
                          className:
                            'bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2',
                          children: [
                            _jsx(AlertTriangle, { size: 16 }),
                            _jsx('span', { className: 'text-sm', children: loginError })
                          ]
                        }),
                      _jsx(Button, {
                        type: 'submit',
                        disabled: isSubmitting,
                        className:
                          'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white gap-x-20 shadow-md hover:drop-shadow-md transition-all duration-200 px-[125px] font-normal text-lg',
                        children: isSubmitting ? 'Signing in...' : 'Sign In'
                      })
                    ]
                  })
                }),
                _jsx('div', {
                  className: 'text-center pt-4',
                  children: _jsxs('p', {
                    className: 'text-muted-foreground text-base',
                    children: [
                      'Not registered yet?',
                      ' ',
                      _jsx(Link, {
                        to: '/register',
                        className: 'font-medium text-primary hover:underline',
                        children: 'Create an account'
                      })
                    ]
                  })
                })
              ]
            })
          ]
        })
      })
    ]
  });
};
export default Login;
