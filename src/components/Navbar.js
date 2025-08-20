import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ExternalFormDialog from './ExternalFormDialog';
import InviteDialog from './InviteDialog';
import { Menu, X, ChevronDown, Shield, Users, Briefcase } from 'lucide-react';
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }
            else {
                setIsVisible(true);
            }
            setIsScrolled(currentScrollY > 50);
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    const openFormDialog = () => {
        setShowFormDialog(true);
    };
    const openInviteDialog = () => {
        setShowInviteDialog(true);
    };
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(motion.header, { initial: {
                    y: 0,
                    opacity: 1
                }, animate: {
                    y: isVisible ? 0 : -100,
                    opacity: isVisible ? 1 : 0
                }, transition: {
                    duration: 0.4,
                    ease: [0.23, 1, 0.32, 1]
                }, className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-border/30 shadow-lg' : 'bg-white/80 backdrop-blur-md border-b border-border/20'}`, children: [_jsx("div", { className: 'w-full max-w-7xl mx-auto', children: _jsxs("div", { className: 'flex items-center justify-between h-16 pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 py-0', children: [_jsx(motion.div, { initial: {
                                        opacity: 0,
                                        x: -20
                                    }, animate: {
                                        opacity: 1,
                                        x: 0
                                    }, transition: {
                                        duration: 0.6,
                                        delay: 0.1
                                    }, className: 'flex items-center', children: _jsx(Link, { to: '/', className: 'text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300', children: "Synapses" }) }), _jsxs("nav", { className: 'hidden lg:flex items-center space-x-8', children: [_jsxs("div", { className: 'relative', onMouseEnter: () => setAgentsDropdownOpen(true), onMouseLeave: () => setAgentsDropdownOpen(false), children: [_jsxs("button", { className: 'flex items-center text-foreground/80 hover:text-foreground font-medium transition-colors duration-200', children: ["Agents", _jsx(ChevronDown, { className: `ml-1 h-4 w-4 transition-transform duration-200 ${agentsDropdownOpen ? 'rotate-180' : ''}` })] }), _jsx(AnimatePresence, { children: agentsDropdownOpen && (_jsx(motion.div, { initial: {
                                                            opacity: 0,
                                                            y: 10,
                                                            scale: 0.95
                                                        }, animate: {
                                                            opacity: 1,
                                                            y: 0,
                                                            scale: 1
                                                        }, exit: {
                                                            opacity: 0,
                                                            y: 10,
                                                            scale: 0.95
                                                        }, transition: {
                                                            duration: 0.2,
                                                            ease: [0.23, 1, 0.32, 1]
                                                        }, className: 'absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-border/30 rounded-xl shadow-xl overflow-hidden', children: _jsxs("div", { className: 'p-4', children: [_jsxs(Link, { to: '/cdd-agent', className: 'flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group', children: [_jsx("div", { className: 'p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200', children: _jsx(Shield, { className: 'h-5 w-5 text-primary' }) }), _jsxs("div", { children: [_jsx("h4", { className: 'font-semibold text-foreground', children: "CDD Agent" }), _jsx("p", { className: 'text-sm text-muted-foreground', children: "Customer Due Diligence compliance" })] })] }), _jsxs(Link, { to: '/nexus-agent', className: 'flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group', children: [_jsx("div", { className: 'p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors duration-200', children: _jsx("img", { src: '/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png', alt: 'Sophia SFDR Navigator', className: 'w-5 h-5 rounded-full object-cover' }) }), _jsxs("div", { children: [_jsx("h4", { className: 'font-semibold text-foreground', children: "SFDR Navigator" }), _jsx("p", { className: 'text-sm text-muted-foreground', children: "I am Sophia, your agentic consultant to sustainable finance disclosures." })] })] })] }) })) })] }), _jsx(Link, { to: '/use-cases', className: 'text-foreground/80 hover:text-foreground font-medium transition-colors duration-200', children: "Use Cases" }), _jsx(Link, { to: '/partners', className: 'text-foreground/80 hover:text-foreground font-medium transition-colors duration-200', children: "Partners" })] }), _jsxs("div", { className: 'hidden lg:flex items-center space-x-4', children: [_jsxs(Button, { variant: 'outline', size: 'sm', onClick: openInviteDialog, className: 'border-border/60 text-foreground hover:bg-muted/50 font-medium px-6 rounded-lg transition-all duration-200', children: [_jsx(Users, { className: 'h-4 w-4 mr-2' }), "Invite"] }), _jsx(Button, { size: 'sm', onClick: openFormDialog, className: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200', children: "Get Early Access" })] }), _jsx(Button, { variant: 'ghost', size: 'icon-sm', onClick: toggleMobileMenu, className: 'lg:hidden', "aria-label": mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu', "aria-expanded": mobileMenuOpen, children: mobileMenuOpen ? _jsx(X, { className: 'h-5 w-5' }) : _jsx(Menu, { className: 'h-5 w-5' }) })] }) }), _jsx(AnimatePresence, { children: mobileMenuOpen && (_jsx(motion.div, { initial: {
                                opacity: 0,
                                height: 0
                            }, animate: {
                                opacity: 1,
                                height: 'auto'
                            }, exit: {
                                opacity: 0,
                                height: 0
                            }, transition: {
                                duration: 0.3,
                                ease: [0.23, 1, 0.32, 1]
                            }, className: 'lg:hidden border-t border-border/20 bg-white/95 backdrop-blur-xl', children: _jsxs("div", { className: 'w-full max-w-7xl mx-auto pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 py-6 space-y-4', children: [_jsxs("div", { className: 'space-y-3', children: [_jsx("h3", { className: 'font-semibold text-foreground text-sm uppercase tracking-wider', children: "Agents" }), _jsxs(Link, { to: '/cdd-agent', onClick: closeMobileMenu, className: 'flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200', children: [_jsx(Shield, { className: 'h-5 w-5 text-primary' }), _jsx("span", { className: 'font-medium text-foreground', children: "CDD Agent" })] }), _jsxs(Link, { to: '/nexus-agent', onClick: closeMobileMenu, className: 'flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200', children: [_jsx("img", { src: '/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png', alt: 'Sophia SFDR Navigator', className: 'w-5 h-5 rounded-full object-cover' }), _jsx("span", { className: 'font-medium text-foreground', children: "SFDR Navigator - Sophia" })] })] }), _jsxs("div", { className: 'space-y-3 pt-4 border-t border-border/20', children: [_jsxs(Link, { to: '/use-cases', onClick: closeMobileMenu, className: 'flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200', children: [_jsx(Briefcase, { className: 'h-5 w-5 text-foreground/60' }), _jsx("span", { className: 'font-medium text-foreground', children: "Use Cases" })] }), _jsxs(Link, { to: '/partners', onClick: closeMobileMenu, className: 'flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200', children: [_jsx(Users, { className: 'h-5 w-5 text-foreground/60' }), _jsx("span", { className: 'font-medium text-foreground', children: "Partners" })] })] }), _jsxs("div", { className: 'flex flex-col space-y-3 pt-6', children: [_jsxs(Button, { variant: 'outline', onClick: () => {
                                                    openInviteDialog();
                                                    closeMobileMenu();
                                                }, className: 'w-full justify-start border-border/60 text-foreground hover:bg-muted/50', children: [_jsx(Users, { className: 'h-4 w-4 mr-2' }), "Invite"] }), _jsx(Button, { onClick: () => {
                                                    openFormDialog();
                                                    closeMobileMenu();
                                                }, className: 'w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-md', children: "Get Early Access" })] })] }) })) })] }), _jsx(ExternalFormDialog, { open: showFormDialog, onOpenChange: setShowFormDialog, title: 'Get Early Access' }), _jsx(InviteDialog, { open: showInviteDialog, onOpenChange: setShowInviteDialog })] }));
};
export default Navbar;
