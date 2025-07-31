import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useInView } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { wrap } from '@/lib/utils';
import { getSortedPerspectives, type IndustryPerspective } from '@/data/industryPerspectivesData';
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
  
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPerspective, setSelectedPerspective] = useState<IndustryPerspective | null>(null);

  // Get sorted perspectives
  const sortedPerspectives = getSortedPerspectives();
  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) {
      return;
    }
    // Use the wrap function to ensure the index stays within bounds
    emblaApi.scrollTo(wrap(0, sortedPerspectives.length, index));
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
  }, [emblaApi, autoplayInterval]);

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
  const handleOpenArticle = (perspective: IndustryPerspective) => {
    setSelectedPerspective(perspective);
    setIsDialogOpen(true);
  };
  return <div id='testimonials' ref={sectionRef} className="relative overflow-hidden py-0 bg-white">
      {/* Stripe-inspired diagonal background */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30'></div>
      </div>

      {/* Diagonal decorative stripe */}
      <div className='absolute inset-x-0 top-0 h-24 -z-10 transform -skew-y-6 bg-gradient-to-r from-indigo-50/80 to-blue-50/80'></div>
      <div className='absolute inset-x-0 bottom-0 h-24 -z-10 transform skew-y-6 bg-gradient-to-r from-purple-50/80 to-indigo-50/80'></div>

      <div className="container mx-auto sm:px-6 lg:px-8 relative z-10 bg-white px-0 py-[20px]">
        <div className='text-center mb-16 max-w-3xl mx-auto'>
          <h2 className="text-3xl md:text-4xl font-display mb-4 font-semibold">
            Perspectives Powering the Future of GRC
          </h2>
          <p className="font-light text-base text-black">
            Leading experts and organizations shaping the future of governance, risk, and compliance
          </p>
        </div>

        {/* Desktop Carousel - limited to 3 perspectives at a time */}
        <div className="max-w-7xl mx-auto hidden md:block bg-white">
          <div className='overflow-hidden' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={emblaRef}>
            <div className='flex -ml-4'>
              {sortedPerspectives.map((perspective, index) => <div key={index} className='flex-[0_0_33.33%] min-w-0 pl-4 transition-all duration-500'>
                  <div className={`transition-all duration-500 ease-in-out transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
                transitionDelay: `${index * 150}ms`
              }}>
                    <Card className='h-[360px] border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden bg-white rounded-xl'>
                      <CardContent className="p-6 flex flex-col h-full bg-slate-200">
                        <div className='mb-4'>{perspective.icon}</div>

                        <div className='mb-5'>
                          <h3 className='text-lg font-bold text-gray-900 mb-1'>
                            {perspective.name}
                          </h3>
                          <p className='text-sm text-synapse-primary/80'>{perspective.role}</p>
                        </div>

                        <p className='text-gray-600 text-sm flex-grow overflow-hidden'>
                          {perspective.bio}
                        </p>

                        <div className='mt-6 pt-4 border-t border-gray-100 flex items-center justify-between'>
                          <span className='text-xs text-gray-400'>Industry Insight</span>
                          <Button variant='link' className={`text-sm ${perspective.color} font-medium flex items-center gap-1 p-0`} onClick={() => handleOpenArticle(perspective)}>
                            Learn More <ExternalLink size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Carousel Controls */}
          
        </div>

        {/* Mobile Carousel */}
        <div className='md:hidden mt-8'>
          <Carousel className='w-full' opts={{
          loop: true
        }}>
            <CarouselContent>
              {sortedPerspectives.map((perspective, i) => <CarouselItem key={i} className='md:basis-1/2 lg:basis-1/3'>
                  <PerspectiveCard perspective={perspective} onLearnMore={() => handleOpenArticle(perspective)} />
                </CarouselItem>)}
            </CarouselContent>
            <div className='flex justify-center gap-4 mt-4'>
              <CarouselPrevious className='relative static transform-none bg-white' />
              <CarouselNext className='relative static transform-none bg-white' />
            </div>
          </Carousel>
        </div>

        <div className='mt-16 text-center'></div>
      </div>

      {/* Article Dialog */}
      <ArticleDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} perspective={selectedPerspective} />
    </div>;
};
const PerspectiveCard = ({
  perspective,
  onLearnMore
}: {
  perspective: IndustryPerspective;
  onLearnMore: () => void;
}) => <div className='h-full'>
    <div className='h-full flex flex-col p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300'>
      <div className='mb-4'>{perspective.icon}</div>

      {/* Quote content */}
      <div className='flex-1 mb-4'>
        <p className='text-gray-700 text-sm'>{perspective.bio}</p>
      </div>

      {/* Attribution section */}
      <div className='mt-auto pt-4 border-t border-gray-100'>
        <h3 className='font-bold text-gray-800'>{perspective.name}</h3>
        <p className='text-synapse-primary/80 text-xs'>{perspective.role}</p>
        <div className='mt-2'>
          <Button variant='link' className={`text-sm ${perspective.color} font-medium flex items-center gap-1 p-0`} onClick={onLearnMore}>
            Learn More <ExternalLink size={14} />
          </Button>
        </div>
      </div>
    </div>
  </div>;
export default IndustryPerspectivesSection;