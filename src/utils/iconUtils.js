import { jsx as _jsx } from 'react/jsx-runtime';
// import React from 'react';
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
export const createCoinsIcon = () => _jsx(Coins, { className: 'h-8 w-8 opacity-90' });
export const createScaleIcon = () => _jsx(Scale, { className: 'h-8 w-8 opacity-90' });
export const createShieldAlertIcon = () => _jsx(ShieldAlert, { className: 'h-8 w-8 opacity-90' });
export const createBuilding2Icon = () => _jsx(Building2, { className: 'h-8 w-8 opacity-90' });
export const createFileTextIcon = () => _jsx(FileText, { className: 'h-8 w-8 opacity-90' });
export const createLineChartIcon = () => _jsx(LineChart, { className: 'h-8 w-8 opacity-90' });
export const createBrainIcon = () => _jsx(Brain, { className: 'h-8 w-8 opacity-90' });
export const createGraduationCapIcon = () =>
  _jsx(GraduationCap, { className: 'h-8 w-8 opacity-90' });
