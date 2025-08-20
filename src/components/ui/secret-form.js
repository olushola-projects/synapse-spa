import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
export const SecretForm = ({
  secretName,
  title,
  description,
  placeholder,
  helpUrl,
  onSubmit,
  onCancel
}) => {
  const [value, setValue] = useState('');
  const [showValue, setShowValue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // In a real implementation, this would call a Supabase function to store the secret
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitted(true);
      onSubmit?.(value);
      setTimeout(() => {
        setValue('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save secret:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getDefaultTitle = () => {
    switch (secretName) {
      case 'NEXUS_API_KEY':
        return 'Configure Nexus API Key';
      case 'OPENAI_API_KEY':
        return 'Configure OpenAI API Key';
      case 'ANTHROPIC_API_KEY':
        return 'Configure Anthropic API Key';
      default:
        return `Configure ${secretName}`;
    }
  };
  const getDefaultDescription = () => {
    switch (secretName) {
      case 'NEXUS_API_KEY':
        return 'Enter your Nexus API key to enable LLM-powered SFDR classification and compliance validation.';
      case 'OPENAI_API_KEY':
        return 'Enter your OpenAI API key to enable GPT-powered features and AI assistance.';
      case 'ANTHROPIC_API_KEY':
        return 'Enter your Anthropic API key to enable Claude-powered features and AI assistance.';
      default:
        return `Enter your ${secretName} to enable the associated features.`;
    }
  };
  const getDefaultPlaceholder = () => {
    switch (secretName) {
      case 'NEXUS_API_KEY':
        return 'nexus_sk_...';
      case 'OPENAI_API_KEY':
        return 'sk-...';
      case 'ANTHROPIC_API_KEY':
        return 'sk-ant-...';
      default:
        return 'Enter your API key...';
    }
  };
  const getHelpUrl = () => {
    switch (secretName) {
      case 'NEXUS_API_KEY':
        return 'https://api.joinsynapses.com/docs';
      case 'OPENAI_API_KEY':
        return 'https://platform.openai.com/api-keys';
      case 'ANTHROPIC_API_KEY':
        return 'https://console.anthropic.com/';
      default:
        return helpUrl;
    }
  };
  if (submitted) {
    return _jsx(Card, {
      className: 'w-full max-w-md mx-auto',
      children: _jsx(CardContent, {
        className: 'pt-6',
        children: _jsxs('div', {
          className: 'text-center space-y-4',
          children: [
            _jsx(CheckCircle, { className: 'w-12 h-12 mx-auto text-green-600' }),
            _jsxs('div', {
              children: [
                _jsx('h3', {
                  className: 'text-lg font-semibold text-green-600',
                  children: 'Success!'
                }),
                _jsxs('p', {
                  className: 'text-sm text-muted-foreground',
                  children: [secretName, ' has been configured successfully.']
                })
              ]
            })
          ]
        })
      })
    });
  }
  return _jsxs(Card, {
    className: 'w-full max-w-md mx-auto',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center gap-2',
            children: [_jsx(Key, { className: 'w-5 h-5' }), title || getDefaultTitle()]
          }),
          _jsx(CardDescription, { children: description || getDefaultDescription() })
        ]
      }),
      _jsxs(CardContent, {
        className: 'space-y-4',
        children: [
          _jsxs(Alert, {
            children: [
              _jsx(AlertTriangle, { className: 'w-4 h-4' }),
              _jsxs(AlertDescription, {
                children: [
                  _jsx('strong', { children: 'Security Note:' }),
                  ' Your API key will be securely stored in Supabase secrets and never exposed in the frontend code.'
                ]
              })
            ]
          }),
          _jsxs('form', {
            onSubmit: handleSubmit,
            className: 'space-y-4',
            children: [
              _jsxs('div', {
                className: 'space-y-2',
                children: [
                  _jsx(Label, { htmlFor: secretName, children: 'API Key' }),
                  _jsxs('div', {
                    className: 'relative',
                    children: [
                      _jsx(Input, {
                        id: secretName,
                        type: showValue ? 'text' : 'password',
                        value: value,
                        onChange: e => setValue(e.target.value),
                        placeholder: placeholder || getDefaultPlaceholder(),
                        className: 'pr-10',
                        required: true
                      }),
                      _jsx(Button, {
                        type: 'button',
                        variant: 'ghost',
                        size: 'sm',
                        className: 'absolute right-0 top-0 h-full px-3 hover:bg-transparent',
                        onClick: () => setShowValue(!showValue),
                        children: showValue
                          ? _jsx(EyeOff, { className: 'w-4 h-4' })
                          : _jsx(Eye, { className: 'w-4 h-4' })
                      })
                    ]
                  })
                ]
              }),
              _jsxs('div', {
                className: 'flex gap-2',
                children: [
                  _jsx(Button, {
                    type: 'submit',
                    className: 'flex-1',
                    disabled: !value.trim() || isSubmitting,
                    children: isSubmitting ? 'Saving...' : 'Save API Key'
                  }),
                  onCancel &&
                    _jsx(Button, {
                      type: 'button',
                      variant: 'outline',
                      onClick: onCancel,
                      disabled: isSubmitting,
                      children: 'Cancel'
                    })
                ]
              })
            ]
          }),
          getHelpUrl() &&
            _jsx('div', {
              className: 'pt-2 border-t',
              children: _jsx(Button, {
                variant: 'link',
                size: 'sm',
                className: 'h-auto p-0 text-xs',
                asChild: true,
                children: _jsxs('a', {
                  href: getHelpUrl(),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'flex items-center gap-1',
                  children: [_jsx(ExternalLink, { className: 'w-3 h-3' }), 'Get your API key']
                })
              })
            })
        ]
      })
    ]
  });
};
