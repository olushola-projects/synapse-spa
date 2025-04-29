
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from 'framer-motion';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";

// Industry perspectives data - same as About page but reordered
const industryPerspectives = [
  {
    name: "Thomson Reuters",
    role: "Future of Professionals Report, 2024",
    bio: "77% of professionals said the rise of AI would transform their work in the next five years.",
    image: "/lovable-uploads/21bbb15a-40f1-48ca-a6a0-5d2d20d9331e.png"
  },
  {
    name: "Complia",
    role: "Strategic Briefing, 2025",
    bio: "AI is no longer just a tool — it's becoming the foundation of modern compliance culture. We're not replacing professionals; we're enabling faster, traceable, and defensible decision-making at every level of the organization.",
    image: "/lovable-uploads/4a8b4569-6106-4b80-9ed1-aad25b35df82.png"
  },
  {
    name: "World Economic Forum & Citi",
    role: "AI Impact in Compliance Report",
    bio: "Compliance officers will evolve into Compliance Analysts and Risk Advisors—focusing on predictive analytics, strategic advisory, and AI-aided decision-making.",
    image: "/lovable-uploads/c9a37f7e-d2d9-4558-a19b-8b109f41376f.png"
  },
  {
    name: "Deloitte & McKinsey",
    role: "State of Compliance & Automation Trends",
    bio: "Up to 50% of compliance tasks currently performed manually will be automated by 2027.",
    image: "/lovable-uploads/d9efb365-be69-41f3-b367-ffdd791930a9.png"
  },
  {
    name: "Synapses",
    role: "Our AI Strategy",
    bio: "GRC professionals have the expertise to shape the next generation of RegTech—but traditional systems have left them behind in AI literacy. Synapses empower compliance leaders to build, adapt, and govern tomorrow's intelligent systems - not be governed by them.",
    image: "/lovable-uploads/c7da120f-c31d-4d3b-aa3d-8e3ba8d619d6.png"
  }
];

const IndustryPerspectivesSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start or reset autoplay when in view
  useEffect(() => {
    if (isInView) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }, [isInView]);

  const startAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsAutoPlaying(true);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % (industryPerspectives.length - 2));
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => {
    stopAutoPlay();
  };

  const handleMouseLeave = () => {
    startAutoPlay();
  };

  const next = () => {
    stopAutoPlay();
    setActiveSlide((prev) => 
      prev === industryPerspectives.length - 3 ? 0 : prev + 1
    );
  };

  const prev = () => {
    stopAutoPlay();
    setActiveSlide((prev) => 
      prev === 0 ? industryPerspectives.length - 3 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    stopAutoPlay();
    setActiveSlide(index);
  };

  // Calculate visible items (3 consecutive items)
  const visibleItems = [
    industryPerspectives[activeSlide],
    industryPerspectives[(activeSlide + 1) % industryPerspectives.length],
    industryPerspectives[(activeSlide + 2) % industryPerspectives.length]
  ];

  return (
    <div id="testimonials" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30 opacity-70 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)] z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Industry Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Leading experts and organizations shaping the future of governance, risk, and compliance
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Carousel (3 cards visible at once) */}
          <div 
            className="hidden md:block relative" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-3 gap-8">
              {visibleItems.map((perspective, index) => (
                <div 
                  key={`desktop-${activeSlide}-${index}`}
                  className="transition-all duration-500 ease-in-out transform hover:-translate-y-1"
                >
                  <PerspectiveCard perspective={perspective} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {industryPerspectives.slice(0, industryPerspectives.length - 2).map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === activeSlide 
                      ? 'bg-synapse-primary scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                ></button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm border-gray-200"
                onClick={prev}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm border-gray-200"
                onClick={next}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {industryPerspectives.map((perspective, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <PerspectiveCard perspective={perspective} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center mt-6 gap-3">
                <CarouselPrevious className="static transform-none" />
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/50 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 shadow-sm border border-gray-100">
            <span className="text-synapse-primary">Shaping the future of regulatory compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerspectiveCard = ({ perspective }: { perspective: typeof industryPerspectives[0] }) => (
  <div className="h-full group animate-float">
    <div className="h-full flex flex-col p-7 hover:shadow-xl transition-all duration-300 rounded-xl bg-white/70 backdrop-blur-md border border-white/60 relative overflow-hidden shadow-md">
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-tr from-blue-100/20 to-indigo-100/30 rounded-full opacity-70"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-synapse-primary/30 to-transparent"></div>
      
      {/* Logo section */}
      <div className="h-14 mb-5 flex items-center">
        <img 
          src={perspective.image} 
          alt={perspective.name}
          className="max-h-full max-w-[140px] object-contain"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-800">{perspective.name}</h3>
          <p className="text-synapse-primary font-medium text-sm">{perspective.role}</p>
        </div>
        
        {/* Quote section with emphasis */}
        <div className="relative">
          <Quote className="text-synapse-primary/20 absolute top-0 left-0 h-6 w-6 transform -translate-x-1 -translate-y-1" />
          <p className="text-gray-600 pl-5 italic font-medium leading-relaxed text-sm">
            {perspective.bio}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default IndustryPerspectivesSection;
