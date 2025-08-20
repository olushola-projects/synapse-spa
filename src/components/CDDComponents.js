import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, Brain, Zap, CheckCircle, TrendingUp, Globe, Lock, Eye, FileText, BarChart3, Play, ChevronRight, Layers, Target, Database } from 'lucide-react';
// Enhanced Metrics Dashboard
export const CDDMetricsDashboard = () => {
    const [activeMetric, setActiveMetric] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const metrics = [
        {
            label: 'Identity Verification Accuracy',
            value: 99.7,
            icon: _jsx(Shield, { className: 'w-6 h-6' }),
            color: 'from-green-500 to-emerald-600',
            description: 'Advanced biometric and document verification'
        },
        {
            label: 'Processing Speed',
            value: 94.2,
            icon: _jsx(Zap, { className: 'w-6 h-6' }),
            color: 'from-blue-500 to-cyan-600',
            description: 'Real-time KYC completion in seconds'
        },
        {
            label: 'Risk Detection Rate',
            value: 98.1,
            icon: _jsx(Target, { className: 'w-6 h-6' }),
            color: 'from-orange-500 to-red-600',
            description: 'ML-powered risk assessment and scoring'
        },
        {
            label: 'Compliance Coverage',
            value: 96.8,
            icon: _jsx(CheckCircle, { className: 'w-6 h-6' }),
            color: 'from-purple-500 to-indigo-600',
            description: 'Global regulatory compliance standards'
        }
    ];
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMetric(prev => (prev + 1) % metrics.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (_jsx("div", { ref: ref, className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', children: metrics.map((metric, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: isInView ? { opacity: 1, y: 0 } : {}, transition: { delay: index * 0.1 }, className: `relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${metric.color} text-white cursor-pointer transform transition-all duration-300 hover:scale-105 ${activeMetric === index ? 'ring-4 ring-white/30 scale-105' : ''}`, onClick: () => setActiveMetric(index), children: [_jsxs("div", { className: 'flex items-center justify-between mb-4', children: [_jsx("div", { className: 'p-2 bg-white/20 rounded-lg backdrop-blur-sm', children: metric.icon }), _jsxs(Badge, { variant: 'secondary', className: 'bg-white/20 text-white border-white/30', children: [metric.value, "%"] })] }), _jsx("h3", { className: 'font-semibold text-lg mb-2', children: metric.label }), _jsx("p", { className: 'text-sm text-white/80 mb-4', children: metric.description }), _jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex justify-between text-sm', children: [_jsx("span", { children: "Performance" }), _jsxs("span", { children: [metric.value, "%"] })] }), _jsx(Progress, { value: metric.value, className: 'h-2 bg-white/20' })] }), _jsx(motion.div, { className: 'absolute inset-0 bg-white/10', initial: { x: '-100%' }, animate: activeMetric === index ? { x: '100%' } : { x: '-100%' }, transition: { duration: 0.6, ease: 'easeInOut' } })] }, index))) }));
};
// Interactive Feature Showcase
export const CDDFeatureShowcase = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const features = [
        {
            title: 'Biometric Identity Verification',
            description: 'Advanced facial recognition and liveness detection with 99.7% accuracy',
            icon: _jsx(Eye, { className: 'w-8 h-8' }),
            gradient: 'from-blue-500 to-cyan-500',
            details: [
                'Real-time facial recognition',
                'Liveness detection technology',
                'Document-to-face matching',
                'Anti-spoofing protection'
            ],
            demo: 'Interactive biometric verification demo'
        },
        {
            title: 'AI-Powered Document Analysis',
            description: 'Intelligent OCR and document authenticity validation across 200+ document types',
            icon: _jsx(FileText, { className: 'w-8 h-8' }),
            gradient: 'from-green-500 to-emerald-500',
            details: [
                'Multi-language OCR support',
                'Forgery detection algorithms',
                'Template matching validation',
                'Real-time data extraction'
            ],
            demo: 'Document scanning simulation'
        },
        {
            title: 'Dynamic Risk Scoring',
            description: 'Machine learning algorithms for real-time risk assessment and behavioral analysis',
            icon: _jsx(Brain, { className: 'w-8 h-8' }),
            gradient: 'from-purple-500 to-indigo-500',
            details: [
                'ML-based risk models',
                'Behavioral pattern analysis',
                'Transaction monitoring',
                'Adaptive scoring algorithms'
            ],
            demo: 'Risk scoring visualization'
        },
        {
            title: 'Global Sanctions Screening',
            description: 'Real-time screening against 50+ global watchlists and sanctions databases',
            icon: _jsx(Globe, { className: 'w-8 h-8' }),
            gradient: 'from-orange-500 to-red-500',
            details: [
                'OFAC sanctions screening',
                'PEP database matching',
                'Adverse media monitoring',
                'Real-time updates'
            ],
            demo: 'Sanctions screening interface'
        }
    ];
    return (_jsxs("div", { ref: ref, className: 'space-y-8', children: [_jsx("div", { className: 'grid grid-cols-1 lg:grid-cols-4 gap-4', children: features.map((feature, index) => (_jsxs(motion.button, { initial: { opacity: 0, y: 20 }, animate: isInView ? { opacity: 1, y: 0 } : {}, transition: { delay: index * 0.1 }, onClick: () => setActiveFeature(index), className: `p-6 rounded-2xl text-left transition-all duration-300 ${activeFeature === index
                        ? `bg-gradient-to-br ${feature.gradient} text-white shadow-2xl scale-105`
                        : 'bg-card hover:bg-muted border border-border'}`, children: [_jsx("div", { className: `p-3 rounded-xl mb-4 inline-block ${activeFeature === index ? 'bg-white/20' : 'bg-primary/10'}`, children: feature.icon }), _jsx("h3", { className: 'font-semibold text-lg mb-2', children: feature.title }), _jsx("p", { className: `text-sm ${activeFeature === index ? 'text-white/80' : 'text-muted-foreground'}`, children: feature.description })] }, index))) }), _jsx(AnimatePresence, { mode: 'wait', children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: 'bg-card rounded-2xl p-8 border border-border', children: _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center', children: [_jsxs("div", { className: 'space-y-6', children: [_jsxs("div", { className: 'flex items-center gap-4', children: [_jsx("div", { className: `p-4 rounded-2xl bg-gradient-to-br ${features[activeFeature]?.gradient || 'from-blue-500 to-cyan-500'} text-white`, children: features[activeFeature]?.icon }), _jsxs("div", { children: [_jsx("h3", { className: 'text-2xl font-bold', children: features[activeFeature]?.title }), _jsx("p", { className: 'text-muted-foreground', children: features[activeFeature]?.description })] })] }), _jsxs("div", { className: 'space-y-3', children: [_jsx("h4", { className: 'font-semibold text-lg', children: "Key Capabilities" }), _jsx("ul", { className: 'space-y-2', children: features[activeFeature]?.details?.map((detail, idx) => (_jsxs(motion.li, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.1 }, className: 'flex items-center gap-3 text-sm', children: [_jsx("div", { className: 'w-2 h-2 bg-primary rounded-full' }), detail] }, idx))) })] }), _jsxs(Button, { className: 'w-full', children: [_jsx(Play, { className: 'w-4 h-4 mr-2' }), "Try ", features[activeFeature]?.demo || 'Demo'] })] }), _jsx("div", { className: 'bg-muted/50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]', children: _jsxs("div", { className: 'text-center space-y-4', children: [_jsx("div", { className: `w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${features[activeFeature]?.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center text-white`, children: features[activeFeature]?.icon }), _jsx("h4", { className: 'font-semibold', children: features[activeFeature]?.demo || 'Demo' }), _jsx("p", { className: 'text-sm text-muted-foreground', children: "Interactive demo coming soon" })] }) })] }) }, activeFeature) })] }));
};
// Compliance Standards Grid
export const ComplianceStandards = () => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const standards = [
        {
            name: 'GDPR',
            region: 'EU',
            icon: _jsx(Shield, { className: 'w-6 h-6' }),
            color: 'from-blue-500 to-blue-600'
        },
        {
            name: 'KYC/AML',
            region: 'Global',
            icon: _jsx(Users, { className: 'w-6 h-6' }),
            color: 'from-green-500 to-green-600'
        },
        {
            name: 'SOX',
            region: 'US',
            icon: _jsx(FileText, { className: 'w-6 h-6' }),
            color: 'from-purple-500 to-purple-600'
        },
        {
            name: 'PCI DSS',
            region: 'Global',
            icon: _jsx(Lock, { className: 'w-6 h-6' }),
            color: 'from-orange-500 to-orange-600'
        },
        {
            name: 'CCPA',
            region: 'California',
            icon: _jsx(Eye, { className: 'w-6 h-6' }),
            color: 'from-red-500 to-red-600'
        },
        {
            name: 'MiFID II',
            region: 'EU',
            icon: _jsx(BarChart3, { className: 'w-6 h-6' }),
            color: 'from-indigo-500 to-indigo-600'
        }
    ];
    return (_jsx("div", { ref: ref, className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4', children: standards.map((standard, index) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: isInView ? { opacity: 1, scale: 1 } : {}, transition: { delay: index * 0.1 }, className: `p-4 rounded-2xl bg-gradient-to-br ${standard.color} text-white text-center space-y-2 hover:scale-105 transition-transform cursor-pointer`, children: [_jsx("div", { className: 'flex justify-center', children: standard.icon }), _jsx("h4", { className: 'font-semibold text-sm', children: standard.name }), _jsx("p", { className: 'text-xs text-white/80', children: standard.region })] }, index))) }));
};
// Architecture Diagram
export const CDDArchitecture = () => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const layers = [
        {
            name: 'User Interface',
            description: 'Intuitive dashboard and API endpoints',
            icon: _jsx(Layers, { className: 'w-8 h-8' }),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            name: 'AI Processing Engine',
            description: 'Machine learning models and NLP processing',
            icon: _jsx(Brain, { className: 'w-8 h-8' }),
            color: 'from-purple-500 to-indigo-500'
        },
        {
            name: 'Data Integration',
            description: 'Real-time data feeds and external APIs',
            icon: _jsx(Database, { className: 'w-8 h-8' }),
            color: 'from-green-500 to-emerald-500'
        },
        {
            name: 'Security Layer',
            description: 'Encryption, access control, and audit trails',
            icon: _jsx(Shield, { className: 'w-8 h-8' }),
            color: 'from-red-500 to-orange-500'
        }
    ];
    return (_jsx("div", { ref: ref, className: 'space-y-6', children: layers.map((layer, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: index % 2 === 0 ? -50 : 50 }, animate: isInView ? { opacity: 1, x: 0 } : {}, transition: { delay: index * 0.2 }, className: 'relative', children: [_jsx("div", { className: `p-6 rounded-2xl bg-gradient-to-r ${layer.color} text-white`, children: _jsxs("div", { className: 'flex items-center gap-4', children: [_jsx("div", { className: 'p-3 bg-white/20 rounded-xl', children: layer.icon }), _jsxs("div", { className: 'flex-1', children: [_jsx("h3", { className: 'text-xl font-semibold mb-2', children: layer.name }), _jsx("p", { className: 'text-white/80', children: layer.description })] }), _jsx(ChevronRight, { className: 'w-6 h-6' })] }) }), index < layers.length - 1 && (_jsx("div", { className: 'flex justify-center py-4', children: _jsx("div", { className: 'w-px h-8 bg-border' }) }))] }, index))) }));
};
// Performance Benchmarks
export const PerformanceBenchmarks = () => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const benchmarks = [
        { metric: 'Identity Verification', ourScore: 99.7, industry: 94.2, unit: '%' },
        { metric: 'Processing Time', ourScore: 2.3, industry: 8.7, unit: 's', inverse: true },
        { metric: 'False Positive Rate', ourScore: 0.8, industry: 3.2, unit: '%', inverse: true },
        { metric: 'Customer Satisfaction', ourScore: 96.8, industry: 87.3, unit: '%' }
    ];
    return (_jsx("div", { ref: ref, className: 'space-y-6', children: benchmarks.map((benchmark, index) => {
            const isOursBetter = benchmark.inverse
                ? benchmark.ourScore < benchmark.industry
                : benchmark.ourScore > benchmark.industry;
            return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: isInView ? { opacity: 1, y: 0 } : {}, transition: { delay: index * 0.1 }, className: 'bg-card rounded-2xl p-6 border border-border', children: [_jsxs("div", { className: 'flex items-center justify-between mb-4', children: [_jsx("h4", { className: 'font-semibold text-lg', children: benchmark.metric }), isOursBetter && (_jsxs(Badge, { variant: 'secondary', className: 'bg-green-100 text-green-800', children: [_jsx(TrendingUp, { className: 'w-3 h-3 mr-1' }), "Leading"] }))] }), _jsxs("div", { className: 'space-y-4', children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsx("span", { className: 'text-sm text-muted-foreground', children: "CDD Agent" }), _jsxs("span", { className: 'font-semibold text-lg', children: [benchmark.ourScore, benchmark.unit] })] }), _jsx(Progress, { value: benchmark.inverse ? 100 - benchmark.ourScore : benchmark.ourScore, className: 'h-3' }), _jsxs("div", { className: 'flex items-center justify-between', children: [_jsx("span", { className: 'text-sm text-muted-foreground', children: "Industry Average" }), _jsxs("span", { className: 'font-medium', children: [benchmark.industry, benchmark.unit] })] }), _jsx(Progress, { value: benchmark.inverse ? 100 - benchmark.industry : benchmark.industry, className: 'h-2 opacity-50' })] })] }, index));
        }) }));
};
// Customer Success Stories
export const CustomerSuccessStories = () => {
    const [activeStory, setActiveStory] = useState(0);
    const ref = React.useRef(null);
    const stories = [
        {
            company: 'NeoBank Digital',
            industry: 'Digital Banking',
            challenge: 'Manual KYC processes taking 3-5 days',
            solution: 'Automated CDD verification in under 2 minutes',
            results: [
                '95% reduction in onboarding time',
                '60% decrease in operational costs',
                '99.2% customer satisfaction rate'
            ],
            quote: 'CDD Agent transformed our customer onboarding from days to minutes while maintaining the highest compliance standards.',
            author: 'Sarah Chen, Chief Compliance Officer',
            logo: '🏦'
        },
        {
            company: 'CryptoExchange Pro',
            industry: 'Cryptocurrency',
            challenge: 'Complex regulatory compliance across multiple jurisdictions',
            solution: 'Unified compliance platform with real-time monitoring',
            results: [
                '100% regulatory compliance maintained',
                '40% reduction in false positives',
                '24/7 automated monitoring'
            ],
            quote: 'The AI-powered risk scoring has been a game-changer for our compliance operations.',
            author: 'Michael Rodriguez, Head of Risk',
            logo: '₿'
        },
        {
            company: 'Global Payments Inc',
            industry: 'Payment Processing',
            challenge: 'High volume transaction monitoring and screening',
            solution: 'Scalable AI platform processing millions of transactions',
            results: [
                '10x increase in processing capacity',
                '85% reduction in manual reviews',
                '99.8% accuracy in risk detection'
            ],
            quote: 'CDD Agent scales effortlessly with our business growth while maintaining exceptional accuracy.',
            author: 'David Kim, VP of Operations',
            logo: '💳'
        }
    ];
    return (_jsxs("div", { ref: ref, className: 'space-y-8', children: [_jsx("div", { className: 'flex justify-center', children: _jsx("div", { className: 'flex gap-2', children: stories.map((_, index) => (_jsx("button", { onClick: () => setActiveStory(index), className: `w-3 h-3 rounded-full transition-all ${activeStory === index ? 'bg-primary' : 'bg-muted'}` }, index))) }) }), _jsx(AnimatePresence, { mode: 'wait', children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: 'bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8', children: _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8', children: [_jsxs("div", { className: 'space-y-6', children: [_jsxs("div", { className: 'flex items-center gap-4', children: [_jsx("div", { className: 'text-4xl', children: stories[activeStory]?.logo }), _jsxs("div", { children: [_jsx("h3", { className: 'text-2xl font-bold', children: stories[activeStory]?.company }), _jsx("p", { className: 'text-muted-foreground', children: stories[activeStory]?.industry })] })] }), _jsxs("div", { className: 'space-y-4', children: [_jsxs("div", { children: [_jsx("h4", { className: 'font-semibold text-red-600 mb-2', children: "Challenge" }), _jsx("p", { className: 'text-sm', children: stories[activeStory]?.challenge })] }), _jsxs("div", { children: [_jsx("h4", { className: 'font-semibold text-blue-600 mb-2', children: "Solution" }), _jsx("p", { className: 'text-sm', children: stories[activeStory]?.solution })] })] })] }), _jsxs("div", { className: 'space-y-6', children: [_jsxs("div", { children: [_jsx("h4", { className: 'font-semibold text-green-600 mb-4', children: "Results" }), _jsx("ul", { className: 'space-y-2', children: stories[activeStory]?.results?.map((result, idx) => (_jsxs("li", { className: 'flex items-center gap-3 text-sm', children: [_jsx(CheckCircle, { className: 'w-4 h-4 text-green-600' }), result] }, idx))) })] }), _jsxs("div", { className: 'bg-white/50 rounded-xl p-6', children: [_jsxs("blockquote", { className: 'text-sm italic mb-4', children: ["\"", stories[activeStory]?.quote, "\""] }), _jsxs("cite", { className: 'text-xs text-muted-foreground font-medium', children: ["\u2014 ", stories[activeStory]?.author] })] })] })] }) }, activeStory) })] }));
};
