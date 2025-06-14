
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
        "relative bg-white rounded-xl shadow-2xl overflow-hidden",
        "aspect-[16/9] transform transition-all duration-500 hover:shadow-3xl",
        "border border-white/20 backdrop-blur-sm",
        className
      )}
      style={{
        transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none z-10" />
      
      {/* Dashboard content container */}
      <div className="relative w-full h-full overflow-hidden bg-gray-50">
        <div className="transform scale-[0.8] origin-top-left w-[125%] h-[125%]">
          <IntegratedDashboardExample />
        </div>
      </div>
      
      {/* Interaction overlay */}
      <div className="absolute inset-0 bg-transparent hover:bg-white/5 transition-colors duration-300 cursor-pointer" />
    </div>
  );
};
