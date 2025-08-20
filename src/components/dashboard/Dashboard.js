import { jsx as _jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
export const EnhancedDashboardContainer = ({ children, className = '' }) => {
  return _jsx('div', {
    className: `w-[150%] max-w-[1440px] mx-auto p-8 overflow-hidden relative md:w-full md:p-4 ${className}`,
    children: children
  });
};
export const DashboardGrid = ({ children, className = '' }) => {
  return _jsx('div', {
    className: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 ${className}`,
    children: children
  });
};
export const MobileDashboard = ({ children, className = '' }) => {
  return _jsx(motion.div, {
    className: `hidden md:block w-full overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 ${className}`,
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    children: children
  });
};
