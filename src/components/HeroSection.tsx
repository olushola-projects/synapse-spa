
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, Bell, Briefcase, FileText, BarChart3, BookOpen, Clock, AlertTriangle, ShieldAlert, PieChart, Zap, Users, BookMarked, BadgeCheck, UserCheck, Compass } from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart as ReChartPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";

// Sample data for the colorful area chart
const areaChartData = [
  { name: 'Jan', gdpr: 30, aml: 40, psd2: 20, dora: 27 },
  { name: 'Feb', gdpr: 25, aml: 43, psd2: 25, dora: 30 },
  { name: 'Mar', gdpr: 32, aml: 38, psd2: 20, dora: 35 },
  { name: 'Apr', gdpr: 35, aml: 43, psd2: 30, dora: 38 },
  { name: 'May', gdpr: 30, aml: 48, psd2: 25, dora: 40 },
  { name: 'Jun', gdpr: 40, aml: 50, psd2: 35, dora: 43 },
];

// Sample data for the pie chart
const pieChartData = [
  { name: 'GDPR', value: 35, fill: '#4F46E5' },
  { name: 'AMLD6', value: 25, fill: '#EC4899' },
  { name: 'DORA', value: 20, fill: '#10B981' },
  { name: 'PSD2', value: 15, fill: '#F59E0B' },
  { name: 'NIS2', value: 5, fill: '#8B5CF6' },
];

// Feature icons configuration
const featureIcons = [
  { title: "Regulatory Analysis", icon: <MessageSquare className="text-synapse-primary" size={20} /> },
  { title: "Regulatory Calendar", icon: <Calendar className="text-purple-500" size={20} /> },
  { title: "Regulatory Updates", icon: <Bell className="text-blue-500" size={20} /> },
  { title: "CV Surgery", icon: <FileText className="text-emerald-500" size={20} /> },
  { title: "Job Matching", icon: <Briefcase className="text-amber-500" size={20} /> },
  { title: "Classes", icon: <BookOpen className="text-rose-500" size={20} /> },
];

const HeroSection = () => {
  // Animation states for staggered animations
  const [animateContent, setAnimateContent] = useState(false);
  const [animateImage, setAnimateImage] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);

  // Trigger animations on component mount
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

  return (
    <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-indigo-50"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-indigo-200/30 via-transparent to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-synapse-accent/10 rounded-full filter blur-3xl -z-10 animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-synapse-primary/10 rounded-full filter blur-3xl -z-10 animate-pulse-soft"></div>
      
      {/* Animated gradient background stripe-like */}
      <div className="absolute inset-x-0 top-40 h-[500px] -z-10 transform -skew-y-6 opacity-10">
        <div className="h-full w-full bg-gradient-stripe from-purple-300 via-blue-300 to-indigo-300 animate-gradient-shift"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content with animations */}
          <div className={`md:w-2/5 pb-10 md:pb-0 text-center md:text-left transition-all duration-700 ease-out ${animateContent ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
            <h1 className="heading-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              The Future of <span className="text-synapse-primary">GRC</span> is Connected
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Synapses empowers GRC professionals with intelligent tools, specialized knowledge, and a vibrant community to navigate complex regulatory landscapes.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="bg-synapse-primary hover:bg-synapse-secondary text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 hover-lift">
                Join Waitlist <ArrowRight size={18} />
              </Button>
              <Button variant="outline" className="border-synapse-primary text-synapse-primary hover:bg-synapse-primary/5 px-8 py-6 text-lg rounded-lg hover-lift">
                Learn More
              </Button>
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

            {/* Feature Icons with staggered animation */}
            <div className={`mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0 transition-all duration-700 ease-out ${animateFeatures ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
              {featureIcons.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-3 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md hover-lift transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero Image - GRC Platform Dashboard Mockup with animation */}
          <div className={`md:w-3/5 relative transition-all duration-700 ease-out ${animateImage ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <div className="relative w-full max-w-3xl mx-auto">
              {/* MacBook Pro Display with new image */}
              <div className="aspect-[16/10] mb-2 rounded-t-xl overflow-hidden shadow-2xl relative">
                {/* MacBook Pro Image */}
                <img 
                  src="/lovable-uploads/c5b1f529-364b-4a3f-9e4e-29fe1862e7b3.png" 
                  alt="MacBook Pro" 
                  className="w-full h-auto"
                />
                
                {/* Dashboard Screen Content - Positioned absolutely over the laptop image */}
                <div className="absolute top-[5%] left-[10%] right-[10%] bottom-[10%] bg-[#F1F0FB] rounded-md overflow-hidden">
                  {/* Header Bar */}
                  <div className="h-[6%] bg-white flex items-center px-3 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-gray-800 text-[8px] sm:text-xs font-medium">Synapses GRC Intelligence Platform</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-2 flex h-[94%] bg-[#F1F0FB]">
                    {/* Sidebar */}
                    <div className="w-[8%] h-full bg-white rounded-lg border border-gray-200 flex flex-col items-center py-2 gap-3">
                      <div className="w-[60%] h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-indigo-500 rounded-md"></div>
                      </div>
                      <div className="w-4 h-4 bg-indigo-500 rounded-md flex items-center justify-center">
                        <MessageSquare size={8} className="text-white" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Calendar size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Bell size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Briefcase size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center">
                        <BookOpen size={8} className="text-indigo-500" />
                      </div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-md flex items-center justify-center">
                        <ShieldAlert size={8} className="text-indigo-500" />
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 pl-1 flex flex-col gap-1">
                      {/* Header */}
                      <div className="h-4 flex justify-between items-center">
                        <div className="text-gray-800 text-[6px] sm:text-[8px] font-medium">Regulatory Intelligence Dashboard</div>
                        <div className="flex gap-2 items-center">
                          <div className="text-[5px] sm:text-[6px] text-gray-500">April 12, 2025</div>
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
                      
                      {/* KPI Row */}
                      <div className="flex gap-1 h-[15%]">
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-0.5">
                            <Clock size={6} className="text-blue-500" />
                            <div className="text-[5px] text-gray-600">Regulatory Updates</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">12 New</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-0.5">
                            <Calendar size={6} className="text-purple-500" />
                            <div className="text-[5px] text-gray-600">Compliance Deadlines</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">3 Due</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-0.5">
                            <MessageSquare size={6} className="text-emerald-500" />
                            <div className="text-[5px] text-gray-600">AI Assists Used</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">24 Today</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-0.5">
                            <AlertTriangle size={6} className="text-amber-500" />
                            <div className="text-[5px] text-gray-600">Risk Alerts</div>
                          </div>
                          <div className="text-gray-800 text-[8px] font-medium">5 High</div>
                          <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Main Widgets Area */}
                      <div className="flex gap-1 flex-1">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col gap-1">
                          {/* AMLD6 Content */}
                          <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm">
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
                          
                          {/* Calendar Widget */}
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm">
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

                          {/* Pie Chart */}
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm">
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
                        
                        {/* Right Column */}
                        <div className="flex-1 flex flex-col gap-1">
                          {/* DORA Content */}
                          <div className="flex-1 bg-white rounded-md p-1 border border-gray-100 shadow-sm">
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
                          
                          {/* Colorful Area Chart */}
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm">
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

                          {/* Job Matching */}
                          <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm">
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
              
              {/* Mobile App Mockup with animation */}
              <div className="absolute -right-6 -bottom-12 transform rotate-6 w-[120px] h-[240px] bg-white rounded-[18px] border-4 border-gray-200 shadow-xl overflow-hidden animate-float">
                {/* Status Bar */}
                <div className="h-4 bg-gray-100 flex justify-between items-center px-2 text-[6px] text-gray-800">
                  <span>9:41</span>
                  <div className="flex gap-0.5 items-center">
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                  </div>
                </div>
                
                {/* Mobile App Content */}
                <div className="p-1 bg-[#F1F0FB]">
                  {/* App Header */}
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
                  
                  {/* Dashboard Elements */}
                  <div className="space-y-1">
                    {/* Alert Widget */}
                    <div className="h-16 bg-red-50 rounded-md p-1 border border-red-100">
                      <div className="flex items-center gap-0.5 mb-0.5">
                        <ShieldAlert size={6} className="text-red-500" />
                        <div className="text-[5px] text-red-700 font-medium">AMLD6 Priority Alert</div>
                      </div>
                      <div className="h-10 rounded flex flex-col justify-center p-0.5">
                        <div className="text-[4px] text-gray-800 font-medium">Criminal Liability Extension</div>
                        <div className="text-[3px] text-gray-600 mt-0.5">Review recent updates to criminal liability provisions under AMLD6 that may affect your organization's compliance requirements.</div>
                      </div>
                    </div>
                    
                    {/* Calendar Item */}
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
    </div>
  );
};

export default HeroSection;
