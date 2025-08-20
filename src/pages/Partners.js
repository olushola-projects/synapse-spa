import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { partnerCategories } from '../data/partnersData';
import PartnerCategoryCard from '../components/partners/PartnerCategoryCard';
import { Button } from '@/components/ui/button';
import { MailIcon } from 'lucide-react';
const Partners = () => {
    return (_jsxs("div", { className: 'min-h-screen', children: [_jsx(Navbar, {}), _jsx("section", { className: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16', children: _jsx("div", { className: 'container mx-auto px-6', children: _jsxs("div", { className: 'max-w-3xl mx-auto text-center', children: [_jsxs(motion.h1, { className: 'text-4xl md:text-5xl font-bold mb-4 text-gray-900', initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: ["Partner with ", _jsx("span", { className: 'text-blue-700', children: "Synapse" })] }), _jsx(motion.p, { className: 'text-lg text-gray-600 mb-8', initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, children: "Join our ecosystem of regulatory and compliance professionals and organizations to drive innovation, share knowledge, and create better GRC outcomes together." }), _jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: _jsx(Button, { size: 'lg', className: 'bg-blue-700 hover:bg-blue-800', children: "Become a Partner" }) })] }) }) }), _jsx("section", { className: 'py-16 bg-white', children: _jsxs("div", { className: 'container mx-auto px-6', children: [_jsxs("div", { className: 'text-center mb-12', children: [_jsx("h2", { className: 'text-3xl font-bold mb-4', children: "Who Can Partner with Us?" }), _jsx("p", { className: 'text-gray-600 max-w-2xl mx-auto', children: "We're building a comprehensive ecosystem to connect all stakeholders in the regulatory and compliance space. Discover how you can get involved." })] }), _jsx("div", { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8', children: partnerCategories.map((category, index) => (_jsx(PartnerCategoryCard, { category: category, index: index }, category.id))) })] }) }), _jsx("section", { className: 'py-16 bg-gray-50', children: _jsxs("div", { className: 'container mx-auto px-6', children: [_jsxs("div", { className: 'text-center mb-12', children: [_jsx("h2", { className: 'text-3xl font-bold mb-4', children: "Partnership Process" }), _jsx("p", { className: 'text-gray-600 max-w-2xl mx-auto', children: "Joining our partner network is simple. Follow these steps to get started." })] }), _jsx("div", { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto', children: [
                                {
                                    step: '1',
                                    title: 'Initial Consultation',
                                    description: 'Schedule a call with our partnership team to discuss opportunities and alignment.'
                                },
                                {
                                    step: '2',
                                    title: 'Customize Partnership',
                                    description: 'Work together to define the scope and terms of the partnership that works for both parties.'
                                },
                                {
                                    step: '3',
                                    title: 'Launch & Grow',
                                    description: 'Implement the partnership and collaborate to achieve mutual business objectives.'
                                }
                            ].map((item, index) => (_jsxs(motion.div, { className: 'bg-white p-8 rounded-lg shadow-sm text-center border-t-4 border-blue-500', initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: index * 0.1 }, children: [_jsx("div", { className: 'w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold', children: item.step }), _jsx("h3", { className: 'text-xl font-bold mb-3', children: item.title }), _jsx("p", { className: 'text-gray-600', children: item.description })] }, index))) })] }) }), _jsx("section", { className: 'py-16 bg-blue-700 text-white', children: _jsx("div", { className: 'container mx-auto px-6', children: _jsxs("div", { className: 'max-w-4xl mx-auto text-center', children: [_jsx("h2", { className: 'text-3xl font-bold mb-4', children: "Ready to Join Our Partner Network?" }), _jsx("p", { className: 'mb-8 text-blue-100', children: "Contact our partnership team today to discuss how we can collaborate to meet your business objectives." }), _jsxs(Button, { size: 'lg', variant: 'outline', className: 'bg-white text-blue-700 hover:bg-blue-50', children: [_jsx(MailIcon, { className: 'mr-2 h-4 w-4' }), " Contact the Partnership Team"] })] }) }) }), _jsx(Footer, {})] }));
};
export default Partners;
