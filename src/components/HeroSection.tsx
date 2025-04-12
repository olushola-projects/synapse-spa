
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, Bell, Briefcase, FileText, BarChart3, BookOpen, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-indigo-50"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-indigo-200/30 via-transparent to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-synapse-accent/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-synapse-primary/10 rounded-full filter blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="md:w-1/2 pb-10 md:pb-0 text-center md:text-left">
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
          <div className="md:w-1/2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Dashboard Display */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 relative">
                {/* Header Bar */}
                <div className="h-8 bg-gray-800 flex items-center px-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-3 flex h-full">
                  {/* Sidebar */}
                  <div className="w-[80px] h-full bg-indigo-900/40 rounded-lg flex flex-col items-center py-4 gap-6">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-indigo-400 rounded-md"></div>
                    </div>
                    <div className="w-8 h-8 bg-white/30 rounded-md flex items-center justify-center">
                      <MessageSquare size={16} className="text-white/80" />
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
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 pl-3 flex flex-col gap-3">
                    {/* Header */}
                    <div className="h-8 flex justify-between items-center">
                      <div className="text-white text-sm font-medium">Regulatory Intelligence Dashboard</div>
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* KPI Row */}
                    <div className="flex gap-2 h-[60px]">
                      <div className="flex-1 bg-white/5 rounded-lg p-2">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-blue-400" />
                          <div className="h-2 w-16 bg-white/20 rounded text-xs text-white/60">Updates</div>
                        </div>
                        <div className="h-3 w-10 bg-white/30 rounded mt-1 text-xs text-white font-medium">12 New</div>
                        <div className="h-2 w-full mt-2 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-purple-400" />
                          <div className="h-2 w-16 bg-white/20 rounded text-xs text-white/60">Deadlines</div>
                        </div>
                        <div className="h-3 w-10 bg-white/30 rounded mt-1 text-xs text-white font-medium">3 Due</div>
                        <div className="h-2 w-full mt-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-2">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-emerald-400" />
                          <div className="h-2 w-16 bg-white/20 rounded text-xs text-white/60">AI Assists</div>
                        </div>
                        <div className="h-3 w-10 bg-white/30 rounded mt-1 text-xs text-white font-medium">24 Used</div>
                        <div className="h-2 w-full mt-2 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-lg p-2">
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-amber-400" />
                          <div className="h-2 w-16 bg-white/20 rounded text-xs text-white/60">Jobs</div>
                        </div>
                        <div className="h-3 w-10 bg-white/30 rounded mt-1 text-xs text-white font-medium">5 Matches</div>
                        <div className="h-2 w-full mt-2 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Main Widgets Area */}
                    <div className="flex gap-3 flex-1">
                      {/* Left Column */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex-1 bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare size={16} className="text-indigo-400" />
                              <div className="text-white text-xs font-medium">AI Assistant</div>
                            </div>
                            <div className="text-white/40 text-[10px]">Ask Dara</div>
                          </div>
                          
                          <div className="flex-1 h-20 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center p-2">
                            <div className="bg-black/30 rounded-lg p-2 w-full">
                              <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                  <div className="h-2 w-3/4 bg-white/20 rounded mb-1"></div>
                                  <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                                </div>
                              </div>
                              <div className="mt-2 h-px bg-white/10 w-full"></div>
                              <div className="mt-2 h-2 w-full bg-white/5 rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="h-36 bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={16} className="text-blue-400" />
                              <div className="text-white text-xs font-medium">Regulatory Calendar</div>
                            </div>
                            <div className="text-white/40 text-[10px]">This Week</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 h-[80px]">
                            <div className="bg-white/10 rounded-md flex items-start p-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1 mr-1.5"></div>
                              <div>
                                <div className="h-2 w-12 bg-white/30 rounded mb-1"></div>
                                <div className="h-1.5 w-20 bg-white/20 rounded"></div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-md flex items-start p-2">
                              <div className="w-2 h-2 rounded-full bg-red-400 mt-1 mr-1.5"></div>
                              <div>
                                <div className="h-2 w-12 bg-white/30 rounded mb-1"></div>
                                <div className="h-1.5 w-20 bg-white/20 rounded"></div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-md flex items-start p-2">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-1 mr-1.5"></div>
                              <div>
                                <div className="h-2 w-12 bg-white/30 rounded mb-1"></div>
                                <div className="h-1.5 w-20 bg-white/20 rounded"></div>
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-md flex items-start p-2">
                              <div className="w-2 h-2 rounded-full bg-purple-400 mt-1 mr-1.5"></div>
                              <div>
                                <div className="h-2 w-12 bg-white/30 rounded mb-1"></div>
                                <div className="h-1.5 w-20 bg-white/20 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="h-40 bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <BarChart3 size={16} className="text-teal-400" />
                              <div className="text-white text-xs font-medium">Compliance Metrics</div>
                            </div>
                            <div className="text-white/40 text-[10px]">Monthly</div>
                          </div>
                          
                          <div className="flex justify-between items-end h-[80px] pt-4">
                            {[65, 40, 75, 50, 60].map((height, i) => (
                              <div key={i} className="w-[15%] bg-gradient-to-t from-teal-500/20 to-teal-500/60 rounded-sm" style={{ height: `${height}%` }}></div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2">
                            {["GDPR", "PCI", "SOX", "HIPAA", "AML"].map((text, i) => (
                              <div key={i} className="text-[8px] text-white/50">{text}</div>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <FileText size={16} className="text-amber-400" />
                              <div className="text-white text-xs font-medium">Daily Insights</div>
                            </div>
                            <div className="text-white/40 text-[10px]">5 New</div>
                          </div>
                          
                          <div className="space-y-1.5">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-6 px-2 bg-white/10 rounded flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-red-400" : i === 2 ? "bg-yellow-400" : "bg-blue-400"}`}></div>
                                  <div className="h-1.5 w-24 bg-white/20 rounded-sm"></div>
                                </div>
                                <div className="h-1.5 w-6 bg-white/10 rounded-sm"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile App Mockup */}
              <div className="absolute -right-6 -bottom-12 transform rotate-6 w-[140px] h-[280px] bg-gray-900 rounded-[24px] border-4 border-gray-700 shadow-xl overflow-hidden">
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
                  <div className="h-4 flex justify-between items-center mb-2">
                    <div className="h-2 w-8 bg-indigo-500/50 rounded-sm"></div>
                    <div className="w-4 h-4 bg-white/10 rounded-full"></div>
                  </div>
                  
                  {/* Dashboard Elements */}
                  <div className="space-y-2">
                    {/* Chat with Dara */}
                    <div className="h-24 bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <MessageSquare size={8} className="text-purple-400" />
                        <div className="h-1.5 w-12 bg-white/20 rounded-sm text-[6px] text-white">Dara</div>
                      </div>
                      <div className="h-14 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded flex flex-col justify-center p-1.5">
                        <div className="flex gap-1 items-start mb-1">
                          <div className="w-3 h-3 rounded-full bg-purple-500/30 flex-shrink-0"></div>
                          <div className="h-1 w-full bg-white/20 rounded-sm"></div>
                        </div>
                        <div className="h-1 w-3/4 bg-white/10 rounded-sm ml-4 mb-1"></div>
                        <div className="h-1 w-1/2 bg-white/10 rounded-sm ml-4"></div>
                        <div className="h-3 mt-1 flex">
                          <div className="h-1 w-full bg-white/5 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Regulatory Alerts */}
                    <div className="h-20 bg-white/5 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Bell size={8} className="text-amber-400" />
                        <div className="h-1.5 w-16 bg-white/20 rounded-sm text-[6px] text-white">Alerts</div>
                      </div>
                      
                      <div className="space-y-1.5">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-6 px-1.5 bg-white/10 rounded flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <div className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-red-500/50" : "bg-yellow-500/50"}`}></div>
                              <div className="h-1 w-12 bg-white/20 rounded-sm"></div>
                            </div>
                            <div className="h-1 w-6 bg-white/10 rounded-sm"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom Tabs */}
                    <div className="h-6 bg-black/30 rounded-lg mt-auto flex justify-around items-center">
                      <MessageSquare size={10} className="text-purple-400" />
                      <Calendar size={10} className="text-white/40" />
                      <Bell size={10} className="text-white/40" />
                      <Briefcase size={10} className="text-white/40" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Compliance Alert */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-3 -rotate-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Compliance Alert</p>
                    <p className="text-[10px] text-gray-500">GDPR update requires action</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Labels */}
              <div className="absolute top-1/3 -right-28 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-12 bg-indigo-400"></div>
                  <div className="text-xs font-medium text-indigo-600">AI-Powered Analysis</div>
                </div>
              </div>
              
              <div className="absolute bottom-1/3 -left-28 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-indigo-600">Regulatory Calendar</div>
                  <div className="h-0.5 w-12 bg-indigo-400"></div>
                </div>
              </div>
              
              <div className="absolute -right-40 bottom-12 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-12 bg-indigo-400"></div>
                  <div className="text-xs font-medium text-indigo-600">Mobile Compliance Access</div>
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
