import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ExternalFormDialog from './ExternalFormDialog';
const CTASection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  return <section className='bg-white py-12 sm:py-16 md:py-20'>
      <div className='container mx-auto px-4 sm:px-6 font-normal'>
        <div className='text-center max-w-2xl mx-auto'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 font-semibold'>Ready to Transform GRC?</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base font-light px-4 leading-relaxed">
            Join a global network of professionals for exclusive beta testing of future solutions,
            comprehensive regulatory insights and personalized career resilience tools to upskill,
            adapt, and lead the way in shaping the future of GRC.
          </p>
          <Button onClick={() => setShowFormDialog(true)} className='bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto'>
            Get Early Access <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      <ExternalFormDialog open={showFormDialog} onOpenChange={setShowFormDialog} title='Get Early Access' />
    </section>;
};
export default CTASection;