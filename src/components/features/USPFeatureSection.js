import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Brain, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
const uspItems = [
    {
        title: 'Agents Gallery',
        description: 'Purpose-built AI agents designed to reduce manual work in compliance.',
        icon: _jsx(Brain, { className: 'h-7 w-7 opacity-90' }),
        color: 'text-purple-600',
        modalContent: {
            position: 'Modular thematic AI agents trained to support regulatory analysis, exception reviews, GRC operations and document drafting.',
            problem: 'Manual reviews, fragmented tools, and generic AI that lacks regulatory context.',
            solution: 'Embedded SME agents with training in KYC, ESG, TPRM e.t.c, provide traceable outputs, support key compliance workflows, and plug into real tools.',
            whyItMatters: 'These agents are built for GRC, not just response — freeing up teams time to focus on judgment, not grunt work.'
        }
    },
    {
        title: 'Regulatory Intelligence',
        description: 'Agent summarized bespoke updates filtered by jurisdiction, risk area, and role.',
        icon: _jsx(Globe, { className: 'h-7 w-7 opacity-90' }),
        color: 'text-blue-500',
        modalContent: {
            position: 'Synapses turn fragmented change updates into instant, personalized contextualized insights.',
            problem: 'GRC professionals spend hours reading PDFs, decoding alerts, and chasing updates across silos.',
            solution: 'AI curates relevant personalized rules, explains them, and ties them to real-world decisions.',
            whyItMatters: "Less inbox, more insight. Updates shouldn't just be read - they should drive action."
        }
    },
    {
        title: 'Ecosystem',
        description: 'A vibrant professional community built for governance, compliance, risk, and audit teams.',
        icon: _jsx(Users, { className: 'h-7 w-7 opacity-90' }),
        color: 'text-indigo-500',
        modalContent: {
            position: 'Not a professional social network, a real-time environment for collaboration, recognition, and learning.',
            problem: 'Siloed teams, noisy channels, no reskilling platform and outdated training.',
            solution: 'Scenario challenges, reskilling to copilot with GRC agents, badges, peer insights, co-creation, and AI-supported growth.',
            whyItMatters: 'Because compliance is evolving, the future of GRC is with AI agents and that future is now. Transformation is crucial.'
        }
    }
];
/**
 * USPFeatureSection component - Enhanced feature showcase with improved visual design
 * Features better spacing, hover effects, and professional card-based layout
 */
export const USPFeatureSection = () => {
    const [selectedUSP, setSelectedUSP] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const handleUSPClick = (usp) => {
        setSelectedUSP(usp);
        setIsOpen(true);
    };
    return (_jsxs("div", { className: 'flex flex-col md:flex-row items-start justify-start gap-8 lg:gap-12 rounded-none', children: [uspItems.map((usp, index) => (_jsxs(motion.div, { className: 'flex flex-col items-center text-center group cursor-pointer', initial: {
                    opacity: 0,
                    y: 20
                }, animate: {
                    opacity: 1,
                    y: 0
                }, transition: {
                    duration: 0.5,
                    delay: index * 0.15
                }, onClick: () => handleUSPClick(usp), children: [_jsx("div", { className: `w-16 h-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 ${usp.color}`, children: usp.icon }), _jsx("h3", { className: 'font-semibold text-slate-800 group-hover:text-blue-600 transition-colors text-sm', children: usp.title })] }, index))), _jsx(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: selectedUSP && (_jsxs(DialogContent, { className: 'sm:max-w-2xl', children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: 'text-2xl flex items-center gap-2', children: [_jsx("div", { className: `inline-block ${selectedUSP.color}`, children: selectedUSP.icon }), _jsx("span", { children: selectedUSP.title })] }), _jsx(DialogDescription, { className: 'text-lg text-gray-700 mt-2', children: selectedUSP.description })] }), _jsxs("div", { className: 'space-y-6 pt-4', children: [_jsxs("div", { children: [_jsx("h4", { className: 'text-lg font-semibold text-indigo-700', children: "Position" }), _jsx("p", { className: 'mt-1 text-gray-700', children: selectedUSP.modalContent.position })] }), _jsxs("div", { children: [_jsx("h4", { className: 'text-lg font-semibold text-indigo-700', children: "Problem" }), _jsx("p", { className: 'mt-1 text-gray-700', children: selectedUSP.modalContent.problem })] }), _jsxs("div", { children: [_jsx("h4", { className: 'text-lg font-semibold text-indigo-700', children: "Solution" }), _jsx("p", { className: 'mt-1 text-gray-700', children: selectedUSP.modalContent.solution })] }), _jsxs("div", { children: [_jsx("h4", { className: 'text-lg font-semibold text-indigo-700', children: "Why It Matters" }), _jsx("p", { className: 'mt-1 text-gray-700', children: selectedUSP.modalContent.whyItMatters })] })] })] })) })] }));
};
