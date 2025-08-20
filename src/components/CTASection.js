import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ExternalFormDialog from './ExternalFormDialog';
const CTASection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  return _jsxs('section', {
    className: 'bg-white py-20',
    children: [
      _jsx('div', {
        className: 'container mx-auto px-4 font-normal',
        children: _jsxs('div', {
          className: 'text-center max-w-2xl mx-auto',
          children: [
            _jsx('h2', {
              className: 'text-3xl md:text-4xl mb-6 font-semibold',
              children: 'Ready to Transform GRC?'
            }),
            _jsx('p', {
              className: 'text-gray-600 mb-8 text-base font-light',
              children:
                'Join a global network of professionals for exclusive beta testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.'
            }),
            _jsxs(Button, {
              onClick: () => setShowFormDialog(true),
              className:
                'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
              children: ['Get Early Access ', _jsx(ArrowRight, { size: 18 })]
            })
          ]
        })
      }),
      _jsx(ExternalFormDialog, {
        open: showFormDialog,
        onOpenChange: setShowFormDialog,
        title: 'Get Early Access'
      })
    ]
  });
};
export default CTASection;
