import React, { useState } from 'react';
import { Brain, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
interface USPItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  modalContent: {
    position: string;
    problem: string;
    solution: string;
    whyItMatters: string;
  };
}
const uspItems: USPItem[] = [
  {
    title: 'Agents Gallery',
    description: 'Purpose-built AI agents designed to reduce manual work in compliance.',
    icon: <Brain className='h-7 w-7 opacity-90' />,
    color: 'text-purple-600',
    modalContent: {
      position:
        'Modular thematic AI agents trained to support regulatory analysis, exception reviews, GRC operations and document drafting.',
      problem: 'Manual reviews, fragmented tools, and generic AI that lacks regulatory context.',
      solution:
        'Embedded SME agents with training in KYC, ESG, TPRM e.t.c, provide traceable outputs, support key compliance workflows, and plug into real tools.',
      whyItMatters:
        'These agents are built for GRC, not just response — freeing up teams time to focus on judgment, not grunt work.'
    }
  },
  {
    title: 'Regulatory Intelligence',
    description: 'Agent summarized bespoke updates filtered by jurisdiction, risk area, and role.',
    icon: <Globe className='h-7 w-7 opacity-90' />,
    color: 'text-blue-500',
    modalContent: {
      position:
        'Synapses turn fragmented change updates into instant, personalized contextualized insights.',
      problem:
        'GRC professionals spend hours reading PDFs, decoding alerts, and chasing updates across silos.',
      solution:
        'AI curates relevant personalized rules, explains them, and ties them to real-world decisions.',
      whyItMatters:
        "Less inbox, more insight. Updates shouldn't just be read - they should drive action."
    }
  },
  {
    title: 'Ecosystem',
    description:
      'A vibrant professional community built for governance, compliance, risk, and audit teams.',
    icon: <Users className='h-7 w-7 opacity-90' />,
    color: 'text-indigo-500',
    modalContent: {
      position:
        'Not a professional social network, a real-time environment for collaboration, recognition, and learning.',
      problem: 'Siloed teams, noisy channels, no reskilling platform and outdated training.',
      solution:
        'Scenario challenges, reskilling to copilot with GRC agents, badges, peer insights, co-creation, and AI-supported growth.',
      whyItMatters:
        'Because compliance is evolving, the future of GRC is with AI agents and that future is now. Transformation is crucial.'
    }
  }
];

/**
 * USPFeatureSection component - Enhanced feature showcase with improved visual design
 * Features better spacing, hover effects, and professional card-based layout
 */
export const USPFeatureSection = () => {
  const [selectedUSP, setSelectedUSP] = useState<USPItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleUSPClick = (usp: USPItem) => {
    setSelectedUSP(usp);
    setIsOpen(true);
  };
  return (
    <div className='flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-6 sm:gap-8 lg:gap-12'>
      {uspItems.map((usp, index) => (
        <motion.div
          key={index}
          className='flex flex-col items-center text-center group cursor-pointer min-h-[100px] p-4 rounded-xl hover:bg-slate-50/50 transition-all duration-300'
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.15
          }}
          onClick={() => handleUSPClick(usp)}
        >
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 ${usp.color} shadow-sm`}
          >
            {usp.icon}
          </div>
          <h3 className='font-semibold text-slate-800 group-hover:text-blue-600 transition-colors text-sm sm:text-base leading-tight'>
            {usp.title}
          </h3>
          <p className='text-xs text-slate-600 mt-2 opacity-0 sm:opacity-100 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2'>
            {usp.description}
          </p>
        </motion.div>
      ))}

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {selectedUSP && (
          <DialogContent className='sm:max-w-2xl'>
            <DialogHeader>
              <DialogTitle className='text-2xl flex items-center gap-2'>
                <div className={`inline-block ${selectedUSP.color}`}>{selectedUSP.icon}</div>
                <span>{selectedUSP.title}</span>
              </DialogTitle>
              <DialogDescription className='text-lg text-gray-700 mt-2'>
                {selectedUSP.description}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-6 pt-4'>
              <div>
                <h4 className='text-lg font-semibold text-indigo-700'>Position</h4>
                <p className='mt-1 text-gray-700'>{selectedUSP.modalContent.position}</p>
              </div>

              <div>
                <h4 className='text-lg font-semibold text-indigo-700'>Problem</h4>
                <p className='mt-1 text-gray-700'>{selectedUSP.modalContent.problem}</p>
              </div>

              <div>
                <h4 className='text-lg font-semibold text-indigo-700'>Solution</h4>
                <p className='mt-1 text-gray-700'>{selectedUSP.modalContent.solution}</p>
              </div>

              <div>
                <h4 className='text-lg font-semibold text-indigo-700'>Why It Matters</h4>
                <p className='mt-1 text-gray-700'>{selectedUSP.modalContent.whyItMatters}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
