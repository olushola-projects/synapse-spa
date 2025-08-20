import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { cn } from '@/lib/utils';
function Skeleton({ className, ...props }) {
  return _jsx('div', { className: cn('animate-pulse rounded-md bg-muted', className), ...props });
}
function SkeletonCard() {
  return _jsxs('div', {
    className: 'border rounded-lg p-4 space-y-3',
    children: [
      _jsxs('div', {
        className: 'flex items-center space-x-2',
        children: [
          _jsx(Skeleton, { className: 'h-4 w-4 rounded-full' }),
          _jsx(Skeleton, { className: 'h-4 w-[100px]' })
        ]
      }),
      _jsx(Skeleton, { className: 'h-16 w-full' })
    ]
  });
}
function SkeletonChatMessage() {
  return _jsxs('div', {
    className: 'flex items-start space-x-3 p-4',
    children: [
      _jsx(Skeleton, { className: 'h-8 w-8 rounded-full' }),
      _jsxs('div', {
        className: 'space-y-2 flex-1',
        children: [
          _jsx(Skeleton, { className: 'h-4 w-[200px]' }),
          _jsx(Skeleton, { className: 'h-4 w-[300px]' }),
          _jsx(Skeleton, { className: 'h-4 w-[150px]' })
        ]
      })
    ]
  });
}
function SkeletonQuickAction() {
  return _jsx('div', {
    className: 'border rounded-lg p-3 space-y-2',
    children: _jsxs('div', {
      className: 'flex items-center space-x-2',
      children: [
        _jsx(Skeleton, { className: 'h-4 w-4' }),
        _jsx(Skeleton, { className: 'h-4 w-[120px]' })
      ]
    })
  });
}
export { Skeleton, SkeletonCard, SkeletonChatMessage, SkeletonQuickAction };
