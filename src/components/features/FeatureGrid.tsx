
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';

export const featureIcons = [
  {
    title: "Regulatory Analysis",
    icon: <MessageSquare className="text-indigo-600" size={20} />,
    description: "Analysis"
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={20} />,
    description: "Forum"
  },
  {
    title: "Badges & Recognition",
    icon: <BadgeCheck className="text-blue-500" size={20} />,
    description: "Recognition"
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={20} />,
    description: "Matching"
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={20} />,
    description: "Games"
  },
  {
    title: "Interview Prep",
    icon: <FileText className="text-amber-500" size={20} />,
    description: "Prep"
  }
];

interface FeatureGridProps {
  animate: boolean;
  onFeatureClick?: (index: number) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate, onFeatureClick }) => {
  return (
    <div className={`mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      {featureIcons.map((feature, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-4 rounded-xl bg-white/90 hover:bg-white/95 transition-all cursor-pointer shadow-sm hover:shadow"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onFeatureClick && onFeatureClick(index)}
        >
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            {feature.icon}
          </div>
          <h3 className="text-sm font-medium mb-1 text-center">{feature.title}</h3>
          <p className="text-xs text-gray-600 text-center">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
