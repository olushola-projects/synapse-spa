import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Search, FileText, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
/**
 * Typing indicator component that shows agent processing status
 * Provides visual feedback during SFDR compliance analysis
 */
export const TypingIndicator = ({
  agentName = 'SFDR Navigator',
  processingType = 'thinking',
  message,
  className
}) => {
  /**
   * Get processing configuration based on type
   */
  const getProcessingConfig = () => {
    switch (processingType) {
      case 'searching':
        return {
          icon: _jsx(Search, { className: 'h-4 w-4' }),
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          defaultMessage: 'Searching regulatory databases...'
        };
      case 'analyzing':
        return {
          icon: _jsx(FileText, { className: 'h-4 w-4' }),
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          defaultMessage: 'Analyzing compliance requirements...'
        };
      case 'calculating':
        return {
          icon: _jsx(Calculator, { className: 'h-4 w-4' }),
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          defaultMessage: 'Calculating ESG metrics...'
        };
      case 'generating':
        return {
          icon: _jsx(Brain, { className: 'h-4 w-4' }),
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          defaultMessage: 'Generating compliance report...'
        };
      default: // thinking
        return {
          icon: _jsx(Bot, { className: 'h-4 w-4' }),
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          defaultMessage: 'Processing your request...'
        };
    }
  };
  const config = getProcessingConfig();
  const displayMessage = message || config.defaultMessage;
  return _jsx(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
    className: cn('mr-12', className),
    children: _jsxs(Card, {
      className: cn('relative', config.bgColor, config.borderColor),
      children: [
        _jsx(CardContent, {
          className: 'p-4',
          children: _jsxs('div', {
            className: 'flex space-x-3',
            children: [
              _jsxs(Avatar, {
                className: 'h-8 w-8 bg-blue-500 text-white',
                children: [_jsx(AvatarFallback, { children: 'AI' }), config.icon]
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
                          _jsx('span', { className: 'text-sm font-medium', children: agentName }),
                          _jsx(Badge, {
                            variant: 'outline',
                            className: cn('text-xs', config.color),
                            children: processingType
                          })
                        ]
                      }),
                      _jsx('span', {
                        className: 'text-xs text-muted-foreground',
                        children: new Date().toLocaleTimeString()
                      })
                    ]
                  }),
                  _jsxs('div', {
                    className: 'flex items-center space-x-3',
                    children: [
                      _jsx(motion.div, {
                        animate: { rotate: 360 },
                        transition: { duration: 2, repeat: Infinity, ease: 'linear' },
                        className: config.color,
                        children: config.icon
                      }),
                      _jsxs('div', {
                        className: 'flex-1',
                        children: [
                          _jsx('p', {
                            className: 'text-sm text-muted-foreground',
                            children: displayMessage
                          }),
                          _jsx('div', {
                            className: 'flex items-center space-x-1 mt-2',
                            children: [0, 1, 2].map(index =>
                              _jsx(
                                motion.div,
                                {
                                  animate: {
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                  },
                                  transition: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: index * 0.2
                                  },
                                  className: cn(
                                    'h-2 w-2 rounded-full',
                                    config.color.replace('text-', 'bg-')
                                  )
                                },
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
            ]
          })
        }),
        _jsx(motion.div, {
          animate: {
            opacity: [0.5, 1, 0.5]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          className: cn(
            'absolute inset-0 rounded-lg border-2',
            config.borderColor,
            'pointer-events-none'
          )
        })
      ]
    })
  });
};
/**
 * Simple dots typing indicator for minimal UI
 */
export const SimpleTypingIndicator = ({ className }) => {
  return _jsx('div', {
    className: cn('flex items-center space-x-1', className),
    children: [0, 1, 2].map(index =>
      _jsx(
        motion.div,
        {
          animate: {
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          },
          transition: {
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          },
          className: 'h-2 w-2 bg-blue-500 rounded-full'
        },
        index
      )
    )
  });
};
export const ProcessingStages = ({ stages, className }) => {
  return _jsx(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    className: cn('mr-12', className),
    children: _jsx(Card, {
      className: 'bg-blue-50 border-blue-200',
      children: _jsx(CardContent, {
        className: 'p-4',
        children: _jsxs('div', {
          className: 'flex space-x-3',
          children: [
            _jsxs(Avatar, {
              className: 'h-8 w-8 bg-blue-500 text-white',
              children: [
                _jsx(AvatarFallback, { children: 'AI' }),
                _jsx(Brain, { className: 'h-4 w-4' })
              ]
            }),
            _jsxs('div', {
              className: 'flex-1 space-y-3',
              children: [
                _jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    _jsx('span', { className: 'text-sm font-medium', children: 'SFDR Navigator' }),
                    _jsx(Badge, {
                      variant: 'outline',
                      className: 'text-xs text-blue-500',
                      children: 'Processing'
                    })
                  ]
                }),
                _jsx('div', {
                  className: 'space-y-2',
                  children: stages.map((stage, index) =>
                    _jsxs(
                      'div',
                      {
                        className: 'flex items-center space-x-3',
                        children: [
                          _jsx('div', {
                            className: cn(
                              'h-2 w-2 rounded-full',
                              stage.status === 'completed' && 'bg-green-500',
                              stage.status === 'active' && 'bg-blue-500',
                              stage.status === 'pending' && 'bg-gray-300'
                            ),
                            children:
                              stage.status === 'active' &&
                              _jsx(motion.div, {
                                animate: { scale: [1, 1.5, 1] },
                                transition: { duration: 1, repeat: Infinity },
                                className: 'h-full w-full bg-blue-500 rounded-full'
                              })
                          }),
                          _jsxs('div', {
                            className: 'flex-1',
                            children: [
                              _jsx('p', {
                                className: cn(
                                  'text-sm',
                                  stage.status === 'active' && 'font-medium text-blue-700',
                                  stage.status === 'completed' && 'text-green-700',
                                  stage.status === 'pending' && 'text-muted-foreground'
                                ),
                                children: stage.name
                              }),
                              stage.description &&
                                stage.status === 'active' &&
                                _jsx('p', {
                                  className: 'text-xs text-muted-foreground mt-1',
                                  children: stage.description
                                })
                            ]
                          }),
                          stage.status === 'completed' &&
                            _jsx(motion.div, {
                              initial: { scale: 0 },
                              animate: { scale: 1 },
                              className: 'text-green-500',
                              children: '\u2713'
                            })
                        ]
                      },
                      index
                    )
                  )
                })
              ]
            })
          ]
        })
      })
    })
  });
};
