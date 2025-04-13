
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquareCode, Bot, Calendar, RefreshCw, Lightbulb, 
  Briefcase, Scissors, FilePen, Headphones, Users, 
  MessageSquare, Folder, School, Award, Badge, 
  UserCheck, Handshake, Translate
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
    id: "dara-chatbot",
    title: "Regulatory Analysis Chatbot - Dara",
    description: "AI-powered insights for complex regulatory interpretation and guidance.",
    icon: Bot,
    color: "from-purple-600 to-indigo-600",
  },
  {
    id: "regulatory-calendar",
    title: "Regulatory Calendar",
    description: "Track critical regulatory deadlines and upcoming changes with precision.",
    icon: Calendar,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "regulatory-updates",
    title: "Regulatory Updates",
    description: "Stay informed with real-time regulatory change notifications.",
    icon: RefreshCw,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "daily-insights",
    title: "Daily Regulatory Insights",
    description: "Curated, bite-sized regulatory news tailored to your industry.",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "job-matching",
    title: "Job Matching",
    description: "Personalized career opportunities aligned with your GRC expertise.",
    icon: Briefcase,
    color: "from-red-500 to-pink-600",
  },
  {
    id: "cv-surgery",
    title: "CV Surgery",
    description: "AI-powered resume optimization for GRC professionals.",
    icon: FilePen,
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "coaching-training",
    title: "Coaching & Training",
    description: "Comprehensive learning paths with AI and expert-guided training.",
    icon: Headphones,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "networking",
    title: "Networking",
    description: "Connect with 10,000+ global GRC professionals.",
    icon: Users,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "interview-coaching",
    title: "AI + Human Interview Coaching",
    description: "Tailored interview preparation with advanced performance analytics.",
    icon: MessageSquareCode,
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "community-forum",
    title: "Community Forum",
    description: "Collaborative platform to discuss regulatory challenges.",
    icon: MessageSquare,
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "career-insights",
    title: "Career Insights",
    description: "Personalized career development strategies and counseling.",
    icon: Folder,
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "events-projects",
    title: "Events & Projects",
    description: "Engage in collaborative compliance initiatives and networking events.",
    icon: School,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "team-huddle",
    title: "Team Huddle",
    description: "Streamline compliance workflows and team collaboration.",
    icon: Users,
    color: "from-teal-500 to-green-600",
  },
  {
    id: "gamification",
    title: "Gamification",
    description: "Earn badges, track progress, and make compliance engaging.",
    icon: Award,
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "badges",
    title: "Professional Badges",
    description: "Showcase your compliance expertise with verifiable digital credentials.",
    icon: Badge,
    color: "from-lime-500 to-green-600",
  },
  {
    id: "mentorship",
    title: "Mentorship",
    description: "Connect with senior GRC professionals for personalized guidance.",
    icon: UserCheck,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "translation",
    title: "Multilingual Support",
    description: "Break language barriers with expert translation services.",
    icon: Translate,
    color: "from-blue-600 to-indigo-700",
  }
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
            A comprehensive ecosystem of tools designed to elevate your GRC professional journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Solutions nav - scrollable on mobile, sidebar on desktop */}
          <div className="lg:col-span-3 max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
              {solutions.map((solution) => (
                <Button
                  key={solution.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "justify-start gap-3 rounded-lg px-3 py-2 text-left w-full",
                    "border border-transparent transition-colors whitespace-nowrap text-xs",
                    activeSolution === solution.id
                      ? "bg-slate-100 border-slate-200"
                      : "hover:bg-slate-50 hover:border-slate-100"
                  )}
                  onClick={() => setActiveSolution(solution.id)}
                >
                  <div className={`rounded-md p-1 bg-gradient-to-br ${solution.color} text-white`}>
                    <solution.icon className="h-3 w-3" />
                  </div>
                  <span className="truncate">{solution.title}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Solution details - animates when selection changes */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeSolution} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-8">
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
                  
                  <div className="mt-8">
                    <Button
                      className={`bg-gradient-to-r ${activeSolutionData.color} text-white hover:shadow-md transition-shadow`}
                    >
                      Explore {activeSolutionData.title}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModularSolutionsSection;
