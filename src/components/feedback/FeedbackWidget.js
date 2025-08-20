import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// React import removed - using modern JSX transform
import { useState, useEffect } from 'react';
import { X, MessageCircle, Star, Camera, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
/**
 * Comprehensive feedback widget component for collecting user feedback
 * Supports ratings, categories, comments, and optional screenshots
 * Integrates with analytics and feedback management systems
 */
const FeedbackWidget = ({
  position = 'bottom-right',
  primaryColor = '#3B82F6',
  showScreenshot = true,
  apiEndpoint = 'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/feedback'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('trigger');
  const [feedback, setFeedback] = useState({
    rating: 0,
    category: '',
    message: '',
    page: window.location.pathname,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickFeedback, setShowQuickFeedback] = useState(false);
  // Feedback categories for better organization
  const categories = [
    { id: 'usability', label: 'Usability Issue', icon: '🔧' },
    { id: 'content', label: 'Content Feedback', icon: '📝' },
    { id: 'bug', label: 'Bug Report', icon: '🐛' },
    { id: 'feature', label: 'Feature Request', icon: '💡' },
    { id: 'performance', label: 'Performance Issue', icon: '⚡' },
    { id: 'general', label: 'General Feedback', icon: '💬' }
  ];
  // Position styles for the widget
  const getPositionStyles = () => {
    const baseStyles = 'fixed z-50 transition-all duration-300';
    switch (position) {
      case 'bottom-right':
        return `${baseStyles} bottom-6 right-6`;
      case 'bottom-left':
        return `${baseStyles} bottom-6 left-6`;
      case 'top-right':
        return `${baseStyles} top-6 right-6`;
      case 'top-left':
        return `${baseStyles} top-6 left-6`;
      default:
        return `${baseStyles} bottom-6 right-6`;
    }
  };
  // Handle rating selection
  const handleRatingSelect = rating => {
    setFeedback(prev => ({ ...prev, rating }));
    setStep('category');
  };
  // Handle category selection
  const handleCategorySelect = category => {
    setFeedback(prev => ({ ...prev, category }));
    setStep('details');
  };
  // Handle screenshot capture
  const captureScreenshot = async () => {
    try {
      // Use html2canvas or similar library for screenshot capture
      // This is a placeholder for the actual implementation
      console.log('Screenshot capture would be implemented here');
      return Promise.resolve();
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return Promise.reject(error);
    }
  };
  // Submit feedback to backend
  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...feedback,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          url: window.location.href
        })
      });
      if (response.ok) {
        setStep('success');
        // Track feedback submission event
        if (typeof window !== 'undefined' && 'gtag' in window) {
          window.gtag('event', 'feedback_submitted', {
            event_category: 'engagement',
            event_label: feedback.category,
            value: feedback.rating
          });
        }
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle quick feedback (thumbs up/down)
  const handleQuickFeedback = async type => {
    try {
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: type === 'positive' ? 5 : 1,
          category: 'quick_feedback',
          message: `Quick ${type} feedback`,
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });
      setShowQuickFeedback(true);
      setTimeout(() => setShowQuickFeedback(false), 2000);
    } catch (error) {
      console.error('Quick feedback error:', error);
    }
  };
  // Reset widget state
  const resetWidget = () => {
    setStep('trigger');
    setFeedback({
      rating: 0,
      category: '',
      message: '',
      page: window.location.pathname,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    });
    setIsOpen(false);
  };
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        resetWidget();
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step]);
  return _jsxs('div', {
    className: getPositionStyles(),
    children: [
      showQuickFeedback &&
        _jsx('div', {
          className:
            'mb-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-in slide-in-from-bottom',
          children: _jsx('p', {
            className: 'text-sm font-medium',
            children: 'Thanks for your feedback! \uD83D\uDE4F'
          })
        }),
      !isOpen
        ? _jsxs('div', {
            className: 'flex flex-col gap-2',
            children: [
              _jsxs('div', {
                className: 'flex gap-2 opacity-75 hover:opacity-100 transition-opacity',
                children: [
                  _jsx(Button, {
                    size: 'sm',
                    variant: 'outline',
                    className: 'bg-white shadow-lg hover:bg-green-50',
                    onClick: () => handleQuickFeedback('positive'),
                    children: _jsx(ThumbsUp, { className: 'h-4 w-4' })
                  }),
                  _jsx(Button, {
                    size: 'sm',
                    variant: 'outline',
                    className: 'bg-white shadow-lg hover:bg-red-50',
                    onClick: () => handleQuickFeedback('negative'),
                    children: _jsx(ThumbsDown, { className: 'h-4 w-4' })
                  })
                ]
              }),
              _jsx(Button, {
                onClick: () => setIsOpen(true),
                className:
                  'rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                style: { backgroundColor: primaryColor },
                children: _jsx(MessageCircle, { className: 'h-6 w-6' })
              })
            ]
          })
        : _jsxs(Card, {
            className: 'w-80 shadow-xl border-0 animate-in slide-in-from-bottom duration-300',
            children: [
              _jsx(CardHeader, {
                className: 'pb-3',
                children: _jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    _jsxs(CardTitle, {
                      className: 'text-lg font-semibold',
                      children: [
                        step === 'rating' && 'Rate Your Experience',
                        step === 'category' && 'What Type of Feedback?',
                        step === 'details' && 'Tell Us More',
                        step === 'success' && 'Thank You!'
                      ]
                    }),
                    _jsx(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: resetWidget,
                      className: 'h-8 w-8 p-0',
                      children: _jsx(X, { className: 'h-4 w-4' })
                    })
                  ]
                })
              }),
              _jsxs(CardContent, {
                className: 'space-y-4',
                children: [
                  step === 'rating' &&
                    _jsxs('div', {
                      className: 'space-y-4',
                      children: [
                        _jsx('p', {
                          className: 'text-sm text-gray-600',
                          children: 'How would you rate your experience on this page?'
                        }),
                        _jsx('div', {
                          className: 'flex justify-center gap-2',
                          children: [1, 2, 3, 4, 5].map(star =>
                            _jsx(
                              'button',
                              {
                                onClick: () => handleRatingSelect(star),
                                className: 'transition-all duration-200 hover:scale-110',
                                children: _jsx(Star, {
                                  className: `h-8 w-8 ${
                                    star <= feedback.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 hover:text-yellow-300'
                                  }`
                                })
                              },
                              star
                            )
                          )
                        })
                      ]
                    }),
                  step === 'category' &&
                    _jsxs('div', {
                      className: 'space-y-3',
                      children: [
                        _jsx('p', {
                          className: 'text-sm text-gray-600',
                          children: 'What would you like to share feedback about?'
                        }),
                        _jsx('div', {
                          className: 'grid grid-cols-2 gap-2',
                          children: categories.map(category =>
                            _jsxs(
                              Button,
                              {
                                variant: 'outline',
                                className: 'h-auto p-3 text-left justify-start hover:bg-blue-50',
                                onClick: () => handleCategorySelect(category.id),
                                children: [
                                  _jsx('span', { className: 'mr-2', children: category.icon }),
                                  _jsx('span', { className: 'text-xs', children: category.label })
                                ]
                              },
                              category.id
                            )
                          )
                        })
                      ]
                    }),
                  step === 'details' &&
                    _jsxs('div', {
                      className: 'space-y-4',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsxs(Badge, {
                              variant: 'secondary',
                              children: [
                                categories.find(c => c.id === feedback.category)?.icon,
                                categories.find(c => c.id === feedback.category)?.label
                              ]
                            }),
                            _jsx('div', {
                              className: 'flex',
                              children: [1, 2, 3, 4, 5].map(star =>
                                _jsx(
                                  Star,
                                  {
                                    className: `h-4 w-4 ${
                                      star <= feedback.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`
                                  },
                                  star
                                )
                              )
                            })
                          ]
                        }),
                        _jsxs('div', {
                          children: [
                            _jsx('label', {
                              className: 'text-sm font-medium text-gray-700',
                              children: 'Your feedback (optional)'
                            }),
                            _jsx(Textarea, {
                              placeholder: 'Tell us more about your experience...',
                              value: feedback.message,
                              onChange: e =>
                                setFeedback(prev => ({ ...prev, message: e.target.value })),
                              className: 'mt-1 min-h-[80px]'
                            })
                          ]
                        }),
                        showScreenshot &&
                          _jsxs(Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: captureScreenshot,
                            className: 'w-full',
                            children: [
                              _jsx(Camera, { className: 'h-4 w-4 mr-2' }),
                              'Attach Screenshot'
                            ]
                          }),
                        _jsx(Button, {
                          onClick: submitFeedback,
                          disabled: isSubmitting,
                          className: 'w-full',
                          style: { backgroundColor: primaryColor },
                          children: isSubmitting
                            ? _jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  _jsx('div', {
                                    className:
                                      'animate-spin rounded-full h-4 w-4 border-b-2 border-white'
                                  }),
                                  'Submitting...'
                                ]
                              })
                            : _jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [_jsx(Send, { className: 'h-4 w-4' }), 'Submit Feedback']
                              })
                        })
                      ]
                    }),
                  step === 'success' &&
                    _jsxs('div', {
                      className: 'text-center space-y-3',
                      children: [
                        _jsx('div', { className: 'text-4xl', children: '\uD83C\uDF89' }),
                        _jsx('p', {
                          className: 'text-sm text-gray-600',
                          children:
                            'Thank you for your feedback! It helps us improve the experience for everyone.'
                        }),
                        _jsx('p', {
                          className: 'text-xs text-gray-500',
                          children: 'This window will close automatically in a few seconds.'
                        })
                      ]
                    })
                ]
              })
            ]
          }),
      step === 'trigger' &&
        !isOpen &&
        _jsx(Button, {
          onClick: () => setStep('rating'),
          className: 'mt-2 text-xs opacity-75 hover:opacity-100',
          variant: 'ghost',
          size: 'sm',
          children: 'Detailed Feedback'
        })
    ]
  });
};
export default FeedbackWidget;
