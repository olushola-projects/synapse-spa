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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error: any) {
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

  return (
    <div className='max-w-md w-full mx-auto'>
      {isSubmitted ? (
        <div className='text-center p-6 bg-green-50 rounded-lg border border-green-100'>
          <div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Check className='h-6 w-6 text-green-600' />
          </div>
          <h3 className='text-xl font-bold mb-2'>You're on the list!</h3>
          <p className='text-gray-600'>
            Thank you for joining the Synapses waitlist. We'll contact you soon with updates on our
            launch.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name
              </Label>
              <Input
                id='name'
                type='text'
                placeholder='Your name'
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className='w-full'
              />
            </div>

            <div>
              <Label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Work Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='you@company.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full'
              />
            </div>

            <div>
              <Label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
                Job Title
              </Label>
              <Input
                id='title'
                type='text'
                placeholder='Your position'
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className='w-full'
              />
            </div>

            <div>
              <Label htmlFor='country' className='block text-sm font-medium text-gray-700 mb-1'>
                Country
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id='country'>
                  <SelectValue placeholder='Select country' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='us'>United States</SelectItem>
                  <SelectItem value='uk'>United Kingdom</SelectItem>
                  <SelectItem value='ca'>Canada</SelectItem>
                  <SelectItem value='au'>Australia</SelectItem>
                  <SelectItem value='de'>Germany</SelectItem>
                  <SelectItem value='fr'>France</SelectItem>
                  <SelectItem value='sg'>Singapore</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor='company' className='block text-sm font-medium text-gray-700 mb-1'>
              Company
            </Label>
            <Input
              id='company'
              type='text'
              placeholder='Your organization'
              value={company}
              onChange={e => setCompany(e.target.value)}
              required
              className='w-full'
            />
          </div>

          <div className='mt-6'>
            <Label
              htmlFor='missing-capability'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              What's one capability, workflow, or tool you believe is missing from the current
              compliance landscape?
            </Label>
            <p className='text-xs text-gray-500 mb-2'>
              Think about your day-to-day—what would make your work significantly more efficient,
              insightful, or impactful?
            </p>
            <Textarea
              id='missing-capability'
              placeholder='Share your thoughts...'
              value={missingCapability}
              onChange={e => setMissingCapability(e.target.value)}
              className='w-full min-h-24'
              required
            />
          </div>

          <div>
            <Label
              htmlFor='limiting-tools'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Are there any existing tools or platforms you've found limiting in your compliance
              work? If so, what challenges have you experienced?
            </Label>
            <p className='text-xs text-gray-500 mb-2'>
              Your perspective will help us understand where existing solutions may fall short—and
              where new value can be created.
            </p>
            <Textarea
              id='limiting-tools'
              placeholder='Share your experiences...'
              value={limitingTools}
              onChange={e => setLimitingTools(e.target.value)}
              className='w-full min-h-24'
              required
            />
          </div>

          <div>
            <Label htmlFor='engagement' className='block text-sm font-medium text-gray-700 mb-1'>
              How do you currently engage with platforms like LinkedIn, GRC forums, or associations
              to stay informed, upskill, or solve regulatory challenges?
            </Label>
            <p className='text-xs text-gray-500 mb-2'>
              We'd love to learn how you gather insights, build networks, or contribute to the
              professional community.
            </p>
            <Textarea
              id='engagement'
              placeholder='Share your approaches...'
              value={engagement}
              onChange={e => setEngagement(e.target.value)}
              className='w-full min-h-24'
              required
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-blue-700 hover:bg-blue-800 py-6 text-white'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className='flex items-center justify-center'>
                Join Waitlist <ArrowRight className='ml-2' size={18} />
              </span>
            )}
          </Button>

          <p className='text-xs text-center text-gray-500'>
            By joining, you agree to our{' '}
            <a href='/legal/terms' className='text-blue-600 hover:underline'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='/legal/privacy' className='text-blue-600 hover:underline'>
              Privacy Policy
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
};

export default WaitlistForm;
