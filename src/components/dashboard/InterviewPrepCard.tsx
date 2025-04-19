
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InterviewPrepCard: React.FC = () => {
  return (
    <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <FileText size={8} className="text-blue-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Interview Preparation</div>
        </div>
        <div className="text-blue-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-blue-50 rounded-full">New</div>
      </div>
      
      <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
        <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">Prepare for your GRC interview with our AI coach</h3>
        <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
          Practice answering common GRC interview questions with our AI coach. Receive instant feedback on your responses and tips to improve your delivery. Access industry-specific questions and adapt your answers to different compliance roles.
        </p>
        <div className="mt-1 flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
            Start Practice
          </Button>
          <Button variant="outline" size="sm" className="h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};
