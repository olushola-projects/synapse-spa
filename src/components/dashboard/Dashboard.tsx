
import React from "react";
import { motion } from "framer-motion";

export const EnhancedDashboardContainer = ({ children, className = "" }) => {
  return (
    <div className={`max-w-full w-full mx-auto p-4 sm:p-6 md:p-8 overflow-hidden relative ${className}`}>
      {children}
    </div>
  );
};

export const DashboardGrid = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 lg:mt-8 ${className}`}>
      {children}
    </div>
  );
};

export const MobileDashboard = ({ children, className = "" }) => {
  return (
    <motion.div 
      className={`w-full overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
