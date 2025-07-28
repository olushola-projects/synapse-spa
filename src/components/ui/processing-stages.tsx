import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface ProcessingStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface ProcessingStagesProps {
  stages: ProcessingStage[];
}

export function ProcessingStages({ stages }: ProcessingStagesProps) {
  return (
    <div className='space-y-2'>
      <div className='text-sm font-medium text-gray-700 mb-3'>Processing your request...</div>

      <div className='space-y-2'>
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className='flex items-center space-x-3'
          >
            <div className='flex-shrink-0'>
              {stage.status === 'completed' && <CheckCircle className='w-4 h-4 text-green-500' />}
              {stage.status === 'active' && (
                <Loader2 className='w-4 h-4 text-blue-500 animate-spin' />
              )}
              {stage.status === 'pending' && <Circle className='w-4 h-4 text-gray-300' />}
            </div>

            <span
              className={`text-sm ${
                stage.status === 'completed'
                  ? 'text-green-700 font-medium'
                  : stage.status === 'active'
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-500'
              }`}
            >
              {stage.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
