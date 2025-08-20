import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedAgentCard } from '@/components/AgentShowcase';
import { Bot, Zap, Shield, TrendingUp, Users, Clock, Star, CheckCircle, Sparkles, BarChart3, Globe, Rocket, Award, Lightbulb, Search, Filter, Grid, List } from 'lucide-react';
/**
 * Enhanced agent data with comprehensive information
 * Based on research of top AI agent platforms and UX best practices
 */
const enhancedAgents = [
    {
        id: 'sfdr-navigator',
        name: 'SFDR Navigator',
        description: 'Revolutionary AI agent for SFDR compliance and sustainability reporting automation with real-time regulatory updates',
        longDescription: "The SFDR Navigator represents the pinnacle of regulatory technology, combining advanced AI with deep domain expertise to revolutionize sustainability reporting. Our agent doesn't just automate compliance—it transforms how organizations approach ESG data management, ensuring accuracy, efficiency, and regulatory adherence at unprecedented scale.",
        status: 'launching',
        category: 'compliance',
        capabilities: [
            'ESG Data Analysis',
            'Automated Reporting',
            'Compliance Monitoring',
            'Risk Assessment',
            'Regulatory Intelligence'
        ],
        metrics: {
            accuracy: 98.7,
            speed: 95.2,
            reliability: 99.1,
            satisfaction: 96.8
        },
        icon: _jsx(Shield, { className: 'w-8 h-8' }),
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        features: [
            'Real-time SFDR compliance monitoring with instant alerts',
            'Automated sustainability report generation in multiple formats',
            'ESG data validation and verification with blockchain integration',
            'Regulatory change tracking with predictive impact analysis',
            'Multi-language support for global compliance requirements',
            'Advanced analytics dashboard with customizable KPIs',
            'Integration with major ESG data providers and frameworks'
        ],
        useCases: [
            'Asset Management Firms',
            'Investment Banks',
            'Pension Funds',
            'Insurance Companies',
            'Private Equity',
            'Wealth Management'
        ],
        launchDate: '2024-Q1',
        screenshots: [],
        pricing: {
            tier: 'Enterprise',
            price: 'Custom',
            features: [
                'Unlimited reports',
                '24/7 support',
                'Custom integrations',
                'Dedicated success manager'
            ]
        },
        testimonials: [
            {
                name: 'Sarah Chen',
                company: 'Global Asset Management',
                quote: "SFDR Navigator reduced our compliance workload by 80% while improving accuracy. It's a game-changer for our ESG reporting.",
                rating: 5
            },
            {
                name: 'Marcus Weber',
                company: 'European Investment Bank',
                quote: 'The real-time regulatory updates and automated reporting have transformed our sustainability operations.',
                rating: 5
            }
        ]
    },
    {
        id: 'cdd-agent',
        name: 'CDD Agent',
        description: 'Next-generation Customer Due Diligence agent powered by advanced AI for seamless KYC and AML compliance',
        longDescription: 'The CDD Agent redefines customer onboarding and compliance through cutting-edge artificial intelligence. By combining machine learning, natural language processing, and advanced risk analytics, our agent delivers unparalleled accuracy in identity verification, risk assessment, and ongoing monitoring while dramatically reducing processing time and operational costs.',
        status: 'launching',
        category: 'compliance',
        capabilities: [
            'Identity Verification',
            'Risk Scoring',
            'Document Analysis',
            'Sanctions Screening',
            'Behavioral Analytics',
            'Continuous Monitoring'
        ],
        metrics: {
            accuracy: 97.3,
            speed: 92.8,
            reliability: 98.5,
            satisfaction: 95.2
        },
        icon: _jsx(Users, { className: 'w-8 h-8' }),
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        features: [
            'Advanced biometric identity verification with liveness detection',
            'Real-time sanctions and PEP screening across global databases',
            'AI-powered document authenticity validation and OCR',
            'Dynamic risk scoring with machine learning algorithms',
            'Continuous transaction monitoring and behavioral analysis',
            'Automated case management with intelligent escalation',
            'Comprehensive audit trails and regulatory reporting'
        ],
        useCases: [
            'Digital Banks',
            'Fintech Platforms',
            'Cryptocurrency Exchanges',
            'Payment Processors',
            'Lending Institutions',
            'Insurance Companies'
        ],
        launchDate: '2024-Q1',
        screenshots: [],
        pricing: {
            tier: 'Professional',
            price: 'From $2.50/check',
            features: ['Volume discounts', 'API access', 'Custom workflows', 'Priority support']
        },
        testimonials: [
            {
                name: 'Alex Rodriguez',
                company: 'NeoBank Solutions',
                quote: 'CDD Agent streamlined our onboarding process, reducing verification time from hours to minutes while maintaining the highest security standards.',
                rating: 5
            },
            {
                name: 'Emma Thompson',
                company: 'CryptoTrade Exchange',
                quote: 'The accuracy and speed of identity verification has significantly improved our customer experience and compliance posture.',
                rating: 5
            }
        ]
    }
];
/**
 * Advanced animation variants with sophisticated timing
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};
/**
 * Floating particles background component
 */
const FloatingParticles = () => {
    return (_jsx("div", { className: 'absolute inset-0 overflow-hidden pointer-events-none', children: [...Array(20)].map((_, i) => (_jsx(motion.div, { className: 'absolute w-2 h-2 bg-primary/20 rounded-full', initial: {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            }, animate: {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            }, transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear'
            } }, i))) }));
};
/**
 * Interactive statistics component with hover effects
 */
const InteractiveStats = () => {
    const stats = [
        {
            icon: _jsx(Bot, { className: 'w-8 h-8' }),
            value: '2+',
            label: 'AI Agents',
            description: 'Specialized agents for different domains'
        },
        {
            icon: _jsx(TrendingUp, { className: 'w-8 h-8' }),
            value: '98%',
            label: 'Accuracy Rate',
            description: 'Industry-leading precision'
        },
        {
            icon: _jsx(Zap, { className: 'w-8 h-8' }),
            value: '10x',
            label: 'Faster Processing',
            description: 'Compared to traditional methods'
        },
        {
            icon: _jsx(Globe, { className: 'w-8 h-8' }),
            value: '24/7',
            label: 'Availability',
            description: 'Continuous operation and monitoring'
        },
        {
            icon: _jsx(Award, { className: 'w-8 h-8' }),
            value: '99%',
            label: 'Uptime',
            description: 'Enterprise-grade reliability'
        },
        {
            icon: _jsx(Lightbulb, { className: 'w-8 h-8' }),
            value: '50+',
            label: 'Use Cases',
            description: 'Across multiple industries'
        }
    ];
    return (_jsx("div", { className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6', children: stats.map((stat, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.6, delay: index * 0.1 }, className: 'group text-center space-y-3 p-4 rounded-2xl hover:bg-muted/50 transition-all duration-300 cursor-pointer', whileHover: { scale: 1.05, y: -5 }, whileTap: { scale: 0.95 }, children: [_jsx("div", { className: 'mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300', children: stat.icon }), _jsx("div", { className: 'text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent', children: stat.value }), _jsx("div", { className: 'text-sm font-medium', children: stat.label }), _jsx("div", { className: 'text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300', children: stat.description })] }, index))) }));
};
/**
 * Advanced search and filter component
 */
const AgentFilters = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, viewMode, setViewMode }) => {
    const categories = ['all', 'compliance', 'finance', 'analytics', 'automation'];
    return (_jsxs(motion.div, { className: 'flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-muted/30 rounded-2xl backdrop-blur-sm', initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: 'flex flex-1 items-center gap-4', children: [_jsxs("div", { className: 'relative flex-1 max-w-md', children: [_jsx(Search, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' }), _jsx("input", { type: 'text', placeholder: 'Search agents...', value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: 'w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all' })] }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Filter, { className: 'w-4 h-4 text-muted-foreground' }), _jsx("select", { value: selectedCategory, onChange: e => setSelectedCategory(e.target.value), className: 'px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all capitalize', children: categories.map(category => (_jsx("option", { value: category, children: category === 'all' ? 'All Categories' : category }, category))) })] })] }), _jsxs("div", { className: 'flex items-center gap-2 bg-background rounded-lg p-1', children: [_jsx(Button, { variant: viewMode === 'grid' ? 'default' : 'ghost', size: 'sm', onClick: () => setViewMode('grid'), className: 'h-8 w-8 p-0', children: _jsx(Grid, { className: 'w-4 h-4' }) }), _jsx(Button, { variant: viewMode === 'list' ? 'default' : 'ghost', size: 'sm', onClick: () => setViewMode('list'), className: 'h-8 w-8 p-0', children: _jsx(List, { className: 'w-4 h-4' }) })] })] }));
};
/**
 * Main Agents Page component with advanced UX patterns
 */
const AgentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [filteredAgents, setFilteredAgents] = useState(enhancedAgents);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    /**
     * Advanced filtering logic with search and category filters
     */
    useEffect(() => {
        let filtered = enhancedAgents;
        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(agent => agent.category === selectedCategory);
        }
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase())));
        }
        setFilteredAgents(filtered);
    }, [searchTerm, selectedCategory]);
    return (_jsxs("div", { className: 'min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden', children: [_jsx(FloatingParticles, {}), _jsxs(motion.section, { ref: heroRef, className: 'relative py-24 px-4 text-center overflow-hidden', style: { opacity: heroOpacity, scale: heroScale }, children: [_jsx("div", { className: 'absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5' }), _jsx("div", { className: 'absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_70%)]' }), _jsx("div", { className: 'relative max-w-6xl mx-auto space-y-8', children: _jsxs(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }, className: 'space-y-6', children: [_jsxs(Badge, { className: 'mb-6 px-6 py-3 text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 border-primary/20', children: [_jsx(Sparkles, { className: 'w-4 h-4 mr-2' }), "Next-Generation AI Workforce"] }), _jsxs("h1", { className: 'text-5xl md:text-7xl font-bold leading-tight', children: [_jsx("span", { className: 'bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent', children: "Meet Your" }), _jsx("br", {}), _jsx("span", { className: 'bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent', children: "AI Agents" })] }), _jsx("p", { className: 'text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed', children: "Discover our revolutionary AI agents designed to transform your business operations. From compliance automation to intelligent analytics, experience unprecedented efficiency, accuracy, and innovation." }), _jsxs("div", { className: 'flex flex-col sm:flex-row gap-4 justify-center pt-8', children: [_jsxs(Button, { size: 'lg', className: 'px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70', children: [_jsx(Rocket, { className: 'w-5 h-5 mr-2' }), "Explore Agents"] }), _jsxs(Button, { variant: 'outline', size: 'lg', className: 'px-8 py-4 text-lg border-primary/20 hover:bg-primary/5', children: [_jsx(Clock, { className: 'w-5 h-5 mr-2' }), "Join Waitlist"] })] })] }) })] }), _jsx(motion.section, { className: 'py-20 px-4 relative', variants: containerVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-100px' }, children: _jsxs("div", { className: 'max-w-7xl mx-auto', children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: 'text-center mb-16', children: [_jsx("h2", { className: 'text-3xl md:text-4xl font-bold mb-4', children: "Powered by Advanced AI Technology" }), _jsx("p", { className: 'text-lg text-muted-foreground max-w-2xl mx-auto', children: "Our agents leverage cutting-edge artificial intelligence to deliver measurable business outcomes across industries." })] }), _jsx(InteractiveStats, {})] }) }), _jsx(motion.section, { className: 'py-20 px-4 relative', variants: containerVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-100px' }, children: _jsxs("div", { className: 'max-w-7xl mx-auto space-y-12', children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: 'text-center space-y-6', children: [_jsx("h2", { className: 'text-4xl md:text-5xl font-bold', children: "Our AI Agent Portfolio" }), _jsx("p", { className: 'text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed', children: "Each agent is meticulously engineered with specialized capabilities to address specific industry challenges and drive transformational business outcomes." })] }), _jsx(AgentFilters, { searchTerm: searchTerm, setSearchTerm: setSearchTerm, selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, viewMode: viewMode, setViewMode: setViewMode }), _jsx(motion.div, { className: `grid gap-8 ${viewMode === 'grid'
                                ? 'md:grid-cols-2 xl:grid-cols-2'
                                : 'grid-cols-1 max-w-4xl mx-auto'}`, variants: containerVariants, initial: 'hidden', animate: 'visible', children: filteredAgents.length > 0 ? (filteredAgents.map((agent, index) => (_jsx(EnhancedAgentCard, { agent: agent, index: index }, agent.id)))) : (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: 'col-span-full text-center py-16 space-y-4', children: [_jsx("div", { className: 'w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center', children: _jsx(Search, { className: 'w-12 h-12 text-muted-foreground' }) }), _jsx("h3", { className: 'text-xl font-semibold', children: "No agents found" }), _jsx("p", { className: 'text-muted-foreground', children: "Try adjusting your search or filter criteria" })] })) })] }) }), _jsxs(motion.section, { className: 'py-24 px-4 relative overflow-hidden', initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.8 }, children: [_jsx("div", { className: 'absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10' }), _jsx("div", { className: 'absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(var(--primary),0.15),transparent_70%)]' }), _jsxs("div", { className: 'relative max-w-5xl mx-auto text-center space-y-10', children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: 'space-y-6', children: [_jsx("h2", { className: 'text-4xl md:text-5xl font-bold', children: "Ready to Transform Your Business?" }), _jsx("p", { className: 'text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed', children: "Join the waitlist to be among the first to experience the power of our AI agents. Get early access, exclusive updates, special launch pricing, and dedicated support from our team of experts." })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.2 }, className: 'flex flex-col sm:flex-row gap-6 justify-center', children: [_jsxs(Button, { size: 'lg', className: 'px-10 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70', children: [_jsx(Star, { className: 'w-5 h-5 mr-2' }), "Join Early Access"] }), _jsxs(Button, { variant: 'outline', size: 'lg', className: 'px-10 py-4 text-lg border-primary/20 hover:bg-primary/5', children: [_jsx(BarChart3, { className: 'w-5 h-5 mr-2' }), "Schedule Demo"] })] }), _jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.4 }, className: 'flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(CheckCircle, { className: 'w-4 h-4 text-primary' }), "No setup fees"] }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(CheckCircle, { className: 'w-4 h-4 text-primary' }), "30-day free trial"] }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(CheckCircle, { className: 'w-4 h-4 text-primary' }), "Cancel anytime"] })] })] })] })] }));
};
export default AgentsPage;
