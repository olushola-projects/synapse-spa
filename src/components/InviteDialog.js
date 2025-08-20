import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// Define form validation schema
const inviteFormSchema = z.object({
    senderName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    senderEmail: z.string().email({ message: 'Please enter a valid email address.' }),
    inviteeEmail: z.string().email({ message: 'Please enter a valid email address.' }),
    message: z.string().optional()
});
const InviteDialog = ({ open, onOpenChange }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            senderName: '',
            senderEmail: '',
            inviteeEmail: '',
            message: ''
        }
    });
    const onSubmit = async (data) => {
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
        }
        catch (error) {
            console.error('Error sending invitation:', error);
            toast({
                title: 'Failed to send invitation',
                description: error?.message || 'Something went wrong. Please try again later.',
                variant: 'destructive'
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: 'sm:max-w-md', children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: 'text-xl', children: "Invite a Colleague" }), _jsx(DialogDescription, { children: "Share Synapses with your network. We'll send them a personalized invitation and notify you when they join." })] }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: 'space-y-4', children: [_jsx(FormField, { control: form.control, name: 'senderName', render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Your Name" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: 'John Doe', ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: 'senderEmail', render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Your Email" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: 'you@example.com', type: 'email', ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(Separator, { className: 'my-4' }), _jsx(FormField, { control: form.control, name: 'inviteeEmail', render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Invitee's Email" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: 'colleague@example.com', type: 'email', ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: 'message', render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Message (Optional)" }), _jsx(FormControl, { children: _jsx("textarea", { className: 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', placeholder: "I'd like to invite you to check out Synapses!", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: 'flex justify-end gap-2 pt-2', children: [_jsx(Button, { type: 'button', variant: 'outline', onClick: () => onOpenChange(false), children: "Cancel" }), _jsx(Button, { type: 'submit', disabled: isSubmitting, children: isSubmitting ? 'Sending...' : 'Send Invitation' })] })] }) })] }) }));
};
export default InviteDialog;
