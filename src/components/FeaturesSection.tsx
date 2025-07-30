import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
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
const DashboardIcon = () => <Monitor className='w-6 h-6' />;
const BotIcon = () => <Bot className='w-6 h-6' />;
const CalendarIcon = () => <Calendar className='w-6 h-6' />;
const NewsIcon = () => <Newspaper className='w-6 h-6' />;
const BriefcaseIcon = () => <Briefcase className='w-6 h-6' />;
const PenIcon = () => <PenTool className='w-6 h-6' />;
const GameIcon = () => <Gamepad2 className='w-6 h-6' />;
const UsersIcon = () => <Users className='w-6 h-6' />;
const LightbulbIcon = () => <Lightbulb className='w-6 h-6' />;
const RocketIcon = () => <Rocket className='w-6 h-6' />;
const TeamIcon = () => <Users className='w-6 h-6' />;
const AwardIcon = () => <Award className='w-6 h-6' />;
const GlobeIcon = () => <Globe className='w-6 h-6' />;
const CpuIcon = () => <Cpu className='w-6 h-6' />;

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
  const [activeFeature, setActiveFeature] = useState(4);
  const [api, setApi] = useState<CarouselApi>();
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Enhanced auto-scroll with smooth interactions
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
      }, 4000); // Optimized timing
    };

    startAutoPlay();

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [api, autoPlayEnabled]);

  // Enhanced mouse interactions
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
  }, []);

  const onApiChange = useCallback((api: CarouselApi | null) => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setActiveFeature(api.selectedScrollSnap());
    };

    api.on('select', handleSelect);
    handleSelect();

    return () => {
      api.off('select', handleSelect);
    };
  }, []);

  const handleApiChange = useCallback(
    (newApi: CarouselApi) => {
      setApi(newApi);
      onApiChange(newApi);

      setTimeout(() => {
        newApi?.scrollTo(4, false);
      }, 100);
    },
    [onApiChange]
  );

  return (
    <section id='features' className='relative py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden'>
      {/* Subtle background pattern */}
      <div className='absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]' />
      
      <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Enhanced header */}
        <div className='text-center mb-20'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <Cpu className='w-4 h-4' />
            AI-Powered GRC Platform
          </div>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent'>
            Transform Your GRC Workflow
          </h2>
          <p className='text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
            Discover AI-driven tools that revolutionize compliance management, enhance career growth, 
            and connect you with the world's leading GRC professionals.
          </p>
        </div>

        {/* Redesigned carousel with better visual hierarchy */}
        <div className='max-w-7xl mx-auto' ref={carouselRef}>
          <Carousel
            opts={{
              align: 'center',
              loop: true,
              dragFree: true,
              skipSnaps: false
            }}
            className='w-full'
            setApi={handleApiChange}
          >
            <CarouselContent className='-ml-2 md:-ml-4'>
              {features.map((feature, index) => (
                <CarouselItem key={index} className='pl-2 md:pl-4 md:basis-auto'>
                  <Card
                    className={cn(
                      'relative overflow-hidden transition-all duration-500 ease-out cursor-pointer group',
                      'border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl',
                      activeFeature === index
                        ? 'w-[320px] sm:w-[360px] md:w-[440px] h-[360px] md:h-[400px] z-20 scale-105 shadow-2xl border-primary/20'
                        : 'w-[100px] sm:w-[120px] h-[360px] md:h-[400px] opacity-70 hover:opacity-90 z-10'
                    )}
                  >
                    {/* Gradient overlay for active card */}
                    {activeFeature === index && (
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none' />
                    )}
                    
                    <CardContent
                      className={cn(
                        'relative flex flex-col h-full p-6',
                        activeFeature === index ? 'justify-between' : 'justify-center'
                      )}
                    >
                      {activeFeature === index ? (
                        // Enhanced expanded view
                        <div className='flex flex-col h-full justify-between'>
                          <div className='space-y-6'>
                            {/* Icon with enhanced styling */}
                            <div
                              className={cn(
                                feature.color,
                                feature.textColor,
                                'rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg',
                                'group-hover:scale-110 transition-transform duration-300'
                              )}
                            >
                              <feature.icon />
                            </div>
                            
                            {/* Enhanced typography */}
                            <div className='space-y-4'>
                              <h3 className='text-2xl font-display font-bold text-foreground leading-tight'>
                                {feature.title}
                              </h3>
                              <p className='text-muted-foreground leading-relaxed text-base'>
                                {feature.description}
                              </p>
                            </div>
                          </div>

                          {/* Enhanced CTA */}
                          <Button
                            variant='ghost'
                            className='w-fit text-muted-foreground hover:text-foreground gap-3 mt-6 group/btn p-0 h-auto'
                          >
                            <span className='text-sm font-medium'>Explore {feature.title}</span>
                            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-all duration-300'>
                              <Play className='h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform' />
                            </div>
                          </Button>
                        </div>
                      ) : (
                        // Enhanced collapsed view
                        <div className='flex items-center justify-center h-full'>
                          <div className='transform rotate-90 whitespace-nowrap'>
                            <span className='text-muted-foreground/70 text-sm font-medium uppercase tracking-[0.2em] group-hover:text-muted-foreground transition-colors'>
                              {feature.title}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Enhanced navigation */}
            <div className='flex justify-center items-center mt-12 gap-6'>
              <Button
                onClick={() => api?.scrollPrev()}
                variant='outline'
                size='icon'
                className='h-12 w-12 rounded-full border-2 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg'
              >
                <ChevronLeft className='h-5 w-5' />
                <span className='sr-only'>Previous feature</span>
              </Button>
              
              {/* Progress indicator */}
              <div className='flex items-center gap-2'>
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      activeFeature === index
                        ? 'bg-primary w-8'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    )}
                  />
                ))}
              </div>
              
              <Button
                onClick={() => api?.scrollNext()}
                variant='outline'
                size='icon'
                className='h-12 w-12 rounded-full border-2 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg'
              >
                <ChevronRight className='h-5 w-5' />
                <span className='sr-only'>Next feature</span>
              </Button>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
