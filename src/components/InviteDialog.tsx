import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define form validation schema
const inviteFormSchema = z.object({
  senderName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  senderEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  inviteeEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().optional()
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const InviteDialog: React.FC<InviteDialogProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      senderName: '',
      senderEmail: '',
      inviteeEmail: '',
      message: ''
    }
  });

  const onSubmit = async (data: InviteFormValues) => {
    setIsSubmitting(true);

    try {
      // Call the invite edge function
      const { error } = await supabase.functions.invoke('send-invitation', {
        body: {
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          inviteeEmail: data.inviteeEmail,
          adminEmail: 'admin@joinsynapses.com',
          message: data.message || `I'd like to invite you to check out Synapses!`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Invitation sent!',
        description: `We've sent an invitation to ${data.inviteeEmail} and a confirmation to your email.`
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Failed to send invitation',
        description: error?.message || 'Something went wrong. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Invite a Colleague</DialogTitle>
          <DialogDescription>
            Share Synapses with your network. We'll send them a personalized invitation and notify
            you when they join.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='senderName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='senderEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input placeholder='you@example.com' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className='my-4' />

            <FormField
              control={form.control}
              name='inviteeEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitee's Email</FormLabel>
                  <FormControl>
                    <Input placeholder='colleague@example.com' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      placeholder="I'd like to invite you to check out Synapses!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
