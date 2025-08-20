import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { MONITORING_CONSTANTS } from '@/utils/constants';
export function SystemHealthCard({ health }) {
    const getHealthIconProps = (health) => ({
        className: health === 'healthy' ? 'text-green-500' : health === 'degraded' ? 'text-yellow-500' : 'text-red-500',
        size: 16
    });
    const iconProps = getHealthIconProps(health);
    const Icon = health === 'healthy'
        ? CheckCircle
        : health === 'degraded'
            ? AlertTriangle
            : health === 'critical'
                ? XCircle
                : Activity;
    return (_jsx(Card, { children: _jsx(CardContent, { className: 'p-6', children: _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { children: [_jsx("p", { className: 'text-sm font-medium text-muted-foreground', children: "System Health" }), _jsxs("div", { className: 'flex items-center space-x-2 mt-1', children: [_jsx(Icon, { ...iconProps }), _jsx("span", { className: `text-lg font-bold capitalize ${iconProps.className}`, children: health })] })] }), _jsx(Shield, { className: `h-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} text-muted-foreground` })] }) }) }));
}
