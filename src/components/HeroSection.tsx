
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, Bell, Briefcase, FileText, BarChart3, BookOpen, Clock, AlertTriangle, ShieldAlert } from "lucide-react";

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
              Synapse empowers GRC professionals with intelligent tools, specialized knowledge, and a vibrant community to navigate complex regulatory landscapes.
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
              {/* Main Dashboard Display */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 relative">
                {/* Header Bar */}
                <div className="h-10 bg-gray-800 flex items-center px-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-white text-sm font-medium">Synapse GRC Intelligence Platform</div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-4 flex h-full">
                  {/* Sidebar */}
                  <div className="w-[80px] h-full bg-indigo-900/40 rounded-lg flex flex-col items-center py-4 gap-6">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-indigo-400 rounded-md"></div>
                    </div>
                    <div className="w-8 h-8 bg-indigo-500/30 rounded-md flex items-center justify-center">
                      <MessageSquare size={16} className="text-white/90" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                      <Calendar size={16} className="text-white/80" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                      <Bell size={16} className="text-white/80" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                      <Briefcase size={16} className="text-white/80" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                      <BookOpen size={16} className="text-white/80" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                      <ShieldAlert size={16} className="text-white/80" />
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 pl-4 flex flex-col gap-4">
                    {/* Header */}
                    <div className="h-8 flex justify-between items-center">
                      <div className="text-white text-base font-medium">Regulatory Intelligence Dashboard</div>
                      <div className="flex gap-2 items-center">
                        <div className="text-xs text-white/50">April 12, 2025</div>
                        <div className="w-7 h-7 bg-indigo-500/30 rounded-full flex items-center justify-center text-sm text-white">JD</div>
                      </div>
                    </div>
                    
                    {/* KPI Row */}
                    <div className="flex gap-3 h-[70px]">
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-blue-400" />
                          <div className="text-xs text-white/70">Regulatory Updates</div>
                        </div>
                        <div className="text-white text-lg font-medium mt-1">12 New</div>
                        <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} className="text-purple-400" />
                          <div className="text-xs text-white/70">Compliance Deadlines</div>
                        </div>
                        <div className="text-white text-lg font-medium mt-1">3 Due</div>
                        <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare size={16} className="text-emerald-400" />
                          <div className="text-xs text-white/70">AI Assists Used</div>
                        </div>
                        <div className="text-white text-lg font-medium mt-1">24 Today</div>
                        <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle size={16} className="text-amber-400" />
                          <div className="text-xs text-white/70">Risk Alerts</div>
                        </div>
                        <div className="text-white text-lg font-medium mt-1">5 High</div>
                        <div className="h-1.5 w-full mt-2 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Main Widgets Area */}
                    <div className="flex gap-4 flex-1">
                      {/* Left Column */}
                      <div className="flex-1 flex flex-col gap-4">
                        {/* AMLD6 Content */}
                        <div className="flex-1 bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <ShieldAlert size={18} className="text-red-400" />
                              <div className="text-white text-base font-medium">AMLD6 Penalty Analysis</div>
                            </div>
                            <div className="text-white/40 text-xs px-2 py-1 bg-red-500/20 rounded-full">High Priority</div>
                          </div>
                          
                          <div className="bg-black/20 rounded-lg p-3">
                            <h3 className="text-white text-sm font-bold mb-2">What is the Penalty under AMLD6 and criminal liability extension?</h3>
                            <p className="text-white/80 text-xs leading-relaxed">
                              One of the key aspects of AMLD6 is the aggressive expansion of liability to legal entities and company executives who aid and abet money laundering, either through negligence or deliberate actions. Penalties under AMLD6 are severe, and fines can reach into the hundreds of millions of euros. The AMLD6 has set a precedent for stricter AML oversight and amplified penalties.
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-0">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-indigo-500/30 hover:bg-indigo-500/40 text-white border-0">
                                Ask Dara
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Calendar Widget */}
                        <div className="h-[160px] bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar size={18} className="text-blue-400" />
                              <div className="text-white text-base font-medium">Regulatory Calendar</div>
                            </div>
                            <div className="text-white/40 text-xs">This Week</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 h-[100px] overflow-y-auto">
                            <div className="bg-white/10 rounded-md flex items-start p-2.5">
                              <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 mr-2"></div>
                              <div>
                                <div className="text-white/90 text-xs font-medium mb-1">Apr 14 - GDPR Update</div>
                                <div className="text-white/60 text-[10px]">Review privacy policy changes</div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-md flex items-start p-2.5">
                              <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 mr-2"></div>
                              <div>
                                <div className="text-white/90 text-xs font-medium mb-1">Apr 15 - AMLD6 Deadline</div>
                                <div className="text-white/60 text-[10px]">Submit compliance report</div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-md flex items-start p-2.5">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 mr-2"></div>
                              <div>
                                <div className="text-white/90 text-xs font-medium mb-1">Apr 16 - Training</div>
                                <div className="text-white/60 text-[10px]">AML compliance workshop</div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-md flex items-start p-2.5">
                              <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 mr-2"></div>
                              <div>
                                <div className="text-white/90 text-xs font-medium mb-1">Apr 18 - DORA Review</div>
                                <div className="text-white/60 text-[10px]">ESAs roadmap discussion</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="flex-1 flex flex-col gap-4">
                        {/* DORA Content */}
                        <div className="flex-1 bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileText size={18} className="text-blue-400" />
                              <div className="text-white text-base font-medium">DORA Regulatory Update</div>
                            </div>
                            <div className="text-white/40 text-xs px-2 py-1 bg-blue-500/20 rounded-full">New</div>
                          </div>
                          
                          <div className="bg-black/20 rounded-lg p-3">
                            <h3 className="text-white text-sm font-bold mb-2">The ESAs provide a roadmap towards the designation of CTPPs under DORA</h3>
                            <p className="text-white/80 text-xs leading-relaxed">
                              The European Supervisory Authorities (ESAs) have published their joint roadmap outlining the process and timeline for designating Critical Third-Party Providers (CTPPs) under the Digital Operational Resilience Act (DORA). Financial entities should review this roadmap to understand how their third-party technology partners may be affected.
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-0">
                                View Report
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-indigo-500/30 hover:bg-indigo-500/40 text-white border-0">
                                Impact Analysis
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Compliance Metrics */}
                        <div className="h-[160px] bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <BarChart3 size={18} className="text-teal-400" />
                              <div className="text-white text-base font-medium">Compliance Metrics</div>
                            </div>
                            <div className="text-white/40 text-xs">April 2025</div>
                          </div>
                          
                          <div className="flex justify-between items-end h-[80px] pt-2">
                            {[85, 60, 75, 90, 40].map((height, i) => (
                              <div key={i} className="w-[15%] relative group">
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">
                                  {height}%
                                </div>
                                <div className="w-full bg-gradient-to-t from-teal-500/20 to-teal-500/60 rounded-sm" style={{ height: `${height}%` }}></div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2">
                            {["AMLD6", "DORA", "GDPR", "PCI", "MiFID"].map((text, i) => (
                              <div key={i} className="text-[10px] text-white/50">{text}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile App Mockup */}
              <div className="absolute -right-8 -bottom-16 transform rotate-6 w-[160px] h-[320px] bg-gray-900 rounded-[24px] border-4 border-gray-700 shadow-xl overflow-hidden">
                {/* Status Bar */}
                <div className="h-6 bg-black flex justify-between items-center px-2.5 text-[8px] text-white">
                  <span>9:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                
                {/* Mobile App Content */}
                <div className="p-2">
                  {/* App Header */}
                  <div className="h-6 flex justify-between items-center mb-2">
                    <div className="h-3 w-16 bg-indigo-500/50 rounded-sm flex items-center justify-center">
                      <span className="text-[8px] text-white">Synapse GRC</span>
                    </div>
                    <div className="w-5 h-5 bg-indigo-500/30 rounded-full flex items-center justify-center">
                      <span className="text-[8px] text-white">JD</span>
                    </div>
                  </div>
                  
                  {/* Dashboard Elements */}
                  <div className="space-y-2">
                    {/* Alert Widget */}
                    <div className="h-20 bg-red-500/10 rounded-lg p-2 border border-red-500/20">
                      <div className="flex items-center gap-1 mb-1">
                        <ShieldAlert size={10} className="text-red-400" />
                        <div className="text-[8px] text-white/90 font-medium">AMLD6 Priority Alert</div>
                      </div>
                      <div className="h-11 rounded flex flex-col justify-center p-1">
                        <div className="text-[7px] text-white/90 font-medium">Criminal Liability Extension</div>
                        <div className="text-[6px] text-white/70 mt-0.5 leading-tight">
                          Penalties under AMLD6 are severe, and fines can reach into the hundreds of millions of euros. Review compliance measures immediately.
                        </div>
                      </div>
                    </div>
                    
                    {/* DORA Update */}
                    <div className="h-20 bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                      <div className="flex items-center gap-1 mb-1">
                        <FileText size={10} className="text-blue-400" />
                        <div className="text-[8px] text-white/90 font-medium">DORA Update</div>
                      </div>
                      
                      <div className="text-[7px] text-white/90 font-medium">ESAs Roadmap for CTPPs</div>
                      <div className="text-[6px] text-white/70 mt-0.5 leading-tight">
                        The European Supervisory Authorities have published their joint roadmap for Critical Third-Party Providers designation under DORA.
                      </div>
                    </div>
                    
                    {/* Calendar Widget */}
                    <div className="h-16 bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar size={10} className="text-purple-400" />
                        <div className="text-[8px] text-white/90 font-medium">Today's Deadlines</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="h-4 px-1.5 bg-white/10 rounded flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500/70 mr-1"></div>
                          <div className="text-[6px] text-white/90">AMLD6 Compliance Report Due</div>
                          <div className="ml-auto text-[6px] text-white/50">Today</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Tabs */}
                    <div className="h-8 bg-black/30 rounded-lg mt-auto flex justify-around items-center">
                      <MessageSquare size={12} className="text-purple-400" />
                      <Calendar size={12} className="text-white/40" />
                      <Bell size={12} className="text-white/40" />
                      <ShieldAlert size={12} className="text-white/40" />
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
