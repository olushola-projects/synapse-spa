
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { floatAnimation } from '@/styles/animations';

export const featureIcons = [
  {
    title: "Regulatory Analysis",
    icon: <MessageSquare className="text-indigo-600" size={20} />,
    description: "Analysis",
    content: {
      title: "AI-Powered Regulatory Analysis",
      description: "Navigate complex regulations with ease",
      details: "Our AI copilot Dara provides intelligent regulatory insights and automates compliance tasks, helping you stay ahead of regulatory changes and requirements."
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
    title: "Interview Prep",
    icon: <FileText className="text-amber-500" size={20} />,
    description: "Prep",
    content: {
      title: "Career Readiness Tools",
      description: "Prepare for your next role",
      details: "Access interview guides, resume reviews, and practice sessions tailored specifically for GRC professionals to help you succeed in your career journey."
    }
  }
];

const FeatureContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const EnhancedFeatureBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  /* Reduced size by 50% */
  max-width: 180px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(31, 38, 135, 0.15);
  }
`;

const FeatureIcon = styled.div`
  animation: ${floatAnimation} 3s ease-in-out infinite;
`;

interface FeatureGridProps {
  animate: boolean;
  onFeatureClick?: (index: number) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate, onFeatureClick }) => {
  return (
    <FeatureContainer>
      <div className={`mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mx-auto transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
        {featureIcons.map((feature, index) => (
          <EnhancedFeatureBox 
            key={index}
            className="flex flex-col items-center p-3 rounded-xl bg-white/90 hover:bg-white/95 transition-all cursor-pointer shadow-sm hover:shadow"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onFeatureClick && onFeatureClick(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeatureIcon className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mb-2">
              {feature.icon}
            </FeatureIcon>
            <h3 className="text-xs font-medium mb-1 text-center">{feature.title}</h3>
            <p className="text-xs text-gray-600 text-center">{feature.description}</p>
          </EnhancedFeatureBox>
        ))}
      </div>
    </FeatureContainer>
  );
};
