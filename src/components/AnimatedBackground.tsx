
import React from "react";
import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Animated diagonal stripes - Stripe-inspired */}
      <div className="absolute inset-0">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f01a_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f01a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        {/* Animated gradients */}
        <motion.div 
          className="absolute -inset-[100%] rotate-[-35deg]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Primary gradient stripe */}
          <motion.div 
            className="h-[15vh] w-[200%] bg-gradient-to-r from-blue-100/20 via-indigo-100/30 to-blue-50/20 mb-[20vh] blur-xl"
            animate={{
              x: [0, 50, 0],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Secondary gradient stripe */}
          <motion.div 
            className="h-[8vh] w-[200%] bg-gradient-to-r from-indigo-100/10 via-purple-100/20 to-indigo-50/10 mb-[25vh] blur-lg"
            animate={{
              x: [50, -30, 50],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Tertiary gradient stripe */}
          <motion.div 
            className="h-[12vh] w-[200%] bg-gradient-to-r from-blue-50/30 via-indigo-100/10 to-purple-50/20 blur-xl"
            animate={{
              x: [-20, 30, -20],
            }}
            transition={{
              duration: 55,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>

      {/* Floating gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1 */}
        <motion.div 
          className="absolute top-[15%] left-[10%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-br from-blue-100/20 to-indigo-200/10 blur-3xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Blob 2 */}
        <motion.div 
          className="absolute bottom-[20%] right-[15%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-tr from-purple-100/10 to-indigo-100/20 blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 0.95, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};
