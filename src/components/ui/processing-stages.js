import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
export function ProcessingStages({ stages }) {
  return _jsxs('div', {
    className: 'space-y-2',
    children: [
      _jsx('div', {
        className: 'text-sm font-medium text-gray-700 mb-3',
        children: 'Processing your request...'
      }),
      _jsx('div', {
        className: 'space-y-2',
        children: stages.map((stage, index) =>
          _jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.1 },
              className: 'flex items-center space-x-3',
              children: [
                _jsxs('div', {
                  className: 'flex-shrink-0',
                  children: [
                    stage.status === 'completed' &&
                      _jsx(CheckCircle, { className: 'w-4 h-4 text-green-500' }),
                    stage.status === 'active' &&
                      _jsx(Loader2, { className: 'w-4 h-4 text-blue-500 animate-spin' }),
                    stage.status === 'pending' &&
                      _jsx(Circle, { className: 'w-4 h-4 text-gray-300' })
                  ]
                }),
                _jsx('span', {
                  className: `text-sm ${
                    stage.status === 'completed'
                      ? 'text-green-700 font-medium'
                      : stage.status === 'active'
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-500'
                  }`,
                  children: stage.label
                })
              ]
            },
            stage.id
          )
        )
      })
    ]
  });
}
