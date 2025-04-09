
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
          
          {/* Hero Image */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-video bg-gradient-to-br from-synapse-primary to-synapse-secondary rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-6">
                    <div className="text-3xl font-bold mb-2">Synapse</div>
                    <div className="text-lg opacity-80">GRC Intelligence Platform</div>
                    <div className="mt-4 flex justify-center">
                      <Button variant="default" className="bg-white/30 hover:bg-white/40 backdrop-blur-sm">
                        Preview Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 rotate-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Regulatory Alert</p>
                    <p className="text-xs text-gray-500">New compliance update</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -left-6 bg-white rounded-xl shadow-lg p-4 -rotate-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">D</div>
                  <div>
                    <p className="font-medium text-sm">Dara AI</p>
                    <p className="text-xs text-gray-500">Your GRC copilot</p>
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
