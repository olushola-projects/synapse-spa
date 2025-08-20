import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };
    const socialLinks = [
        {
            href: 'https://facebook.com/synapsesgrc',
            icon: Facebook,
            label: 'Facebook'
        },
        {
            href: 'https://twitter.com/synapsesgrc',
            icon: Twitter,
            label: 'Twitter'
        },
        {
            href: 'https://linkedin.com/company/synapsesgrc',
            icon: Linkedin,
            label: 'LinkedIn'
        },
        {
            href: 'https://instagram.com/synapsesgrc',
            icon: Instagram,
            label: 'Instagram'
        },
        {
            href: 'mailto:admin@joinsynapses.com',
            icon: Mail,
            label: 'Email'
        }
    ];
    return (_jsx("footer", { className: 'relative bg-background border-t border-border/60', children: _jsxs("div", { className: 'w-full max-w-7xl mx-auto pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 bg-white', children: [_jsx(motion.div, { initial: {
                        opacity: 0,
                        y: 20
                    }, whileInView: {
                        opacity: 1,
                        y: 0
                    }, transition: {
                        duration: 0.6
                    }, viewport: {
                        once: true
                    }, className: 'border-b border-border/40 bg-slate-300 py-[60px]', children: _jsxs("div", { className: 'max-w-2xl mx-auto text-center', children: [_jsx("h3", { className: 'text-2xl text-foreground mb-4 font-thin', children: "Stay Updated with GRC Insights" }), _jsx("p", { className: 'text-muted-foreground mb-6', children: "Get the latest regulatory updates, compliance insights, and industry trends delivered to your inbox." }), _jsxs("form", { onSubmit: handleNewsletterSubmit, className: 'flex gap-4 max-w-md mx-auto', children: [_jsx(Input, { type: 'email', placeholder: 'Enter your email', value: email, onChange: e => setEmail(e.target.value), className: 'flex-1 bg-background/50 border-border/60 focus:border-primary/60 backdrop-blur-sm', required: true }), _jsx(motion.div, { whileHover: {
                                            scale: 1.05
                                        }, whileTap: {
                                            scale: 0.95
                                        }, children: _jsx(Button, { type: 'submit', className: 'bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200', disabled: isSubscribed, children: isSubscribed ? (_jsx(motion.span, { initial: {
                                                    scale: 0
                                                }, animate: {
                                                    scale: 1
                                                }, className: 'flex items-center gap-2', children: "\u2713 Subscribed!" })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: 'h-4 w-4 mr-2' }), "Subscribe"] })) }) })] })] }) }), _jsx("div", { className: 'py-px', children: _jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8', children: [_jsxs(motion.div, { initial: {
                                    opacity: 0,
                                    y: 20
                                }, whileInView: {
                                    opacity: 1,
                                    y: 0
                                }, transition: {
                                    duration: 0.6,
                                    delay: 0.1
                                }, viewport: {
                                    once: true
                                }, className: 'lg:col-span-1', children: [_jsx(Link, { to: '/', className: 'inline-block text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300', children: "Synapses" }), _jsx("p", { className: 'mt-4 text-muted-foreground max-w-xs leading-relaxed text-sm font-normal', children: "The global ecosystem where Governance, Risk, and Compliance professionals connect, grow, and shape the future of compliance." }), _jsx("div", { className: 'mt-6 flex space-x-3', children: socialLinks.map((social, index) => (_jsx(motion.a, { href: social.href, target: '_blank', rel: 'noopener noreferrer', whileHover: {
                                                scale: 1.1,
                                                y: -2
                                            }, whileTap: {
                                                scale: 0.9
                                            }, initial: {
                                                opacity: 0,
                                                scale: 0.8
                                            }, whileInView: {
                                                opacity: 1,
                                                scale: 1
                                            }, transition: {
                                                delay: 0.1 * index,
                                                duration: 0.3
                                            }, viewport: {
                                                once: true
                                            }, className: 'p-2 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-200 backdrop-blur-sm', "aria-label": social.label, children: _jsx(social.icon, { size: 18 }) }, social.label))) })] }), _jsxs(motion.div, { initial: {
                                    opacity: 0,
                                    y: 20
                                }, whileInView: {
                                    opacity: 1,
                                    y: 0
                                }, transition: {
                                    duration: 0.6,
                                    delay: 0.2
                                }, viewport: {
                                    once: true
                                }, className: 'space-y-4', children: [_jsx("h3", { className: 'font-semibold text-foreground mb-4 text-lg', children: "Platform" }), _jsx("ul", { className: 'space-y-3', children: [
                                            {
                                                to: '/platform/features',
                                                label: 'Features'
                                            },
                                            {
                                                to: '/platform/solutions',
                                                label: 'Solutions'
                                            },
                                            {
                                                to: '/#features',
                                                label: 'Integrations'
                                            },
                                            {
                                                to: '/ask-dara',
                                                label: 'Agent'
                                            }
                                        ].map((link, index) => (_jsx(motion.li, { initial: {
                                                opacity: 0,
                                                x: -10
                                            }, whileInView: {
                                                opacity: 1,
                                                x: 0
                                            }, transition: {
                                                delay: 0.05 * index
                                            }, viewport: {
                                                once: true
                                            }, children: _jsxs(Link, { to: link.to, className: 'text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group', children: [_jsx(ArrowRight, { className: 'h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200' }), link.label] }) }, link.to))) })] }), _jsxs(motion.div, { initial: {
                                    opacity: 0,
                                    y: 20
                                }, whileInView: {
                                    opacity: 1,
                                    y: 0
                                }, transition: {
                                    duration: 0.6,
                                    delay: 0.3
                                }, viewport: {
                                    once: true
                                }, className: 'space-y-4', children: [_jsx("h3", { className: 'font-semibold text-foreground mb-4 text-lg', children: "Resources" }), _jsx("ul", { className: 'space-y-3', children: [
                                            {
                                                to: '/resources/blog',
                                                label: 'Blog'
                                            },
                                            {
                                                to: '/resources/documentation',
                                                label: 'Documentation'
                                            },
                                            {
                                                to: '/resources/faq',
                                                label: 'FAQ'
                                            },
                                            {
                                                to: '/resources/webinars',
                                                label: 'Webinars'
                                            }
                                        ].map((link, index) => (_jsx(motion.li, { initial: {
                                                opacity: 0,
                                                x: -10
                                            }, whileInView: {
                                                opacity: 1,
                                                x: 0
                                            }, transition: {
                                                delay: 0.05 * index
                                            }, viewport: {
                                                once: true
                                            }, children: _jsxs(Link, { to: link.to, className: 'text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group', children: [_jsx(ArrowRight, { className: 'h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200' }), link.label] }) }, link.to))) })] }), _jsx(motion.div, { initial: {
                                    opacity: 0,
                                    y: 20
                                }, whileInView: {
                                    opacity: 1,
                                    y: 0
                                }, transition: {
                                    duration: 0.6,
                                    delay: 0.4
                                }, viewport: {
                                    once: true
                                }, className: 'space-y-6', children: _jsxs("div", { className: 'space-y-4', children: [_jsx("h3", { className: 'font-semibold text-foreground mb-4 text-lg', children: "Company" }), _jsx("ul", { className: 'space-y-3', children: [
                                                {
                                                    to: '/company/about',
                                                    label: 'About'
                                                },
                                                {
                                                    to: '/company/careers',
                                                    label: 'Careers'
                                                },
                                                {
                                                    to: '/company/contact',
                                                    label: 'Contact'
                                                },
                                                {
                                                    to: '/partners',
                                                    label: 'Partners'
                                                }
                                            ].map((link, index) => (_jsx(motion.li, { initial: {
                                                    opacity: 0,
                                                    x: -10
                                                }, whileInView: {
                                                    opacity: 1,
                                                    x: 0
                                                }, transition: {
                                                    delay: 0.05 * index
                                                }, viewport: {
                                                    once: true
                                                }, children: _jsxs(Link, { to: link.to, className: 'text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group', children: [_jsx(ArrowRight, { className: 'h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200' }), link.label] }) }, link.to))) })] }) })] }) }), _jsx(motion.div, { initial: {
                        opacity: 0
                    }, whileInView: {
                        opacity: 1
                    }, transition: {
                        duration: 0.6,
                        delay: 0.5
                    }, viewport: {
                        once: true
                    }, className: 'py-8 border-t border-border/40', children: _jsxs("div", { className: 'flex flex-col md:flex-row justify-between items-center gap-4', children: [_jsxs("div", { className: 'flex flex-col md:flex-row items-center gap-4', children: [_jsxs("p", { className: 'text-sm text-muted-foreground', children: ["\u00A9 ", new Date().getFullYear(), " Synapses Technologies Ltd. All rights reserved."] }), _jsxs("div", { className: 'flex items-center gap-4', children: [_jsx(Link, { to: '/legal/privacy', className: 'text-sm text-muted-foreground hover:text-primary transition-colors', children: "Privacy Policy" }), _jsx("span", { className: 'text-border', children: "\u2022" }), _jsx(Link, { to: '/legal/terms', className: 'text-sm text-muted-foreground hover:text-primary transition-colors', children: "Terms of Service" })] })] }), _jsxs(motion.div, { whileHover: {
                                    scale: 1.05
                                }, className: 'text-sm text-muted-foreground flex items-center gap-1', children: ["Made with ", _jsx("span", { className: 'text-lg', children: "\u2764\uFE0F" }), " for GRC professionals worldwide"] })] }) })] }) }));
};
export default Footer;
