import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Download,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
/**
 * Enhanced message component with streaming animation, reactions, and rich content support
 * Provides professional UI for SFDR compliance conversations
 */
export const EnhancedMessage = ({
  id,
  type,
  content,
  timestamp,
  isLoading = false,
  isStreaming = false,
  confidence,
  messageType = 'text',
  metadata,
  onReaction,
  onCopy,
  onExport
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  // Streaming text animation effect
  useEffect(() => {
    if (isStreaming && content) {
      setDisplayedContent('');
      let currentIndex = 0;
      const streamInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(streamInterval);
        }
      }, 20); // Adjust speed as needed
      return () => clearInterval(streamInterval);
    } else {
      setDisplayedContent(content);
    }
    // Explicitly return undefined for non-streaming case
    return undefined;
  }, [content, isStreaming]);
  /**
   * Handle copying message content to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied to clipboard',
        description: 'Message content has been copied.'
      });
      onCopy?.(content);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard.',
        variant: 'destructive'
      });
    }
  };
  /**
   * Handle user reaction to message
   */
  const handleReaction = reaction => {
    setUserReaction(reaction);
    onReaction?.(id, reaction);
    toast({
      title: 'Feedback recorded',
      description: `Thank you for your ${reaction === 'like' ? 'positive' : 'constructive'} feedback.`
    });
  };
  /**
   * Handle exporting message
   */
  const handleExport = () => {
    onExport?.(id);
    toast({
      title: 'Export initiated',
      description: 'Message is being prepared for export.'
    });
  };
  /**
   * Get avatar configuration based on message type
   */
  const getAvatarConfig = () => {
    switch (type) {
      case 'agent':
        return {
          icon: _jsx(Bot, { className: 'h-4 w-4' }),
          fallback: 'AI',
          className: 'bg-blue-500 text-white'
        };
      case 'user':
        return {
          icon: _jsx(User, { className: 'h-4 w-4' }),
          fallback: 'U',
          className: 'bg-green-500 text-white'
        };
      case 'system':
        return {
          icon: _jsx(Sparkles, { className: 'h-4 w-4' }),
          fallback: 'SYS',
          className: 'bg-purple-500 text-white'
        };
      default:
        return {
          icon: _jsx(Bot, { className: 'h-4 w-4' }),
          fallback: 'AI',
          className: 'bg-gray-500 text-white'
        };
    }
  };
  /**
   * Render content based on message type
   */
  const renderContent = () => {
    if (isLoading) {
      return _jsxs('div', {
        className: 'flex items-center space-x-2',
        children: [
          _jsx(motion.div, {
            animate: {
              rotate: 360
            },
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            },
            children: _jsx(Clock, { className: 'h-4 w-4 text-muted-foreground' })
          }),
          _jsx('span', {
            className: 'text-muted-foreground',
            children: 'Processing your request...'
          })
        ]
      });
    }
    switch (messageType) {
      case 'compliance-report':
        return _jsxs('div', {
          className: 'space-y-3',
          children: [
            _jsxs('div', {
              className: 'flex items-center space-x-2',
              children: [
                _jsx(CheckCircle2, { className: 'h-4 w-4 text-green-500' }),
                _jsx(Badge, { variant: 'outline', children: 'Compliance Report' })
              ]
            }),
            _jsx('div', {
              className: 'prose prose-sm max-w-none',
              children: _jsx('pre', {
                className: 'whitespace-pre-wrap font-sans',
                children: displayedContent
              })
            })
          ]
        });
      case 'risk-analysis':
        return _jsxs('div', {
          className: 'space-y-3',
          children: [
            _jsxs('div', {
              className: 'flex items-center space-x-2',
              children: [
                _jsx(AlertCircle, { className: 'h-4 w-4 text-orange-500' }),
                _jsx(Badge, { variant: 'outline', children: 'Risk Analysis' }),
                confidence &&
                  _jsxs(Badge, {
                    variant: 'secondary',
                    children: [Math.round(confidence * 100), '% confidence']
                  })
              ]
            }),
            _jsx('div', {
              className: 'prose prose-sm max-w-none',
              children: _jsx('pre', {
                className: 'whitespace-pre-wrap font-sans',
                children: displayedContent
              })
            })
          ]
        });
      case 'code':
        return _jsxs('div', {
          className: 'space-y-2',
          children: [
            _jsx(Badge, { variant: 'outline', children: 'Code' }),
            _jsx('pre', {
              className: 'bg-muted p-3 rounded-md overflow-x-auto',
              children: _jsx('code', { children: displayedContent })
            })
          ]
        });
      default:
        return _jsx('div', {
          className: 'prose prose-sm max-w-none',
          children: _jsx('p', {
            className: 'whitespace-pre-wrap font-thin text-base',
            children: displayedContent
          })
        });
    }
  };
  const avatarConfig = getAvatarConfig();
  return _jsx(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.3
    },
    className: cn('group relative', type === 'user' ? 'ml-12' : 'mr-12'),
    onMouseEnter: () => setShowActions(true),
    onMouseLeave: () => setShowActions(false),
    children: _jsxs(Card, {
      className: cn(
        'relative',
        type === 'user' ? 'bg-blue-50 border-blue-200' : 'bg-white',
        isStreaming && 'border-blue-300 shadow-sm'
      ),
      children: [
        _jsx(CardContent, {
          className: 'p-4',
          children: _jsxs('div', {
            className: 'flex space-x-3',
            children: [
              _jsxs(Avatar, {
                className: cn('h-8 w-8', avatarConfig.className),
                children: [
                  _jsx(AvatarFallback, { children: avatarConfig.fallback }),
                  avatarConfig.icon
                ]
              }),
              _jsxs('div', {
                className: 'flex-1 space-y-2',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center justify-between',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center space-x-2',
                        children: [
                          _jsx('span', {
                            className: 'text-sm font-medium',
                            children:
                              type === 'agent'
                                ? metadata?.agentRole || 'SFDR Navigator'
                                : type === 'user'
                                  ? 'You'
                                  : 'System'
                          }),
                          _jsx('span', {
                            className: 'text-xs text-muted-foreground',
                            children: timestamp.toLocaleTimeString()
                          })
                        ]
                      }),
                      metadata?.processingTime &&
                        _jsxs(Badge, {
                          variant: 'secondary',
                          className: 'text-xs',
                          children: [metadata.processingTime, 'ms']
                        })
                    ]
                  }),
                  renderContent(),
                  metadata?.sources &&
                    metadata.sources.length > 0 &&
                    _jsxs('div', {
                      className: 'mt-3 pt-2 border-t',
                      children: [
                        _jsx('p', {
                          className: 'text-xs text-muted-foreground mb-1',
                          children: 'Sources:'
                        }),
                        _jsx('div', {
                          className: 'flex flex-wrap gap-1',
                          children: metadata.sources.map((source, index) =>
                            _jsx(
                              Badge,
                              { variant: 'outline', className: 'text-xs', children: source },
                              index
                            )
                          )
                        })
                      ]
                    })
                ]
              })
            ]
          })
        }),
        _jsx(AnimatePresence, {
          children:
            showActions &&
            type === 'agent' &&
            !isLoading &&
            _jsxs(motion.div, {
              initial: {
                opacity: 0,
                scale: 0.9
              },
              animate: {
                opacity: 1,
                scale: 1
              },
              exit: {
                opacity: 0,
                scale: 0.9
              },
              className:
                'absolute -right-2 top-2 flex flex-col space-y-1 bg-white border rounded-lg shadow-lg p-1',
              children: [
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: handleCopy,
                  className: 'h-8 w-8 p-0',
                  children: _jsx(Copy, { className: 'h-3 w-3' })
                }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: () => handleReaction('like'),
                  className: cn(
                    'h-8 w-8 p-0',
                    userReaction === 'like' && 'bg-green-100 text-green-600'
                  ),
                  children: _jsx(ThumbsUp, { className: 'h-3 w-3' })
                }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: () => handleReaction('dislike'),
                  className: cn(
                    'h-8 w-8 p-0',
                    userReaction === 'dislike' && 'bg-red-100 text-red-600'
                  ),
                  children: _jsx(ThumbsDown, { className: 'h-3 w-3' })
                }),
                _jsx(Separator, { className: 'my-1' }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: handleExport,
                  className: 'h-8 w-8 p-0',
                  children: _jsx(Download, { className: 'h-3 w-3' })
                })
              ]
            })
        }),
        isStreaming &&
          _jsx(motion.div, {
            animate: {
              opacity: [0.5, 1, 0.5]
            },
            transition: {
              duration: 1.5,
              repeat: Infinity
            },
            className: 'absolute bottom-2 right-2',
            children: _jsx('div', { className: 'h-2 w-2 bg-blue-500 rounded-full' })
          })
      ]
    })
  });
};
