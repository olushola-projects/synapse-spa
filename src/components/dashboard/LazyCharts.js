import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Simple lazy loading without complex module resolution
const MobileCharts = lazy(() => import('./MobileCharts'));
// Loading fallback component
const ChartSkeleton = ({ title }) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: title }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'space-y-4', children: [_jsx(Skeleton, { className: 'h-4 w-full' }), _jsx(Skeleton, { className: 'h-32 w-full' }), _jsxs("div", { className: 'flex space-x-2', children: [_jsx(Skeleton, { className: 'h-4 w-16' }), _jsx(Skeleton, { className: 'h-4 w-16' }), _jsx(Skeleton, { className: 'h-4 w-16' })] })] }) })] }));
// Simple non-lazy exports for now to fix build issues
export { RegulatoryFocusChart, ComplianceRiskChart, ControlStatusChart } from './charts/DashboardCharts';
export const LazyMobileCharts = () => (_jsx(Suspense, { fallback: _jsx(ChartSkeleton, { title: 'Mobile Analytics' }), children: _jsx(MobileCharts, {}) }));
// Monitoring skeleton - removed unused component
// Simple imports for monitoring components
export { default as PerformanceMonitoringDashboard } from '../monitoring/PerformanceMonitoringDashboard';
export { default as RealTimeMonitoringDashboard } from '../monitoring/RealTimeMonitoringDashboard';
