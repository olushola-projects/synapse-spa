
import { useState, useEffect } from "react";
import { USPFeatureSection } from "./features/USPFeatureSection";
import { HeroContent } from "./hero/HeroContent";
import ExternalFormDialog from "./ExternalFormDialog";
import InviteDialog from "./InviteDialog";

/**
 * HeroSection component - Main landing page hero section with glass visualization
 * Features precise container alignment, optimized spacing, and enhanced visual hierarchy
 */
const HeroSection = () => {
  const [animate, setAnimate] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Trigger animations after component mounts with optimized timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 150);
    return () => clearTimeout(timer);
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
      className="w-full py-8 md:py-12 lg:py-16 flex flex-col items-start justify-center bg-white relative overflow-hidden"
    >
      {/* Glass Visualization Background - Positioned to replace dashboard area */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-end pointer-events-none">
        <div className="relative w-full h-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <img
            src="/lovable-uploads/f6b960c4-dad9-41ed-a356-34b2bac4663c.png"
            alt="GRC Data Visualization"
            className="w-full h-full object-contain object-center md:object-right opacity-80 hover:opacity-90 transition-opacity duration-1000"
            style={{
              filter: 'drop-shadow(0 4px 20px rgba(59, 130, 246, 0.1))',
              maxHeight: '85vh'
            }}
          />
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent md:from-white/60"></div>
        </div>
      </div>

      {/* Main container with precise alignment matching navbar */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Hero Content - Precisely aligned with navbar logo */}
        <div className="flex flex-col items-start w-full">
          <HeroContent
            animate={animate}
            onGetAccess={handleGetAccessClick}
            onInvite={handleInviteClick}
          />
          
          {/* USP Feature Section - Aligned under GRC Innovation Hub */}
          <div className={`mt-8 w-full pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 transition-all duration-700 ease-out delay-300 ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
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
