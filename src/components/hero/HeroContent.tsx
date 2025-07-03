
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
    <div className={`w-full pb-10 md:pb-0 text-center transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-[6rem] font-bold tracking-tight leading-tight text-black mb-8 max-w-5xl mx-auto">
        Transform Your Expertise With GRC Agents
      </h1>
      
      <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
        Join a global network of professionals to boost your expertise with GRC agents, exclusive testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <div onClick={onGetAccess} className="cursor-pointer">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift font-medium">
            Get Early Access <ArrowRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-center text-sm text-gray-500 space-x-6">
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
