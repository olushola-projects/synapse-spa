
import React from "react";
import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <motion.div 
      className="fixed inset-0 -z-10 bg-gradient-to-br from-[#ee7752] via-[#e73c7e] to-[#23a6d5] bg-[length:400%_400%] opacity-5"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 15,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};
