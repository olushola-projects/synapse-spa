
import { useState, useEffect, useRef, useCallback } from 'react';
import { Quote, ArrowRight, Zap, TrendingUp, Shield, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import { wrap } from "@/lib/utils";

// Industry perspectives data - updated quotes with links to sources
const industryPerspectives = [
  {
    name: "Thomson Reuters",
    role: "Future of Professionals Report, 2024",
    bio: "77% of professionals said the rise of AI would transform their work in the next five years.",
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    link: "https://www.thomsonreuters.com/en/artificial-intelligence/future-of-professionals-report.html"
  },
  {
    name: "Complia",
    role: "Strategic Briefing, 2025",
    bio: "AI is no longer just a tool — it's becoming the foundation of modern compliance culture. We're not replacing professionals; we're enabling faster, traceable, and defensible decision-making at every level of the organization.",
    icon: <Zap className="h-8 w-8 text-purple-600" />,
    link: "https://www.compliancecosmos.org/ai-in-compliance-culture"
  },
  {
    name: "World Economic Forum & Citi",
    role: "AI Impact in Compliance Report",
    bio: "Compliance officers will evolve into Compliance Analysts and Risk Advisors—focusing on predictive analytics, strategic advisory, and AI-aided decision-making.",
    icon: <Shield className="h-8 w-8 text-green-600" />,
    link: "https://www.weforum.org/reports/the-future-of-jobs-report-2023/"
  },
  {
    name: "Deloitte & McKinsey",
    role: "State of Compliance & Automation Trends",
    bio: "Up to 50% of compliance tasks currently performed manually will be automated by 2027.",
    icon: <Users className="h-8 w-8 text-orange-600" />,
    link: "https://www2.deloitte.com/us/en/pages/regulatory/articles/modernizing-compliance-digital-age.html"
  },
  {
    name: "Synapses",
    role: "Our AI Strategy",
    bio: "GRC professionals have the expertise to shape the next generation of RegTech—but traditional systems have left them behind in AI literacy. Synapses empower compliance leaders to build, adapt, and govern tomorrow's intelligent systems - not be governed by them.",
    icon: <Zap className="h-8 w-8 text-synapse-primary" />,
    link: "https://synapses.ai/blog/ai-strategy-for-grc"
  }
];

const IndustryPerspectivesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px 0px" });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  
  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(wrap(0, industryPerspectives.length, index));
  }, [emblaApi]);

  // Setup autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayInterval) clearInterval(autoplayInterval);
    
    const interval = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 5000); // Slide every 5 seconds
    
    setAutoplayInterval(interval);
  }, [emblaApi, autoplayInterval]);
  
  // Handle carousel initialization and cleanup
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    startAutoplay();
    
    return () => {
      emblaApi.off("select", onSelect);
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    };
  }, [emblaApi, startAutoplay, autoplayInterval]);

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
  
  return (
    <div id="testimonials" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Stripe-inspired diagonal background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
      </div>
      
      {/* Diagonal decorative stripe */}
      <div className="absolute inset-x-0 top-0 h-24 -z-10 transform -skew-y-6 bg-gradient-to-r from-indigo-50/80 to-blue-50/80"></div>
      <div className="absolute inset-x-0 bottom-0 h-24 -z-10 transform skew-y-6 bg-gradient-to-r from-purple-50/80 to-indigo-50/80"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Perspectives Powering the Future of GRC
          </h2>
          <p className="text-lg text-gray-600">
            Leading experts and organizations shaping the future of governance, risk, and compliance
          </p>
        </div>

        {/* Desktop Carousel - limited to 3 perspectives at a time */}
        <div className="max-w-7xl mx-auto hidden md:block">
          <div 
            className="overflow-hidden" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={emblaRef}
          >
            <div className="flex -ml-4">
              {industryPerspectives.map((perspective, index) => (
                <div 
                  key={index} 
                  className="flex-[0_0_33.33%] min-w-0 pl-4 transition-all duration-500"
                >
                  <div 
                    className={`transition-all duration-500 ease-in-out transform ${
                      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <Card className="h-full border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden bg-white rounded-xl">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          {perspective.icon}
                        </div>
                        
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{perspective.name}</h3>
                          <p className="text-sm text-synapse-primary/80">{perspective.role}</p>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-3">{perspective.bio}</p>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400">Industry Insight</span>
                          <a 
                            href={perspective.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-synapse-primary text-sm font-medium inline-flex items-center gap-2 hover:underline"
                          >
                            Learn more <ArrowRight size={14} />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full bg-white shadow-sm hover:bg-gray-100 hover:text-synapse-primary"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft size={20} />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex gap-2">
              {industryPerspectives.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    selectedIndex === index ? 'bg-synapse-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full bg-white shadow-sm hover:bg-gray-100 hover:text-synapse-primary"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight size={20} />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mt-8">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {industryPerspectives.map((perspective, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <PerspectiveCard perspective={perspective} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-4">
              <CarouselPrevious className="relative static transform-none bg-white" />
              <CarouselNext className="relative static transform-none bg-white" />
            </div>
          </Carousel>
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
  <div className="h-full">
    <div className="h-full flex flex-col p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300">
      <div className="mb-4">
        {perspective.icon}
      </div>
      
      {/* Quote content */}
      <div className="flex-1 mb-4">
        <p className="text-gray-700 text-sm">{perspective.bio}</p>
      </div>
      
      {/* Attribution section */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <h3 className="font-bold text-gray-800">{perspective.name}</h3>
        <p className="text-synapse-primary/80 text-xs">{perspective.role}</p>
        <div className="mt-2">
          <a 
            href={perspective.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-synapse-primary text-sm font-medium inline-flex items-center gap-2 hover:underline"
          >
            Learn more <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default IndustryPerspectivesSection;
