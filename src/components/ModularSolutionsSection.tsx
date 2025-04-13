
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCheck2, BarChart3, Lightbulb, Shield, PieChart, 
  Calendar, BookOpen, Users, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Solution = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

const solutions: Solution[] = [
  {
    id: "compliance",
    title: "Compliance Management",
    description: "Track and manage all your regulatory obligations with automated workflows, task assignments, and deadline reminders.",
    icon: FileCheck2,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "analytics",
    title: "Risk Analytics",
    description: "Visualize your compliance landscape with powerful dashboards, heat maps, and trend analysis to identify emerging risks.",
    icon: BarChart3,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "intelligence",
    title: "Regulatory Intelligence",
    description: "Stay ahead with AI-powered insights on changing regulations, impact analysis, and actionable recommendations.",
    icon: Lightbulb,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "security",
    title: "Data Protection",
    description: "Ensure GDPR, CCPA, and other privacy compliance with data mapping, subject access requests, and breach management tools.",
    icon: Shield,
    color: "from-purple-600 to-fuchsia-600",
  },
  {
    id: "reporting",
    title: "Executive Reporting",
    description: "Generate board-ready reports with compliance metrics, risk exposures, and attestation status across your organization.",
    icon: PieChart,
    color: "from-rose-500 to-red-600",
  },
  {
    id: "training",
    title: "Certification Training",
    description: "Access industry-recognized GRC certification courses with interactive learning modules and practice examinations.",
    icon: BookOpen,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "calendar",
    title: "Regulatory Calendar",
    description: "Track implementation dates, comment periods, and effective dates for regulations affecting your industry.",
    icon: Calendar,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "community",
    title: "Expert Network",
    description: "Connect with compliance leaders for peer benchmarking, best practices, and collaborative problem-solving.",
    icon: Users,
    color: "from-violet-600 to-purple-700",
  },
  {
    id: "alerts",
    title: "Regulatory Alerts",
    description: "Receive timely notifications about regulatory changes tailored to your specific industry and jurisdictions.",
    icon: AlertCircle, 
    color: "from-pink-500 to-rose-600",
  },
];

const ModularSolutionsSection = () => {
  const [activeSolution, setActiveSolution] = useState<string>(solutions[0].id);
  
  const activeSolutionData = solutions.find((solution) => solution.id === activeSolution) || solutions[0];
  
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
            A fully integrated suite of GRC products and services designed to streamline compliance workflows
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Solutions nav - left sidebar on desktop, horizontal scrolling tabs on mobile */}
          <div className="lg:col-span-3">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2">
              {solutions.map((solution) => (
                <Button
                  key={solution.id}
                  variant="ghost"
                  size="lg"
                  className={cn(
                    "justify-start gap-3 rounded-lg px-4 py-2 text-left",
                    "border border-transparent transition-colors whitespace-nowrap",
                    activeSolution === solution.id
                      ? "bg-slate-100 border-slate-200"
                      : "hover:bg-slate-50 hover:border-slate-100"
                  )}
                  onClick={() => setActiveSolution(solution.id)}
                >
                  <div className={`rounded-md p-1 bg-gradient-to-br ${solution.color} text-white`}>
                    <solution.icon className="h-4 w-4" />
                  </div>
                  <span>{solution.title}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Solution details - animates when selection changes */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 h-full">
              <motion.div
                key={activeSolution} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row md:items-start gap-8"
              >
                {/* Solution icon */}
                <div className={`hidden md:flex items-center justify-center w-24 h-24 rounded-xl bg-gradient-to-br ${activeSolutionData.color} text-white shadow-lg`}>
                  <activeSolutionData.icon className="h-10 w-10" />
                </div>

                {/* Solution content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-display font-bold mb-4">
                    {activeSolutionData.title}
                  </h3>
                  
                  <p className="text-slate-700 mb-6 text-lg">
                    {activeSolutionData.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Solution features */}
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={`feature-${activeSolution}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-100"
                      >
                        <div className="flex gap-3 items-start">
                          <div className={`rounded-md p-1 bg-gradient-to-br ${activeSolutionData.color} text-white`}>
                            <activeSolutionData.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">Feature {i + 1}</h4>
                            <p className="text-sm text-slate-500">
                              {`Enhance your ${activeSolutionData.title.toLowerCase()} with integrated tools and analytics.`}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button
                      className={`bg-gradient-to-r ${activeSolutionData.color} text-white hover:shadow-md transition-shadow`}
                    >
                      Explore {activeSolutionData.title}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModularSolutionsSection;
