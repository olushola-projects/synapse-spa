import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Bot, Shield, Target, Sparkles, CheckCircle, ArrowRight, Brain, FileCheck, TrendingUp, Zap } from 'lucide-react';
/**
 * NexusAgentSection component - Showcases the SFDR Navigator on the landing page
 * Provides an overview and call-to-action to try the SFDR compliance validation tool
 */
const NexusAgentSection = () => {
    const features = [
        {
            icon: _jsx(Target, { className: 'w-5 h-5' }),
            title: 'SFDR Classification',
            description: 'Intelligent Article 6/8/9 classification with 94% accuracy'
        },
        {
            icon: _jsx(Shield, { className: 'w-5 h-5' }),
            title: 'Compliance Validation',
            description: 'Real-time regulatory compliance checking and validation'
        },
        {
            icon: _jsx(FileCheck, { className: 'w-5 h-5' }),
            title: 'Document Analysis',
            description: 'AI-powered document review and compliance gap analysis'
        },
        {
            icon: _jsx(Brain, { className: 'w-5 h-5' }),
            title: 'PAI Analysis',
            description: 'Principal Adverse Impact indicators analysis and reporting'
        }
    ];
    return (_jsx("section", { className: 'py-20 bg-gradient-to-br from-slate-50 to-blue-50', children: _jsxs("div", { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', children: [_jsxs(motion.div, { initial: {
                        opacity: 0,
                        y: 20
                    }, whileInView: {
                        opacity: 1,
                        y: 0
                    }, viewport: {
                        once: true
                    }, transition: {
                        duration: 0.6
                    }, className: 'text-center mb-16', children: [_jsxs("div", { className: 'flex items-center justify-center gap-3 mb-6', children: [_jsxs("div", { className: 'relative', children: [_jsx(Bot, { className: 'w-12 h-12 text-primary' }), _jsx(motion.div, { className: 'absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full', animate: {
                                                scale: [1, 1.2, 1]
                                            }, transition: {
                                                repeat: Infinity,
                                                duration: 2
                                            } })] }), _jsxs("div", { children: [_jsx("h2", { className: 'text-4xl font-bold text-gray-900', children: "Meet Sophia" }), _jsx(Badge, { variant: 'secondary', className: 'mt-2 bg-primary/10 text-primary border-primary/20', children: "SFDR Navigator Agent" })] })] }), _jsx("p", { className: 'text-gray-600 max-w-3xl mx-auto mb-8 text-base', children: "Your AI-powered guide to sustainable finance disclosures. Sophia breaks down complex SFDR requirements into actionable steps, ensuring compliant and accurate reporting." }), _jsxs("div", { className: 'flex items-center justify-center gap-6 text-sm text-gray-500', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(CheckCircle, { className: 'w-4 h-4 text-green-600' }), _jsx("span", { children: "94% Classification Accuracy" })] }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Zap, { className: 'w-4 h-4 text-yellow-600' }), _jsx("span", { children: "3.2s Average Response" })] }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(TrendingUp, { className: 'w-4 h-4 text-blue-600' }), _jsx("span", { children: "500+ Active Users" })] })] })] }), _jsx("div", { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12', children: features.map((feature, index) => (_jsx(motion.div, { initial: {
                            opacity: 0,
                            y: 20
                        }, whileInView: {
                            opacity: 1,
                            y: 0
                        }, viewport: {
                            once: true
                        }, transition: {
                            duration: 0.6,
                            delay: index * 0.1
                        }, children: _jsxs(Card, { className: 'h-full hover:shadow-lg transition-shadow duration-300', children: [_jsx(CardHeader, { className: 'pb-3', children: _jsxs("div", { className: 'flex items-center gap-3', children: [_jsx("div", { className: 'p-2 bg-primary/10 rounded-lg text-primary', children: feature.icon }), _jsx(CardTitle, { className: 'text-lg', children: feature.title })] }) }), _jsx(CardContent, { children: _jsx("p", { className: 'text-gray-600 text-sm', children: feature.description }) })] }) }, index))) }), _jsx(motion.div, { initial: {
                        opacity: 0,
                        y: 20
                    }, whileInView: {
                        opacity: 1,
                        y: 0
                    }, viewport: {
                        once: true
                    }, transition: {
                        duration: 0.6,
                        delay: 0.4
                    }, className: 'text-center', children: _jsx(Card, { className: 'bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20', children: _jsxs(CardContent, { className: 'py-12', children: [_jsxs("div", { className: 'flex items-center justify-center gap-2 mb-4', children: [_jsx(Sparkles, { className: 'w-6 h-6 text-primary' }), _jsx("h3", { className: 'text-2xl font-bold text-gray-900', children: "Ready to Transform Your SFDR Compliance?" })] }), _jsx("p", { className: 'text-gray-600 mb-8 max-w-2xl mx-auto', children: "Experience intelligent SFDR guidance with Sophia. Get instant classifications, compliance validation, and regulatory insights tailored to your fund structure." }), _jsxs("div", { className: 'flex flex-col sm:flex-row gap-4 justify-center', children: [_jsx(Button, { asChild: true, size: 'lg', className: 'group', children: _jsxs(Link, { to: '/nexus-agent', className: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200', children: [_jsx(Bot, { className: 'w-5 h-5 mr-2' }), "Try SFDR Navigator", _jsx(ArrowRight, { className: 'w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' })] }) }), _jsx(Button, { asChild: true, variant: 'outline', size: 'lg', className: 'group', children: _jsxs(Link, { to: '/sfdr-gem', children: [_jsx(Sparkles, { className: 'w-5 h-5 mr-2' }), "Explore SFDR Gem", _jsx(ArrowRight, { className: 'w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' })] }) })] }), _jsx("div", { className: 'mt-6 text-sm text-gray-500', children: "No registration required \u2022 Free to explore \u2022 Enterprise plans available" })] }) }) })] }) }));
};
export default NexusAgentSection;
