import {
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect, useRef } from 'react';

import { 
  Monitor, 
  Bot, 
  Calendar, 
  Newspaper, 
  Briefcase, 
  PenTool, 
  Gamepad2, 
  Users, 
  Lightbulb, 
  Rocket, 
  Award, 
  Globe, 
  Cpu 
} from 'lucide-react';

// Simple icon components
const DashboardIcon = () => <Monitor className="w-6 h-6" />;
const BotIcon = () => <Bot className="w-6 h-6" />;
const CalendarIcon = () => <Calendar className="w-6 h-6" />;
const NewsIcon = () => <Newspaper className="w-6 h-6" />;
const BriefcaseIcon = () => <Briefcase className="w-6 h-6" />;
const PenIcon = () => <PenTool className="w-6 h-6" />;
const GameIcon = () => <Gamepad2 className="w-6 h-6" />;
const UsersIcon = () => <Users className="w-6 h-6" />;
const LightbulbIcon = () => <Lightbulb className="w-6 h-6" />;
const RocketIcon = () => <Rocket className="w-6 h-6" />;
const TeamIcon = () => <Users className="w-6 h-6" />;
const AwardIcon = () => <Award className="w-6 h-6" />;
const GlobeIcon = () => <Globe className="w-6 h-6" />;
const CpuIcon = () => <Cpu className="w-6 h-6" />;

// GRC professional features data with enhanced descriptions
const features = [
  {
    title: 'Customizable Dashboards',
    description:
      'Create personalized workspaces with drag-and-drop widgets, custom notification settings, and regulatory focus areas tailored to your industry. Monitor everything from regulatory changes to compliance deadlines in one central interface.',
    icon: DashboardIcon,
    color: 'bg-blue-900/20',
    textColor: 'text-blue-400'
  },
  {
    title: 'Regulatory Analysis Chatbot',
    description:
      'Dara, our AI copilot, analyzes complex regulations in seconds, providing actionable insights, compliance recommendations, and potential risk alerts. Ask questions in plain language and receive expert-level guidance instantly.',
    icon: BotIcon,
    color: 'bg-purple-900/20',
    textColor: 'text-purple-400'
  },
  {
    title: 'Regulatory Calendar',
    description:
      'Never miss critical deadlines with our intelligent regulatory calendar. Receive automatic updates on industry-specific regulations, upcoming changes, and implementation timelines with customizable alerts and integration with your work calendar.',
    icon: CalendarIcon,
    color: 'bg-emerald-900/20',
    textColor: 'text-emerald-400'
  },
  {
    title: 'Daily Regulatory Insights',
    description:
      'Start each day with curated, relevant regulatory news and analysis delivered in bite-sized formats. Our AI filters the noise to deliver only what matters to your role, with severity ratings and impact assessments for your organization.',
    icon: NewsIcon,
    color: 'bg-amber-900/20',
    textColor: 'text-amber-400'
  },
  {
    title: 'Job Matching',
    description:
      'Our proprietary algorithm matches your GRC skills and experience with opportunities from top employers. Receive personalized job recommendations with compatibility scores, salary insights, and career growth potential analysis.',
    icon: BriefcaseIcon,
    color: 'bg-red-900/20',
    textColor: 'text-red-400'
  },
  {
    title: 'CV Surgery',
    description:
      'Transform your professional profile with our expert CV analysis. Receive personalized feedback on how to highlight your GRC expertise, certification recommendations, and tailored suggestions to stand out in competitive compliance roles.',
    icon: PenIcon,
    color: 'bg-indigo-900/20',
    textColor: 'text-indigo-400'
  },
  {
    title: 'Games',
    description:
      'Access immersive learning experiences with personalized games for individual learning as well as group games for huddles, events, and ice breakers. Earn badges as you progress through educational challenges on topics like SFDR and other regulatory frameworks.',
    icon: GameIcon,
    color: 'bg-cyan-900/20',
    textColor: 'text-cyan-400'
  },
  {
    title: 'Networking & Forum',
    description:
      'Connect with over 10,000 GRC professionals worldwide. Share best practices, discuss regulatory challenges, and build meaningful professional relationships through moderated forums, virtual meetups, and expert panel discussions.',
    icon: UsersIcon,
    color: 'bg-teal-900/20',
    textColor: 'text-teal-400'
  },
  {
    title: 'GRC Agent Gallery',
    description:
      'Explore a curated library of specialized AI assistants built for compliance use cases. Access pre-built agents designed to tackle specific regulatory challenges across industries, from SFDR audits to AML compliance checks.',
    icon: BotIcon,
    color: 'bg-pink-900/20',
    textColor: 'text-pink-400'
  },
  {
    title: 'Career Insights',
    description:
      'Map your GRC career trajectory with personalized development plans. Identify skill gaps, certification opportunities, and advancement strategies based on your career goals and industry trends in compliance and risk management.',
    icon: LightbulbIcon,
    color: 'bg-orange-900/20',
    textColor: 'text-orange-400'
  },
  {
    title: 'Events & Projects',
    description:
      'Participate in live discussions, webinars, and collaborative compliance projects with industry pioneers. Stay at the forefront of regulatory developments through exclusive access to thought leadership events and networking opportunities.',
    icon: RocketIcon,
    color: 'bg-violet-900/20',
    textColor: 'text-violet-400'
  },
  {
    title: 'Team Huddle',
    description:
      'Enhance team collaboration with integrated compliance workflows, document sharing, and project tracking. Streamline communication across compliance, legal, and operations teams with dedicated channels and task management tools.',
    icon: TeamIcon,
    color: 'bg-green-900/20',
    textColor: 'text-green-400'
  },
  {
    title: 'Gamification & Badges',
    description:
      'Make compliance engaging through achievement systems, leaderboards, and digital credentials. Track your progress, earn recognition for regulatory expertise, and showcase your professional development through shareable certification badges.',
    icon: AwardIcon,
    color: 'bg-yellow-900/20',
    textColor: 'text-yellow-400'
  },
  {
    title: 'Mentorship & Translation',
    description:
      'Access guidance from senior GRC professionals and overcome language barriers with our multilingual support. Connect with mentors who match your career aspirations and translate complex regulations into actionable insights in your preferred language.',
    icon: GlobeIcon,
    color: 'bg-blue-900/20',
    textColor: 'text-blue-400'
  },
  {
    title: 'Customize Your Own Agent',
    description:
      'Build your personal compliance AI assistant. Choose your preferred LLM, set its tone, and define its behavior — no coding needed. Create specialized agents for specific regulatory domains or compliance tasks tailored to your organization.',
    icon: CpuIcon,
    color: 'bg-indigo-900/20',
    textColor: 'text-indigo-400'
  }
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(4); // Start with Job Matching selected
  const [api, setApi] = useState<CarouselApi>();
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || !autoPlayEnabled) {
      return;
    }

    const startAutoPlay = () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }

      autoPlayIntervalRef.current = setInterval(() => {
        api?.scrollNext();
      }, 5000); // Slow rhythm - 5 seconds per card
    };

    startAutoPlay();

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [api, autoPlayEnabled]);

  // Setup mouse interactions for pausing autoplay
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const handleMouseEnter = () => setAutoPlayEnabled(false);
    const handleMouseLeave = () => setAutoPlayEnabled(true);

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [carouselRef]);

  // Setup callback to handle carousel API change
  const onApiChange = useCallback((api: CarouselApi | null) => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setActiveFeature(api.selectedScrollSnap());
    };

    api.on('select', handleSelect);
    handleSelect();

    // Cleanup
    return () => {
      api.off('select', handleSelect);
    };
  }, []);

  // Update the API state when carousel is mounted
  const handleApiChange = useCallback(
    (newApi: CarouselApi) => {
      setApi(newApi);
      onApiChange(newApi);

      // Initialize to Job Matching (index 4)
      setTimeout(() => {
        newApi?.scrollTo(4, false);
      }, 100);
    },
    [onApiChange]
  );

  return (
    <div id='features' className='py-20 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900'>
            Powerful GRC Tools for Compliance Professionals
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            Synapses provide the tools and community to navigate regulations, shape future
            technologies, and lead the way in AI-driven compliance.
          </p>
        </div>

        {/* Dark themed stacked cards carousel */}
        <div className='max-w-5xl mx-auto' ref={carouselRef}>
          <Carousel
            opts={{
              align: 'center',
              loop: true,
              dragFree: true
            }}
            className='w-full'
            setApi={handleApiChange}
          >
            <CarouselContent className='-ml-2 md:-ml-4'>
              {features.map((feature, index) => (
                <CarouselItem key={index} className='pl-2 md:pl-4 md:basis-auto'>
                  <Card
                    className={cn(
                      'border border-gray-200 bg-white shadow-lg transition-all duration-300',
                      activeFeature === index
                        ? 'w-[280px] sm:w-[300px] md:w-[400px] h-[320px] md:h-[340px] z-20 shadow-xl'
                        : 'w-[80px] sm:w-[100px] h-[320px] md:h-[340px] opacity-80 z-10'
                    )}
                  >
                    <CardContent
                      className={cn(
                        'flex flex-col h-full p-4',
                        activeFeature === index ? 'justify-between' : 'justify-center'
                      )}
                    >
                      {activeFeature === index ? (
                        // Expanded card view
                        <div className='flex flex-col h-full justify-between'>
                          {/* Title and Icon at the top */}
                          <div>
                            <div
                              className={cn(
                                feature.color,
                                feature.textColor,
                                'rounded-full w-12 h-12 flex items-center justify-center mb-4'
                              )}
                            >
                              <feature.icon />
                            </div>
                            <h3 className='text-xl font-bold mb-4 text-gray-900'>{feature.title}</h3>
                            <p className='text-gray-600 text-sm'>{feature.description}</p>
                          </div>

                          {/* Preview button at bottom */}
                          <Button variant='ghost' className='w-fit text-gray-600 hover:text-gray-900 gap-2 mt-4 group'>
                            <span>Learn about {feature.title.toLowerCase()}</span>
                            <Play className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                          </Button>
                        </div>
                      ) : (
                        // Collapsed card view - vertical text along the side
                        <div className='flex items-center justify-center h-full'>
                          <div className='rotate-90 whitespace-nowrap text-gray-500 text-sm font-medium uppercase tracking-wider'>
                            {feature.title}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className='flex justify-center mt-8 gap-4'>
              <Button
                onClick={() => api?.scrollPrev()}
                variant='outline'
                size='icon'
                className='bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
              >
                <ChevronLeft className='h-5 w-5' />
                <span className='sr-only'>Previous feature</span>
              </Button>
              <Button
                onClick={() => api?.scrollNext()}
                variant='outline'
                size='icon'
                className='bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
              >
                <ChevronRight className='h-5 w-5' />
                <span className='sr-only'>Next feature</span>
              </Button>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
