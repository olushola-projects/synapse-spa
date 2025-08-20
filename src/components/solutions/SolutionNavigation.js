import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const SolutionNavigation = ({ solutions, activeSolution, onSolutionChange }) => {
  return _jsx('div', {
    className: 'lg:col-span-3 max-h-[600px] overflow-y-auto',
    children: _jsx('div', {
      className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2',
      children: solutions.map(solution =>
        _jsxs(
          Button,
          {
            variant: 'ghost',
            size: 'sm',
            className: cn(
              'justify-start gap-3 rounded-lg px-3 py-2 text-left w-full',
              'border border-transparent transition-colors whitespace-nowrap text-xs',
              activeSolution === solution.id
                ? 'bg-slate-100 border-slate-200'
                : 'hover:bg-slate-50 hover:border-slate-100'
            ),
            onClick: () => onSolutionChange(solution.id),
            children: [
              _jsx('div', {
                className: `rounded-md p-1 bg-gradient-to-br ${solution.color} text-white`,
                children: _jsx(solution.icon, { className: 'h-3 w-3' })
              }),
              _jsx('span', { className: 'truncate', children: solution.title })
            ]
          },
          solution.id
        )
      )
    })
  });
};
export default SolutionNavigation;
