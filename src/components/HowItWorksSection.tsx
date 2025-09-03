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
    <div id='how-it-works' className='py-20 bg-gray-50'>
      <div className='container mx-auto sm:px-6 lg:px-8 px-[50px] py-[10px]'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-display font-bold mb-4'>How Synapses Works</h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto font-medium'>
            Getting started with Synapses is simple. Follow these steps to transform your GRC
            experience.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {steps.map((step, index) => (
            <div key={index} className='relative'>
              {/* Connect lines between steps except for the last one */}
              {index < steps.length - 1 && (
                <div
                  className='hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-synapse-primary to-transparent z-0'
                  style={{
                    width: 'calc(100% - 2rem)'
                  }}
                ></div>
              )}

              <div className='feature-card h-full relative z-10 bg-slate-200'>
                <div className='text-3xl font-bold text-synapse-primary/20 mb-4'>{step.number}</div>
                <h3 className='text-xl font-semibold mb-3'>{step.title}</h3>
                <p className='text-gray-600 text-sm'>{step.description}</p>
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
