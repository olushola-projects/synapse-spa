
import { useState, useEffect, useRef } from 'react';
import { Quote } from "lucide-react";
import { useInView } from 'framer-motion';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Industry perspectives data - updated quotes as requested
const industryPerspectives = [
  {
    name: "Thomson Reuters",
    role: "Future of Professionals Report, 2024",
    bio: "77% of professionals said the rise of AI would transform their work in the next five years.",
  },
  {
    name: "Complia",
    role: "Strategic Briefing, 2025",
    bio: "AI is no longer just a tool — it's becoming the foundation of modern compliance culture. We're not replacing professionals; we're enabling faster, traceable, and defensible decision-making at every level of the organization.",
  },
  {
    name: "World Economic Forum & Citi",
    role: "AI Impact in Compliance Report",
    bio: "Compliance officers will evolve into Compliance Analysts and Risk Advisors—focusing on predictive analytics, strategic advisory, and AI-aided decision-making.",
  },
  {
    name: "Deloitte & McKinsey",
    role: "State of Compliance & Automation Trends",
    bio: "Up to 50% of compliance tasks currently performed manually will be automated by 2027.",
  },
  {
    name: "Synapses",
    role: "Our AI Strategy",
    bio: "GRC professionals have the expertise to shape the next generation of RegTech—but traditional systems have left them behind in AI literacy. Synapses empower compliance leaders to build, adapt, and govern tomorrow's intelligent systems - not be governed by them.",
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
    }, 8000); // Slower rotation for better readability
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
            Perspectives Powering the Future of GRC
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
                  className="transition-all duration-500 ease-in-out"
                >
                  <PerspectiveCard perspective={perspective} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {industryPerspectives.slice(0, industryPerspectives.length - 2).map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === activeSlide 
                      ? 'bg-synapse-primary scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => {
                    stopAutoPlay();
                    setActiveSlide(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                ></button>
              ))}
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
  <div className="h-full group animate-gentle-rotate">
    <div className="h-full flex flex-col p-7 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300">
      {/* Quote content with emphasis */}
      <div className="flex-1 flex flex-col mb-5">
        <div className="relative">
          <Quote className="text-synapse-primary/30 absolute top-0 left-0 h-8 w-8 transform -translate-x-1 -translate-y-1" />
          <p className="text-gray-700 pl-7 font-medium leading-relaxed text-lg">
            {perspective.bio}
          </p>
        </div>
      </div>
      
      {/* Attribution section */}
      <div className="mt-auto border-t border-gray-100 pt-4">
        <h3 className="font-bold text-lg text-gray-800">{perspective.name}</h3>
        <p className="text-synapse-primary/80 font-medium text-sm">{perspective.role}</p>
      </div>
    </div>
  </div>
);

export default IndustryPerspectivesSection;
