
import React, { useState } from 'react';
import { Brain, Globe, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
    title: "Agents Gallery",
    description: "Purpose-built AI agents designed to reduce manual work in compliance.",
    icon: <Brain className="h-5 w-5 opacity-90" />,
    color: "text-purple-600",
    modalContent: {
      position: "Modular thematic AI agents trained to support regulatory analysis, exception reviews, GRC operations and document drafting.",
      problem: "Manual reviews, fragmented tools, and generic AI that lacks regulatory context.",
      solution: "Embedded SME agents with training in KYC, ESG, TPRM e.t.c, provide traceable outputs, support key compliance workflows, and plug into real tools.",
      whyItMatters: "These agents are built for GRC, not just response — freeing up teams time to focus on judgment, not grunt work."
    }
  },
  {
    title: "Regulatory Intelligence",
    description: "Agent summarized bespoke updates filtered by jurisdiction, risk area, and role.",
    icon: <Globe className="h-5 w-5 opacity-90" />,
    color: "text-blue-500",
    modalContent: {
      position: "Synapses turn fragmented change updates into instant, personalized contextualized insights.",
      problem: "GRC professionals spend hours reading PDFs, decoding alerts, and chasing updates across silos.",
      solution: "AI curates relevant personalized rules, explains them, and ties them to real-world decisions.",
      whyItMatters: "Less inbox, more insight. Updates shouldn't just be read - they should drive action."
    }
  },
  {
    title: "Ecosystem",
    description: "A vibrant professional community built for governance, compliance, risk, and audit teams.",
    icon: <Users className="h-5 w-5 opacity-90" />,
    color: "text-indigo-500",
    modalContent: {
      position: "Not a professional social network, a real-time environment for collaboration, recognition, and learning.",
      problem: "Siloed teams, noisy channels, no reskilling platform and outdated training.",
      solution: "Scenario challenges, reskilling to copilot with GRC agents, badges, peer insights, co-creation, and AI-supported growth.",
      whyItMatters: "Because compliance is evolving, the future of GRC is with AI agents and that future is now. Transformation is crucial."
    }
  }
];

/**
 * USPFeatureSection component - Compact side-by-side layout with premium design
 * Features tight spacing, smaller typography, and professional card-based presentation
 */
export const USPFeatureSection = () => {
  const [selectedUSP, setSelectedUSP] = useState<USPItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleUSPClick = (usp: USPItem) => {
    setSelectedUSP(usp);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-start gap-3 md:gap-4 lg:gap-6 max-w-5xl">
      {uspItems.map((usp, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-start text-left group flex-1 min-w-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {/* Icon container - smaller and more refined */}
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:scale-105 transition-all duration-200 mb-3 ${usp.color} shadow-sm`}>
            {usp.icon}
          </div>
          
          {/* Title with info button - compact layout */}
          <div className="flex items-start gap-1.5 mb-2 w-full">
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight flex-1 min-w-0">
              {usp.title}
            </h3>
            <button
              onClick={() => handleUSPClick(usp)}
              className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 flex-shrink-0"
              aria-label={`More information about ${usp.title}`}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
          
          {/* Description - smaller text with better line height */}
          <p className="text-xs text-slate-600 leading-relaxed">
            {usp.description}
          </p>
        </motion.div>
      ))}

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {selectedUSP && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div className={`inline-block ${selectedUSP.color}`}>
                  {selectedUSP.icon}
                </div>
                <span>{selectedUSP.title}</span>
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-700 mt-2">
                {selectedUSP.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 pt-4">
              <div>
                <h4 className="text-lg font-semibold text-indigo-700">Position</h4>
                <p className="mt-1 text-gray-700">{selectedUSP.modalContent.position}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-indigo-700">Problem</h4>
                <p className="mt-1 text-gray-700">{selectedUSP.modalContent.problem}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-indigo-700">Solution</h4>
                <p className="mt-1 text-gray-700">{selectedUSP.modalContent.solution}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-indigo-700">Why It Matters</h4>
                <p className="mt-1 text-gray-700">{selectedUSP.modalContent.whyItMatters}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
