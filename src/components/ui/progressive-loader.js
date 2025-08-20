import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Brain, Shield, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ProgressiveLoader({
  stages,
  isVisible,
  variant = 'default',
  className,
  onComplete
}) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [internalStages, setInternalStages] = useState(stages);
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentStageIndex(prev => {
        const nextIndex = prev + 1;
        // Update stage statuses
        setInternalStages(currentStages =>
          currentStages.map((stage, index) => ({
            ...stage,
            status: index < nextIndex ? 'completed' : index === nextIndex ? 'active' : 'pending'
          }))
        );
        if (nextIndex >= stages.length) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return prev;
        }
        return nextIndex;
      });
    }, stages[currentStageIndex]?.duration || 800);
    return () => clearInterval(interval);
  }, [isVisible, currentStageIndex, stages, onComplete]);
  if (!isVisible) {
    return null;
  }
  const getStageIcon = stage => {
    switch (stage.status) {
      case 'completed':
        return _jsx(CheckCircle2, { className: 'w-4 h-4 text-emerald-500' });
      case 'active':
        return _jsx(Loader2, { className: 'w-4 h-4 animate-spin text-primary' });
      case 'error':
        return _jsx('div', { className: 'w-4 h-4 rounded-full bg-destructive' });
      default:
        return _jsx('div', { className: 'w-4 h-4 rounded-full bg-muted' });
    }
  };
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-background/80 backdrop-blur-sm border border-border/50';
      case 'detailed':
        return 'bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-md border border-border/30 shadow-2xl';
      default:
        return 'bg-background/90 backdrop-blur-sm border border-border/40 shadow-lg';
    }
  };
  return _jsx(AnimatePresence, {
    children: _jsx(motion.div, {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2, ease: 'easeOut' },
      className: cn('fixed inset-0 z-50 flex items-center justify-center p-4', className),
      children: _jsxs('div', {
        className: cn('w-full max-w-md rounded-xl p-6 space-y-6', getVariantStyles()),
        children: [
          _jsxs('div', {
            className: 'text-center space-y-2',
            children: [
              _jsxs('div', {
                className: 'flex items-center justify-center space-x-2',
                children: [
                  _jsx(Brain, { className: 'w-6 h-6 text-primary' }),
                  _jsx('h3', {
                    className: 'text-lg font-semibold text-foreground',
                    children: 'SFDR Navigator'
                  })
                ]
              }),
              _jsx('p', {
                className: 'text-sm text-muted-foreground',
                children: 'Processing your request...'
              })
            ]
          }),
          _jsxs('div', {
            className: 'space-y-2',
            children: [
              _jsxs('div', {
                className: 'flex justify-between text-xs text-muted-foreground',
                children: [
                  _jsx('span', { children: 'Progress' }),
                  _jsxs('span', {
                    children: [Math.round((currentStageIndex / stages.length) * 100), '%']
                  })
                ]
              }),
              _jsx('div', {
                className: 'w-full bg-muted rounded-full h-2 overflow-hidden',
                children: _jsx(motion.div, {
                  className: 'h-full bg-gradient-to-r from-primary to-primary/80 rounded-full',
                  initial: { width: 0 },
                  animate: { width: `${(currentStageIndex / stages.length) * 100}%` },
                  transition: { duration: 0.3, ease: 'easeOut' }
                })
              })
            ]
          }),
          _jsx('div', {
            className: 'space-y-3',
            children: internalStages.map((stage, index) =>
              _jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: index * 0.1 },
                  className: cn(
                    'flex items-center space-x-3 p-3 rounded-lg transition-all duration-300',
                    stage.status === 'active' && 'bg-primary/5 border border-primary/20',
                    stage.status === 'completed' && 'bg-emerald-50 dark:bg-emerald-950/20'
                  ),
                  children: [
                    _jsx('div', { className: 'flex-shrink-0', children: getStageIcon(stage) }),
                    _jsx('div', {
                      className: 'flex-1 min-w-0',
                      children: _jsx('p', {
                        className: cn(
                          'text-sm font-medium transition-colors',
                          stage.status === 'completed' && 'text-emerald-700 dark:text-emerald-300',
                          stage.status === 'active' && 'text-primary',
                          stage.status === 'pending' && 'text-muted-foreground'
                        ),
                        children: stage.label
                      })
                    }),
                    stage.status === 'active' &&
                      _jsx(motion.div, {
                        className: 'w-2 h-2 bg-primary rounded-full',
                        animate: { scale: [1, 1.2, 1] },
                        transition: { repeat: Infinity, duration: 1 }
                      })
                  ]
                },
                stage.id
              )
            )
          }),
          _jsx('div', {
            className: 'pt-4 border-t border-border/40',
            children: _jsxs('div', {
              className: 'flex items-center justify-center space-x-4 text-xs text-muted-foreground',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-1',
                  children: [
                    _jsx(Shield, { className: 'w-3 h-3' }),
                    _jsx('span', { children: 'Secure Processing' })
                  ]
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-1',
                  children: [
                    _jsx(Target, { className: 'w-3 h-3' }),
                    _jsx('span', { children: 'AI-Powered' })
                  ]
                })
              ]
            })
          })
        ]
      })
    })
  });
}
// Predefined loading stages for common operations
export const NEXUS_LOADING_STAGES = {
  CLASSIFICATION: [
    {
      id: 'init',
      label: 'Initializing request',
      icon: _jsx(Brain, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 600
    },
    {
      id: 'validate',
      label: 'Validating data structure',
      icon: _jsx(Shield, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 800
    },
    {
      id: 'analyze',
      label: 'Analyzing compliance requirements',
      icon: _jsx(Target, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 1200
    },
    {
      id: 'generate',
      label: 'Generating recommendations',
      icon: _jsx(CheckCircle2, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 900
    }
  ],
  CHAT_INIT: [
    {
      id: 'auth',
      label: 'Authenticating session',
      icon: _jsx(Shield, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 400
    },
    {
      id: 'load',
      label: 'Loading conversation history',
      icon: _jsx(Brain, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 600
    },
    {
      id: 'ready',
      label: 'Preparing interface',
      icon: _jsx(Target, { className: 'w-4 h-4' }),
      status: 'pending',
      duration: 300
    }
  ]
};
