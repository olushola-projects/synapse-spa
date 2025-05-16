
import React from 'react';
import { Award, Briefcase, Compass, GamepadIcon, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Updated feature icons with new icon components
export const featureIcons = [
  {
    title: "GRC Agent Gallery",
    icon: <Compass className="text-indigo-600" size={26} />,
    description: "Explore",
    content: {
      title: "GRC Agent Gallery",
      description: "Explore specialized compliance AI assistants",
      details: "Explore a curated library of intelligent agents built for real-world compliance use cases — from SFDR audits to AML checks. Access pre-built, specialized AI assistants designed to tackle specific regulatory challenges across industries."
    }
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={26} />,
    description: "Forum",
    content: {
      title: "GRC Professional Community",
      description: "Connect with peers and mentors",
      details: "Join a global network of GRC professionals to share knowledge, ask questions, and collaborate on solving complex compliance challenges."
    }
  },
  {
    title: "Badges & Recognition",
    icon: <Award className="text-blue-500" size={26} />,
    description: "Recognition",
    content: {
      title: "Professional Achievement Tracking",
      description: "Showcase your expertise",
      details: "Earn badges and recognition for your contributions, skills, and knowledge in specific regulatory domains and compliance areas."
    }
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={26} />,
    description: "Matching",
    content: {
      title: "Career Advancement Opportunities",
      description: "Find your next GRC position",
      details: "Get matched with relevant job opportunities based on your skills, experience, and career goals in the governance, risk, and compliance space."
    }
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={26} />,
    description: "Games",
    content: {
      title: "Interactive Learning Experience",
      description: "Learn through gameplay",
      details: "Enhance your GRC knowledge and skills through interactive scenarios, quizzes, and challenges designed to make learning engaging and effective."
    }
  },
  {
    title: "Customize Agent",
    icon: <Settings className="text-amber-500" size={26} />,
    description: "Customize",
    content: {
      title: "Customizable AI Assistant",
      description: "Build your personal compliance assistant",
      details: "Build your personal compliance AI assistant. Choose your preferred LLM, set its tone, and define its behavior — no coding needed. Create specialized agents for specific regulatory domains or compliance tasks tailored to your organization's needs."
    }
  }
];

interface FeatureGridProps {
  animate: boolean;
  onFeatureClick?: (index: number) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate, onFeatureClick }) => {
  return (
    <div className="feature-grid w-full max-w-xl">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 transition-all duration-700 ease-out">
        {featureIcons.map((feature, index) => (
          <motion.div 
            key={index}
            className="feature-card flex flex-col items-center justify-center aspect-square p-2 sm:p-3 rounded-lg bg-white hover:bg-white/95 shadow-md hover:shadow-lg border border-gray-200 cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:border-indigo-500"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onFeatureClick && onFeatureClick(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            aria-label={`${feature.title} - ${feature.description}`}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-50 flex items-center justify-center mb-1 sm:mb-2">
              {feature.icon}
            </div>
            <h3 className="text-xs sm:text-sm font-semibold mb-0.5 text-center line-clamp-1">{feature.title}</h3>
            <p className="text-[10px] sm:text-xs text-gray-600 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
