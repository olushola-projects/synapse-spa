import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
const PartnerCategoryCard = ({ category, index }) => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  return _jsx(motion.div, {
    variants: fadeInUpVariants,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true },
    custom: index,
    children: _jsxs(Card, {
      className: 'h-full hover:shadow-lg transition-shadow duration-300',
      children: [
        _jsxs(CardHeader, {
          children: [
            _jsxs('div', {
              className: 'flex items-center gap-3 mb-3',
              children: [
                _jsx('div', {
                  className: `rounded-md p-2 bg-gradient-to-br ${category.color} text-white`,
                  children: _jsx(category.icon, { className: 'h-5 w-5' })
                }),
                _jsx(CardTitle, { children: category.title })
              ]
            }),
            _jsx(CardDescription, { className: 'text-base', children: category.description })
          ]
        }),
        _jsxs(CardContent, {
          children: [
            _jsx('h4', { className: 'font-medium mb-3 text-sm', children: 'Key Benefits:' }),
            _jsx('ul', {
              className: 'space-y-2 mb-5',
              children: category.benefits.map((benefit, idx) =>
                _jsxs(
                  'li',
                  {
                    className: 'flex items-start gap-2',
                    children: [
                      _jsx('div', {
                        className: 'rounded-full bg-green-100 p-1 mt-0.5',
                        children: _jsx('svg', {
                          width: '10',
                          height: '10',
                          viewBox: '0 0 10 10',
                          children: _jsx('path', {
                            d: 'M3.5 6.5L2 5l-.5.5L3.5 7.5 8 3l-.5-.5z',
                            fill: 'currentColor',
                            className: 'text-green-600'
                          })
                        })
                      }),
                      _jsx('span', { className: 'text-sm', children: benefit })
                    ]
                  },
                  idx
                )
              )
            }),
            _jsxs(Button, {
              variant: 'outline',
              className:
                'w-full text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300',
              children: ['Learn More ', _jsx(ArrowRight, { className: 'ml-1 h-4 w-4' })]
            })
          ]
        })
      ]
    })
  });
};
export default PartnerCategoryCard;
