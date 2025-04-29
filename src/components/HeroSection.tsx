import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageSquare, Bot, Cpu } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SideNavigation } from './dashboard/SideNavigation';
import { StatusCards } from './dashboard/StatusCards';
import { DashboardContent } from './dashboard/DashboardContent';
import { FeatureGrid, featureIcons } from './features/FeatureGrid';
import { HeroContent } from './hero/HeroContent';
import JoinWaitlistDialog from "./JoinWaitlistDialog";
import MobileCharts from './dashboard/MobileCharts';

const HeroSection = () => {
  const [animateContent, setAnimateContent] = useState(false);
  const [animateImage, setAnimateImage] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAmlDialog, setOpenAmlDialog] = useState(false);
  const [chatResponse, setChatResponse] = useState("");
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  const amldInfo = {
    title: "AMLD6 Penalties and Criminal Liability Extension",
    description: "Understanding the Sixth Anti-Money Laundering Directive's enhanced penalties and criminal liability provisions",
    content: `
      <h3 class="text-lg font-semibold mb-3">Extended Criminal Liability Under AMLD6</h3>
      
      <p class="mb-4">The Sixth Anti-Money Laundering Directive (AMLD6) significantly expands criminal liability to legal entities and individuals who aid and abet money laundering, either through negligence or deliberate actions.</p>
      
      <h4 class="text-md font-medium mb-2">Key Penalty Provisions:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Maximum imprisonment term for money laundering offenses increased to at least 4 years</li>
        <li>Fines can reach into the hundreds of millions of euros</li>
        <li>Additional sanctions include exclusion from public benefits and temporary/permanent bans from conducting business</li>
        <li>Corporate liability for "lack of supervision" that enables money laundering</li>
      </ul>
      
      <h4 class="text-md font-medium mb-2">Regulatory References:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Article 5: Effective and dissuasive penalties with a maximum term of at least 4 years imprisonment</li>
        <li>Article 6: Aggravating circumstances for offenses committed within criminal organizations or in abuse of professional position</li>
        <li>Article 7: Liability of legal persons for lack of supervision or control</li>
        <li>Article 10: Jurisdiction established when offense is committed in whole or part within territory</li>
      </ul>
      
      <h4 class="text-md font-medium mb-2">Real-World Scenario:</h4>
      <div class="bg-blue-50 p-3 rounded-md mb-4">
        <p class="italic text-sm">A financial institution failed to implement adequate customer due diligence procedures, resulting in several high-risk transactions going undetected. Under AMLD6, both the financial institution (as a legal entity) and its compliance officer (as an individual) face criminal liability. The institution faces fines of €10M or 5% of annual turnover, while the officer faces potential imprisonment and a prohibition from holding management positions in financial institutions.</p>
      </div>
      
      <h4 class="text-md font-medium mb-2">Compliance Recommendations:</h4>
      <ol class="list-decimal pl-5 space-y-1">
        <li>Conduct a thorough review of existing AML frameworks</li>
        <li>Update risk assessment methodologies to incorporate AMLD6 requirements</li>
        <li>Enhance transaction monitoring systems</li>
        <li>Implement comprehensive training programs for staff</li>
        <li>Establish clear lines of responsibility for AML compliance</li>
      </ol>
    `
  };

  useEffect(() => {
    if (openAmlDialog) {
      setTimeout(() => {
        setChatResponse("The penalties under AMLD6 are significantly more severe than previous directives. Legal entities and individuals who enable money laundering can face criminal liability, with maximum imprisonment terms of at least 4 years and fines that can reach hundreds of millions of euros. The directive extends criminal liability to those who aid and abet money laundering through either negligence or deliberate actions.");
      }, 800);
    }
  }, [openAmlDialog]);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateContent(true), 100);
    const timer2 = setTimeout(() => setAnimateImage(true), 300);
    const timer3 = setTimeout(() => setAnimateFeatures(true), 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleFeatureClick = (index: number) => {
    setSelectedFeature(index);
    setOpenDialog(true);
  };

  const openWaitlistDialog = () => {
    setShowWaitlistDialog(true);
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const yOffset = -80; // Account for header height
      const y = featuresSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="relative pt-24 pb-8 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4f1ff,#e9e8ff,#f4e8ff,#e9e8ff,#e4f1ff)] animate-gradient-x"></div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-indigo-200/30 via-transparent to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-synapse-accent/10 rounded-full filter blur-3xl -z-10 animate-pulse-soft"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-synapse-primary/10 rounded-full filter blur-3xl -z-10 animate-pulse-soft"></div>
        
        <div className="absolute inset-x-0 top-40 h-[500px] -z-10 transform -skew-y-6 opacity-10">
          <div className="h-full w-full bg-gradient-stripe from-purple-300 via-blue-300 to-indigo-300 animate-gradient-shift"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start">
            {/* Left side with hero content */}
            <div className="md:w-1/2 mb-10 md:mb-0">
              <HeroContent 
                animate={animateContent}
                onGetAccess={openWaitlistDialog}
                onLearnMore={handleLearnMoreClick}
                onFeatureClick={handleFeatureClick}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 rounded-full text-sm font-medium text-gray-600">
            <span>Join</span>
            <span className="font-bold text-synapse-primary">50+</span>
            <span>early adopters in our private pilot</span>
          </div>
        </div>

        {/* Dashboard Preview Section - displayed within hero section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="aspect-[16/9] mb-4 rounded-xl overflow-hidden shadow-2xl relative">
              {/* Main Dashboard */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#F1F0FB] rounded-md overflow-hidden">
                <DashboardHeader avatarSrc="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png" />
                
                <div className="p-2 flex h-[94%] bg-[#F1F0FB]">
                  <SideNavigation onAmlDialogOpen={() => setOpenAmlDialog(true)} />
                  
                  <div className="flex-1 pl-1 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-800 text-[10px] sm:text-[12px] font-medium">Regulatory Intelligence Dashboard</div>
                      <div className="flex gap-2 items-center">
                        <div className="text-[8px] sm:text-[10px] text-gray-500">April 29, 2025</div>
                        <div className="flex items-center gap-1">
                          <div className="text-[8px] sm:text-[10px] text-gray-500">Hi, Phoebe Banks</div>
                          <img 
                            src="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png" 
                            alt="Phoebe Banks" 
                            className="w-4 h-4 rounded-full object-cover border border-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <StatusCards />
                    <DashboardContent onAmlDialogOpen={() => setOpenAmlDialog(true)} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Mobile Preview */}
            <div className="hidden lg:block absolute -right-10 top-1/2 transform -translate-y-1/2 w-[180px] h-[350px] rounded-[28px] border-[8px] border-gray-800 bg-[#F1F0FB] shadow-2xl overflow-hidden">
              <div className="absolute top-[14px] left-1/2 transform -translate-x-1/2 w-[60px] h-[16px] bg-gray-800 rounded-full"></div>
              <div className="h-full overflow-hidden">
                <img 
                  src="/lovable-uploads/2a0750ab-ba08-4622-8ded-ba9afe4e7980.png" 
                  alt="Mobile Dashboard" 
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          {selectedFeature !== null && featureIcons[selectedFeature] && (
            <>
              <DialogHeader>
                <DialogTitle>{featureIcons[selectedFeature].content.title}</DialogTitle>
                <DialogDescription>
                  {featureIcons[selectedFeature].content.description}
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <p className="text-gray-700">
                  {featureIcons[selectedFeature].content.details}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openAmlDialog} onOpenChange={setOpenAmlDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{amldInfo?.title}</DialogTitle>
            <DialogDescription>
              {amldInfo?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div dangerouslySetInnerHTML={{ __html: amldInfo?.content || '' }} />
            
            {chatResponse && (
              <div className="mt-6 border-t pt-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <MessageSquare size={16} className="text-purple-600" />
                    </div>
                    <div className="font-medium text-sm">Dara (AI Assistant)</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">{chatResponse}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <JoinWaitlistDialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />
    </>
  );
};

export default HeroSection;
