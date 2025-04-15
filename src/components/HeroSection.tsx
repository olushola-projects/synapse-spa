
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MessageSquare, Bell, Briefcase, FileText, BarChart3, BookOpen, Clock, AlertTriangle, ShieldAlert, PieChart, Zap, Users, BookMarked, BadgeCheck, UserCheck, Compass } from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart as ReChartPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

const featureIcons = [
  { title: "Regulatory Analysis", icon: <MessageSquare className="text-synapse-primary" size={20} />, content: {
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
  { title: "CV Surgery", icon: <FileText className="text-emerald-500" size={20} />, content: {
    title: "Professional CV Enhancement",
    description: "Optimize your career profile with expert guidance from GRC specialists.",
    details: "Our CV Surgery service combines AI analysis with human expertise to help you present your GRC skills and experience in the most effective way. Get personalized feedback, industry-specific terminology suggestions, and formatting advice tailored to regulatory compliance roles."
  } },
  { title: "Job Matching", icon: <Briefcase className="text-amber-500" size={20} />, content: {
    title: "Intelligent Job Matching",
    description: "Find the perfect role with our AI-powered matching algorithm.",
    details: "Our job matching system goes beyond keywords to analyze your skills, experience, and career aspirations against the detailed requirements of open positions. Receive compatibility scores, salary insights, and personalized application advice for each opportunity."
  } },
  { title: "Classes", icon: <BookOpen className="text-rose-500" size={20} />, content: {
    title: "Specialized GRC Training",
    description: "Enhance your expertise with courses designed by industry leaders.",
    details: "Our training platform offers courses ranging from foundational compliance knowledge to advanced regulatory strategy. All content is developed by practicing GRC experts, updated regularly to reflect regulatory changes, and presented in engaging, interactive formats."
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
              <span className="inline-block animate-text bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
                GRC Infrastructure for Modern Professionals
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Join a global network of professionals using Synapses to navigate regulations, adopt regtech, grow careers, connect with mentors, leverage artificial intelligence, and future-proof compliance operations.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="#cta">
                <Button className="bg-synapse-primary hover:bg-synapse-secondary text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift">
                  Join Waitlist <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" className="border-synapse-primary text-synapse-primary hover:bg-synapse-primary/5 px-8 py-6 text-lg rounded-lg hover-lift">
                  Learn More
                </Button>
              </Link>
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
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer">
                        <Bell size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer">
                        <Briefcase size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center cursor-pointer">
                        <BookOpen size={8} className="text-indigo-500" />
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
                            <Clock size={6} className="text-blue-500" />
                            <div className="text-[5px] text-gray-600">Regulatory Updates</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">12 New</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                          <div className="flex items-center gap-0.5">
                            <Calendar size={6} className="text-purple-500" />
                            <div className="text-[5px] text-gray-600">Compliance Deadlines</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">3 Due</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                          <div className="flex items-center gap-0.5">
                            <MessageSquare size={6} className="text-emerald-500" />
                            <div className="text-[5px] text-gray-600">AI Assists Used</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">24 Today</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                          <div className="flex items-center gap-0.5">
                            <AlertTriangle size={6} className="text-amber-500" />
                            <div className="text-[5px] text-gray-600">Risk Alerts</div>
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
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">DORA Regulatory Update</div>
                              </div>
                              <div className="text-blue-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-blue-50 rounded-full">New</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-md p-1 border border-gray-100">
                              <h3 className="text-gray-800 text-[5px] sm:text-[6px] font-bold mb-0.5">The ESAs provide a roadmap towards the designation of CTPPs under DORA</h3>
                              <p className="text-gray-600 text-[4px] sm:text-[5px] leading-tight">
                                The European Supervisory Authorities (ESAs) have published their joint roadmap outlining the process and timeline for designating Critical Third-Party Providers (CTPPs) under the Digital Operational Resilience Act (DORA). Financial entities should review this roadmap to understand how their third-party technology partners may be affected.
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 px-1 py-0">
                                  View Report
                                </Button>
                                <Button variant="outline" size="sm" className="h-3 text-[4px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200 px-1 py-0">
                                  Impact Analysis
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1">
                                <BarChart3 size={8} className="text-indigo-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Regulatory Compliance Trends</div>
                              </div>
                              <div className="text-gray-500 text-[4px] sm:text-[5px]">H1 2025</div>
                            </div>
                            
                            <div className="h-[80%] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="gdpr" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="aml" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="dora" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="psd2" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="name" tick={{ fontSize: 4 }} />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="gdpr" stroke="#4F46E5" fillOpacity={1} fill="url(#gdpr)" />
                                  <Area type="monotone" dataKey="aml" stroke="#EC4899" fillOpacity={1} fill="url(#aml)" />
                                  <Area type="monotone" dataKey="dora" stroke="#10B981" fillOpacity={1} fill="url(#dora)" />
                                  <Area type="monotone" dataKey="psd2" stroke="#F59E0B" fillOpacity={1} fill="url(#psd2)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between mt-0.5 px-0.5">
                              <div className="flex items-center text-[3px] sm:text-[4px]">
                                <div className="w-1 h-1 bg-indigo-500 rounded-full mr-0.5"></div>
                                <span className="text-gray-500">GDPR</span>
                              </div>
                              <div className="flex items-center text-[3px] sm:text-[4px]">
                                <div className="w-1 h-1 bg-pink-500 rounded-full mr-0.5"></div>
                                <span className="text-gray-500">AMLD6</span>
                              </div>
                              <div className="flex items-center text-[3px] sm:text-[4px]">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full mr-0.5"></div>
                                <span className="text-gray-500">DORA</span>
                              </div>
                              <div className="flex items-center text-[3px] sm:text-[4px]">
                                <div className="w-1 h-1 bg-amber-500 rounded-full mr-0.5"></div>
                                <span className="text-gray-500">PSD2</span>
                              </div>
                            </div>
                          </div>

                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <Briefcase size={8} className="text-purple-500" />
                                <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Job Opportunities</div>
                              </div>
                              <div className="text-purple-500 text-[4px] sm:text-[5px] px-1 py-0.5 bg-purple-50 rounded-full">Tailored</div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-1 h-[80%] overflow-y-auto">
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
                                <div className="flex-shrink-0 w-3 h-3 bg-blue-100 rounded-sm flex items-center justify-center mr-1">
                                  <UserCheck size={6} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-gray-800 text-[5px] font-medium">GRC Manager - Fintech</div>
                                  <div className="text-gray-500 text-[4px] flex items-center justify-between">
                                    <span>London • £90k-£110k</span>
                                    <span className="bg-green-100 text-green-700 px-0.5 rounded text-[3px]">95% Match</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-sm flex items-start p-1 border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors">
                                <div className="flex-shrink-0 w-3 h-3 bg-purple-100 rounded-sm flex items-center justify-center mr-1">
                                  <BadgeCheck size={6} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-gray-800 text-[5px] font-medium">Compliance Director - Banking</div>
                                  <div className="text-gray-500 text-[4px] flex items-center justify-between">
                                    <span>Remote • £120k-£150k</span>
                                    <span className="bg-green-100 text-green-700 px-0.5 rounded text-[3px]">90% Match</span>
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
              
              <div className="absolute -right-6 -bottom-12 transform rotate-6 w-[120px] h-[240px] bg-white rounded-[18px] border-4 border-gray-200 shadow-xl overflow-hidden animate-float">
                <div className="h-4 bg-gray-100 flex justify-between items-center px-2 text-[6px] text-gray-800">
                  <span>9:41</span>
                  <div className="flex gap-0.5 items-center">
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                  </div>
                </div>
                
                <div className="p-1 bg-[#F1F0FB]">
                  <div className="h-4 flex justify-between items-center mb-1">
                    <div className="h-2 w-12 bg-indigo-500 rounded-sm flex items-center justify-center">
                      <span className="text-[5px] text-white">SYNAPSES</span>
                    </div>
                    <img 
                      src="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png" 
                      alt="User" 
                      className="w-3 h-3 rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="h-10 bg-red-50 rounded-md p-1 border border-red-100">
                      <div className="flex items-center gap-0.5 mb-0.5">
                        <ShieldAlert size={6} className="text-red-500" />
                        <div className="text-[5px] text-red-700 font-medium">AMLD6 Priority Alert</div>
                      </div>
                      <div className="h-6 rounded flex flex-col justify-center p-0.5">
                        <div className="text-[4px] text-gray-800 font-medium">Criminal Liability Extension</div>
                        <div className="text-[3px] text-gray-600 mt-0.5">Review recent updates to criminal liability provisions.</div>
                      </div>
                    </div>
                    
                    <div className="h-14 bg-white rounded-md p-1 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-0.5">
                          <BarChart3 size={6} className="text-indigo-500" />
                          <div className="text-[5px] text-indigo-700 font-medium">Compliance Trends</div>
                        </div>
                      </div>
                      <div className="h-8 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={areaChartData.slice(0,4)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="mobilegdpr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="mobileaml" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="gdpr" stroke="#4F46E5" fillOpacity={1} fill="url(#mobilegdpr)" />
                            <Area type="monotone" dataKey="aml" stroke="#EC4899" fillOpacity={1} fill="url(#mobileaml)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="h-10 bg-white rounded-md p-1 border border-gray-100">
                      <div className="flex items-center gap-0.5 mb-0.5">
                        <Calendar size={6} className="text-blue-500" />
                        <div className="text-[5px] text-blue-700 font-medium">Upcoming Deadline</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[4px] text-gray-800 font-medium">AMLD6 Report</div>
                          <div className="text-[3px] text-gray-600">Due in 3 days</div>
                        </div>
                        <Button size="sm" className="h-2 text-[3px] bg-blue-500 hover:bg-blue-600 text-white px-1 py-0">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {selectedFeature !== null && featureIcons[selectedFeature] && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${selectedFeature === 0 ? 'bg-blue-100 text-blue-600' : 
                                    selectedFeature === 1 ? 'bg-purple-100 text-purple-600' : 
                                    selectedFeature === 2 ? 'bg-blue-100 text-blue-600' : 
                                    selectedFeature === 3 ? 'bg-emerald-100 text-emerald-600' : 
                                    selectedFeature === 4 ? 'bg-amber-100 text-amber-600' : 
                                    'bg-rose-100 text-rose-600'}`}>
                  {featureIcons[selectedFeature].icon}
                </div>
                <DialogTitle>{featureIcons[selectedFeature].content.title}</DialogTitle>
              </div>
              <DialogDescription>
                {featureIcons[selectedFeature].content.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">{featureIcons[selectedFeature].content.details}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-sm mb-2">Coming in Beta Release</h4>
                <p className="text-sm text-gray-600">This feature will be available in our upcoming beta release. Join the waitlist to be among the first to try it out.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Close</Button>
                <Button>Join Waitlist</Button>
              </div>
            </div>
          </>
        )}
      </Dialog>

      <Dialog open={openAmlDialog} onOpenChange={setOpenAmlDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <DialogTitle>{amldInfo.title}</DialogTitle>
            </div>
            <DialogDescription>
              {amldInfo.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Dara AI Assistant</h4>
                <p className="text-xs text-gray-500">Regulatory Intelligence Bot</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-gray-700 text-sm">What is the penalty under AMLD6 and criminal liability extension?</p>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 text-gray-800 text-sm">
                {chatResponse || (
                  <div className="flex gap-2 items-center h-6">
                    <div className="h-2 w-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0ms]"></div>
                    <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]"></div>
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:300ms]"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div dangerouslySetInnerHTML={{ __html: amldInfo.content }} className="prose prose-sm max-w-none" />
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-600" /> AI-Generated Analysis
              </h4>
              <p className="text-sm text-gray-700">Synapses has analyzed 248 sources including the official AMLD6 directive, legal commentaries, and recent enforcement actions to provide this summary. Our AI continuously monitors for updates to ensure you have the most current information.</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Calendar className="h-3 w-3" />
                <span>Last updated: April 12, 2025</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">Save to Library</Button>
                <Button>Ask Follow-up Question</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default HeroSection;
