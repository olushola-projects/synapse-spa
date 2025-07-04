
import { useState, useEffect } from "react";
import { USPFeatureSection } from "./features/USPFeatureSection";
import { HeroContent } from "./hero/HeroContent";
import ExternalFormDialog from "./ExternalFormDialog";
import InviteDialog from "./InviteDialog";

/**
 * HeroSection component - Main landing page hero section with improved layout and alignment
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
      className="w-full py-8 md:py-12 lg:py-16 flex flex-col items-start justify-center bg-gradient-to-b from-white to-slate-50/30 relative overflow-hidden"
    >
      {/* Earth Video Background - Positioned creatively in front of text */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none">
        <div className="relative w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-20 hover:opacity-30 transition-opacity duration-1000">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-full shadow-2xl filter blur-[1px] hover:blur-0 transition-all duration-1000"
            style={{
              maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)'
            }}
          >
            <source src="/Earth.mp4" type="video/mp4" />
          </video>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 animate-pulse"></div>
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
