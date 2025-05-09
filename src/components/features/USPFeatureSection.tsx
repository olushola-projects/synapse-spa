
import React, { useState } from 'react';
import { Brain, Globe, Users } from 'lucide-react';
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
    icon: <Brain className="h-9 w-9" />,
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
    icon: <Globe className="h-9 w-9" />,
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
    icon: <Users className="h-9 w-9" />,
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900">
            Synapses Core Capabilities
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your expertise with our purpose-built GRC solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {uspItems.map((usp, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer h-full border border-gray-100 hover:border-indigo-300"
              whileHover={{ y: -5 }}
              onClick={() => handleUSPClick(usp)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 ${usp.color}`}>
                  {usp.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{usp.title}</h3>
                <p className="text-gray-600 mb-4">{usp.description}</p>
                <div className="mt-auto pt-4">
                  <span className="text-indigo-600 font-medium text-sm flex items-center justify-center">
                    Learn More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
    </section>
  );
};
