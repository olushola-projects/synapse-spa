import React from 'react';
import {
  Brain,
  Building2,
  GraduationCap,
  LineChart,
  ShieldAlert,
  Coins,
  FileText,
  Scale
} from 'lucide-react';

// Create helper functions that return React nodes for each icon
export const createCoinsIcon = () => <Coins className='h-8 w-8 opacity-90' />;
export const createScaleIcon = () => <Scale className='h-8 w-8 opacity-90' />;
export const createShieldAlertIcon = () => <ShieldAlert className='h-8 w-8 opacity-90' />;
export const createBuilding2Icon = () => <Building2 className='h-8 w-8 opacity-90' />;
export const createFileTextIcon = () => <FileText className='h-8 w-8 opacity-90' />;
export const createLineChartIcon = () => <LineChart className='h-8 w-8 opacity-90' />;
export const createBrainIcon = () => <Brain className='h-8 w-8 opacity-90' />;
export const createGraduationCapIcon = () => <GraduationCap className='h-8 w-8 opacity-90' />;
