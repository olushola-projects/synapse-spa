import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';
import { useInView } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { getSortedPerspectives } from '@/data/industryPerspectivesData';
import ArticleDialog from '@/components/ArticleDialog';
const IndustryPerspectivesSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        margin: '-100px 0px'
    });
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1
    });
    const [autoplayInterval, setAutoplayInterval] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPerspective, setSelectedPerspective] = useState(null);
    // Get sorted perspectives
    const sortedPerspectives = getSortedPerspectives();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollTo = useCallback((index) => {
        if (!emblaApi) {
            return;
        }
        emblaApi.scrollTo(index);
    }, [emblaApi, sortedPerspectives.length]);
    // Setup autoplay with slower speed for better readability
    const startAutoplay = useCallback(() => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        const interval = setInterval(() => {
            if (emblaApi) {
                emblaApi.scrollNext();
            }
        }, 20000); // Slide every 20 seconds (increased from 8s for better readability)
        setAutoplayInterval(interval);
    }, [emblaApi]); // Fixed: removed autoplayInterval from dependencies
    // Handle carousel initialization and cleanup
    useEffect(() => {
        if (!emblaApi) {
            return;
        }
        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };
        emblaApi.on('select', onSelect);
        startAutoplay();
        return () => {
            emblaApi.off('select', onSelect);
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        };
    }, [emblaApi, startAutoplay]); // Fixed: removed autoplayInterval from dependencies
    // Pause autoplay when hovering over carousel
    const handleMouseEnter = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            setAutoplayInterval(null);
        }
    };
    const handleMouseLeave = () => {
        startAutoplay();
    };
    const handleOpenArticle = (perspective) => {
        setSelectedPerspective(perspective);
        setIsDialogOpen(true);
    };
    return (_jsxs("div", { id: 'testimonials', ref: sectionRef, className: 'relative overflow-hidden py-0 bg-white', children: [_jsx("div", { className: 'absolute inset-0 -z-10', children: _jsx("div", { className: 'absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30' }) }), _jsx("div", { className: 'absolute inset-x-0 top-0 h-24 -z-10 transform -skew-y-6 bg-gradient-to-r from-indigo-50/80 to-blue-50/80' }), _jsx("div", { className: 'absolute inset-x-0 bottom-0 h-24 -z-10 transform skew-y-6 bg-gradient-to-r from-purple-50/80 to-indigo-50/80' }), _jsxs("div", { className: 'container mx-auto sm:px-6 lg:px-8 relative z-10 bg-white px-0 py-[20px]', children: [_jsxs("div", { className: 'text-center mb-16 max-w-3xl mx-auto', children: [_jsx("h2", { className: 'text-3xl md:text-4xl font-display mb-4 font-semibold', children: "Perspectives Powering the Future of GRC" }), _jsx("p", { className: 'font-light text-base text-black', children: "Leading experts and organizations shaping the future of governance, risk, and compliance" })] }), _jsxs("div", { className: 'max-w-7xl mx-auto hidden md:block bg-white', children: [_jsx("div", { className: 'overflow-hidden', onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, ref: emblaRef, children: _jsx("div", { className: 'flex -ml-4', children: sortedPerspectives.map((perspective, index) => (_jsx("div", { className: 'flex-[0_0_33.33%] min-w-0 pl-4 transition-all duration-500', children: _jsx("div", { className: `transition-all duration-500 ease-in-out transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`, style: {
                                                transitionDelay: `${index * 150}ms`
                                            }, children: _jsx(Card, { className: 'h-[360px] border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden bg-white rounded-xl', children: _jsxs(CardContent, { className: 'p-6 flex flex-col h-full bg-slate-200', children: [_jsx("div", { className: 'mb-4', children: perspective.icon }), _jsxs("div", { className: 'mb-5', children: [_jsx("h3", { className: 'text-lg font-bold text-gray-900 mb-1', children: perspective.name }), _jsx("p", { className: 'text-sm text-synapse-primary/80', children: perspective.role })] }), _jsx("p", { className: 'text-gray-600 text-sm flex-grow overflow-hidden', children: perspective.bio }), _jsxs("div", { className: 'mt-6 pt-4 border-t border-gray-100 flex items-center justify-between', children: [_jsx("span", { className: 'text-xs text-gray-400', children: "Industry Insight" }), _jsxs(Button, { variant: 'link', className: `text-sm ${perspective.color} font-medium flex items-center gap-1 p-0`, onClick: () => handleOpenArticle(perspective), children: ["Learn More ", _jsx(ExternalLink, { size: 14 })] })] })] }) }) }) }, index))) }) }), _jsxs("div", { className: 'flex justify-center gap-4 mt-8', children: [_jsx("button", { onClick: () => scrollTo(selectedIndex - 1), className: 'p-2 rounded-full bg-white border border-gray-200 hover:border-primary/50 transition-colors', children: "\u2190" }), _jsx("button", { onClick: () => scrollTo(selectedIndex + 1), className: 'p-2 rounded-full bg-white border border-gray-200 hover:border-primary/50 transition-colors', children: "\u2192" })] })] }), _jsx("div", { className: 'md:hidden mt-8', children: _jsxs(Carousel, { className: 'w-full', opts: {
                                loop: true
                            }, children: [_jsx(CarouselContent, { children: sortedPerspectives.map((perspective, i) => (_jsx(CarouselItem, { className: 'md:basis-1/2 lg:basis-1/3', children: _jsx(PerspectiveCard, { perspective: perspective, onLearnMore: () => handleOpenArticle(perspective) }) }, i))) }), _jsxs("div", { className: 'flex justify-center gap-4 mt-4', children: [_jsx(CarouselPrevious, { className: 'relative static transform-none bg-white' }), _jsx(CarouselNext, { className: 'relative static transform-none bg-white' })] })] }) }), _jsx("div", { className: 'mt-16 text-center' })] }), _jsx(ArticleDialog, { isOpen: isDialogOpen, onOpenChange: setIsDialogOpen, perspective: selectedPerspective })] }));
};
const PerspectiveCard = ({ perspective, onLearnMore }) => (_jsx("div", { className: 'h-full', children: _jsxs("div", { className: 'h-full flex flex-col p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300', children: [_jsx("div", { className: 'mb-4', children: perspective.icon }), _jsx("div", { className: 'flex-1 mb-4', children: _jsx("p", { className: 'text-gray-700 text-sm', children: perspective.bio }) }), _jsxs("div", { className: 'mt-auto pt-4 border-t border-gray-100', children: [_jsx("h3", { className: 'font-bold text-gray-800', children: perspective.name }), _jsx("p", { className: 'text-synapse-primary/80 text-xs', children: perspective.role }), _jsx("div", { className: 'mt-2', children: _jsxs(Button, { variant: 'link', className: `text-sm ${perspective.color} font-medium flex items-center gap-1 p-0`, onClick: onLearnMore, children: ["Learn More ", _jsx(ExternalLink, { size: 14 })] }) })] })] }) }));
export default IndustryPerspectivesSection;
