import {
  MessageSquareCode,
  Bot,
  Calendar,
  RefreshCw,
  Lightbulb,
  Briefcase,
  FilePen,
  Headphones,
  Users,
  MessageSquare,
  Folder,
  School,
  Award,
  Badge,
  UserCheck,
  
  Globe
} from 'lucide-react';
import type { Solution } from '@/types/solutions';

export const solutions: Solution[] = [
  {
    id: 'dara-chatbot',
    title: 'Regulatory Analysis Chatbot - Dara',
    description: 'AI-powered insights for complex regulatory interpretation and guidance.',
    icon: Bot,
    color: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'regulatory-calendar',
    title: 'Regulatory Calendar',
    description: 'Track critical regulatory deadlines and upcoming changes with precision.',
    icon: Calendar,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'regulatory-updates',
    title: 'Regulatory Updates',
    description: 'Stay informed with real-time regulatory change notifications.',
    icon: RefreshCw,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'daily-insights',
    title: 'Daily Regulatory Insights',
    description: 'Curated, bite-sized regulatory news tailored to your industry.',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'job-matching',
    title: 'Job Matching',
    description: 'Personalized career opportunities aligned with your GRC expertise.',
    icon: Briefcase,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'cv-surgery',
    title: 'CV Surgery',
    description: 'AI-powered resume optimization for GRC professionals.',
    icon: FilePen,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'coaching-training',
    title: 'Coaching & Training',
    description: 'Comprehensive learning paths with AI and expert-guided training.',
    icon: Headphones,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'networking',
    title: 'Networking',
    description: 'Connect with 10,000+ global GRC professionals.',
    icon: Users,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'interview-coaching',
    title: 'AI + Human Interview Coaching',
    description: 'Tailored interview preparation with advanced performance analytics.',
    icon: MessageSquareCode,
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'community-forum',
    title: 'Community Forum',
    description: 'Collaborative platform to discuss regulatory challenges.',
    icon: MessageSquare,
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 'career-insights',
    title: 'Career Insights',
    description: 'Personalized career development strategies and counseling.',
    icon: Folder,
    color: 'from-violet-500 to-fuchsia-600'
  },
  {
    id: 'events-projects',
    title: 'Events & Projects',
    description: 'Engage in collaborative compliance initiatives and networking events.',
    icon: School,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'team-huddle',
    title: 'Team Huddle',
    description: 'Streamline compliance workflows and team collaboration.',
    icon: Users,
    color: 'from-teal-500 to-green-600'
  },
  {
    id: 'gamification',
    title: 'Gamification',
    description: 'Earn badges, track progress, and make compliance engaging.',
    icon: Award,
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'badges',
    title: 'Professional Badges',
    description: 'Showcase your compliance expertise with verifiable digital credentials.',
    icon: Badge,
    color: 'from-lime-500 to-green-600'
  },
  {
    id: 'mentorship',
    title: 'Mentorship',
    description: 'Connect with senior GRC professionals for personalized guidance.',
    icon: UserCheck,
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'translation',
    title: 'Multilingual Support',
    description: 'Break language barriers with expert translation services.',
    icon: Globe,
    color: 'from-blue-600 to-indigo-700'
  }
];
