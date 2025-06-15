
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Using Lucide as per allowed icons list
import { GalleryHorizontal, Globe, Users } from 'lucide-react';

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
    icon: <GalleryHorizontal className="h-8 w-8" />,
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
    icon: <Globe className="h-8 w-8" />,
    color: "text-blue-600",
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
    icon: <Users className="h-8 w-8" />,
    color: "text-indigo-500",
    modalContent: {
      position: "Not a professional social network, a real-time environment for collaboration, recognition, and learning.",
      problem: "Siloed teams, noisy channels, no reskilling platform and outdated training.",
      solution: "Scenario challenges, reskilling to copilot with GRC agents, badges, peer insights, co-creation, and AI-supported growth.",
      whyItMatters: "Because compliance is evolving, the future of GRC is with AI agents and that future is now. Transformation is crucial."
    }
  }
];

export const USPFeatureSection = () => {
  const [selectedUSP, setSelectedUSP] = useState<USPItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleUSPClick = (usp: USPItem) => {
    setSelectedUSP(usp);
    setIsOpen(true);
  };

  return (
    <div className="w-full flex flex-row justify-center items-start gap-8 md:gap-16 pt-4 pb-2">
      {uspItems.map((usp, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center group min-w-[160px] max-w-[220px] text-center cursor-pointer"
          style={{ flex: 1 }}
          whileHover={{ y: -2, scale: 1.05 }}
          onClick={() => handleUSPClick(usp)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.07 }}
        >
          <div className={`mb-2 ${usp.color}`}>
            {usp.icon}
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-0">{usp.title}</h3>
          {/* Optional: Uncomment for further description 
          <p className="hidden md:block text-xs text-gray-500 mt-1 mb-2">
            {usp.description}
          </p>
          */}
          <button
            type="button"
            tabIndex={0}
            className={`mt-2 text-sm font-medium group-hover:underline flex items-center gap-1 ${usp.color} bg-transparent outline-none border-none`}
            style={{ cursor: 'pointer', background: 'none', outline: 'none' }}
            aria-label={`Learn more about ${usp.title}`}
            onClick={e => { e.stopPropagation(); handleUSPClick(usp); }}
          >
            Learn More
            <svg className={`w-4 h-4 ${usp.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
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
