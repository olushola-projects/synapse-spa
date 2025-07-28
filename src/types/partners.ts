import type { LucideIcon } from 'lucide-react';

export interface PartnerCategory {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: LucideIcon;
  color: string;
}
