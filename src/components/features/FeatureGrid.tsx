
import React from 'react';
import { MessageSquare, Users, BadgeCheck, Briefcase, GamepadIcon, FileText } from 'lucide-react';

export const featureIcons = [
  { title: "Regulatory Analysis", icon: <MessageSquare className="text-indigo-600" size={20} />, content: {
    title: "AI-Powered Regulatory Analysis",
    description: "Get instant insights on complex regulations with our advanced AI analysis tool.",
    details: "Our regulatory analysis tool uses natural language processing to break down complex legal text into actionable insights. It can compare regulations across jurisdictions, highlight key compliance requirements, and identify potential conflicts or gaps in your existing compliance framework."
  } },
  { title: "Networking & Forum", icon: <Users className="text-purple-500" size={20} />, content: {
    title: "GRC Professional Networking & Forum",
    description: "Connect with peers and mentors in the compliance community.",
    details: "Our networking platform and forum allow you to connect with peers, mentors, and industry experts. Share knowledge, ask questions, and collaborate on solutions to common compliance challenges. Build your professional network and stay connected with the global GRC community."
  } },
  { title: "Badges & Recognition", icon: <BadgeCheck className="text-blue-500" size={20} />, content: {
    title: "Professional Badges & Recognition",
    description: "Earn badges for your skills and achievements in the GRC field.",
    details: "Our badge system recognizes your skills, achievements, and contributions to the GRC field. Complete courses, contribute to discussions, solve regulatory challenges, and receive badges that you can display on your profile and share with your network."
  } },
  { title: "Job Matching", icon: <Briefcase className="text-emerald-500" size={20} />, content: {
    title: "Intelligent Job Matching",
    description: "Find the perfect role with our AI-powered matching algorithm and personalized career insights.",
    details: "Our job matching system goes beyond keywords to analyze your skills, experience, and career aspirations against the detailed requirements of open positions. Receive compatibility scores, salary insights, and personalized application advice for each opportunity."
  } },
  { title: "GRC Games", icon: <GamepadIcon className="text-rose-500" size={20} />, content: {
    title: "Personalized GRC Games",
    description: "Learn compliance concepts through interactive individual and group gameplay.",
    details: "Our gamification platform offers personalized games for individual learning as well as group games for huddles, events, and ice breakers. Earn badges as you progress, turning complex compliance topics into engaging interactive experiences."
  } },
  { title: "Interview Prep", icon: <FileText className="text-amber-500" size={20} />, content: {
    title: "GRC Interview Preparation",
    description: "Prepare for your next career move with our comprehensive interview preparation tools.",
    details: "Our interview preparation system helps you get ready for your next career move with practice questions, AI-powered feedback, and industry insights. Learn how to effectively communicate your GRC expertise and stand out in competitive job interviews."
  } },
];

interface FeatureGridProps {
  onFeatureClick: (index: number) => void;
  animate: boolean;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onFeatureClick, animate }) => {
  return (
    <div className={`mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
      {featureIcons.map((feature, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center p-6 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md hover-lift transition-all cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onFeatureClick(index)}
        >
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            {feature.icon}
          </div>
          <span className="text-sm md:text-base text-gray-700 text-center font-medium">{feature.title}</span>
        </div>
      ))}
    </div>
  );
};
