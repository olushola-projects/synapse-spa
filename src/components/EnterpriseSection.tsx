
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-tight leading-[1.1] text-gray-900 -tracking-[0.5px]">
              Put Compliance at the Core of Enterprise Agility
            </h2>
            
            <p className="text-[1.125rem] text-[#4B4B4B] leading-relaxed font-normal">
              Modernize regulatory operations, automate oversight, and scale securely across jurisdictions. 
              Synapses equips GRC teams with real-time insights, modular workflows, and seamless integrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-6 text-base font-medium rounded-lg"
                onClick={openWaitlistDialog}
              >
                Book a Demo <ArrowRight size={18} className="ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-medium rounded-lg"
              >
                Download Overview <Download size={16} className="ml-2" />
              </Button>
            </div>
            
            {/* Proof points */}
            <div className="pt-6 border-t border-gray-200 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <BarChart3 size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">25+ GRC teams</p>
                    <p className="text-xs text-gray-500">participating in early pilot</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-full">
                    <Globe size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">9 jurisdictions</p>
                    <p className="text-xs text-gray-500">supported at MVP</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-full">
                    <ShieldCheck size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Products used</p>
                    <p className="text-xs text-gray-500">Dara AI · Regulatory Intel · Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right column - Visual case study */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[4/3] w-full relative">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="Enterprise GRC team using Synapses compliance dashboard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,30,90,0.65)] to-[rgba(20,30,90,0.35)]"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="mb-3">
                    <span className="text-xs font-medium bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                      CASE STUDY
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">
                    Learn how Global Finance Corp is shaping the future of RegTech with Synapses
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:bg-white/20 p-0 h-auto font-medium text-sm"
                    >
                      View case study <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <JoinWaitlistDialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />
    </section>
  );
};

export default EnterpriseSection;
