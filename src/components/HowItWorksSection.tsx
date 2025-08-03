import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ExternalFormDialog from './ExternalFormDialog';
const HowItWorksSection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const openFormDialog = () => {
    setShowFormDialog(true);
  };
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description:
        'Join the Synapses waiting list to be one of the first to experience the platform when it launches.'
    },
    {
      number: '02',
      title: 'Customize Your Experience',
      description:
        'Set up your profile, select your areas of interest, and personalize your dashboard to focus on what matters to you.'
    },
    {
      number: '03',
      title: 'Engage Agent Gallery',
      description:
        'Interact with Dara and other agents, build your own agents, add test and co-create new regtechs for your compliance needs.'
    },
    {
      number: '04',
      title: 'Connect & Grow',
      description:
        'Network with peers, participate in discussions, attend events, and continuously expand your knowledge and skills.'
    }
  ];
  return (
    <div id='how-it-works' className='py-12 sm:py-16 md:py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12 sm:mb-16'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4'>How Synapses Works</h2>
          <p className='text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-medium px-4'>
            Getting started with Synapses is simple. Follow these steps to transform your GRC
            experience.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
          {steps.map((step, index) => (
            <div key={index} className='relative'>
              {/* Connect lines between steps except for the last one - hidden on mobile */}
              {index < steps.length - 1 && (
                <div
                  className='hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent z-0'
                  style={{
                    width: 'calc(100% - 2rem)'
                  }}
                ></div>
              )}

              <div className='feature-card h-full relative z-10 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
                <div className='text-2xl sm:text-3xl font-bold text-primary/30 mb-3 sm:mb-4'>{step.number}</div>
                <h3 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3'>{step.title}</h3>
                <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-16 text-center'>
          <Button
            onClick={openFormDialog}
            className='bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200'
          >
            Get Early Access <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      <ExternalFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        title='Get Early Access'
      />
    </div>
  );
};
export default HowItWorksSection;
