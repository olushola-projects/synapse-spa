
import { useState } from "react";
import { solutions } from "@/data/solutionsData";
import { Solution } from "@/types/solutions";
import SolutionNavigation from "./solutions/SolutionNavigation";
import SolutionDetail from "./solutions/SolutionDetail";

const ModularSolutionsSection = () => {
  const [activeSolution, setActiveSolution] = useState<string>(solutions[0]?.id || "");
  
  const activeSolutionData: Solution = solutions.find((solution) => solution.id === activeSolution) || solutions[0];
  
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[60%] h-[80%] rounded-full bg-blue-50 blur-3xl opacity-70" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-indigo-50 blur-3xl opacity-70" />
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            Modular Solutions
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            A comprehensive ecosystem of tools designed to elevate your GRC professional journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Solutions navigation */}
          <SolutionNavigation 
            solutions={solutions} 
            activeSolution={activeSolution} 
            onSolutionChange={setActiveSolution} 
          />
          
          {/* Solution details */}
          <div className="lg:col-span-9">
            <SolutionDetail solution={activeSolutionData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModularSolutionsSection;
