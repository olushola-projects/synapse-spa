import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AmlAnalysisCard } from './AmlAnalysisCard';
import { NetworkingCard } from './NetworkingCard';
import { RegulatoryFocusChart, ComplianceRiskChart, ControlStatusChart } from './charts/DashboardCharts';
import { AgentGalleryCard } from './AgentGalleryCard';
import { StatusCards } from './StatusCards';
export const DashboardContent = ({ onAmlDialogOpen = () => { }, children }) => {
    return (_jsxs("div", { className: 'flex gap-1 flex-1 text-[1.125rem] p-2', children: [_jsxs("div", { className: 'flex-1 flex flex-col gap-1', children: [_jsx(StatusCards, {}), _jsx(AmlAnalysisCard, { onAmlDialogOpen: onAmlDialogOpen }), _jsx(NetworkingCard, {}), _jsx(RegulatoryFocusChart, {})] }), _jsxs("div", { className: 'flex-1 flex flex-col gap-1', children: [_jsx(AgentGalleryCard, {}), _jsx(ComplianceRiskChart, {}), _jsx(ControlStatusChart, {})] }), children] }));
};
