
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, BarChart3, Globe, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ExternalFormDialog from './ExternalFormDialog';

const EnterpriseSection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Join Synapse");

  const openFormDialog = (title: string = "Join Synapse") => {
    setDialogTitle(title);
    setShowFormDialog(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="bg-[#F9FAFB] py-16 md:py-[90px]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Small label/tag above the main headline - matching Stripe's "Enterprise reinvention" */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-[#7A73FF] font-medium mb-4 text-lg"
        >
          Enterprise reinvention
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-7"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-[1.15] text-gray-900 -tracking-[0.5px]"
            >
              Bring agility to your enterprise
            </motion.h2>
            
            <motion.div variants={itemVariants}>
              <p className="text-[1.125rem] text-[#4B4B4B] leading-relaxed font-normal">
                Modernize regulatory operations with <a href="#" onClick={(e) => {e.preventDefault(); openFormDialog("Learn about Professional Services");}} className="text-[#7A73FF] hover:text-[#6366F1] underline-offset-4 hover:underline">professional services</a> and <a href="#" onClick={(e) => {e.preventDefault(); openFormDialog("Learn about Certified Partners");}} className="text-[#7A73FF] hover:text-[#6366F1] underline-offset-4 hover:underline">certified partners</a>. Scale securely across jurisdictions with Synapses enterprise-grade regulatory compliance solutions.
              </p>
              <p className="mt-4 text-[1.125rem] text-[#4B4B4B] leading-relaxed font-normal">
                Connect to existing platforms like ServiceNow, Salesforce, and Microsoft 365.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-2">
              <Button 
                size="lg" 
                className="bg-[#7A73FF] hover:bg-[#6366F1] text-white px-8 py-6 text-base font-medium rounded-full"
                onClick={() => openFormDialog("Explore Synapses for enterprises")}
              >
                Explore Synapses for enterprises <ArrowRight size={18} className="ml-2" />
              </Button>
            </motion.div>

            {/* Stats moved to left column below the text */}
            <motion.div
              variants={itemVariants}
              className="pt-6 mt-8 border-t border-gray-200"
            >
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">25+</h4>
                  <p className="text-gray-600">Global enterprises onboarded</p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">9</h4>
                  <p className="text-gray-600">jurisdictions supported</p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Products</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <div className="w-3 h-3 bg-[#7A73FF] rounded-full"></div>
                      <span>Dara AI</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
                      <span>RegCheck</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right column - Visual case study with card layout similar to BMW image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-0"
          >
            <div 
              className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
              onClick={() => openFormDialog("Global Finance Corp Case Study")}
            >
              <div className="aspect-[16/9] w-full relative">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="Enterprise GRC team using Synapses compliance dashboard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(60,90,180,0.5)] to-[rgba(50,70,150,0.85)]"></div>
                
                {/* Document icon in top right */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white bg-opacity-90 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <FileText className="text-[#7A73FF]" size={20} />
                  </div>
                </div>
                
                {/* Logo overlay in top left, similar to BMW logo in Stripe example */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white bg-opacity-90 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <ShieldCheck className="text-[#4B4B4B]" size={20} />
                  </div>
                </div>
                
                {/* Text content overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-2 leading-tight">
                    Learn why Global Finance Corp chose Synapses to reshape their compliance operations
                  </h3>
                  <div className="flex items-center mt-3 opacity-90 group-hover:opacity-100 transition-opacity">
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
      </div>
      
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog}
        title={dialogTitle}
      />
    </section>
  );
};

export default EnterpriseSection;
