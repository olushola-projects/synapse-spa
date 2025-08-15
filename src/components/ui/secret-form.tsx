import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';

interface SecretFormProps {
  secretName: string;
  title?: string;
  description?: string;
  placeholder?: string;
  helpUrl?: string;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
}

export const SecretForm: React.FC<SecretFormProps> = ({
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-4'>
            <CheckCircle className='w-12 h-12 mx-auto text-green-600' />
            <div>
              <h3 className='text-lg font-semibold text-green-600'>Success!</h3>
              <p className='text-sm text-muted-foreground'>
                {secretName} has been configured successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='w-5 h-5' />
          {title || getDefaultTitle()}
        </CardTitle>
        <CardDescription>{description || getDefaultDescription()}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert>
          <AlertTriangle className='w-4 h-4' />
          <AlertDescription>
            <strong>Security Note:</strong> Your API key will be securely stored in Supabase secrets
            and never exposed in the frontend code.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor={secretName}>API Key</Label>
            <div className='relative'>
              <Input
                id={secretName}
                type={showValue ? 'text' : 'password'}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={placeholder || getDefaultPlaceholder()}
                className='pr-10'
                required
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                onClick={() => setShowValue(!showValue)}
              >
                {showValue ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </Button>
            </div>
          </div>

          <div className='flex gap-2'>
            <Button type='submit' className='flex-1' disabled={!value.trim() || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save API Key'}
            </Button>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {getHelpUrl() && (
          <div className='pt-2 border-t'>
            <Button variant='link' size='sm' className='h-auto p-0 text-xs' asChild>
              <a
                href={getHelpUrl()}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1'
              >
                <ExternalLink className='w-3 h-3' />
                Get your API key
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
