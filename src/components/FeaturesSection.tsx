
import { 
  LayoutDashboard, MessageSquareText, Calendar, Bell, 
  Briefcase, FileText, GraduationCap, Users, Target, 
  LineChart, CalendarClock, Medal, Globe, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

const features = [
  {
    title: "Customizable Dashboards",
    description: "Personalize your workspace to focus on the information that matters most to you.",
    icon: LayoutDashboard,
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    title: "Regulatory Analysis Chatbot",
    description: "Leverage Dara, our AI copilot, for instant regulatory insights and actionable compliance recommendations.",
    icon: MessageSquareText,
    color: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    title: "Regulatory Calendar & Updates",
    description: "Stay current with scheduled deadlines and breaking regulatory news.",
    icon: Calendar,
    color: "bg-emerald-100",
    textColor: "text-emerald-700"
  },
  {
    title: "Daily Regulatory Insights",
    description: "Receive timely, bite-sized updates to keep you informed.",
    icon: Bell,
    color: "bg-amber-100",
    textColor: "text-amber-700"
  },
  {
    title: "Job Matching",
    description: "Discover career opportunities that align with your expertise.",
    icon: Briefcase,
    color: "bg-red-100",
    textColor: "text-red-700"
  },
  {
    title: "CV Surgery",
    description: "Elevate your professional profile with expert guidance from TealHQ.com.",
    icon: FileText,
    color: "bg-teal-100",
    textColor: "text-teal-700"
  },
  {
    title: "Interactive Classes",
    description: "Experience immersive learning with interactive voiceovers powered by Speechma.com.",
    icon: GraduationCap,
    color: "bg-indigo-100",
    textColor: "text-indigo-700"
  },
  {
    title: "Networking & Forum",
    description: "Connect with peers, share knowledge, and ask the community for advice.",
    icon: Users,
    color: "bg-cyan-100",
    textColor: "text-cyan-700"
  },
  {
    title: "Interview Prep",
    description: "Combine AI insights with human coaching for interview success.",
    icon: Target,
    color: "bg-violet-100",
    textColor: "text-violet-700"
  },
  {
    title: "Career Insights",
    description: "Gain personalized advice and plan your next steps.",
    icon: LineChart,
    color: "bg-pink-100",
    textColor: "text-pink-700"
  },
  {
    title: "Events & Projects",
    description: "Engage in live discussions and collaborate on real-time initiatives.",
    icon: CalendarClock,
    color: "bg-fuchsia-100",
    textColor: "text-fuchsia-700"
  },
  {
    title: "Gamification & Badges",
    description: "Track your progress, earn digital rewards, and showcase your expertise.",
    icon: Medal,
    color: "bg-orange-100",
    textColor: "text-orange-700"
  },
  {
    title: "Mentorship & Translation",
    description: "Access expert mentorship and multilingual support with DeepL for a global perspective.",
    icon: Globe,
    color: "bg-blue-100",
    textColor: "text-blue-700"
  }
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Setup callback to handle carousel API change
  const onApiChange = useCallback((api: CarouselApi | null) => {
    if (!api) return;
    
    const handleSelect = () => {
      setActiveFeature(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    handleSelect();

    // Cleanup
    return () => {
      api.off("select", handleSelect);
    };
  }, []);

  // Update the API state when carousel is mounted
  const handleApiChange = (newApi: CarouselApi) => {
    setApi(newApi);
    onApiChange(newApi);
  };

  return (
    <div id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Powerful Features for GRC Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Synapse combines intelligent tools, specialized knowledge, and a vibrant community to help you navigate complex regulatory landscapes.
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {features.slice(0, 8).map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group"
            >
              <div className={`${feature.color} ${feature.textColor} rounded-full w-12 h-12 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Horizontal Carousel for Features */}
        <div className="mb-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            setApi={handleApiChange}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="flex flex-col items-center p-6">
                        <div className={cn(
                          feature.color,
                          feature.textColor,
                          "rounded-full w-16 h-16 flex items-center justify-center mb-5 transition-transform hover:scale-110"
                        )}>
                          <feature.icon size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                        <p className="text-gray-600 text-center">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center mt-4 gap-1">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    activeFeature === index ? "bg-synapse-primary w-4" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
            <CarouselPrevious className="absolute left-4 top-1/3" />
            <CarouselNext className="absolute right-4 top-1/3" />
          </Carousel>
        </div>

        {/* Feature focus modal - similar to the image shared */}
        <div className="mt-10 bg-gray-900 rounded-xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-7 gap-0">
            <div className="md:col-span-5 p-6 md:p-10 bg-gradient-to-br from-gray-900 to-gray-800">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Regulatory Analysis through AI</h3>
              <p className="text-gray-300 max-w-lg">
                Explore current regulations with detailed insights powered by our AI assistant Dara. 
                Track compliance requirements and spot patterns across jurisdictions.
              </p>
              <button className="mt-6 flex items-center gap-2 text-sm font-medium text-synapse-primary hover:text-synapse-secondary transition-colors">
                <span>Preview Dara in action</span>
                <ArrowRightIcon />
              </button>
            </div>
            <div className="md:col-span-2 p-6 bg-gray-800 flex flex-col min-h-[200px] justify-between">
              <FeatureTab active={true} name="Regulatory Analysis" />
              <FeatureTab active={false} name="Smart Calendar" />
              <FeatureTab active={false} name="Career Matching" />
              <FeatureTab active={false} name="Compliance Tools" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.66669 4L12.6667 8L8.66669 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeatureTab = ({ active, name }: { active: boolean; name: string }) => (
  <div className={`py-2 px-4 flex items-center ${active ? 'text-white' : 'text-gray-400'}`}>
    <div className={`w-2 h-2 rounded-full mr-3 ${active ? 'bg-synapse-primary' : 'bg-gray-600'}`}></div>
    <span className="text-sm font-medium">{name}</span>
  </div>
);

export default FeaturesSection;
