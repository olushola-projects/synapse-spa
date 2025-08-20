import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ThumbsUp, ThumbsDown, BookOpen, AlertCircle, Send, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
// Sample team members for the modal
const teamMembers = [
  {
    name: 'Dara Zhang',
    role: 'Lead AI Expert',
    avatar: 'https://i.pravatar.cc/150?u=dara',
    bio: 'Dara leads our AI team with 10+ years of experience in regulatory technology and compliance AI.'
  },
  {
    name: 'Alex Thompson',
    role: 'AML Subject Matter Expert',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    bio: 'Former compliance officer with 15 years of experience in global financial institutions, specializing in AML regulations.'
  },
  {
    name: 'Sarah Patel',
    role: 'Regulatory Reporting Specialist',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    bio: '8 years of experience in regulatory reporting across multiple jurisdictions, focusing on EU and UK frameworks.'
  },
  {
    name: 'Michael Chen',
    role: 'Legal & Compliance Advisor',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    bio: 'Corporate lawyer with expertise in translating complex regulations into actionable compliance guidance.'
  }
];
// Sample response for the AMLD6 query
const sampleResponse = {
  query: 'What is the Penalty under AMLD6 and criminal liability extension?',
  answer: `The 6th Anti-Money Laundering Directive (AMLD6) significantly expanded penalties and criminal liability in several key ways:

1. **Increased Maximum Imprisonment**: AMLD6 establishes a minimum maximum term of imprisonment of at least 4 years for money laundering offenses, up from the previous requirements.

2. **Extended Criminal Liability**: Perhaps most significantly, AMLD6 extends criminal liability to legal persons (companies and organizations) in addition to natural persons (individuals). Companies can now be held criminally liable for money laundering offenses committed for their benefit by individuals in leadership positions or due to lack of supervision.

3. **Expanded Predicate Offenses**: The directive defined 22 specific predicate offenses that constitute money laundering activities, including new additions like cybercrime, environmental crime, and tax crimes.

4. **Additional Sanctions**: Beyond imprisonment, sanctions may include:
   - Exclusion from public benefits or aid
   - Temporary or permanent ban from commercial activities
   - Placement under judicial supervision
   - Judicial winding-up orders
   - Temporary or permanent closure of establishments
   - Fines that can reach up to €5 million or 10% of total annual turnover

**Regulatory Reference**: Articles 6, 7, 8, and 10 of Directive (EU) 2018/1673 of the European Parliament and of the Council of 23 October 2018 on combating money laundering by criminal law.`,
  sources: [
    'Directive (EU) 2018/1673 of the European Parliament and of the Council of 23 October 2018',
    'European Banking Authority Guidelines on AMLD6 Implementation, 2020',
    'European Commission Report on AMLD6 National Implementations, 2021'
  ],
  timestamp: new Date().toISOString(),
  examples: [
    {
      title: 'Corporate Liability Example',
      description:
        "A bank's senior management knowingly approves transactions despite red flags for money laundering. Under AMLD6, both the executives and the bank itself could face criminal liability."
    },
    {
      title: 'Cross-Border Application',
      description:
        'A German company with operations in France fails to implement adequate AML controls. Money laundering occurs through its French subsidiary. The company could face prosecution in both jurisdictions.'
    },
    {
      title: 'Aiding and Abetting Case',
      description:
        "A financial advisor provides guidance on how to structure transactions to avoid detection. Under AMLD6, they could be criminally liable even if they didn't directly handle illicit funds."
    }
  ]
};
const AskDara = () => {
  // const { user } = useAuth(); // user variable removed - not used in this component
  const [query, setQuery] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const handleSubmit = () => {
    if (!query.trim()) {
      toast({
        title: 'Empty query',
        description: 'Please enter your question',
        variant: 'destructive'
      });
      return;
    }
    // In a real implementation, this would call your API
    // For now, we'll just simulate a response
    setIsSubmitted(true);
  };
  const handleFeedback = type => {
    setFeedback(type);
    if (type === 'negative') {
      setIsFeedbackDialogOpen(true);
    } else {
      toast({
        title: 'Thank you for your feedback!',
        description: 'Your feedback helps us improve our responses.'
      });
    }
  };
  const submitFeedbackComment = () => {
    // In a real implementation, this would submit to your API
    toast({
      title: 'Feedback submitted',
      description: 'Thank you for helping us improve!'
    });
    setIsFeedbackDialogOpen(false);
  };
  return _jsx(DashboardLayout, {
    children: _jsxs('div', {
      className: 'container max-w-4xl py-8',
      children: [
        _jsxs('div', {
          className: 'flex items-center justify-between mb-6',
          children: [
            _jsxs('div', {
              children: [
                _jsx('h1', { className: 'text-3xl font-bold', children: 'Ask Dara' }),
                _jsx('p', {
                  className: 'text-gray-500 mt-1',
                  children: 'Get expert answers to your GRC questions'
                })
              ]
            }),
            _jsxs(Button, {
              variant: 'outline',
              onClick: () => setIsTeamDialogOpen(true),
              children: [_jsx(Info, { className: 'w-4 h-4 mr-2' }), 'About Dara']
            })
          ]
        }),
        _jsxs(Card, {
          className: 'mb-8',
          children: [
            _jsxs(CardHeader, {
              children: [
                _jsx(CardTitle, { children: 'Ask Your Question' }),
                _jsx(CardDescription, {
                  children:
                    'Ask anything about regulatory compliance, AML, risk management, and more'
                })
              ]
            }),
            _jsxs(CardContent, {
              children: [
                _jsx(Textarea, {
                  placeholder: 'Example: What are the key changes in AMLD6 compared to AMLD5?',
                  value: query,
                  onChange: e => setQuery(e.target.value),
                  rows: 3,
                  className: 'mb-4',
                  disabled: isSubmitted
                }),
                !isSubmitted &&
                  _jsx('div', {
                    className: 'flex justify-end',
                    children: _jsxs(Button, {
                      onClick: handleSubmit,
                      children: [_jsx(Send, { className: 'w-4 h-4 mr-2' }), 'Send Question']
                    })
                  })
              ]
            })
          ]
        }),
        isSubmitted &&
          _jsxs(Card, {
            children: [
              _jsxs(CardHeader, {
                children: [
                  _jsx(CardTitle, { children: 'Response' }),
                  _jsx(CardDescription, { children: 'Answered by Dara AI with expert oversight' })
                ]
              }),
              _jsxs(CardContent, {
                children: [
                  _jsxs('div', {
                    className: 'mb-4',
                    children: [
                      _jsx('div', {
                        className: 'bg-gray-50 p-4 rounded-lg mb-4',
                        children: _jsx('p', {
                          className: 'font-medium text-gray-800',
                          children: sampleResponse.query
                        })
                      }),
                      _jsx('div', {
                        className: 'prose max-w-none',
                        children: _jsx('div', {
                          className: 'whitespace-pre-line',
                          children: sampleResponse.answer
                        })
                      })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6',
                    children: [
                      _jsxs('h3', {
                        className: 'flex items-center text-blue-800 font-medium mb-2',
                        children: [_jsx(BookOpen, { className: 'w-4 h-4 mr-2' }), ' Examples']
                      }),
                      _jsx('div', {
                        className: 'space-y-3',
                        children: sampleResponse.examples.map((example, index) =>
                          _jsxs(
                            'div',
                            {
                              className: 'bg-white p-3 rounded border border-blue-100',
                              children: [
                                _jsx('h4', {
                                  className: 'font-medium text-blue-900 mb-1',
                                  children: example.title
                                }),
                                _jsx('p', {
                                  className: 'text-sm text-gray-700',
                                  children: example.description
                                })
                              ]
                            },
                            index
                          )
                        )
                      })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'border-t pt-4',
                    children: [
                      _jsx('h3', { className: 'text-sm font-medium mb-2', children: 'Sources' }),
                      _jsx('ul', {
                        className: 'text-sm text-gray-600 space-y-1 list-disc pl-5',
                        children: sampleResponse.sources.map((source, index) =>
                          _jsx('li', { children: source }, index)
                        )
                      })
                    ]
                  }),
                  _jsx(Separator, { className: 'my-6' }),
                  _jsxs('div', {
                    className:
                      'bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start',
                    children: [
                      _jsx(AlertCircle, { className: 'w-5 h-5 text-amber-500 mr-3 mt-0.5' }),
                      _jsxs('div', {
                        children: [
                          _jsx('h3', {
                            className: 'text-sm font-medium text-amber-800 mb-1',
                            children: 'Disclaimer'
                          }),
                          _jsx('p', {
                            className: 'text-xs text-amber-700',
                            children:
                              'This information is provided for general guidance only and should not be relied upon as legal advice. The application of regulations may vary based on specific circumstances. Always consult with a qualified legal professional for advice on your particular situation.'
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              _jsxs(CardFooter, {
                className: 'flex justify-between border-t pt-6',
                children: [
                  _jsxs('div', {
                    className: 'flex gap-2',
                    children: [
                      _jsxs(Button, {
                        variant: feedback === 'positive' ? 'default' : 'outline',
                        size: 'sm',
                        onClick: () => handleFeedback('positive'),
                        children: [_jsx(ThumbsUp, { className: 'w-4 h-4 mr-2' }), 'Helpful']
                      }),
                      _jsxs(Button, {
                        variant: feedback === 'negative' ? 'default' : 'outline',
                        size: 'sm',
                        onClick: () => handleFeedback('negative'),
                        children: [_jsx(ThumbsDown, { className: 'w-4 h-4 mr-2' }), 'Not Helpful']
                      })
                    ]
                  }),
                  _jsx(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => {
                      setQuery('');
                      setIsSubmitted(false);
                      setFeedback(null);
                    },
                    children: 'Ask Another Question'
                  })
                ]
              })
            ]
          }),
        _jsx(Dialog, {
          open: isTeamDialogOpen,
          onOpenChange: setIsTeamDialogOpen,
          children: _jsxs(DialogContent, {
            className: 'sm:max-w-[600px]',
            children: [
              _jsxs(DialogHeader, {
                children: [
                  _jsx(DialogTitle, { children: 'Meet Dara & The Team' }),
                  _jsx(DialogDescription, {
                    children: 'Dara is powered by AI with oversight from regulatory experts'
                  })
                ]
              }),
              _jsxs('div', {
                className: 'py-4 space-y-6',
                children: [
                  _jsxs('div', {
                    className: 'flex items-start gap-4',
                    children: [
                      _jsxs(Avatar, {
                        className: 'w-16 h-16',
                        children: [
                          _jsx(AvatarImage, {
                            src: teamMembers[0]?.avatar,
                            alt: teamMembers[0]?.name
                          }),
                          _jsx(AvatarFallback, { children: teamMembers[0]?.name?.charAt(0) })
                        ]
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('h3', {
                            className: 'font-medium text-lg',
                            children: teamMembers[0]?.name
                          }),
                          _jsx('p', {
                            className: 'text-blue-600 text-sm mb-2',
                            children: teamMembers[0]?.role
                          }),
                          _jsx('p', { className: 'text-gray-600', children: teamMembers[0]?.bio })
                        ]
                      })
                    ]
                  }),
                  _jsx(Separator, {}),
                  _jsx('div', {
                    className: 'grid grid-cols-1 md:grid-cols-3 gap-6',
                    children: teamMembers.slice(1).map((member, index) =>
                      _jsxs(
                        'div',
                        {
                          className: 'text-center',
                          children: [
                            _jsxs(Avatar, {
                              className: 'w-16 h-16 mx-auto mb-3',
                              children: [
                                _jsx(AvatarImage, { src: member.avatar, alt: member.name }),
                                _jsx(AvatarFallback, { children: member.name.charAt(0) })
                              ]
                            }),
                            _jsx('h4', { className: 'font-medium', children: member.name }),
                            _jsx('p', {
                              className: 'text-blue-600 text-sm mb-1',
                              children: member.role
                            }),
                            _jsx('p', {
                              className: 'text-xs text-gray-600',
                              children: member.bio
                            })
                          ]
                        },
                        index
                      )
                    )
                  }),
                  _jsxs('div', {
                    className: 'bg-blue-50 p-4 rounded-lg',
                    children: [
                      _jsx('h3', { className: 'font-medium mb-2', children: 'How Dara Works' }),
                      _jsx('p', {
                        className: 'text-sm text-gray-700',
                        children:
                          'Dara combines advanced AI with human expert oversight to provide accurate, up-to-date regulatory guidance. All answers are reviewed for accuracy and include source citations and relevant disclaimers.'
                      })
                    ]
                  })
                ]
              }),
              _jsx(DialogFooter, {
                children: _jsx(Button, {
                  onClick: () => setIsTeamDialogOpen(false),
                  children: 'Close'
                })
              })
            ]
          })
        }),
        _jsx(Dialog, {
          open: isFeedbackDialogOpen,
          onOpenChange: setIsFeedbackDialogOpen,
          children: _jsxs(DialogContent, {
            className: 'sm:max-w-[425px]',
            children: [
              _jsxs(DialogHeader, {
                children: [
                  _jsx(DialogTitle, { children: 'What could be improved?' }),
                  _jsx(DialogDescription, {
                    children:
                      "Your feedback helps us improve Dara's responses. What was missing or incorrect?"
                  })
                ]
              }),
              _jsx('div', {
                className: 'grid gap-4 py-4',
                children: _jsx(Textarea, {
                  placeholder: 'Please tell us what was incorrect or missing from the response...',
                  value: feedbackComment,
                  onChange: e => setFeedbackComment(e.target.value),
                  rows: 4
                })
              }),
              _jsxs(DialogFooter, {
                children: [
                  _jsx(Button, {
                    variant: 'outline',
                    onClick: () => setIsFeedbackDialogOpen(false),
                    children: 'Cancel'
                  }),
                  _jsx(Button, { onClick: submitFeedbackComment, children: 'Submit Feedback' })
                ]
              })
            ]
          })
        })
      ]
    })
  });
};
export default AskDara;
