
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AmlAnalysisCardProps {
  onAmlDialogOpen: () => void;
}

export const AmlAnalysisCard: React.FC<AmlAnalysisCardProps> = ({ onAmlDialogOpen }) => {
  return (
    <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer" onClick={onAmlDialogOpen}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <ShieldAlert size={8} className="text-red-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">AMLD6 Penalty Analysis</div>
        </div>
        <div className="text-red-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-red-50 rounded-full">High Priority</div>
      </div>
      
      <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
        <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">What is the Penalty under AMLD6 and criminal liability extension?</h3>
        <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
          One of the key aspects of AMLD6 is the aggressive expansion of liability to legal entities and company executives who aid and abet money laundering, either through negligence or deliberate actions. Penalties under AMLD6 are severe, and fines can reach into the hundreds of millions of euros. The AMLD6 has set a precedent for stricter AML oversight and amplified penalties.
        </p>
        <div className="mt-1 flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0">
            Ask Dara
          </Button>
        </div>
      </div>
    </div>
  );
};
