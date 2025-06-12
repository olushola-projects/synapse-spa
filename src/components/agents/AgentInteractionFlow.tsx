
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Loader2, CheckCircle, Award, X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { toast } from '@/components/ui/use-toast';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  onClick: () => void;
}

interface AgentInteractionFlowProps {
  agents: AgentCardProps[];
}

export const AgentInteractionFlow: React.FC<AgentInteractionFlowProps> = ({ agents }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentCardProps | null>(null);
  const [flowState, setFlowState] = useState<'idle' | 'loading' | 'results' | 'complete'>('idle');
  const [showModal, setShowModal] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleAgentClick = (agent: AgentCardProps) => {
    setSelectedAgent(agent);
    setShowModal(true);
    setFlowState('loading');
    
    // Simulate loading (Frame 2: 1.5s loading)
    setTimeout(() => {
      setFlowState('results');
    }, 1500);
  };

  const handleCompleteFlow = () => {
    setFlowState('complete');
    
    // Frame 4: Badge toast with confetti (or static)
    setTimeout(() => {
      toast({
        title: "Achievement Unlocked!",
        description: `${selectedAgent?.name} Expert badge earned`,
        duration: 3000,
      });
      
      // Frame 5: Close and reset (300ms fade)
      setTimeout(() => {
        setShowModal(false);
        setFlowState('idle');
        setSelectedAgent(null);
      }, 300);
    }, 1000);
  };

  const cardVariants = {
    idle: { scale: 1, y: 0 },
    hover: { 
      scale: prefersReducedMotion ? 1 : 1.02, 
      y: prefersReducedMotion ? 0 : -2,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: prefersReducedMotion ? 1 : 0.98,
      transition: { duration: 0.1 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 }
    }
  };

  const slideVariants = {
    hidden: { x: prefersReducedMotion ? 0 : 300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }
    }
  };

  return (
    <>
      {/* Frame 1: Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            variants={cardVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="cursor-pointer"
            onClick={() => handleAgentClick(agent)}
          >
            <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{agent.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {agent.category}
                  </Badge>
                </div>
              </div>
              <Button
                className="w-full mt-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                aria-label={`Activate ${agent.name} agent`}
              >
                Activate Agent
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Frame 2-5: Modal Flow */}
      <AnimatePresence>
        {showModal && selectedAgent && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent 
              className="max-w-2xl focus:outline-none"
              aria-labelledby="agent-modal-title"
              aria-describedby="agent-modal-description"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Frame 2: Loading State (1.5s) */}
                {flowState === 'loading' && (
                  <div 
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="sr-only">Loading {selectedAgent.name} analysis...</div>
                    <Loader2 className={`w-12 h-12 text-blue-600 ${!prefersReducedMotion ? 'animate-spin' : ''}`} />
                    <h2 id="agent-modal-title" className="text-xl font-semibold text-gray-900">
                      Activating {selectedAgent.name}
                    </h2>
                    <p id="agent-modal-description" className="text-gray-600 text-center">
                      Analyzing regulatory requirements and generating insights...
                    </p>
                  </div>
                )}

                {/* Frame 3: Results Panel (slide-in 300ms) */}
                {flowState === 'results' && (
                  <motion.div
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Analysis Complete
                      </h2>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h3 className="font-medium text-gray-900">Key Findings:</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          Compliance status: 87% compliant with current regulations
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          3 action items identified for improvement
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          Next review recommended in 30 days
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCompleteFlow}
                        className="flex-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                        aria-label="Accept analysis and earn badge"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Accept & Earn Badge
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowModal(false)}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                        aria-label="Close analysis"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Frame 4: Completion (1s before auto-close) */}
                {flowState === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
                    }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <div className={`w-16 h-16 bg-green-100 rounded-full flex items-center justify-center ${!prefersReducedMotion ? 'animate-pulse' : ''}`}>
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Badge Earned!</h2>
                    <p className="text-gray-600 text-center">
                      You've successfully completed the {selectedAgent.name} analysis
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
