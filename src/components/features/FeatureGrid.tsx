
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';

export const featureIcons = [
  {
    title: "Regulatory Analysis",
    icon: <MessageSquare className="text-indigo-600" size={24} />,
    description: "Get instant insights on complex regulations",
    content: {
      title: "Regulatory Analysis with AI",
      description: "Harness the power of AI for regulatory compliance",
      details: "Our AI-powered regulatory analysis tools help compliance professionals stay ahead of complex regulations. Get instant insights, summaries, and actionable recommendations tailored to your industry and jurisdiction."
    }
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={24} />,
    description: "Connect with peers in the compliance community",
    content: {
      title: "GRC Professional Network",
      description: "Build your professional network in the GRC space",
      details: "Join a vibrant community of GRC professionals to share knowledge, discuss regulatory challenges, and build meaningful connections that enhance your career opportunities."
    }
  },
  {
    title: "Badges & Recognition",
    icon: <BadgeCheck className="text-blue-500" size={24} />,
    description: "Earn badges for your GRC expertise",
    content: {
      title: "Professional Recognition System",
      description: "Showcase your expertise and achievements",
      details: "Our badge system recognizes your growing expertise in different regulatory domains. Earn credentials that demonstrate your knowledge and commitment to excellence in governance, risk, and compliance."
    }
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={24} />,
    description: "Find your next GRC opportunity",
    content: {
      title: "Career Advancement Tools",
      description: "Discover opportunities aligned with your skills",
      details: "Our intelligent job matching algorithm connects you with opportunities that align with your expertise, career goals, and professional interests in the GRC space."
    }
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={24} />,
    description: "Learn through interactive gameplay",
    content: {
      title: "Interactive Learning Experience",
      description: "Make compliance learning engaging and effective",
      details: "Turn complex regulatory concepts into engaging learning experiences through gamification. Our GRC games help you and your team build knowledge while having fun."
    }
  },
  {
    title: "Interview Prep",
    icon: <FileText className="text-amber-500" size={24} />,
    description: "Prepare for your next career move",
    content: {
      title: "Career Development Resources",
      description: "Ace your next GRC interview with confidence",
      details: "Access specialized resources to prepare for GRC interviews, including practice questions, expert insights, and personalized feedback to help you advance your career."
    }
  }
];

interface FeatureGridProps {
  animate: boolean;
  onFeatureClick?: (index: number) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate, onFeatureClick }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      {featureIcons.map((feature, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-white"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onFeatureClick && onFeatureClick(index)}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">{feature.title}</h3>
          <p className="text-sm text-white/80 text-center">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
