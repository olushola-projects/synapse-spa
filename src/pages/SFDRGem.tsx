import React from 'react';
import { SFDRGem } from '@/components/sfdr-gem/SFDRGem';
import { motion } from 'framer-motion';

/**
 * SFDR Gem page component
 * Provides the main interface for the advanced SFDR compliance assistant
 */
const SFDRGemPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8"
    >
      <div className="container mx-auto px-4">
        <SFDRGem />
      </div>
    </motion.div>
  );
};

export default SFDRGemPage;