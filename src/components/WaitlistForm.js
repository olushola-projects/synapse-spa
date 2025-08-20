import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils } from '@/utils/security';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
const WaitlistForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [missingCapability, setMissingCapability] = useState('');
  const [limitingTools, setLimitingTools] = useState('');
  const [engagement, setEngagement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!email || !name) {
        throw new Error('Name and email are required');
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      // Sanitize all inputs
      const sanitizedData = {
        email: SecurityUtils.sanitizeInput(email.trim()),
        name: SecurityUtils.sanitizeInput(name.trim()),
        company: company ? SecurityUtils.sanitizeInput(company.trim()) : null,
        role: title ? SecurityUtils.sanitizeInput(title.trim()) : null,
        country: country ? SecurityUtils.sanitizeInput(country) : null,
        missing_capability: missingCapability
          ? SecurityUtils.sanitizeInput(missingCapability.trim())
          : null,
        limiting_tools: limitingTools ? SecurityUtils.sanitizeInput(limitingTools.trim()) : null,
        engagement: engagement ? SecurityUtils.sanitizeInput(engagement.trim()) : null
      };
      // Store the waitlist entry in Supabase
      const { error } = await supabase.from('waitlist').insert([sanitizedData]);
      if (error) {
        throw error;
      }
      setIsSubmitted(true);
      toast({
        title: 'Success!',
        description: "You've been added to the Synapses waitlist.",
        variant: 'default'
      });
      // Clear form
      setEmail('');
      setName('');
      setCompany('');
      setTitle('');
      setCountry('');
      setMissingCapability('');
      setLimitingTools('');
      setEngagement('');
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast({
        title: 'Something went wrong',
        description: "We couldn't add you to the waitlist. Please try again.",
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return _jsx('div', {
    className: 'max-w-md w-full mx-auto',
    children: isSubmitted
      ? _jsxs('div', {
          className: 'text-center p-6 bg-green-50 rounded-lg border border-green-100',
          children: [
            _jsx('div', {
              className:
                'h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4',
              children: _jsx(Check, { className: 'h-6 w-6 text-green-600' })
            }),
            _jsx('h3', { className: 'text-xl font-bold mb-2', children: "You're on the list!" }),
            _jsx('p', {
              className: 'text-gray-600',
              children:
                "Thank you for joining the Synapses waitlist. We'll contact you soon with updates on our launch."
            })
          ]
        })
      : _jsxs('form', {
          onSubmit: handleSubmit,
          className: 'space-y-4',
          children: [
            _jsxs('div', {
              className: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
              children: [
                _jsxs('div', {
                  children: [
                    _jsx(Label, {
                      htmlFor: 'name',
                      className: 'block text-sm font-medium text-gray-700 mb-1',
                      children: 'Full Name'
                    }),
                    _jsx(Input, {
                      id: 'name',
                      type: 'text',
                      placeholder: 'Your name',
                      value: name,
                      onChange: e => setName(e.target.value),
                      required: true,
                      className: 'w-full'
                    })
                  ]
                }),
                _jsxs('div', {
                  children: [
                    _jsx(Label, {
                      htmlFor: 'email',
                      className: 'block text-sm font-medium text-gray-700 mb-1',
                      children: 'Work Email'
                    }),
                    _jsx(Input, {
                      id: 'email',
                      type: 'email',
                      placeholder: 'you@company.com',
                      value: email,
                      onChange: e => setEmail(e.target.value),
                      required: true,
                      className: 'w-full'
                    })
                  ]
                }),
                _jsxs('div', {
                  children: [
                    _jsx(Label, {
                      htmlFor: 'title',
                      className: 'block text-sm font-medium text-gray-700 mb-1',
                      children: 'Job Title'
                    }),
                    _jsx(Input, {
                      id: 'title',
                      type: 'text',
                      placeholder: 'Your position',
                      value: title,
                      onChange: e => setTitle(e.target.value),
                      required: true,
                      className: 'w-full'
                    })
                  ]
                }),
                _jsxs('div', {
                  children: [
                    _jsx(Label, {
                      htmlFor: 'country',
                      className: 'block text-sm font-medium text-gray-700 mb-1',
                      children: 'Country'
                    }),
                    _jsxs(Select, {
                      value: country,
                      onValueChange: setCountry,
                      children: [
                        _jsx(SelectTrigger, {
                          id: 'country',
                          children: _jsx(SelectValue, { placeholder: 'Select country' })
                        }),
                        _jsxs(SelectContent, {
                          children: [
                            _jsx(SelectItem, { value: 'us', children: 'United States' }),
                            _jsx(SelectItem, { value: 'uk', children: 'United Kingdom' }),
                            _jsx(SelectItem, { value: 'ca', children: 'Canada' }),
                            _jsx(SelectItem, { value: 'au', children: 'Australia' }),
                            _jsx(SelectItem, { value: 'de', children: 'Germany' }),
                            _jsx(SelectItem, { value: 'fr', children: 'France' }),
                            _jsx(SelectItem, { value: 'sg', children: 'Singapore' }),
                            _jsx(SelectItem, { value: 'other', children: 'Other' })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            _jsxs('div', {
              children: [
                _jsx(Label, {
                  htmlFor: 'company',
                  className: 'block text-sm font-medium text-gray-700 mb-1',
                  children: 'Company'
                }),
                _jsx(Input, {
                  id: 'company',
                  type: 'text',
                  placeholder: 'Your organization',
                  value: company,
                  onChange: e => setCompany(e.target.value),
                  required: true,
                  className: 'w-full'
                })
              ]
            }),
            _jsxs('div', {
              className: 'mt-6',
              children: [
                _jsx(Label, {
                  htmlFor: 'missing-capability',
                  className: 'block text-sm font-medium text-gray-700 mb-1',
                  children:
                    "What's one capability, workflow, or tool you believe is missing from the current compliance landscape?"
                }),
                _jsx('p', {
                  className: 'text-xs text-gray-500 mb-2',
                  children:
                    'Think about your day-to-day\u2014what would make your work significantly more efficient, insightful, or impactful?'
                }),
                _jsx(Textarea, {
                  id: 'missing-capability',
                  placeholder: 'Share your thoughts...',
                  value: missingCapability,
                  onChange: e => setMissingCapability(e.target.value),
                  className: 'w-full min-h-24',
                  required: true
                })
              ]
            }),
            _jsxs('div', {
              children: [
                _jsx(Label, {
                  htmlFor: 'limiting-tools',
                  className: 'block text-sm font-medium text-gray-700 mb-1',
                  children:
                    "Are there any existing tools or platforms you've found limiting in your compliance work? If so, what challenges have you experienced?"
                }),
                _jsx('p', {
                  className: 'text-xs text-gray-500 mb-2',
                  children:
                    'Your perspective will help us understand where existing solutions may fall short\u2014and where new value can be created.'
                }),
                _jsx(Textarea, {
                  id: 'limiting-tools',
                  placeholder: 'Share your experiences...',
                  value: limitingTools,
                  onChange: e => setLimitingTools(e.target.value),
                  className: 'w-full min-h-24',
                  required: true
                })
              ]
            }),
            _jsxs('div', {
              children: [
                _jsx(Label, {
                  htmlFor: 'engagement',
                  className: 'block text-sm font-medium text-gray-700 mb-1',
                  children:
                    'How do you currently engage with platforms like LinkedIn, GRC forums, or associations to stay informed, upskill, or solve regulatory challenges?'
                }),
                _jsx('p', {
                  className: 'text-xs text-gray-500 mb-2',
                  children:
                    "We'd love to learn how you gather insights, build networks, or contribute to the professional community."
                }),
                _jsx(Textarea, {
                  id: 'engagement',
                  placeholder: 'Share your approaches...',
                  value: engagement,
                  onChange: e => setEngagement(e.target.value),
                  className: 'w-full min-h-24',
                  required: true
                })
              ]
            }),
            _jsx(Button, {
              type: 'submit',
              className: 'w-full bg-blue-700 hover:bg-blue-800 py-6 text-white',
              disabled: isSubmitting,
              children: isSubmitting
                ? _jsxs('span', {
                    className: 'flex items-center justify-center',
                    children: [
                      _jsxs('svg', {
                        className: 'animate-spin -ml-1 mr-3 h-5 w-5 text-white',
                        xmlns: 'http://www.w3.org/2000/svg',
                        fill: 'none',
                        viewBox: '0 0 24 24',
                        children: [
                          _jsx('circle', {
                            className: 'opacity-25',
                            cx: '12',
                            cy: '12',
                            r: '10',
                            stroke: 'currentColor',
                            strokeWidth: '4'
                          }),
                          _jsx('path', {
                            className: 'opacity-75',
                            fill: 'currentColor',
                            d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          })
                        ]
                      }),
                      'Processing...'
                    ]
                  })
                : _jsxs('span', {
                    className: 'flex items-center justify-center',
                    children: ['Join Waitlist ', _jsx(ArrowRight, { className: 'ml-2', size: 18 })]
                  })
            }),
            _jsxs('p', {
              className: 'text-xs text-center text-gray-500',
              children: [
                'By joining, you agree to our',
                ' ',
                _jsx('a', {
                  href: '/legal/terms',
                  className: 'text-blue-600 hover:underline',
                  children: 'Terms of Service'
                }),
                ' ',
                'and',
                ' ',
                _jsx('a', {
                  href: '/legal/privacy',
                  className: 'text-blue-600 hover:underline',
                  children: 'Privacy Policy'
                }),
                '.'
              ]
            })
          ]
        })
  });
};
export default WaitlistForm;
