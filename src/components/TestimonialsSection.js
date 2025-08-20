import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
const testimonials = [
    {
        id: 1,
        content: 'Synapses has revolutionized how I stay updated on regulatory changes. The AI-powered insights save me hours of research every week.',
        name: 'Sarah Johnson',
        role: 'Chief Compliance Officer',
        company: 'Financial Services Inc.',
        avatar: '/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png'
    },
    {
        id: 2,
        content: 'The networking capabilities on Synapses have connected me with peers facing similar challenges. The collaborative problem-solving has been invaluable.',
        name: 'Michael Chang',
        role: 'GRC Director',
        company: 'TechGiant Corp',
        avatar: '/lovable-uploads/c5b1f529-364b-4a3f-9e4e-29fe1862e7b3.png'
    },
    {
        id: 3,
        content: 'As someone new to the GRC field, the mentorship and learning resources on Synapses have accelerated my professional growth tremendously.',
        name: 'Emma Rodriguez',
        role: 'Compliance Analyst',
        company: 'Healthcare Systems',
        avatar: '/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png'
    }
];
const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const next = () => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
    };
    const prev = () => {
        setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    };
    return (_jsx("div", { id: 'testimonials', className: 'py-20 bg-white', children: _jsxs("div", { className: 'container mx-auto px-4 sm:px-6 lg:px-8', children: [_jsxs("div", { className: 'text-center mb-16', children: [_jsx("h2", { className: 'text-3xl md:text-4xl font-display font-bold mb-4', children: "What Our Users Say" }), _jsx("p", { className: 'text-lg text-gray-600 max-w-3xl mx-auto', children: "Reimagining compliance in the age of AI through human-centered design and collaborative intelligence" })] }), _jsxs("div", { className: 'max-w-4xl mx-auto', children: [_jsx("div", { className: 'hidden md:grid md:grid-cols-3 gap-6', children: testimonials.map(testimonial => (_jsx(TestimonialCard, { testimonial: testimonial }, testimonial.id))) }), _jsx("div", { className: 'md:hidden', children: _jsxs("div", { className: 'relative', children: [_jsx("div", { className: 'overflow-hidden', children: _jsx("div", { className: 'flex transition-transform duration-300 ease-in-out', style: { transform: `translateX(-${currentIndex * 100}%)` }, children: testimonials.map(testimonial => (_jsx("div", { className: 'w-full flex-shrink-0', children: _jsx(TestimonialCard, { testimonial: testimonial }) }, testimonial.id))) }) }), _jsx("div", { className: 'flex justify-center mt-6 gap-2', children: testimonials.map((_, i) => (_jsx("button", { className: `w-2.5 h-2.5 rounded-full ${i === currentIndex ? 'bg-synapse-primary' : 'bg-gray-300'}`, onClick: () => setCurrentIndex(i) }, i))) }), _jsxs("div", { className: 'flex justify-between mt-6', children: [_jsx(Button, { variant: 'outline', size: 'icon', className: 'rounded-full', onClick: prev, children: _jsx(ChevronLeft, { size: 16 }) }), _jsx(Button, { variant: 'outline', size: 'icon', className: 'rounded-full', onClick: next, children: _jsx(ChevronRight, { size: 16 }) })] })] }) })] }), _jsx("div", { className: 'mt-16 text-center', children: _jsx("div", { className: 'inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 rounded-full text-sm font-medium text-gray-600', children: _jsx("span", { className: 'text-synapse-primary', children: "Shaping the future of regulatory compliance" }) }) })] }) }));
};
const TestimonialCard = ({ testimonial }) => (_jsxs("div", { className: 'feature-card h-full flex flex-col', children: [_jsx("div", { className: 'flex justify-center mb-4', children: [...Array(5)].map((_, i) => (_jsx(Star, { size: 18, className: 'text-yellow-400 fill-yellow-400' }, i))) }), _jsxs("p", { className: 'text-gray-600 flex-grow mb-6', children: ["\"", testimonial.content, "\""] }), _jsxs("div", { className: 'flex items-center', children: [_jsx(Avatar, { className: 'h-10 w-10 mr-4', children: _jsx(AvatarImage, { src: testimonial.avatar, alt: testimonial.name }) }), _jsxs("div", { children: [_jsx("p", { className: 'font-semibold', children: testimonial.name }), _jsxs("p", { className: 'text-sm text-gray-500', children: [testimonial.role, ", ", testimonial.company] })] })] })] }));
export default TestimonialsSection;
