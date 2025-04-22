
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';

const features = [
  {
    title: "Regulatory Analysis",
    icon: <MessageSquare className="text-indigo-600" size={24} />,
    description: "Get instant insights on complex regulations"
  },
  {
    title: "Networking & Forum",
    icon: <Users className="text-purple-500" size={24} />,
    description: "Connect with peers in the compliance community"
  },
  {
    title: "Badges & Recognition",
    icon: <BadgeCheck className="text-blue-500" size={24} />,
    description: "Earn badges for your GRC expertise"
  },
  {
    title: "Job Matching",
    icon: <Briefcase className="text-emerald-500" size={24} />,
    description: "Find your next GRC opportunity"
  },
  {
    title: "GRC Games",
    icon: <GamepadIcon className="text-rose-500" size={24} />,
    description: "Learn through interactive gameplay"
  },
  {
    title: "Interview Prep",
    icon: <FileText className="text-amber-500" size={24} />,
    description: "Prepare for your next career move"
  }
];

interface FeatureGridProps {
  animate: boolean;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ animate }) => {
  return (
    <div className={`mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      {features.map((feature, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">{feature.title}</h3>
          <p className="text-gray-600 text-sm text-center">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
