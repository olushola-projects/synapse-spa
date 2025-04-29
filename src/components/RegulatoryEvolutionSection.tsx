
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import JoinWaitlistDialog from './JoinWaitlistDialog';
import { useState } from 'react';

const RegulatoryEvolutionSection = () => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  const openWaitlistDialog = () => {
    setShowWaitlistDialog(true);
  };

  const features = [
    "Upskill in GRC and AI competencies",
    "Collaborate with compliance leaders",
    "Test and leverage GRC Agent Gallery", 
    "GRC Agent Gallery and Super Agents",
    "Future-proof your practice"
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Join Synapses to upskill, collaborate with compliance leaders, test and leverage GRC agent gallery, train powerful AI agents, and future-proof your practice in a unified ecosystem.
            </h2>
            
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-green-100 p-1 text-green-600">
                    <Check size={14} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div onClick={openWaitlistDialog}>
              <Button size="lg" className="group">
                Join Waitlist
                <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
              <img
                src="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png"
                alt="Regulatory Evolution Platform"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg max-w-[200px] border border-gray-100">
              <p className="text-sm font-medium">Join 300+ GRC professionals already on the waitlist</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <JoinWaitlistDialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />
    </section>
  );
};

export default RegulatoryEvolutionSection;
