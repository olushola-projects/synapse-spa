import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001
};
export const MenuItem = ({ setActive, active, item, children }) => {
  return _jsxs('div', {
    onMouseEnter: () => setActive(item),
    className: 'relative ',
    children: [
      _jsx(motion.p, {
        transition: { duration: 0.3 },
        className: 'cursor-pointer text-black hover:opacity-[0.9] dark:text-white',
        children: item
      }),
      active !== null &&
        _jsx(motion.div, {
          initial: { opacity: 0, scale: 0.85, y: 10 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: transition,
          children:
            active === item &&
            _jsx('div', {
              className:
                'absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4',
              children: _jsx(motion.div, {
                transition: transition,
                layoutId: 'active', // layoutId ensures smooth animation
                className:
                  'bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl',
                children: _jsx(motion.div, {
                  // layout ensures smooth animation
                  layout: true,
                  className: 'w-max h-full p-4',
                  children: children
                })
              })
            })
        })
    ]
  });
};
export const Menu = ({ setActive, children }) => {
  return _jsx('nav', {
    onMouseLeave: () => setActive(null),
    className:
      'relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-6 ',
    children: children
  });
};
export const ProductItem = ({ title, description, to, src }) => {
  return _jsxs(Link, {
    to: to,
    className: 'flex space-x-2',
    children: [
      _jsx('img', {
        src: src,
        width: 140,
        height: 70,
        alt: title,
        className: 'flex-shrink-0 rounded-md shadow-2xl object-cover'
      }),
      _jsxs('div', {
        children: [
          _jsx('h4', {
            className: 'text-xl font-bold mb-1 text-black dark:text-white',
            children: title
          }),
          _jsx('p', {
            className: 'text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300',
            children: description
          })
        ]
      })
    ]
  });
};
export const HoveredLink = ({ children, ...rest }) => {
  return _jsx(Link, {
    ...rest,
    className: 'text-neutral-700 dark:text-neutral-200 hover:text-black ',
    children: children
  });
};
