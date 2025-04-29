
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AgentGalleryCard: React.FC = () => {
  return (
    <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Bot size={8} className="text-blue-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Agent Gallery</div>
        </div>
        <div className="text-blue-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-blue-50 rounded-full">Featured</div>
      </div>
      
      <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
        <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">Explore intelligent GRC agents</h3>
        <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
          Access specialized compliance AI agents for various regulatory frameworks including AML, ESG, MiFID II, DORA, and Privacy. Get instant guidance and analysis tailored to your specific regulatory needs.
        </p>
        
        <div className="mt-1 flex flex-wrap gap-1">
          {['AML', 'ESG', 'MiFID II', 'DORA', 'Privacy'].map((agent, index) => (
            <div key={index} className="bg-white px-1 py-0.5 rounded-full border border-gray-200 text-[3px] sm:text-[4px] font-medium text-gray-700 flex items-center gap-0.5">
              <div className={`w-1 h-1 rounded-full ${['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400'][index]}`}></div>
              {agent}
            </div>
          ))}
        </div>
        
        <div className="mt-1 flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
            Explore Agents
          </Button>
          <Button variant="outline" size="sm" className="h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0">
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
};
