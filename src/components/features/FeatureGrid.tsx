
import React from 'react';
import { Compass, Users, Award, Briefcase, GamepadIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

// Updated feature icons with new titles and icons
export const featureIcons = [
  {
    title: "GRC Agent Gallery",
    icon: <Compass className="text-indigo-600" size={32} />,
    description: "Explore",
    content: {
      title: "GRC Agent Gallery",
      description: "Explore specialized compliance AI assistants",
      details: "Explore a curated library of intelligent agents built for real-world compliance use cases — from SFDR audits to AML checks. Access pre-built, specialized AI assistants designed to tackle specific regulatory challenges across industries."
    }
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={32} />,
    description: "Forum",
    content: {
      title: "GRC Professional Community",
      description: "Connect with peers and mentors",
      details: "Join a global network of GRC professionals to share knowledge, ask questions, and collaborate on solving complex compliance challenges."
    }
  },
  {
    title: "Badges & Recognition",
    icon: <Award className="text-blue-500" size={32} />,
    description: "Recognition",
    content: {
      title: "Professional Achievement Tracking",
      description: "Showcase your expertise",
      details: "Earn badges and recognition for your contributions, skills, and knowledge in specific regulatory domains and compliance areas."
    }
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={32} />,
    description: "Matching",
    content: {
      title: "Career Advancement Opportunities",
      description: "Find your next GRC position",
      details: "Get matched with relevant job opportunities based on your skills, experience, and career goals in the governance, risk, and compliance space."
    }
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={32} />,
    description: "Games",
    content: {
      title: "Interactive Learning Experience",
      description: "Learn through gameplay",
      details: "Enhance your GRC knowledge and skills through interactive scenarios, quizzes, and challenges designed to make learning engaging and effective."
    }
  },
  {
    title: "Customize Agent",
    icon: <Settings className="text-amber-500" size={32} />,
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
    <div className="max-w-2xl">
      <div className="grid grid-cols-3 gap-3 md:gap-4 transition-all duration-700 ease-out">
        {featureIcons.map((feature, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center justify-center w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] aspect-square rounded-md bg-white border border-[#E4E7EC] hover:border-[#4F46E5] shadow-sm hover:shadow cursor-pointer hover:-translate-y-[2px] transition-all duration-150"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onFeatureClick && onFeatureClick(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            aria-label={`${feature.title} – ${feature.description}`}
          >
            <div className="flex flex-col items-center justify-center space-y-1.5">
              {feature.icon}
              <h3 className="text-[14px] font-medium text-gray-800 text-center">{feature.description}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
