import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
import DashboardLayout from '@/components/dashboard/DashboardLayout';
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
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  jurisdiction: z.array(z.string()).optional()
});
const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      jurisdiction: user?.jurisdiction || []
    }
  });
  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        jurisdiction: user.jurisdiction || []
      });
    }
  }, [user, form]);
  const onSubmit = async data => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };
  if (isLoading || !user) {
    return _jsx(DashboardLayout, {
      children: _jsx('div', {
        className: 'flex items-center justify-center h-full',
        children: _jsx('div', { className: 'animate-pulse', children: 'Loading profile...' })
      })
    });
  }
  return _jsx(DashboardLayout, {
    children: _jsxs('div', {
      className: 'container max-w-4xl py-8',
      children: [
        _jsx('h1', { className: 'text-3xl font-bold mb-6', children: 'Profile Settings' }),
        _jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-3 gap-6',
          children: [
            _jsx('div', {
              className: 'md:col-span-1',
              children: _jsxs(Card, {
                children: [
                  _jsxs(CardHeader, {
                    className: 'text-center',
                    children: [
                      _jsxs(Avatar, {
                        className: 'w-24 h-24 mx-auto mb-4',
                        children: [
                          _jsx(AvatarImage, {
                            src: user.avatar_url || '/placeholder.svg',
                            alt: user.name
                          }),
                          _jsx(AvatarFallback, { children: user.name.charAt(0) })
                        ]
                      }),
                      _jsx(CardTitle, { children: user.name }),
                      _jsx(CardDescription, { children: user.email })
                    ]
                  }),
                  _jsx(CardContent, {
                    children: _jsxs('div', {
                      className: 'text-sm text-muted-foreground',
                      children: [
                        _jsxs('div', {
                          className: 'flex justify-between mb-2',
                          children: [
                            _jsx('span', { children: 'Member since:' }),
                            _jsx('span', { children: 'April 2023' })
                          ]
                        }),
                        _jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            _jsx('span', { children: 'Last login:' }),
                            _jsx('span', { children: 'Today' })
                          ]
                        })
                      ]
                    })
                  }),
                  _jsx(CardFooter, {
                    children: _jsx(Button, {
                      variant: 'outline',
                      className: 'w-full',
                      children: 'Change Avatar'
                    })
                  })
                ]
              })
            }),
            _jsx('div', {
              className: 'md:col-span-2',
              children: _jsxs(Card, {
                children: [
                  _jsxs(CardHeader, {
                    children: [
                      _jsx(CardTitle, { children: 'Personal Information' }),
                      _jsx(CardDescription, {
                        children: 'Update your personal details and preferences'
                      })
                    ]
                  }),
                  _jsx(CardContent, {
                    children: _jsx(Form, {
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
                                  _jsx(FormControl, { children: _jsx(Input, { ...field }) }),
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
                                  _jsx(FormLabel, { children: 'Email Address' }),
                                  _jsx(FormControl, {
                                    children: _jsx(Input, { ...field, disabled: true })
                                  }),
                                  _jsx(FormDescription, {
                                    children: 'You cannot change your email address'
                                  }),
                                  _jsx(FormMessage, {})
                                ]
                              })
                          }),
                          _jsx(Separator, { className: 'my-6' }),
                          _jsxs('div', {
                            children: [
                              _jsx('h3', {
                                className: 'text-lg font-medium mb-3',
                                children: 'Jurisdictional Interests'
                              }),
                              _jsx('p', {
                                className: 'text-sm text-muted-foreground mb-4',
                                children:
                                  "Select the jurisdictions you're interested in for content and regulatory updates"
                              }),
                              _jsx(FormField, {
                                control: form.control,
                                name: 'jurisdiction',
                                render: () =>
                                  _jsxs(FormItem, {
                                    children: [
                                      _jsx('div', {
                                        className: 'grid grid-cols-1 md:grid-cols-2 gap-3',
                                        children: jurisdictions.map(item =>
                                          _jsx(
                                            FormField,
                                            {
                                              control: form.control,
                                              name: 'jurisdiction',
                                              render: ({ field }) => {
                                                return _jsxs(
                                                  FormItem,
                                                  {
                                                    className:
                                                      'flex flex-row items-start space-x-3 space-y-0',
                                                    children: [
                                                      _jsx(FormControl, {
                                                        children: _jsx(Checkbox, {
                                                          checked: field.value?.includes(item.id),
                                                          onCheckedChange: checked => {
                                                            return checked
                                                              ? field.onChange([
                                                                  ...(field.value || []),
                                                                  item.id
                                                                ])
                                                              : field.onChange(
                                                                  field.value?.filter(
                                                                    value => value !== item.id
                                                                  )
                                                                );
                                                          }
                                                        })
                                                      }),
                                                      _jsx(FormLabel, {
                                                        className: 'font-normal',
                                                        children: item.label
                                                      })
                                                    ]
                                                  },
                                                  item.id
                                                );
                                              }
                                            },
                                            item.id
                                          )
                                        )
                                      }),
                                      _jsx(FormMessage, {})
                                    ]
                                  })
                              })
                            ]
                          }),
                          _jsx(Button, { type: 'submit', children: 'Save changes' })
                        ]
                      })
                    })
                  })
                ]
              })
            })
          ]
        })
      ]
    })
  });
};
export default Profile;
