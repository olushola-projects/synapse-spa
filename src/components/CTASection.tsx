
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import ExternalFormDialog from './ExternalFormDialog';
import JoinWaitlistDialog from './JoinWaitlistDialog';

const CTASection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  
  const openWaitlistDialog = () => {
    setShowWaitlistDialog(true);
  };
  
  return (
    <section className="bg-white py-10 sm:py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform GRC?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join a global network of professionals for exclusive beta testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
          </p>
          <Button 
            onClick={openWaitlistDialog}
            className="flex items-center gap-2"
          >
            Join Waitlist <ArrowRight size={16} />
          </Button>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 rounded-full text-sm font-medium text-gray-600">
             <span><strong>🎁 Limited time offer:</strong> Join the waitlist for a chance to get 3 months of Pro Plan access—<strong>free!</strong></span>
            </div>
          </div>
        </div>
      </div>
      
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog} 
        title="Get Early Access"
      />
      
      <JoinWaitlistDialog
        open={showWaitlistDialog}
        onOpenChange={setShowWaitlistDialog}
      />
    </section>
  );
};

export default CTASection;
