
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, Bot, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const featureIcons = [
  {
    title: "GRC Agent Gallery",
    icon: <Bot className="text-indigo-600" size={20} />,
    description: "Gallery",
    content: {
      title: "Explore Regulatory AI Agents",
      description: "Discover purpose-built compliance assistants",
      details: "Browse our curated library of intelligent agents developed specifically for compliance tasks - from SFDR disclosure automation to AML transaction monitoring and ESG reporting. Each agent is trained on domain-specific regulations and best practices."
    }
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={20} />,
    description: "Forum",
    content: {
      title: "GRC Professional Community",
      description: "Connect with peers and mentors",
      details: "Join a global network of GRC professionals to share knowledge, ask questions, and collaborate on solving complex compliance challenges."
    }
  },
  {
    title: "Badges & Recognition",
    icon: <BadgeCheck className="text-blue-500" size={20} />,
    description: "Recognition",
    content: {
      title: "Professional Achievement Tracking",
      description: "Showcase your expertise",
      details: "Earn badges and recognition for your contributions, skills, and knowledge in specific regulatory domains and compliance areas."
    }
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={20} />,
    description: "Matching",
    content: {
      title: "Career Advancement Opportunities",
      description: "Find your next GRC position",
      details: "Get matched with relevant job opportunities based on your skills, experience, and career goals in the governance, risk, and compliance space."
    }
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={20} />,
    description: "Games",
    content: {
      title: "Interactive Learning Experience",
      description: "Learn through gameplay",
      details: "Enhance your GRC knowledge and skills through interactive scenarios, quizzes, and challenges designed to make learning engaging and effective."
    }
  },
  {
    title: "Customize Your Own Agent",
    icon: <Settings className="text-amber-500" size={20} />,
    description: "Customize",
    content: {
      title: "Personalized AI Assistant Builder",
      description: "Create compliance tools for your needs",
      details: "Design your own compliance AI assistant with our intuitive builder. Select your preferred large language model, customize its tone and expertise areas, and define its behavior patterns - all without writing a single line of code."
    }
  }
];

interface FeatureGridProps {
  animate: boolean;
  onFeatureClick?: (index: number) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate, onFeatureClick }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className={`mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
        {featureIcons.map((feature, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center p-5 rounded-xl bg-white/90 hover:bg-white/95 transition-all cursor-pointer shadow-sm hover:shadow max-w-none hover:translate-y-[-5px] hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onFeatureClick && onFeatureClick(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 animate-[float_3s_ease-in-out_infinite]">
              {feature.icon}
            </div>
            <h3 className="text-sm font-medium mb-2 text-center">{feature.title}</h3>
            <p className="text-xs text-gray-600 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
