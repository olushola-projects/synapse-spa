import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Solution } from '@/types/solutions';

interface SolutionNavigationProps {
  solutions: Solution[];
  activeSolution: string;
  onSolutionChange: (id: string) => void;
}

const SolutionNavigation: React.FC<SolutionNavigationProps> = ({
  solutions,
  activeSolution,
  onSolutionChange
}) => {
  return (
    <div className='lg:col-span-3 max-h-[600px] overflow-y-auto'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2'>
        {solutions.map(solution => (
          <Button
            key={solution.id}
            variant='ghost'
            size='sm'
            className={cn(
              'justify-start gap-3 rounded-lg px-3 py-2 text-left w-full',
              'border border-transparent transition-colors whitespace-nowrap text-xs',
              activeSolution === solution.id
                ? 'bg-slate-100 border-slate-200'
                : 'hover:bg-slate-50 hover:border-slate-100'
            )}
            onClick={() => onSolutionChange(solution.id)}
          >
            <div className={`rounded-md p-1 bg-gradient-to-br ${solution.color} text-white`}>
              <solution.icon className='h-3 w-3' />
            </div>
            <span className='truncate'>{solution.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SolutionNavigation;
