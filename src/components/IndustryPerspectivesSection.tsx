
import { useState, useEffect, useRef } from 'react';
import { Quote, ArrowRight, Zap, TrendingUp, Shield, Users } from 'lucide-react';
import { useInView } from 'framer-motion';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Industry perspectives data - updated quotes
const industryPerspectives = [
  {
    name: "Thomson Reuters",
    role: "Future of Professionals Report, 2024",
    bio: "77% of professionals said the rise of AI would transform their work in the next five years.",
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />
  },
  {
    name: "Complia",
    role: "Strategic Briefing, 2025",
    bio: "AI is no longer just a tool — it's becoming the foundation of modern compliance culture. We're not replacing professionals; we're enabling faster, traceable, and defensible decision-making at every level of the organization.",
    icon: <Zap className="h-8 w-8 text-purple-600" />
  },
  {
    name: "World Economic Forum & Citi",
    role: "AI Impact in Compliance Report",
    bio: "Compliance officers will evolve into Compliance Analysts and Risk Advisors—focusing on predictive analytics, strategic advisory, and AI-aided decision-making.",
    icon: <Shield className="h-8 w-8 text-green-600" />
  },
  {
    name: "Deloitte & McKinsey",
    role: "State of Compliance & Automation Trends",
    bio: "Up to 50% of compliance tasks currently performed manually will be automated by 2027.",
    icon: <Users className="h-8 w-8 text-orange-600" />
  },
  {
    name: "Synapses",
    role: "Our AI Strategy",
    bio: "GRC professionals have the expertise to shape the next generation of RegTech—but traditional systems have left them behind in AI literacy. Synapses empower compliance leaders to build, adapt, and govern tomorrow's intelligent systems - not be governed by them.",
    icon: <Zap className="h-8 w-8 text-synapse-primary" />
  }
];

const IndustryPerspectivesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px 0px" });

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

        {/* Stripe-inspired card grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industryPerspectives.map((perspective, index) => (
              <div 
                key={index}
                className={`transition-all duration-500 ease-in-out transform ${
                  isInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
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
                    
                    <p className="text-gray-600 text-sm">{perspective.bio}</p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Industry Insight</span>
                      <button className="text-synapse-primary text-sm font-medium inline-flex items-center gap-2 hover:underline">
                        Learn more <ArrowRight size={14} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mt-8">
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
      </div>
    </div>
  </div>
);

export default IndustryPerspectivesSection;
