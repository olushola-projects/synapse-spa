import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function EnhancedSkeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rounded':
        return 'rounded-lg';
      case 'circular':
        return 'rounded-full';
      default:
        return 'rounded-md';
    }
  };
  const getAnimationStyles = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-pulse';
      case 'shimmer':
      default:
        return 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';
    }
  };
  return _jsx('div', {
    className: cn('bg-muted', getVariantStyles(), getAnimationStyles(), className),
    ...props
  });
}
// Specialized skeleton components for Nexus Agent
export function ChatMessageSkeleton() {
  return _jsx('div', {
    className: 'space-y-3 p-4',
    children: _jsxs('div', {
      className: 'flex items-start space-x-3',
      children: [
        _jsx(EnhancedSkeleton, { variant: 'circular', className: 'w-8 h-8' }),
        _jsxs('div', {
          className: 'flex-1 space-y-2',
          children: [
            _jsx(EnhancedSkeleton, { className: 'h-4 w-1/4' }),
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx(EnhancedSkeleton, { className: 'h-4 w-full' }),
                _jsx(EnhancedSkeleton, { className: 'h-4 w-3/4' }),
                _jsx(EnhancedSkeleton, { className: 'h-4 w-1/2' })
              ]
            })
          ]
        })
      ]
    })
  });
}
export function AgentCardSkeleton() {
  return _jsxs('div', {
    className: 'border border-border rounded-lg p-6 space-y-4',
    children: [
      _jsxs('div', {
        className: 'flex items-center space-x-3',
        children: [
          _jsx(EnhancedSkeleton, { variant: 'circular', className: 'w-12 h-12' }),
          _jsxs('div', {
            className: 'space-y-2',
            children: [
              _jsx(EnhancedSkeleton, { className: 'h-5 w-32' }),
              _jsx(EnhancedSkeleton, { className: 'h-4 w-24' })
            ]
          })
        ]
      }),
      _jsxs('div', {
        className: 'space-y-2',
        children: [
          _jsx(EnhancedSkeleton, { className: 'h-4 w-full' }),
          _jsx(EnhancedSkeleton, { className: 'h-4 w-2/3' })
        ]
      }),
      _jsxs('div', {
        className: 'flex space-x-2',
        children: [
          _jsx(EnhancedSkeleton, { className: 'h-8 w-20 rounded-full' }),
          _jsx(EnhancedSkeleton, { className: 'h-8 w-16 rounded-full' })
        ]
      })
    ]
  });
}
export function QuickActionSkeleton() {
  return _jsx('div', {
    className: 'space-y-3',
    children: Array.from({ length: 6 }).map((_, i) =>
      _jsxs(
        'div',
        {
          className: 'flex items-center p-3 border border-border rounded-lg',
          children: [
            _jsx(EnhancedSkeleton, { variant: 'circular', className: 'w-6 h-6 mr-3' }),
            _jsxs('div', {
              className: 'flex-1 space-y-1',
              children: [
                _jsx(EnhancedSkeleton, { className: 'h-4 w-24' }),
                _jsx(EnhancedSkeleton, { className: 'h-3 w-32' })
              ]
            })
          ]
        },
        i
      )
    )
  });
}
export function MetricCardSkeleton() {
  return _jsxs('div', {
    className: 'border border-border rounded-lg p-4 space-y-3',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs('div', {
            className: 'flex items-center space-x-2',
            children: [
              _jsx(EnhancedSkeleton, { variant: 'circular', className: 'w-5 h-5' }),
              _jsx(EnhancedSkeleton, { className: 'h-4 w-20' })
            ]
          }),
          _jsx(EnhancedSkeleton, { className: 'h-6 w-12' })
        ]
      }),
      _jsx(EnhancedSkeleton, { className: 'h-2 w-full' })
    ]
  });
}
export function ComplianceOverviewSkeleton() {
  return _jsx('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    children: Array.from({ length: 6 }).map((_, i) =>
      _jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.1 },
          children: _jsxs('div', {
            className: 'border border-border rounded-lg p-6 space-y-4',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(EnhancedSkeleton, { variant: 'circular', className: 'w-6 h-6' }),
                  _jsx(EnhancedSkeleton, { className: 'h-5 w-32' })
                ]
              }),
              _jsxs('div', {
                className: 'space-y-3',
                children: [
                  _jsxs('div', {
                    className: 'flex justify-between',
                    children: [
                      _jsx(EnhancedSkeleton, { className: 'h-4 w-20' }),
                      _jsx(EnhancedSkeleton, { className: 'h-4 w-12' })
                    ]
                  }),
                  _jsx(EnhancedSkeleton, { className: 'h-2 w-full' }),
                  _jsx(EnhancedSkeleton, { className: 'h-3 w-24' })
                ]
              })
            ]
          })
        },
        i
      )
    )
  });
}
export function TabContentSkeleton({ type }) {
  switch (type) {
    case 'chat':
      return _jsxs('div', {
        className: 'grid grid-cols-1 lg:grid-cols-4 gap-6',
        children: [
          _jsxs('div', {
            className: 'lg:col-span-3 space-y-4',
            children: [
              _jsx(ChatMessageSkeleton, {}),
              _jsx(ChatMessageSkeleton, {}),
              _jsx(ChatMessageSkeleton, {})
            ]
          }),
          _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsx(AgentCardSkeleton, {}),
              _jsx('div', {
                className: 'border border-border rounded-lg p-4',
                children: _jsx(QuickActionSkeleton, {})
              })
            ]
          })
        ]
      });
    case 'overview':
      return _jsx(ComplianceOverviewSkeleton, {});
    case 'testing':
      return _jsxs('div', {
        className: 'space-y-6',
        children: [
          _jsxs('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
            children: [_jsx(AgentCardSkeleton, {}), _jsx(AgentCardSkeleton, {})]
          }),
          _jsxs('div', {
            className: 'border border-border rounded-lg p-6 space-y-4',
            children: [
              _jsx(EnhancedSkeleton, { className: 'h-6 w-48' }),
              _jsx('div', {
                className: 'space-y-2',
                children: Array.from({ length: 4 }).map((_, i) =>
                  _jsxs(
                    'div',
                    {
                      className: 'flex items-center space-x-3',
                      children: [
                        _jsx(EnhancedSkeleton, { variant: 'circular', className: 'w-4 h-4' }),
                        _jsx(EnhancedSkeleton, { className: 'h-4 w-full' })
                      ]
                    },
                    i
                  )
                )
              })
            ]
          })
        ]
      });
    default:
      return _jsxs('div', {
        className: 'space-y-4',
        children: [
          _jsx(EnhancedSkeleton, { className: 'h-8 w-48' }),
          _jsx(EnhancedSkeleton, { className: 'h-32 w-full' })
        ]
      });
  }
}
// Add shimmer animation to global CSS
export const SKELETON_STYLES = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;
