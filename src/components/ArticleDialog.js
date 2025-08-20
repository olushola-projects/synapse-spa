import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// React import removed as it's not needed in modern React with JSX transform
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
const ArticleDialog = ({ isOpen, onOpenChange, perspective }) => {
  if (!perspective) {
    return null;
  }
  return _jsx(Dialog, {
    open: isOpen,
    onOpenChange: onOpenChange,
    children: _jsxs(DialogContent, {
      className: 'sm:max-w-2xl max-h-[85vh] overflow-y-auto',
      children: [
        _jsxs(DialogHeader, {
          children: [
            _jsx('div', { className: `mb-2 ${perspective.color}`, children: perspective.icon }),
            _jsx(DialogTitle, { className: 'text-2xl font-bold', children: perspective.name }),
            _jsx(DialogDescription, {
              className: 'text-lg font-medium text-foreground',
              children: perspective.role
            })
          ]
        }),
        _jsxs('div', {
          className: 'py-4 space-y-4',
          children: [
            _jsx('p', { className: 'text-gray-700 leading-relaxed', children: perspective.bio }),
            perspective.insights &&
              perspective.insights.length > 0 &&
              _jsxs('div', {
                className: 'bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4',
                children: [
                  _jsx('h4', {
                    className: 'font-semibold text-gray-800 mb-2',
                    children: 'Key Insights:'
                  }),
                  _jsx('ul', {
                    className: 'space-y-2 list-disc pl-5',
                    children: perspective.insights.map((insight, index) =>
                      _jsx('li', { children: insight }, index)
                    )
                  })
                ]
              }),
            perspective.quotation &&
              _jsxs('blockquote', {
                className: 'border-l-4 border-synapse-primary/30 pl-4 italic text-gray-700',
                children: [
                  '"',
                  perspective.quotation,
                  '"',
                  perspective.attribution &&
                    _jsxs('footer', {
                      className: 'mt-1 text-sm text-gray-500 not-italic',
                      children: ['\u2014 ', perspective.attribution]
                    })
                ]
              })
          ]
        }),
        _jsxs(DialogFooter, {
          className: 'flex items-center justify-between border-t pt-4',
          children: [
            _jsxs('span', {
              className: 'text-sm text-gray-500',
              children: [
                'Published:',
                ' ',
                perspective.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              ]
            }),
            _jsxs(Button, {
              onClick: () => window.open(perspective.link, '_blank'),
              className: 'gap-2',
              children: ['Read Full Report ', _jsx(ExternalLink, { size: 16 })]
            })
          ]
        })
      ]
    })
  });
};
export default ArticleDialog;
