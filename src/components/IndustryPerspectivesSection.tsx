
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    image: "/lovable-uploads/7ef540cb-b6cd-435f-851f-791b450bf977.png"
  },
  {
    name: "Complia",
    role: "Strategic Briefing, 2025",
    bio: "AI is not just a tool—it's the next compliance culture. We're not replacing professionals; we're enabling faster, traceable, defensible decisions.",
    image: "/lovable-uploads/03eec3f2-1d7f-4ea9-a37d-a5f0a40dd23a.png"
  },
  {
    name: "World Economic Forum & Citi",
    role: "AI Impact in Compliance Report",
    bio: "Compliance officers will evolve into Compliance Analysts and Risk Advisors—focusing on predictive analytics, strategic advisory, and AI-aided decision-making.",
    image: "/lovable-uploads/a445b7c1-0e73-4cf1-95a3-e072d9a2a739.png"
  },
  {
    name: "Deloitte & McKinsey",
    role: "State of Compliance & Automation Trends",
    bio: "Up to 50% of compliance tasks currently performed manually will be automated by 2027.",
    image: "/lovable-uploads/fb0adfe3-6046-421c-aeb4-b4c2e7e4a834.png"
  },
  {
    name: "Synapses",
    role: "Our AI Strategy",
    bio: "Many compliance professionals currently lack familiarity with AI tools. Traditional training systems aren't built for the speed of regulatory change.",
    image: "/lovable-uploads/82f61427-efb3-492c-9be8-fee00268a56a.png"
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
    <div id="testimonials" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="grid grid-cols-3 gap-6">
              {visibleItems.map((perspective, index) => (
                <div 
                  key={`desktop-${activeSlide}-${index}`}
                  className="transition-all duration-500 ease-in-out transform"
                >
                  <PerspectiveCard perspective={perspective} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {industryPerspectives.slice(0, industryPerspectives.length - 2).map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === activeSlide ? 'bg-synapse-primary' : 'bg-gray-300'
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
                className="rounded-full absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
                onClick={prev}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-12"
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
          <div className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 rounded-full text-sm font-medium text-gray-600">
            <span className="text-synapse-primary">Shaping the future of regulatory compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerspectiveCard = ({ perspective }: { perspective: typeof industryPerspectives[0] }) => (
  <Card className="h-full flex flex-col p-6 hover:shadow-md transition-shadow duration-300">
    <div className="h-16 mb-4 flex items-center justify-center">
      <img 
        src={perspective.image} 
        alt={perspective.name}
        className="max-h-full object-contain"
      />
    </div>
    <div>
      <h3 className="font-bold text-lg">{perspective.name}</h3>
      <p className="text-synapse-primary font-medium text-sm mb-3">{perspective.role}</p>
      <p className="text-gray-600 text-sm">{perspective.bio}</p>
    </div>
  </Card>
);

export default IndustryPerspectivesSection;
