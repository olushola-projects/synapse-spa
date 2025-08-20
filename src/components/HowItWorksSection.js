import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ExternalFormDialog from './ExternalFormDialog';
const HowItWorksSection = () => {
    const [showFormDialog, setShowFormDialog] = useState(false);
    const openFormDialog = () => {
        setShowFormDialog(true);
    };
    const steps = [
        {
            number: '01',
            title: 'Sign Up',
            description: 'Join the Synapses waiting list to be one of the first to experience the platform when it launches.'
        },
        {
            number: '02',
            title: 'Customize Your Experience',
            description: 'Set up your profile, select your areas of interest, and personalize your dashboard to focus on what matters to you.'
        },
        {
            number: '03',
            title: 'Engage Agent Gallery',
            description: 'Interact with Dara and other agents, build your own agents, add test and co-create new regtechs for your compliance needs.'
        },
        {
            number: '04',
            title: 'Connect & Grow',
            description: 'Network with peers, participate in discussions, attend events, and continuously expand your knowledge and skills.'
        }
    ];
    return (_jsxs("div", { id: 'how-it-works', className: 'py-20 bg-gray-50', children: [_jsxs("div", { className: 'container mx-auto sm:px-6 lg:px-8 px-[50px] py-[10px]', children: [_jsxs("div", { className: 'text-center mb-16', children: [_jsx("h2", { className: 'text-3xl md:text-4xl font-display font-bold mb-4', children: "How Synapses Works" }), _jsx("p", { className: 'text-lg text-gray-600 max-w-3xl mx-auto font-medium', children: "Getting started with Synapses is simple. Follow these steps to transform your GRC experience." })] }), _jsx("div", { className: 'grid md:grid-cols-2 lg:grid-cols-4 gap-8', children: steps.map((step, index) => (_jsxs("div", { className: 'relative', children: [index < steps.length - 1 && (_jsx("div", { className: 'hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-synapse-primary to-transparent z-0', style: {
                                        width: 'calc(100% - 2rem)'
                                    } })), _jsxs("div", { className: 'feature-card h-full relative z-10 bg-slate-200', children: [_jsx("div", { className: 'text-3xl font-bold text-synapse-primary/20 mb-4', children: step.number }), _jsx("h3", { className: 'text-xl font-semibold mb-3', children: step.title }), _jsx("p", { className: 'text-gray-600 text-sm', children: step.description })] })] }, index))) }), _jsx("div", { className: 'mt-16 text-center', children: _jsxs(Button, { onClick: openFormDialog, className: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200', children: ["Get Early Access ", _jsx(ArrowRight, { size: 18 })] }) })] }), _jsx(ExternalFormDialog, { open: showFormDialog, onOpenChange: setShowFormDialog, title: 'Get Early Access' })] }));
};
export default HowItWorksSection;
