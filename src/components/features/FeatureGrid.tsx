
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';

export const featureIcons = [
  {
    title: "Regulatory Analysis",
    icon: <MessageSquare className="text-indigo-600" size={24} />,
    description: "Get instant insights on complex regulations",
    content: {
      title: "Regulatory Analysis",
      description: "Get instant insights on complex regulations",
      details: "Our AI-powered regulatory analysis helps you understand complex regulations in simple terms. Get immediate answers to your compliance questions."
    }
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={24} />,
    description: "Connect with peers in the compliance community",
    content: {
      title: "Networking & Forum",
      description: "Connect with peers in the compliance community",
      details: "Join a vibrant community of GRC professionals to share knowledge, discuss challenges, and find solutions together."
    }
  },
  {
    title: "Badges & Recognition",
    icon: <BadgeCheck className="text-blue-500" size={24} />,
    description: "Earn badges for your GRC expertise",
    content: {
      title: "Badges & Recognition",
      description: "Earn badges for your GRC expertise",
      details: "Showcase your expertise and achievements with our badge system. Earn recognition for your contributions and skills."
    }
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={24} />,
    description: "Find your next GRC opportunity",
    content: {
      title: "Job Matching",
      description: "Find your next GRC opportunity",
      details: "Our intelligent job matching system connects you with relevant GRC opportunities based on your skills and experience."
    }
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={24} />,
    description: "Learn through interactive gameplay",
    content: {
      title: "GRC Games",
      description: "Learn through interactive gameplay",
      details: "Make learning fun with our interactive GRC games. Test your knowledge and skills in an engaging way."
    }
  },
  {
    title: "Interview Prep",
    icon: <FileText className="text-amber-500" size={24} />,
    description: "Prepare for your next career move",
    content: {
      title: "Interview Prep",
      description: "Prepare for your next career move",
      details: "Get ready for your next interview with our preparation tools. Practice common questions and get feedback on your answers."
    }
  }
];

export interface FeatureGridProps {
  animate: boolean;
  className?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate, className = "" }) => {
  return (
    <div className={`mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto ${className} ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      {featureIcons.map((feature, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white text-center">{feature.title}</h3>
          <p className="text-gray-200 text-sm text-center">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
