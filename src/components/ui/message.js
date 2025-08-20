import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  CheckCircle2,
  Clock,
  FileText,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';
/**
 * Enhanced message component with streaming animation and rich content support
 * Supports multiple content types, reactions, and professional SFDR branding
 */
export const MessageComponent = ({ message, onReaction, onCopy, className }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  /**
   * Handle copying message content to clipboard
   */
  const handleCopy = () => {
    const textContent = message.content
      .filter(c => c.type === 'text')
      .map(c => c.content)
      .join('\n');
    navigator.clipboard.writeText(textContent);
    onCopy?.(textContent);
    toast({
      title: 'Copied to clipboard',
      description: 'Message content has been copied.'
    });
  };
  /**
   * Handle reaction to message
   */
  const handleReaction = reaction => {
    onReaction?.(message.id, reaction);
  };
  /**
   * Get agent avatar based on agent type
   */
  const getAgentAvatar = () => {
    const agentType = message.metadata?.agentType || 'sfdr-expert';
    const avatarMap = {
      'sfdr-expert': '/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png',
      'risk-analyst': '/lovable-uploads/88a5c7a6-e347-41ee-ad94-701d034e7258.png',
      'compliance-officer': '/lovable-uploads/93f022b9-560f-49fe-95a3-72816c483659.png'
    };
    return avatarMap[agentType];
  };
  /**
   * Render different content types
   */
  const renderContent = (content, index) => {
    switch (content.type) {
      case 'code':
        return _jsxs(
          Card,
          {
            className: 'bg-muted p-4 font-mono text-sm',
            children: [
              _jsxs('div', {
                className: 'flex items-center justify-between mb-2',
                children: [
                  _jsx(Badge, { variant: 'secondary', children: content.language || 'code' }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => navigator.clipboard.writeText(content.content),
                    children: _jsx(Copy, { className: 'h-4 w-4' })
                  })
                ]
              }),
              _jsx('pre', { className: 'whitespace-pre-wrap', children: content.content })
            ]
          },
          index
        );
      case 'compliance-report':
        return _jsxs(
          Card,
          {
            className: 'border-green-200 bg-green-50 dark:bg-green-950 p-4',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2 mb-3',
                children: [
                  _jsx(CheckCircle2, { className: 'h-5 w-5 text-green-600' }),
                  _jsx('span', {
                    className: 'font-semibold text-green-800 dark:text-green-200',
                    children: 'SFDR Compliance Report'
                  }),
                  content.metadata?.confidence &&
                    _jsxs(Badge, {
                      variant: 'secondary',
                      children: [Math.round(content.metadata.confidence * 100), '% confidence']
                    })
                ]
              }),
              _jsx('div', {
                className: 'prose prose-sm max-w-none',
                children: _jsx('pre', {
                  className: 'whitespace-pre-wrap text-sm',
                  children: content.content
                })
              })
            ]
          },
          index
        );
      case 'table':
        return _jsxs(
          Card,
          {
            className: 'p-4',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-2 mb-3',
                children: [
                  _jsx(BarChart3, { className: 'h-5 w-5' }),
                  _jsx('span', { className: 'font-semibold', children: 'Data Analysis' })
                ]
              }),
              _jsx('div', {
                className: 'overflow-x-auto',
                children: _jsx('div', {
                  dangerouslySetInnerHTML: {
                    __html: DOMPurify.sanitize(content.content, {
                      ALLOWED_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'],
                      ALLOWED_ATTR: ['class', 'style'],
                      ALLOW_DATA_ATTR: false
                    })
                  }
                })
              })
            ]
          },
          index
        );
      case 'file':
        return _jsx(
          Card,
          {
            className: 'p-4 border-blue-200 bg-blue-50 dark:bg-blue-950',
            children: _jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                _jsx(FileText, { className: 'h-5 w-5 text-blue-600' }),
                _jsx('span', {
                  className: 'font-medium text-blue-800 dark:text-blue-200',
                  children: content.content
                })
              ]
            })
          },
          index
        );
      default:
        return _jsx(
          'div',
          {
            className: 'prose prose-sm max-w-none dark:prose-invert',
            children: message.isStreaming
              ? _jsx(StreamingText, { text: content.content })
              : _jsx('p', { className: 'whitespace-pre-wrap', children: content.content })
          },
          index
        );
    }
  };
  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    className: cn(
      'flex gap-3 p-4',
      isUser ? 'flex-row-reverse' : 'flex-row',
      isSystem && 'justify-center',
      className
    ),
    children: [
      !isSystem &&
        _jsxs(Avatar, {
          className: cn('h-8 w-8', isUser && 'order-2'),
          children: [
            _jsx(AvatarImage, {
              src: isUser ? undefined : getAgentAvatar(),
              alt: isUser ? 'User' : 'SFDR Navigator'
            }),
            _jsx(AvatarFallback, {
              children: isUser
                ? _jsx(User, { className: 'h-4 w-4' })
                : _jsx(Bot, { className: 'h-4 w-4' })
            })
          ]
        }),
      _jsxs('div', {
        className: cn(
          'flex-1 space-y-2',
          isUser ? 'items-end' : 'items-start',
          isSystem && 'text-center'
        ),
        children: [
          !isSystem &&
            _jsxs('div', {
              className: cn(
                'flex items-center gap-2 text-xs text-muted-foreground',
                isUser && 'flex-row-reverse'
              ),
              children: [
                _jsx('span', {
                  className: 'font-medium',
                  children: isUser
                    ? 'You'
                    : message.metadata?.agentType
                        ?.replace('-', ' ')
                        .replace(/\b\w/g, l => l.toUpperCase()) || 'SFDR Navigator'
                }),
                _jsx('span', { children: message.timestamp.toLocaleTimeString() }),
                message.metadata?.processingTime &&
                  _jsxs(Badge, {
                    variant: 'outline',
                    className: 'text-xs',
                    children: [
                      _jsx(Clock, { className: 'h-3 w-3 mr-1' }),
                      message.metadata.processingTime,
                      'ms'
                    ]
                  })
              ]
            }),
          _jsx('div', {
            className: cn('space-y-2', isUser && 'flex flex-col items-end'),
            children: message.content.map((content, index) => renderContent(content, index))
          }),
          _jsx(AnimatePresence, {
            children:
              message.isLoading &&
              _jsxs(motion.div, {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                className: 'flex items-center gap-2 text-sm text-muted-foreground',
                children: [
                  _jsxs('div', {
                    className: 'flex space-x-1',
                    children: [
                      _jsx('div', {
                        className:
                          'w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]'
                      }),
                      _jsx('div', {
                        className:
                          'w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]'
                      }),
                      _jsx('div', { className: 'w-2 h-2 bg-current rounded-full animate-bounce' })
                    ]
                  }),
                  _jsx('span', { children: 'SFDR Navigator is analyzing...' })
                ]
              })
          }),
          !isUser &&
            !isSystem &&
            !message.isLoading &&
            _jsxs('div', {
              className: 'flex items-center gap-2 mt-2',
              children: [
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: handleCopy,
                  className: 'h-8 px-2',
                  children: _jsx(Copy, { className: 'h-3 w-3' })
                }),
                _jsxs('div', {
                  className: 'flex items-center gap-1',
                  children: [
                    _jsxs(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: () => handleReaction('up'),
                      className: cn(
                        'h-8 px-2',
                        message.reactions?.userReaction === 'up' && 'bg-green-100 text-green-700'
                      ),
                      children: [
                        _jsx(ThumbsUp, { className: 'h-3 w-3' }),
                        message.reactions?.thumbsUp || 0
                      ]
                    }),
                    _jsxs(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: () => handleReaction('down'),
                      className: cn(
                        'h-8 px-2',
                        message.reactions?.userReaction === 'down' && 'bg-red-100 text-red-700'
                      ),
                      children: [
                        _jsx(ThumbsDown, { className: 'h-3 w-3' }),
                        message.reactions?.thumbsDown || 0
                      ]
                    })
                  ]
                }),
                message.metadata?.confidence &&
                  _jsxs(Badge, {
                    variant: 'outline',
                    className: 'text-xs',
                    children: [Math.round(message.metadata.confidence * 100), '% confident']
                  })
              ]
            })
        ]
      })
    ]
  });
};
/**
 * Streaming text animation component
 */
const StreamingText = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20); // Adjust speed as needed
    return () => clearInterval(timer);
  }, [text]);
  return _jsxs('p', {
    className: 'whitespace-pre-wrap',
    children: [
      displayedText,
      _jsx(motion.span, {
        animate: { opacity: [1, 0] },
        transition: { duration: 0.8, repeat: Infinity },
        className: 'inline-block w-2 h-4 bg-current ml-1'
      })
    ]
  });
};
export default MessageComponent;
