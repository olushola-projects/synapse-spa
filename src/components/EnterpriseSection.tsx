
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, BarChart3, Globe, ShieldCheck } from 'lucide-react';
import JoinWaitlistDialog from './JoinWaitlistDialog';
import { useState } from 'react';

const EnterpriseSection = () => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  const openWaitlistDialog = () => {
    setShowWaitlistDialog(true);
  };

  return (
    <section className="bg-[#F9FAFB] py-12 md:py-[72px]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Small label/tag above the main headline - matching Stripe's "Enterprise reinvention" */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-[#6366F1] font-medium mb-4 text-lg"
        >
          Enterprise solutions
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-gray-900 -tracking-[0.5px]">
              Put Compliance at the Core of Enterprise Agility
            </h2>
            
            <p className="text-[1.125rem] text-[#4B4B4B] leading-relaxed font-normal">
              Modernize regulatory operations, automate oversight, and scale securely across jurisdictions. 
              Synapses equips GRC teams with real-time insights, modular workflows, and seamless integrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-6 text-base font-medium rounded-full"
                onClick={openWaitlistDialog}
              >
                Book a Demo <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-medium rounded-full"
              >
                Download Overview <Download size={16} className="ml-2" />
              </Button>
            </div>
          </motion.div>
          
          {/* Right column - Visual case study with card layout similar to BMW image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-0"
          >
            <div className="relative rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="aspect-[16/9] w-full relative">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="Enterprise GRC team using Synapses compliance dashboard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,70,150,0.5)] to-[rgba(15,55,120,0.85)]"></div>
                
                {/* Logo overlay in top left, similar to BMW logo in Stripe example */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white bg-opacity-90 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                    <ShieldCheck className="text-blue-600" size={24} />
                  </div>
                </div>
                
                {/* Text content overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-2 leading-tight">
                    Learn how Global Finance Corp is shaping the future of RegTech with Synapses
                  </h3>
                  <div className="flex items-center mt-3">
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/10 p-0 h-auto font-medium"
                    >
                      View case study <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats and product used section - matches the layout in Stripe's example */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-12"
        >
          {/* Millions stat */}
          <div className="border-l-2 border-[#6366F1] pl-6">
            <h4 className="text-xl font-bold text-gray-900 mb-1">25+</h4>
            <p className="text-gray-600">GRC teams participating in early pilot</p>
          </div>
          
          {/* 350+ stat */}
          <div className="border-l-2 border-[#6366F1] pl-6">
            <h4 className="text-xl font-bold text-gray-900 mb-1">9</h4>
            <p className="text-gray-600">jurisdictions supported at MVP</p>
          </div>
          
          {/* Products used */}
          <div className="border-l-2 border-[#6366F1] pl-6">
            <h4 className="text-xl font-bold text-gray-900 mb-1">Products used</h4>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-gray-600">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <span>Dara AI</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                <span>Regulatory Intel</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <JoinWaitlistDialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />
    </section>
  );
};

export default EnterpriseSection;
