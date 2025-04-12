
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, Bell, Briefcase, FileText, BarChart3, BookOpen, Clock, AlertTriangle, ShieldAlert, PieChart } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the colorful chart
const chartData = [
  { name: 'Jan', gdpr: 30, aml: 40, psd2: 20, dora: 27 },
  { name: 'Feb', gdpr: 25, aml: 43, psd2: 25, dora: 30 },
  { name: 'Mar', gdpr: 32, aml: 38, psd2: 20, dora: 35 },
  { name: 'Apr', gdpr: 35, aml: 43, psd2: 30, dora: 38 },
  { name: 'May', gdpr: 30, aml: 48, psd2: 25, dora: 40 },
  { name: 'Jun', gdpr: 40, aml: 50, psd2: 35, dora: 43 },
];

const HeroSection = () => {
  return (
    <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-indigo-50"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-indigo-200/30 via-transparent to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-synapse-accent/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-synapse-primary/10 rounded-full filter blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="md:w-2/5 pb-10 md:pb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              The Future of <span className="text-synapse-primary">GRC</span> is Connected
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
              SYNAPSES empowers GRC professionals with intelligent tools, specialized knowledge, and a vibrant community to navigate complex regulatory landscapes.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="text-white bg-synapse-primary hover:bg-synapse-secondary px-8 py-6 text-lg rounded-lg flex items-center gap-2">
                Join Waitlist <ArrowRight size={18} />
              </Button>
              <Button variant="outline" className="border-synapse-primary text-synapse-primary hover:bg-synapse-primary/5 px-8 py-6 text-lg rounded-lg">
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
          </div>
          
          {/* Hero Image - GRC Platform Dashboard Mockup */}
          <div className="md:w-3/5 relative">
            <div className="relative w-full max-w-2xl mx-auto">
              {/* MacBook Pro Display */}
              <div className="aspect-video mb-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl overflow-hidden shadow-2xl border-8 border-gray-800">
                {/* MacBook Screen Content */}
                <div className="aspect-[16/10] bg-[#F1F0FB] rounded-lg overflow-hidden border border-gray-200 relative">
                  {/* Header Bar */}
                  <div className="h-10 bg-white flex items-center px-3 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-gray-800 text-sm font-medium">SYNAPSES GRC Intelligence Platform</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-4 flex h-full bg-[#F1F0FB]">
                    {/* Sidebar */}
                    <div className="w-[80px] h-full bg-white rounded-lg border border-gray-200 flex flex-col items-center py-4 gap-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 bg-indigo-500 rounded-md"></div>
                      </div>
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <MessageSquare size={16} className="text-white" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Calendar size={16} className="text-indigo-500" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Bell size={16} className="text-indigo-500" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Briefcase size={16} className="text-indigo-500" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                        <BookOpen size={16} className="text-indigo-500" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                        <ShieldAlert size={16} className="text-indigo-500" />
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 pl-4 flex flex-col gap-4">
                      {/* Header */}
                      <div className="h-8 flex justify-between items-center">
                        <div className="text-gray-800 text-base font-medium">Regulatory Intelligence Dashboard</div>
                        <div className="flex gap-3 items-center">
                          <div className="text-xs text-gray-500">April 12, 2025</div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-500">Hi, Phoebe Banks</div>
                            <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-sm text-white">PB</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* KPI Row */}
                      <div className="flex gap-3 h-[70px]">
                        <div className="flex-1 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-blue-500" />
                            <div className="text-xs text-gray-600">Regulatory Updates</div>
                          </div>
                          <div className="text-gray-800 text-lg font-medium mt-1">12 New</div>
                          <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-purple-500" />
                            <div className="text-xs text-gray-600">Compliance Deadlines</div>
                          </div>
                          <div className="text-gray-800 text-lg font-medium mt-1">3 Due</div>
                          <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <MessageSquare size={16} className="text-emerald-500" />
                            <div className="text-xs text-gray-600">AI Assists Used</div>
                          </div>
                          <div className="text-gray-800 text-lg font-medium mt-1">24 Today</div>
                          <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle size={16} className="text-amber-500" />
                            <div className="text-xs text-gray-600">Risk Alerts</div>
                          </div>
                          <div className="text-gray-800 text-lg font-medium mt-1">5 High</div>
                          <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Main Widgets Area */}
                      <div className="flex gap-4 flex-1">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col gap-4">
                          {/* AMLD6 Content */}
                          <div className="flex-1 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <ShieldAlert size={18} className="text-red-500" />
                                <div className="text-gray-800 text-base font-medium">AMLD6 Penalty Analysis</div>
                              </div>
                              <div className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded-full">High Priority</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                              <h3 className="text-gray-800 text-sm font-bold mb-2">What is the Penalty under AMLD6 and criminal liability extension?</h3>
                              <p className="text-gray-600 text-xs leading-relaxed">
                                One of the key aspects of AMLD6 is the aggressive expansion of liability to legal entities and company executives who aid and abet money laundering, either through negligence or deliberate actions. Penalties under AMLD6 are severe, and fines can reach into the hundreds of millions of euros. The AMLD6 has set a precedent for stricter AML oversight and amplified penalties.
                              </p>
                              <div className="mt-3 flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200">
                                  View Details
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200">
                                  Ask Dara
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Calendar Widget */}
                          <div className="h-[180px] bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-blue-500" />
                                <div className="text-gray-800 text-base font-medium">Regulatory Calendar</div>
                              </div>
                              <div className="text-gray-500 text-xs">This Week</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 h-[120px] overflow-y-auto">
                              <div className="bg-gray-50 rounded-md flex items-start p-2.5 border border-gray-100">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-2"></div>
                                <div>
                                  <div className="text-gray-700 text-xs font-medium mb-1">Apr 14 - GDPR Update</div>
                                  <div className="text-gray-500 text-[10px]">Review privacy policy changes</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-md flex items-start p-2.5 border border-gray-100">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                                <div>
                                  <div className="text-gray-700 text-xs font-medium mb-1">Apr 15 - AMLD6 Deadline</div>
                                  <div className="text-gray-500 text-[10px]">Submit compliance report</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-md flex items-start p-2.5 border border-gray-100">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></div>
                                <div>
                                  <div className="text-gray-700 text-xs font-medium mb-1">Apr 16 - Training</div>
                                  <div className="text-gray-500 text-[10px]">AML compliance workshop</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-md flex items-start p-2.5 border border-gray-100">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2"></div>
                                <div>
                                  <div className="text-gray-700 text-xs font-medium mb-1">Apr 18 - DORA Review</div>
                                  <div className="text-gray-500 text-[10px]">ESAs roadmap discussion</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="flex-1 flex flex-col gap-4">
                          {/* DORA Content */}
                          <div className="flex-1 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" />
                                <div className="text-gray-800 text-base font-medium">DORA Regulatory Update</div>
                              </div>
                              <div className="text-blue-500 text-xs px-2 py-1 bg-blue-50 rounded-full">New</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                              <h3 className="text-gray-800 text-sm font-bold mb-2">The ESAs provide a roadmap towards the designation of CTPPs under DORA</h3>
                              <p className="text-gray-600 text-xs leading-relaxed">
                                The European Supervisory Authorities (ESAs) have published their joint roadmap outlining the process and timeline for designating Critical Third-Party Providers (CTPPs) under the Digital Operational Resilience Act (DORA). Financial entities should review this roadmap to understand how their third-party technology partners may be affected.
                              </p>
                              <div className="mt-3 flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200">
                                  View Report
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200">
                                  Impact Analysis
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Colorful Chart */}
                          <div className="h-[180px] bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <BarChart3 size={18} className="text-indigo-500" />
                                <div className="text-gray-800 text-base font-medium">Regulatory Compliance Trends</div>
                              </div>
                              <div className="text-gray-500 text-xs">H1 2025</div>
                            </div>
                            
                            <div className="h-[120px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                                  <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="gdpr" stroke="#4F46E5" fillOpacity={1} fill="url(#gdpr)" />
                                  <Area type="monotone" dataKey="aml" stroke="#EC4899" fillOpacity={1} fill="url(#aml)" />
                                  <Area type="monotone" dataKey="dora" stroke="#10B981" fillOpacity={1} fill="url(#dora)" />
                                  <Area type="monotone" dataKey="psd2" stroke="#F59E0B" fillOpacity={1} fill="url(#psd2)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between mt-1 px-1">
                              <div className="flex items-center text-[9px]">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></div>
                                <span className="text-gray-500">GDPR</span>
                              </div>
                              <div className="flex items-center text-[9px]">
                                <div className="w-2 h-2 bg-pink-500 rounded-full mr-1"></div>
                                <span className="text-gray-500">AMLD6</span>
                              </div>
                              <div className="flex items-center text-[9px]">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                                <span className="text-gray-500">DORA</span>
                              </div>
                              <div className="flex items-center text-[9px]">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                                <span className="text-gray-500">PSD2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* MacBook Stand */}
              <div className="h-3 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-xl mx-auto w-1/3"></div>
              
              {/* Mobile App Mockup */}
              <div className="absolute -right-8 -bottom-16 transform rotate-6 w-[160px] h-[320px] bg-white rounded-[24px] border-4 border-gray-200 shadow-xl overflow-hidden">
                {/* Status Bar */}
                <div className="h-6 bg-gray-100 flex justify-between items-center px-2.5 text-[8px] text-gray-800">
                  <span>9:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  </div>
                </div>
                
                {/* Mobile App Content */}
                <div className="p-2 bg-[#F1F0FB]">
                  {/* App Header */}
                  <div className="h-6 flex justify-between items-center mb-2">
                    <div className="h-3 w-16 bg-indigo-500 rounded-sm flex items-center justify-center">
                      <span className="text-[8px] text-white">SYNAPSES GRC</span>
                    </div>
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] text-white">PB</span>
                    </div>
                  </div>
                  
                  {/* Dashboard Elements */}
                  <div className="space-y-2">
                    {/* Alert Widget */}
                    <div className="h-20 bg-red-50 rounded-lg p-2 border border-red-100">
                      <div className="flex items-center gap-1 mb-1">
                        <ShieldAlert size={10} className="text-red-500" />
                        <div className="text-[8px] text-red-700 font-medium">AMLD6 Priority Alert</div>
                      </div>
                      <div className="h-11 rounded flex flex-col justify-center p-1">
                        <div className="text-[7px] text-gray-800 font-medium">Criminal Liability Extension</div>
                        <div className="text-[6px] text-gray-600 mt-0.5 leading-tight">
                          Penalties under AMLD6 are severe, and fines can reach into the hundreds of millions of euros. Review compliance measures immediately.
                        </div>
                      </div>
                    </div>
                    
                    {/* DORA Update */}
                    <div className="h-20 bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <div className="flex items-center gap-1 mb-1">
                        <FileText size={10} className="text-blue-500" />
                        <div className="text-[8px] text-blue-700 font-medium">DORA Update</div>
                      </div>
                      
                      <div className="text-[7px] text-gray-800 font-medium">ESAs Roadmap for CTPPs</div>
                      <div className="text-[6px] text-gray-600 mt-0.5 leading-tight">
                        The European Supervisory Authorities have published their joint roadmap for Critical Third-Party Providers designation under DORA.
                      </div>
                    </div>
                    
                    {/* Calendar Widget */}
                    <div className="h-16 bg-white rounded-lg p-2 border border-gray-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar size={10} className="text-purple-500" />
                        <div className="text-[8px] text-gray-800 font-medium">Today's Deadlines</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="h-4 px-1.5 bg-gray-50 rounded flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1"></div>
                          <div className="text-[6px] text-gray-700">AMLD6 Compliance Report Due</div>
                          <div className="ml-auto text-[6px] text-gray-500">Today</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Tabs */}
                    <div className="h-8 bg-white rounded-lg mt-auto flex justify-around items-center border border-gray-100">
                      <MessageSquare size={12} className="text-purple-500" />
                      <Calendar size={12} className="text-gray-400" />
                      <Bell size={12} className="text-gray-400" />
                      <ShieldAlert size={12} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Regulatory Alert */}
              <div className="absolute -top-8 -left-8 bg-white rounded-xl shadow-lg p-3 -rotate-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Urgent AMLD6 Alert</p>
                    <p className="text-xs text-gray-500">Criminal liability extension requires action</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Labels with more detailed text */}
              <div className="absolute top-1/3 -right-32 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-14 bg-indigo-400"></div>
                  <div className="text-sm font-medium text-indigo-600">Real-time Regulatory Analysis</div>
                </div>
              </div>
              
              <div className="absolute bottom-1/3 -left-32 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-indigo-600">Compliance Calendar & Alerts</div>
                  <div className="h-0.5 w-14 bg-indigo-400"></div>
                </div>
              </div>
              
              <div className="absolute -right-44 bottom-16 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-14 bg-indigo-400"></div>
                  <div className="text-sm font-medium text-indigo-600">Mobile Regulatory Intelligence</div>
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
