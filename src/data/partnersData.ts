import { Code, Users, Gavel, Briefcase, UserSearch, GraduationCap /* Globe */ } from 'lucide-react';
// Globe import removed - not used in this data file
import type { PartnerCategory } from '@/types/partners';

export const partnerCategories: PartnerCategory[] = [
  {
    id: 'regtech-developers',
    title: 'Regtech Developers',
    description: 'Platform to showcase solutions, gather feedback, and collaborate with end-users.',
    benefits: [
      'Showcase your solution to compliance professionals',
      'Gather real-time feedback from end-users',
      'Connect with potential clients and partners',
      'Stay informed about emerging regulatory challenges'
    ],
    icon: Code,
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'associations',
    title: 'Associations',
    description:
      'Central hub for member engagement, training, and dissemination of best practices.',
    benefits: [
      'Engage members through a specialized platform',
      'Distribute best practices and standards',
      'Organize virtual and hybrid events',
      'Provide exclusive training opportunities'
    ],
    icon: Users,
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'regulators',
    title: 'Regulators',
    description:
      'Channel for stakeholder consultations, policy dissemination, and feedback collection.',
    benefits: [
      'Streamline stakeholder consultations',
      'Effectively communicate policy updates',
      'Gather structured feedback from industry',
      'Support compliance education initiatives'
    ],
    icon: Gavel,
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'consulting-firms',
    title: 'Consulting Firms',
    description: 'Opportunities for client engagement, service offerings, and thought leadership.',
    benefits: [
      'Showcase your expertise and service offerings',
      'Develop thought leadership content',
      'Connect with potential clients',
      'Stay informed about emerging compliance trends'
    ],
    icon: Briefcase,
    color: 'from-amber-500 to-amber-700'
  },
  {
    id: 'recruiters',
    title: 'Recruiters',
    description:
      'Access to a specialized talent pool with verified credentials and project portfolios.',
    benefits: [
      'Access a specialized GRC talent pool',
      'View verified credentials and experience',
      'Post specialized compliance job opportunities',
      'Connect with passive job seekers'
    ],
    icon: UserSearch,
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'coaches-trainers',
    title: 'Coaches & Trainers',
    description:
      'Platform to offer training programs, mentorship, and professional development resources.',
    benefits: [
      'Offer specialized compliance training programs',
      'Provide mentorship opportunities',
      'Build your professional reputation',
      'Connect with professionals seeking development'
    ],
    icon: GraduationCap,
    color: 'from-cyan-500 to-cyan-700'
  }
];
