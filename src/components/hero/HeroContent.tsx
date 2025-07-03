
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface HeroContentProps {
  animate: boolean;
  onGetAccess: () => void;
  onInvite: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ animate, onGetAccess, onInvite }) => {
  return (
    <div className={`w-full max-w-4xl pb-10 md:pb-0 text-left transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] text-black mb-8 font-sans">
        Transform Your Expertise With GRC Agents
      </h1>
      
      <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed font-normal">
        Join a global network of professionals to boost your expertise with GRC agents, exclusive testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-start">
        <div onClick={onGetAccess} className="cursor-pointer">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift font-medium">
            Get Early Access <ArrowRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-start text-sm text-gray-500 space-x-6">
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
