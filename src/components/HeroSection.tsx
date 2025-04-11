
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-white/5 rounded-md"></div>
                    ))}
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 pl-3 flex flex-col gap-3">
                    {/* Header */}
                    <div className="h-8 flex justify-between items-center">
                      <div className="text-white text-sm font-medium">Regulatory Dashboard</div>
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* KPI Row */}
                    <div className="flex gap-2 h-[60px]">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-lg p-2">
                          <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                          <div className="h-3 w-10 bg-white/30 rounded"></div>
                          <div className="h-2 w-full mt-2 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Main Widgets Area */}
                    <div className="flex gap-3 flex-1">
                      {/* Left Column */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex-1 bg-white/5 rounded-lg p-3">
                          <div className="h-2 w-20 bg-white/20 rounded mb-3"></div>
                          <div className="flex-1 h-20 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center relative">
                              <div className="h-12 w-12 flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#4338CA30" strokeWidth="10" />
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="62.8" transform="rotate(-90 50 50)" />
                                </svg>
                                <div className="absolute text-xs text-white">75%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-36 bg-white/5 rounded-lg p-3">
                          <div className="h-2 w-20 bg-white/20 rounded mb-2"></div>
                          <div className="grid grid-cols-2 gap-2 h-[80px]">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="bg-white/10 rounded-md flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-indigo-400/50"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="h-40 bg-white/5 rounded-lg p-3">
                          <div className="h-2 w-20 bg-white/20 rounded mb-4"></div>
                          <div className="flex justify-between h-[80px]">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-[15%] bg-gradient-to-t from-teal-500/20 to-teal-500/60 rounded-sm" style={{ height: `${20 + i * 15}%` }}></div>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg p-3">
                          <div className="h-2 w-20 bg-white/20 rounded mb-2"></div>
                          <div className="flex gap-1 flex-wrap">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="h-6 flex-1 min-w-[60px] bg-white/10 rounded-md flex items-center px-2">
                                <div className="h-2 w-full bg-white/20 rounded"></div>
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
                    {/* Chart */}
                    <div className="h-24 bg-white/5 rounded-lg p-2">
                      <div className="h-1.5 w-10 bg-white/20 rounded-sm mb-2"></div>
                      <div className="h-14 bg-gradient-to-r from-teal-500/30 to-blue-500/30 rounded flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full border-2 border-teal-400 border-t-transparent"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Alert Cards */}
                    <div className="h-20 bg-white/5 rounded-lg p-2">
                      <div className="flex justify-between mb-1">
                        <div className="h-1.5 w-12 bg-white/20 rounded-sm"></div>
                        <div className="h-1.5 w-4 bg-white/20 rounded-sm"></div>
                      </div>
                      
                      <div className="space-y-1.5">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-6 px-1.5 bg-white/10 rounded flex justify-between items-center">
                            <div className="h-1.5 w-8 bg-white/20 rounded-sm"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom Tabs */}
                    <div className="h-6 bg-black/30 rounded-lg mt-auto flex justify-around items-center">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-3 h-3 bg-white/20 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-3 -rotate-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-xs">
                    !
                  </div>
                  <div>
                    <p className="font-medium text-xs">Compliance Alert</p>
                    <p className="text-[10px] text-gray-500">GDPR update requires action</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Labels */}
              <div className="absolute top-1/4 -right-24 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-12 bg-indigo-400"></div>
                  <div className="text-xs font-medium text-indigo-600">Advanced AI Orchestration</div>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -left-24 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-indigo-600">Enterprise Innovation</div>
                  <div className="h-0.5 w-12 bg-indigo-400"></div>
                </div>
              </div>
              
              <div className="absolute -right-36 bottom-12 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-12 bg-indigo-400"></div>
                  <div className="text-xs font-medium text-indigo-600">Multi Device Access</div>
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
