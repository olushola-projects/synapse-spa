import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Remediation Status Page
 * Complete monitoring dashboard for the comprehensive remediation plan
 */
import { RemediationDashboard } from '@/components/testing/RemediationDashboard';
import { SeoHead } from '@/components/SEO/SeoHead';
export default function RemediationStatus() {
    return (_jsxs(_Fragment, { children: [_jsx(SeoHead, { title: 'Remediation Status | SFDR Navigator', description: 'Complete status dashboard for the SFDR Navigator security and compliance remediation plan', keywords: ['remediation', 'security', 'compliance', 'SFDR', 'monitoring'] }), _jsx("div", { className: 'min-h-screen bg-background py-8', children: _jsx("div", { className: 'container mx-auto px-4', children: _jsxs("div", { className: 'max-w-7xl mx-auto', children: [_jsxs("div", { className: 'text-center mb-8', children: [_jsx("h1", { className: 'text-3xl font-bold tracking-tight', children: "Remediation Status Dashboard" }), _jsx("p", { className: 'text-muted-foreground mt-2', children: "Complete monitoring of security and compliance remediation implementation" })] }), _jsx(RemediationDashboard, {})] }) }) })] }));
}
