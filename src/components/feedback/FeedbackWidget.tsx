// React import removed - using modern JSX transform
import { useState, useEffect } from 'react';
import { X, MessageCircle, Star, Camera, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  page: string;
  timestamp: Date;
  userAgent: string;
  screenshot?: string;
}

interface FeedbackWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  showScreenshot?: boolean;
  apiEndpoint?: string;
}

/**
 * Comprehensive feedback widget component for collecting user feedback
 * Supports ratings, categories, comments, and optional screenshots
 * Integrates with analytics and feedback management systems
 */
const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  position = 'bottom-right',
  primaryColor = '#3B82F6',
  showScreenshot = true,
  apiEndpoint = '/api/feedback'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'trigger' | 'rating' | 'category' | 'details' | 'success'>('trigger');
  const [feedback, setFeedback] = useState<Partial<FeedbackData>>({
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
  const handleRatingSelect = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
    setStep('category');
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setFeedback(prev => ({ ...prev, category }));
    setStep('details');
  };

  // Handle screenshot capture
  const captureScreenshot = async (): Promise<void> => {
    try {
      // Use html2canvas or similar library for screenshot capture
      // This is a placeholder for the actual implementation
      const canvas = document.createElement('canvas');
      // Implementation would go here
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
          'Content-Type': 'application/json',
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
  const handleQuickFeedback = async (type: 'positive' | 'negative') => {
    try {
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  // Auto-hide success message
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        resetWidget();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className={getPositionStyles()}>
      {/* Quick Feedback Notification */}
      {showQuickFeedback && (
        <div className="mb-4 p-3 bg-green-500 text-white rounded-lg shadow-lg animate-in slide-in-from-bottom">
          <p className="text-sm font-medium">Thanks for your feedback! 🙏</p>
        </div>
      )}

      {/* Main Widget */}
      {!isOpen ? (
        <div className="flex flex-col gap-2">
          {/* Quick Feedback Buttons */}
          <div className="flex gap-2 opacity-75 hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-lg hover:bg-green-50"
              onClick={() => handleQuickFeedback('positive')}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-lg hover:bg-red-50"
              onClick={() => handleQuickFeedback('negative')}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Trigger Button */}
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      ) : (
        <Card className="w-80 shadow-xl border-0 animate-in slide-in-from-bottom duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {step === 'rating' && 'Rate Your Experience'}
                {step === 'category' && 'What Type of Feedback?'}
                {step === 'details' && 'Tell Us More'}
                {step === 'success' && 'Thank You!'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetWidget}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Rating Step */}
            {step === 'rating' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  How would you rate your experience on this page?
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingSelect(star)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= feedback.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Step */}
            {step === 'category' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  What would you like to share feedback about?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="h-auto p-3 text-left justify-start hover:bg-blue-50"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span className="text-xs">{category.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Details Step */}
            {step === 'details' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {categories.find(c => c.id === feedback.category)?.icon}
                    {categories.find(c => c.id === feedback.category)?.label}
                  </Badge>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Your feedback (optional)
                  </label>
                  <Textarea
                    placeholder="Tell us more about your experience..."
                    value={feedback.message}
                    onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                {showScreenshot && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={captureScreenshot}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Attach Screenshot
                  </Button>
                )}

                <Button
                  onClick={submitFeedback}
                  disabled={isSubmitting}
                  className="w-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </div>
                  )}
                </Button>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="text-center space-y-3">
                <div className="text-4xl">🎉</div>
                <p className="text-sm text-gray-600">
                  Thank you for your feedback! It helps us improve the experience for everyone.
                </p>
                <p className="text-xs text-gray-500">
                  This window will close automatically in a few seconds.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trigger Button for First Time */}
      {step === 'trigger' && !isOpen && (
        <Button
          onClick={() => setStep('rating')}
          className="mt-2 text-xs opacity-75 hover:opacity-100"
          variant="ghost"
          size="sm"
        >
          Detailed Feedback
        </Button>
      )}
    </div>
  );
};

export default FeedbackWidget;