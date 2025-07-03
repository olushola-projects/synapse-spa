
import { useState, useEffect } from "react";
import { USPFeatureSection } from "./features/USPFeatureSection";
import { HeroContent } from "./hero/HeroContent";
import ExternalFormDialog from "./ExternalFormDialog";
import InviteDialog from "./InviteDialog";

const HeroSection = () => {
  const [animate, setAnimate] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  const handleGetAccessClick = () => {
    setShowFormDialog(true);
  };

  const handleInviteClick = () => {
    setShowInviteDialog(true);
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 64px)" }}
      className="w-full px-4 sm:px-6 lg:px-8 py-2 md:py-6 flex flex-col items-start justify-center bg-white"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Hero Content - Left Aligned */}
        <div className="flex flex-col items-start">
          <HeroContent
            animate={animate}
            onGetAccess={handleGetAccessClick}
            onInvite={handleInviteClick}
          />
          
          {/* USP Feature Section - Under Hero Content */}
          <div className={`mt-16 w-full transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
            <USPFeatureSection />
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog} 
        title="Get Early Access"
      />
      
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </div>
  );
};

export default HeroSection;
