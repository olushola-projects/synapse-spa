import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SideNavigation } from './dashboard/SideNavigation';
import { StatusCards } from './dashboard/StatusCards';
import { RegulatoryFocusChart } from './dashboard/charts/RegulatoryFocusChart';
import { FeatureGrid, featureIcons } from './features/FeatureGrid';
import { HeroContent } from './hero/HeroContent';
import JoinWaitlistDialog from "./JoinWaitlistDialog";

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
    <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
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
        <div className="flex flex-col md:flex-row items-center">
          <HeroContent 
            animate={animateContent}
            onGetAccess={() => setShowWaitlistDialog(true)}
            onLearnMore={handleLearnMoreClick}
          />
          
          <div className={`md:w-3/5 relative transition-all duration-700 ease-out ${animateImage ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="aspect-[16/10] mb-2 rounded-t-xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#F1F0FB] rounded-md overflow-hidden">
                  <DashboardHeader avatarSrc="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png" />
                  
                  <div className="p-2 flex h-[94%] bg-[#F1F0FB]">
                    <SideNavigation onAmlDialogOpen={() => setOpenAmlDialog(true)} />
                    
                    <div className="flex-1 pl-1 flex flex-col gap-1">
                      <div className="h-4 flex justify-between items-center">
                        <div className="text-gray-800 text-[6px] sm:text-[8px] font-medium">Regulatory Intelligence Dashboard</div>
                        <div className="flex gap-2 items-center">
                          <div className="text-[5px] sm:text-[6px] text-gray-500">April 14, 2025</div>
                          <div className="flex items-center gap-1">
                            <div className="text-[5px] sm:text-[6px] text-gray-500">Hi, Phoebe Banks</div>
                            <img 
                              src="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png" 
                              alt="Phoebe Banks" 
                              className="w-3 h-3 rounded-full object-cover border border-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 h-[15%]">
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                          <div className="flex items-center gap-0.5">
                            <BadgeCheck size={6} className="text-blue-500" />
                            <div className="text-[5px] text-gray-600">Badges</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">12 New</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                          <div className="flex items-center gap-0.5">
                            <GamepadIcon size={6} className="text-purple-500" />
                            <div className="text-[5px] text-gray-600">Gamification</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">New Games</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                          <div className="flex items-center gap-0.5">
                            <Users size={6} className="text-amber-500" />
                            <div className="text-[5px] text-gray-600">Forum Activity</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">5 New</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 flex-1">
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer" onClick={() => setOpenAmlDialog(true)}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <ShieldAlert size={8} className="text-red-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">AMLD6 Penalty Analysis</div>
                              </div>
                              <div className="text-red-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-red-50 rounded-full">High Priority</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
                              <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">What is the Penalty under AMLD6 and criminal liability extension?</h3>
                              <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
                                One of the key aspects of AMLD6 is the aggressive expansion of liability to legal entities and company executives who aid and abet money laundering, either through negligence or deliberate actions. Penalties under AMLD6 are severe, and fines can reach into the hundreds of millions of euros. The AMLD6 has set a precedent for stricter AML oversight and amplified penalties.
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
                                  View Details
                                </Button>
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0">
                                  Ask Dara
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <Users size={8} className="text-blue-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Networking & Forum</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">Active Now</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-1 h-[80%] overflow-y-auto">
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-yellow-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">John D. - GDPR Forum</div>
                                  <div className="text-gray-500 text-[4px]">Looking for case studies</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Sarah M. - AMLD6 Group</div>
                                  <div className="text-gray-500 text-[4px]">Posted new resource</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-green-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Virtual Meetup - Apr 16</div>
                                  <div className="text-gray-500 text-[4px]">Compliance networking</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-purple-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Risk Officers - Discussion</div>
                                  <div className="text-gray-500 text-[4px]">14 new comments</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1">
                                <PieChart size={8} className="text-violet-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Regulatory Focus Areas</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">Distribution</div>
                            </div>
                            
                            <div className="h-[80%] flex">
                              <div className="w-2/3 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <ReChartPie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={15}
                                    outerRadius={25}
                                  >
                                    {pieChartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                  </ReChartPie>
                                </ResponsiveContainer>
                              </div>
                              <div className="w-1/3 flex flex-col justify-center space-y-0.5">
                                {pieChartData.map((entry, index) => (
                                  <div key={index} className="flex items-center text-[4px]">
                                    <div className="w-1 h-1 rounded-full mr-0.5" style={{ backgroundColor: entry.fill }}></div>
                                    <span className="text-gray-700">{entry.name}</span>
                                    <span className="ml-auto text-gray-500">{entry.value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <FileText size={8} className="text-blue-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Interview Preparation</div>
                              </div>
                              <div className="text-blue-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-blue-50 rounded-full">New</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
                              <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">Prepare for your GRC interview with our AI coach</h3>
                              <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
                                Practice answering common GRC interview questions with our AI coach. Receive instant feedback on your responses and tips to improve your delivery. Access industry-specific questions and adapt your answers to different compliance roles.
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
                                  Start Practice
                                </Button>
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0">
                                  Learn More
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Compliance Status Chart - Donut Chart */}
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1">
                                <PieChart size={8} className="text-indigo-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Compliance Risk Profile</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">Q2 2025</div>
                            </div>
                            
                            <div className="h-[80%] w-full relative">
                              <ResponsiveContainer width="100%" height="100%">
                                <ReChartPie
                                  data={donutPieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={20}
                                  outerRadius={30}
                                  startAngle={90}
                                  endAngle={-270}
                                >
                                  {donutPieData.map((entry, index) => (
                                    <Cell key={`donut-cell-${index}`} fill={entry.fill} />
                                  ))}
                                </ReChartPie>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-gray-800 text-[6px] font-bold">72</div>
                                  <div className="text-gray-500 text-[4px]">Score</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between mt-1 px-0.5">
                              {donutPieData.map((entry, index) => (
                                <div key={index} className="flex items-center text-[3px] sm:text-[4px]">
                                  <div className="w-1 h-1 rounded-full mr-0.5" style={{ backgroundColor: entry.fill }}></div>
                                  <span className="text-gray-700">{entry.name}</span>
                                  <span className="ml-1 text-gray-500">{entry.value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1">
                                <Cpu size={8} className="text-emerald-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Control Status</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">124 Total</div>
                            </div>
                            
                            <div className="h-[80%] flex items-center">
                              <div className="w-full flex flex-wrap gap-1 justify-center">
                                {controlStatusData.map((entry, index) => (
                                  <div key={index} className="flex items-center gap-1 px-1 py-0.5 bg-white rounded border border-gray-100">
                                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                                    <div className="text-[3px] sm:text-[4px] text-gray-700">{entry.name}</div>
                                    <div className="text-[3px] sm:text-[4px] font-medium">{entry.value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeatureGrid 
        onFeatureClick={handleFeatureClick}
        animate={animateFeatures}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          {selectedFeature !== null && (
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
            <DialogTitle>{amldInfo.title}</DialogTitle>
            <DialogDescription>
              {amldInfo.description}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div dangerouslySetInnerHTML={{ __html: amldInfo.content }} />
            
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
    </div>
  );
};

export default HeroSection;
