
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MessageSquare, Bell, Briefcase, GamepadIcon, Cpu, Users, Clock, AlertTriangle, ShieldAlert, PieChart, Zap, BadgeCheck, UserCheck, Compass, BookMarked, BarChart3, FileText } from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart as ReChartPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import JoinWaitlistDialog from "./JoinWaitlistDialog";

const areaChartData = [
  { name: 'Jan', gdpr: 30, aml: 40, psd2: 20, dora: 27 },
  { name: 'Feb', gdpr: 25, aml: 43, psd2: 25, dora: 30 },
  { name: 'Mar', gdpr: 32, aml: 38, psd2: 20, dora: 35 },
  { name: 'Apr', gdpr: 35, aml: 43, psd2: 30, dora: 38 },
  { name: 'May', gdpr: 30, aml: 48, psd2: 25, dora: 40 },
  { name: 'Jun', gdpr: 40, aml: 50, psd2: 35, dora: 43 },
];

const pieChartData = [
  { name: 'GDPR', value: 35, fill: '#4F46E5' },
  { name: 'AMLD6', value: 25, fill: '#EC4899' },
  { name: 'DORA', value: 20, fill: '#10B981' },
  { name: 'PSD2', value: 15, fill: '#F59E0B' },
  { name: 'NIS2', value: 5, fill: '#8B5CF6' },
];

// New chart data for donut pie chart
const donutPieData = [
  { name: 'High Risk', value: 22, fill: '#ef4444' },
  { name: 'Medium Risk', value: 38, fill: '#f97316' },
  { name: 'Low Risk', value: 40, fill: '#22c55e' },
];

// New control status data
const controlStatusData = [
  { name: 'In-Progress', value: 97, fill: '#cbd5e1' },
  { name: 'Cancelled', value: 1, fill: '#e2e8f0' },
  { name: 'On Approval', value: 7, fill: '#fdba74' },
  { name: 'Overdue', value: 19, fill: '#ef4444' },
];

// Updated feature icons to match the image
const featureIcons = [
  { title: "Regulatory Analysis", icon: <MessageSquare className="text-indigo-600" size={20} />, content: {
    title: "AI-Powered Regulatory Analysis",
    description: "Get instant insights on complex regulations with our advanced AI analysis tool.",
    details: "Our regulatory analysis tool uses natural language processing to break down complex legal text into actionable insights. It can compare regulations across jurisdictions, highlight key compliance requirements, and identify potential conflicts or gaps in your existing compliance framework."
  } },
  { title: "Regulatory Calendar", icon: <Calendar className="text-purple-500" size={20} />, content: {
    title: "Smart Regulatory Calendar",
    description: "Never miss important deadlines with our intelligent tracking system.",
    details: "Our calendar integrates with global regulatory databases to provide real-time updates on compliance deadlines, consultation periods, and implementation timelines. Set custom alerts, assign tasks to team members, and track progress all in one place."
  } },
  { title: "Regulatory Updates", icon: <Bell className="text-blue-500" size={20} />, content: {
    title: "Customized Regulatory Updates",
    description: "Stay informed with tailored alerts on regulatory changes relevant to your organization.",
    details: "Our regulatory update system monitors changes across multiple jurisdictions and sectors, filtering information based on your compliance profile. Receive daily or weekly digests, prioritized by impact level and organized by compliance domain."
  } },
  { title: "Job Matching", icon: <Briefcase className="text-emerald-500" size={20} />, content: {
    title: "Intelligent Job Matching",
    description: "Find the perfect role with our AI-powered matching algorithm and personalized career insights.",
    details: "Our job matching system goes beyond keywords to analyze your skills, experience, and career aspirations against the detailed requirements of open positions. Receive compatibility scores, salary insights, and personalized application advice for each opportunity."
  } },
  { title: "Games", icon: <GamepadIcon className="text-rose-500" size={20} />, content: {
    title: "Personalized GRC Games",
    description: "Learn compliance concepts through interactive individual and group gameplay.",
    details: "Our gamification platform offers personalized games for individual learning as well as group games for huddles, events, and ice breakers. Earn badges as you progress, turning complex compliance topics into engaging interactive experiences."
  } },
  { title: "AI Integration", icon: <Cpu className="text-amber-500" size={20} />, content: {
    title: "Advanced AI Integration",
    description: "Leverage cutting-edge AI to streamline compliance workflows and enhance decision making.",
    details: "Our AI integration capabilities allow you to automate routine compliance tasks, generate intelligent insights from regulatory data, and create predictive models to anticipate compliance risks before they materialize."
  } },
];

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
          <div className={`md:w-2/5 pb-10 md:pb-0 text-center md:text-left transition-all duration-700 ease-out ${animateContent ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
            <h1 className="heading-xl">
              <span className="inline-block relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent animate-text">
                <span className="animate-gradient-text">Become a Trusted Expert in the Age of AI-Driven GRC</span>
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Join a global network of professionals for exclusive beta testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <div onClick={openWaitlistDialog} className="cursor-pointer">
                <Button className="bg-synapse-primary hover:bg-synapse-secondary text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift">
                  Join Waitlist <ArrowRight size={18} />
                </Button>
              </div>
              <a href="#features" onClick={handleLearnMoreClick}>
                <Button variant="outline" className="border-synapse-primary text-synapse-primary hover:bg-synapse-primary/5 px-8 py-6 text-lg rounded-lg hover-lift">
                  Learn More
                </Button>
              </a>
            </div>
            
            <div className="mt-8 flex items-center justify-center md:justify-start text-sm text-gray-500">
              <span className="flex items-center mr-4">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                Early Access
              </span>
              <span className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                300+ Professionals Joined
              </span>
            </div>

            <div className={`mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0 transition-all duration-700 ease-out ${animateFeatures ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
              {featureIcons.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-3 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md hover-lift transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleFeatureClick(index)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`md:w-3/5 relative transition-all duration-700 ease-out ${animateImage ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="aspect-[16/10] mb-2 rounded-t-xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#F1F0FB] rounded-md overflow-hidden">
                  <div className="h-[6%] bg-white flex items-center px-3 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-gray-800 text-[8px] sm:text-xs font-medium">Synapses</div>
                  </div>
                  
                  <div className="p-2 flex h-[94%] bg-[#F1F0FB]">
                    <div className="w-[8%] h-full bg-white rounded-lg border border-gray-200 flex flex-col items-center py-2 gap-3">
                      <div className="w-[60%] h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-indigo-500 rounded-md"></div>
                      </div>
                      <div className="w-4 h-4 bg-indigo-500 rounded-md flex items-center justify-center cursor-pointer" onClick={() => setOpenAmlDialog(true)}>
                        <MessageSquare size={8} className="text-white" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer">
                        <Calendar size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-amber-500 rounded-md flex items-center justify-center cursor-pointer">
                        <Bell size={8} className="text-white" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer">
                        <Briefcase size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-green-500 rounded-md flex items-center justify-center cursor-pointer">
                        <GamepadIcon size={8} className="text-white" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer">
                        <ShieldAlert size={8} className="text-indigo-500" />
                      </div>
                    </div>
                    
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
                            <Bell size={6} className="text-blue-500" />
                            <div className="text-[5px] text-gray-600">Notification</div>
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
                            <AlertTriangle size={6} className="text-amber-500" />
                            <div className="text-[5px] text-gray-600">High Compliance Alert</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">5 High</div>
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
                                <Calendar size={8} className="text-blue-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Regulatory Calendar</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">This Week</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-1 h-[80%] overflow-y-auto">
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-yellow-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Apr 14 - GDPR Update</div>
                                  <div className="text-gray-500 text-[4px]">Review privacy policy changes</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Apr 15 - AMLD6 Deadline</div>
                                  <div className="text-gray-500 text-[4px]">Submit compliance report</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-green-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Apr 16 - Training</div>
                                  <div className="text-gray-500 text-[4px]">AML compliance workshop</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100">
                                <div className="w-1 h-1 rounded-full bg-purple-500 mt-0.5 mr-0.5"></div>
                                <div>
                                  <div className="text-gray-700 text-[5px] font-medium mb-0.5">Apr 18 - DORA Review</div>
                                  <div className="text-gray-500 text-[4px]">ESAs roadmap discussion</div>
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
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">SFDR Educational Game</div>
                              </div>
                              <div className="text-blue-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-blue-50 rounded-full">New</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
                              <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">Test your knowledge on Sustainable Finance Disclosure Regulation</h3>
                              <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
                                Our new interactive game helps you understand the complexities of SFDR through engaging scenarios and challenges. Complete the game to earn the 'SFDR Expert' badge and improve your competitive edge in sustainable finance compliance.
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
                                  Play Game
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
                                <BarChart3 size={8} className="text-indigo-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Compliance Risk Profile</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">Q2 2025</div>
                            </div>
                            
                            <div className="h-[80%] w-full">
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

                          {/* Control Status chart */}
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1">
                                <Users size={8} className="text-green-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Community Progress</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">Active Users</div>
                            </div>
                            
                            <div className="h-[80%] flex items-center">
                              <div className="w-full h-12">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={areaChartData}>
                                    <Line type="monotone" dataKey="gdpr" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="aml" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
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
      
      {/* Feature Dialog */}
      {selectedFeature !== null && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{featureIcons[selectedFeature].content.title}</DialogTitle>
              <DialogDescription>{featureIcons[selectedFeature].content.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700">{featureIcons[selectedFeature].content.details}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AML Dialog */}
      <Dialog open={openAmlDialog} onOpenChange={setOpenAmlDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{amldInfo.title}</DialogTitle>
            <DialogDescription>{amldInfo.description}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: amldInfo.content }} />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                Ask Dara
              </h4>
              <div className="text-sm text-gray-700 mb-3">What are the penalties under AMLD6?</div>
              {chatResponse ? (
                <div className="bg-white p-3 rounded-md text-sm text-gray-700 border border-gray-200">
                  {chatResponse}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Waitlist Dialog */}
      <JoinWaitlistDialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />
    </div>
  );
};

export default HeroSection;
