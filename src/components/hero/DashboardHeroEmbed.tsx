
import React from 'react';
import { IntegratedDashboardExample } from '../dashboard/IntegratedDashboardExample';
import { cn } from '@/lib/utils';

interface DashboardHeroEmbedProps {
  className?: string;
}

export const DashboardHeroEmbed: React.FC<DashboardHeroEmbedProps> = ({ 
  className 
}) => {
  return (
    <div 
      className={cn(
        "relative bg-white rounded-2xl overflow-hidden",
        "aspect-[4/3] transform transition-all duration-700 hover:scale-[1.02]",
        "shadow-2xl border border-gray-200/50",
        className
      )}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        transform: 'perspective(1200px) rotateX(4deg) rotateY(-8deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Subtle gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/5 pointer-events-none z-10" />
      
      {/* Dashboard content container */}
      <div className="relative w-full h-full overflow-hidden bg-gray-50/50">
        <div className="transform scale-[0.85] origin-top-left w-[118%] h-[118%] -translate-y-2">
          <IntegratedDashboardExample />
        </div>
      </div>
      
      {/* Interactive overlay */}
      <div className="absolute inset-0 bg-transparent hover:bg-white/5 transition-colors duration-300 cursor-pointer" />
      
      {/* Browser chrome simulation */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-500 min-w-0 max-w-xs">
            app.synapses.com
          </div>
        </div>
      </div>
    </div>
  );
};
