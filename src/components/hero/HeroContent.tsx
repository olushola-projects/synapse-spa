
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface HeroContentProps {
  animate: boolean;
  onGetAccess: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ animate, onGetAccess }) => {
  return (
    <div className={`w-full pb-10 md:pb-0 text-left transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] font-display font-bold tracking-tight leading-tight text-gray-900 mb-6">
        <span className="inline-block relative">
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Transform</span><br />
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Your Expertise</span><br />
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">With GRC Agents</span>
        </span>
      </h1>
      
      <p className="mt-6 text-base md:text-lg text-gray-700 max-w-md leading-relaxed font-normal">
        Join a global network of professionals to boost your expertise with GRC agents, exclusive testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <div onClick={onGetAccess} className="cursor-pointer">
          <Button className="bg-synapse-primary hover:bg-synapse-secondary text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift">
            Get Early Access <ArrowRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="mt-6 flex items-center text-sm text-gray-500 space-x-6">
        <span className="flex items-center">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
          GRC Innovation Hub
        </span>
        <span className="flex items-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
          Join early adopters in our private pilot
        </span>
      </div>
    </div>
  );
};
