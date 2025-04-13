
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Solution } from "@/types/solutions";

interface SolutionDetailProps {
  solution: Solution;
}

const SolutionDetail: React.FC<SolutionDetailProps> = ({ solution }) => {
  return (
    <motion.div
      key={solution.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Solution icon */}
        <div className={`hidden md:flex items-center justify-center w-24 h-24 rounded-xl bg-gradient-to-br ${solution.color} text-white shadow-lg`}>
          <solution.icon className="h-10 w-10" />
        </div>

        {/* Solution content */}
        <div className="flex-1">
          <h3 className="text-2xl font-display font-bold mb-4">
            {solution.title}
          </h3>
          
          <p className="text-slate-700 mb-6 text-lg">
            {solution.description}
          </p>
          
          <div className="mt-8">
            <Button
              className={`bg-gradient-to-r ${solution.color} text-white hover:shadow-md transition-shadow`}
            >
              Explore {solution.title}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SolutionDetail;
