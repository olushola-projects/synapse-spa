
import { useState, useEffect } from "react";
import { USPFeatureSection } from "./features/USPFeatureSection";
import { HeroContent } from "./hero/HeroContent";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardContent } from "./dashboard/DashboardContent";
import { StatusCards } from "./dashboard/StatusCards";
import { EnhancedDashboardContainer, DashboardGrid } from "./dashboard/Dashboard";
import MobileCharts from "./dashboard/MobileCharts";
import ExternalFormDialog from "./ExternalFormDialog";
import InviteDialog from "./InviteDialog";
import JoinWaitlistDialog from "./JoinWaitlistDialog";

const HeroSection = () => {
  const [animate, setAnimate] = useState(false);
  const [showAmlDialog, setShowAmlDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  const handleGetAccessClick = () => {
    setShowWaitlistDialog(true);
  };

  const handleInviteClick = () => {
    setShowInviteDialog(true);
  };

  const handleAmlDialogOpen = () => {
    setShowAmlDialog(true);
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 64px)" }}
      className="w-full px-4 sm:px-6 lg:px-8 py-2 md:py-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#eef4ff] via-white to-[#f8faff]"
      id="hero-section"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Hero Content - Left Side */}
        <div className="flex flex-col items-start">
          <HeroContent
            animate={animate}
            onGetAccess={handleGetAccessClick}
            onInvite={handleInviteClick}
          />
          
          {/* USP Feature Section - Under Hero Content */}
          <div className={`mt-8 w-full transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
            <USPFeatureSection />
          </div>
        </div>

        {/* Hero Visual - Right Side: Dynamic Dashboard */}
        <div className={`relative w-full transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-x-6'}`}>
          <div className="dashboard-mock w-full md:w-[120%] md:ml-[-10%] overflow-hidden rounded-xl shadow-2xl bg-white">
            {/* Dashboard simulation */}
            <div className="w-full h-[630px] overflow-hidden relative flex flex-col">
              {/* Dashboard Header */}
              <DashboardHeader avatarSrc="/lovable-uploads/c5b1f529-364b-4a3f-9e4e-29fe1862e7b3.png" />
              
              {/* Dashboard Container */}
              <div className="flex-1 p-1 flex flex-col bg-gray-50">
                {/* Status Cards */}
                <StatusCards />
                
                {/* Dashboard Main Content */}
                <DashboardContent onAmlDialogOpen={handleAmlDialogOpen} />
                
                {/* Mobile-specific charts for responsive design */}
                <div className="hidden md:hidden">
                  <MobileCharts />
                </div>
              </div>
            </div>
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
      
      <JoinWaitlistDialog
        open={showWaitlistDialog}
        onOpenChange={setShowWaitlistDialog}
      />
    </div>
  );
};

export default HeroSection;
