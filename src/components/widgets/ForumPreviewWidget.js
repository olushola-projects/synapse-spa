import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { Widget } from '../dashboard/WidgetGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// Sample forum posts
const forumPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      role: 'AML Expert'
    },
    title: 'AMLD6 Implementation Challenges',
    content:
      'Has anyone developed a checklist for ensuring company compliance with the cybersecurity requirements in AMLD6?',
    replies: 12,
    views: 240,
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    user: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      role: 'Compliance Officer'
    },
    title: 'Cross-border Data Transfer Under GDPR',
    content:
      'Looking for guidance on how others are handling the new EU-US data transfer framework after Privacy Shield invalidation.',
    replies: 8,
    views: 189,
    timestamp: '6 hours ago'
  },
  {
    id: 3,
    user: {
      name: 'Emma Watson',
      avatar: 'https://i.pravatar.cc/150?u=emma',
      role: 'Legal Counsel'
    },
    title: 'AML Jurisdictional Conflicts',
    content:
      'How are firms reconciling contradictory requirements between UK and UAE AML frameworks?',
    replies: 5,
    views: 102,
    timestamp: '1 day ago'
  }
];
const ForumPreviewWidget = ({ onRemove }) => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitWaitlist = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }
    // In production, this would call your API
    toast({
      title: 'Success!',
      description: "You've been added to the waitlist"
    });
    setSubmitted(true);
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx(Widget, {
        title: 'Community Forum',
        onRemove: onRemove,
        children: _jsxs('div', {
          className: 'space-y-4',
          children: [
            forumPosts.map(post =>
              _jsx(
                Card,
                {
                  className: 'hover:border-blue-200 transition-colors cursor-pointer',
                  children: _jsxs(CardContent, {
                    className: 'p-4',
                    children: [
                      _jsxs('div', {
                        className: 'flex justify-between mb-2',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center',
                            children: [
                              _jsxs(Avatar, {
                                className: 'h-6 w-6 mr-2',
                                children: [
                                  _jsx(AvatarImage, { src: post.user.avatar, alt: post.user.name }),
                                  _jsx(AvatarFallback, { children: post.user.name.charAt(0) })
                                ]
                              }),
                              _jsx('span', {
                                className: 'text-sm font-medium',
                                children: post.user.name
                              }),
                              _jsx('span', {
                                className:
                                  'text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full ml-2',
                                children: post.user.role
                              })
                            ]
                          }),
                          _jsx('span', {
                            className: 'text-xs text-gray-500',
                            children: post.timestamp
                          })
                        ]
                      }),
                      _jsx('h3', { className: 'font-medium mb-1', children: post.title }),
                      _jsx('p', {
                        className: 'text-sm text-gray-600 mb-3',
                        children: post.content
                      }),
                      _jsxs('div', {
                        className: 'flex items-center text-xs text-gray-500',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center mr-4',
                            children: [
                              _jsx(MessageSquare, { className: 'w-3 h-3 mr-1' }),
                              post.replies,
                              ' replies'
                            ]
                          }),
                          _jsxs('div', { children: [post.views, ' views'] })
                        ]
                      })
                    ]
                  })
                },
                post.id
              )
            ),
            _jsx('div', {
              className: 'pt-4 border-t',
              children: _jsxs('div', {
                className: 'text-center',
                children: [
                  _jsx('p', {
                    className: 'text-sm text-gray-600 mb-4',
                    children:
                      'Our community forum is currently in beta. Join the waitlist for early access!'
                  }),
                  _jsx(Button, {
                    onClick: () => setIsWaitlistOpen(true),
                    children: 'Join Waitlist'
                  })
                ]
              })
            })
          ]
        })
      }),
      _jsx(Dialog, {
        open: isWaitlistOpen,
        onOpenChange: setIsWaitlistOpen,
        children: _jsxs(DialogContent, {
          className: 'sm:max-w-[425px]',
          children: [
            _jsxs(DialogHeader, {
              children: [
                _jsx(DialogTitle, { children: 'Join Forum Waitlist' }),
                _jsx(DialogDescription, {
                  children: submitted
                    ? "Thank you for joining the waitlist! We'll notify you when forum access is available."
                    : 'Get early access to our community forum where GRC professionals share insights and best practices.'
                })
              ]
            }),
            !submitted &&
              _jsxs(_Fragment, {
                children: [
                  _jsx('div', {
                    className: 'grid gap-4 py-4',
                    children: _jsxs('div', {
                      className: 'grid gap-2',
                      children: [
                        _jsx('label', {
                          htmlFor: 'email',
                          className: 'text-sm font-medium',
                          children: 'Email Address'
                        }),
                        _jsx(Input, {
                          id: 'email',
                          placeholder: 'you@example.com',
                          value: email,
                          onChange: e => setEmail(e.target.value),
                          autoComplete: 'email'
                        })
                      ]
                    })
                  }),
                  _jsx(DialogFooter, {
                    children: _jsx(Button, {
                      type: 'submit',
                      onClick: handleSubmitWaitlist,
                      children: 'Join Waitlist'
                    })
                  })
                ]
              }),
            submitted &&
              _jsxs('div', {
                className: 'py-4 text-center',
                children: [
                  _jsx('div', {
                    className:
                      'inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4',
                    children: _jsx('svg', {
                      className: 'w-8 h-8 text-green-600',
                      fill: 'none',
                      stroke: 'currentColor',
                      viewBox: '0 0 24 24',
                      xmlns: 'http://www.w3.org/2000/svg',
                      children: _jsx('path', {
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 2,
                        d: 'M5 13l4 4L19 7'
                      })
                    })
                  }),
                  _jsx(Button, { onClick: () => setIsWaitlistOpen(false), children: 'Close' })
                ]
              })
          ]
        })
      })
    ]
  });
};
export default ForumPreviewWidget;
