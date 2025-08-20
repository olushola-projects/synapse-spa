import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { MONITORING_CONSTANTS } from '@/utils/constants';
export function ActiveAlertsCard({ activeAlerts, criticalAlerts }) {
    return (_jsx(Card, { children: _jsx(CardContent, { className: 'p-6', children: _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { children: [_jsx("p", { className: 'text-sm font-medium text-muted-foreground', children: "Active Alerts" }), _jsxs("div", { className: 'flex items-center space-x-2 mt-1', children: [_jsx("span", { className: 'text-2xl font-bold', children: activeAlerts }), criticalAlerts > 0 && (_jsxs(Badge, { className: 'bg-red-100 text-red-800', children: [criticalAlerts, " Critical"] }))] })] }), _jsx(AlertCircle, { className: `h-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} w-${MONITORING_CONSTANTS.ICON.SIZE.LARGE_PX} text-muted-foreground` })] }) }) }));
}
