import { LucideIcon } from "lucide-react";

export type UseCase = {
  id: string;
  title: string;
  description: string;
  industry: string;
  complexity: 'Low' | 'Medium' | 'High';
  status: 'Draft' | 'In Progress' | 'Completed' | 'On Hold';
  aiSolution?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  icon?: string; // Icon identifier for the use case
  viewCount?: number; // For analytics tracking
  
  // Enhanced fields based on Cambridge SupTech Lab structure
  supervisoryFunction?: string; // e.g., "Prudential Supervision", "Market Conduct", etc.
  regulatoryDomain?: string; // e.g., "Banking", "Securities", "Insurance", etc.
  technologyStack?: string[]; // e.g., ["Machine Learning", "NLP", "Cloud"]
  implementationCost?: 'Low' | 'Medium' | 'High';
  timeToImplement?: string; // e.g., "3-6 months"
  regulatoryReferences?: string[]; // e.g., ["GDPR Article 17", "Dodd-Frank Section 1502"]
  benefits?: string[]; // Key benefits of implementing this use case
  challenges?: string[]; // Implementation challenges
  roi?: string; // Return on investment information
  caseStudies?: CaseStudy[]; // Related case studies
  resources?: Resource[]; // Related resources
};

export type CaseStudy = {
  id: string;
  title: string;
  organization: string;
  summary: string;
  outcomes: string[];
  link?: string;
};

export type Resource = {
  id: string;
  title: string;
  type: 'Documentation' | 'Whitepaper' | 'Video' | 'Webinar' | 'Tool' | 'Template';
  link: string;
  description?: string;
};

// Helper types for filtering and sorting
export type ComplexityLevel = 'Low' | 'Medium' | 'High';
export type StatusType = 'Draft' | 'In Progress' | 'Completed' | 'On Hold';
export type SortOption = 'newest' | 'popular' | 'complexity' | 'alphabetical';
export type FilterView = 'simple' | 'advanced';