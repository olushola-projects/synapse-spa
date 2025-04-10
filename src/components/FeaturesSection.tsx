
import { 
  LayoutDashboard, Bot, Calendar, Newspaper, Briefcase, FilePen,
  BookOpen, Users, Mic, Lightbulb, Rocket, UsersRound, 
  Award, Globe, ChevronLeft, ChevronRight, Play
} from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";

// GRC professional features data
const features = [
  {
    title: "Customizable Dashboards",
    description: "Personalize your workspace to focus on the information that matters most to you.",
    icon: LayoutDashboard,
    color: "bg-blue-900/20",
    textColor: "text-blue-400"
  },
  {
    title: "Regulatory Analysis Chatbot",
    description: "Leverage Dara, our AI copilot, for instant regulatory insights and actionable compliance recommendations.",
    icon: Bot,
    color: "bg-purple-900/20",
    textColor: "text-purple-400"
  },
  {
    title: "Regulatory Calendar",
    description: "Stay current with scheduled deadlines and breaking regulatory news.",
    icon: Calendar,
    color: "bg-emerald-900/20",
    textColor: "text-emerald-400"
  },
  {
    title: "Daily Regulatory Insights",
    description: "Receive timely, bite-sized updates to keep you informed.",
    icon: Newspaper,
    color: "bg-amber-900/20",
    textColor: "text-amber-400"
  },
  {
    title: "Job Matching",
    description: "Discover career opportunities that align with your expertise.",
    icon: Briefcase,
    color: "bg-red-900/20",
    textColor: "text-red-400"
  },
  {
    title: "CV Surgery",
    description: "Elevate your professional profile with expert guidance.",
    icon: FilePen,
    color: "bg-indigo-900/20",
    textColor: "text-indigo-400"
  },
  {
    title: "Classes",
    description: "Experience immersive learning with interactive voiceovers.",
    icon: BookOpen,
    color: "bg-cyan-900/20",
    textColor: "text-cyan-400"
  },
  {
    title: "Networking & Forum",
    description: "Connect with peers, share knowledge, and ask the community for advice.",
    icon: Users,
    color: "bg-teal-900/20",
    textColor: "text-teal-400"
  },
  {
    title: "Interview Preparation",
    description: "Combine AI insights with human coaching for interview success.",
    icon: Mic,
    color: "bg-pink-900/20",
    textColor: "text-pink-400"
  },
  {
    title: "Career Insights",
    description: "Gain personalized advice and plan your next steps.",
    icon: Lightbulb,
    color: "bg-orange-900/20",
    textColor: "text-orange-400"
  },
  {
    title: "Events & Projects",
    description: "Engage in live discussions and collaborate on real-time initiatives.",
    icon: Rocket,
    color: "bg-violet-900/20",
    textColor: "text-violet-400"
  },
  {
    title: "Team Huddle",
    description: "Foster better collaboration and problem solving with your team.",
    icon: UsersRound,
    color: "bg-green-900/20",
    textColor: "text-green-400"
  },
  {
    title: "Gamification & Badges",
    description: "Track your progress, earn digital rewards, and showcase your expertise.",
    icon: Award,
    color: "bg-yellow-900/20",
    textColor: "text-yellow-400"
  },
  {
    title: "Mentorship & Translation",
    description: "Access expert mentorship and multilingual support for a global perspective.",
    icon: Globe,
    color: "bg-blue-900/20",
    textColor: "text-blue-400"
  }
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(4); // Start with Job Matching selected 
  const [api, setApi] = useState<CarouselApi>();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Initialize to Job Matching (index 4)
    setTimeout(() => {
      newApi.scrollTo(4, false);
    }, 100);
  };

  return (
    <div id="features" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
            Powerful GRC Tools for Compliance Professionals
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Get comprehensive regulatory insights and career development tools designed for GRC professionals.
          </p>
        </div>

        {/* Dark themed stacked cards carousel */}
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
            setApi={handleApiChange}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-auto">
                  <Card className={cn(
                    "border-0 bg-gray-900 transition-all duration-300",
                    activeFeature === index 
                      ? "w-[280px] sm:w-[300px] md:w-[400px] h-[300px] md:h-[320px] z-20"
                      : "w-[80px] sm:w-[100px] h-[300px] md:h-[320px] opacity-80 z-10"
                  )}>
                    <CardContent className={cn(
                      "flex flex-col h-full p-4",
                      activeFeature === index ? "justify-between" : "justify-center"
                    )}>
                      {activeFeature === index ? (
                        // Expanded card view
                        <div className="flex flex-col h-full justify-between">
                          {/* Title and Icon at the top */}
                          <div>
                            <div className={cn(
                              feature.color,
                              feature.textColor,
                              "rounded-full w-12 h-12 flex items-center justify-center mb-4"
                            )}>
                              <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                          </div>
                          
                          {/* Preview button at bottom */}
                          <Button variant="ghost" className="w-fit text-gray-300 gap-2 mt-4 group">
                            <span>Learn about {feature.title.toLowerCase()}</span>
                            <Play className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      ) : (
                        // Collapsed card view - vertical text along the side
                        <div className="flex items-center justify-center h-full">
                          <div className="rotate-90 whitespace-nowrap text-gray-400 text-sm font-medium uppercase tracking-wider">
                            {feature.title}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-8 gap-4">
              <Button 
                onClick={() => api?.scrollPrev()} 
                variant="outline" 
                size="icon" 
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous feature</span>
              </Button>
              <Button 
                onClick={() => api?.scrollNext()} 
                variant="outline" 
                size="icon"
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next feature</span>
              </Button>
            </div>
          </Carousel>
        </div>

        {/* Grid layout for desktop */}
        <div className="hidden md:block mt-20">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card group"
              >
                <div className={`${feature.color} ${feature.textColor} rounded-full w-12 h-12 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
