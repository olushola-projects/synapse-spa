
import React, { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import WaitlistForm from "./WaitlistForm";

const CTASection = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  return (
    <div id="cta" className="py-20 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-blue-50"></div>
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8e9ac2,#d8b5c1,#f5d2ae,#d8b5c1,#8e9ac2)] animate-gradient-x"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-20 w-96 h-96 rounded-full bg-blue-200 opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-20 w-96 h-96 rounded-full bg-purple-200 opacity-20 blur-3xl -z-10"></div>
      <div className="absolute top-3/4 right-1/3 w-64 h-64 rounded-full bg-indigo-200 opacity-20 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Left side: CTA text */}
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-900">
              Join the Regulatory Evolution with Synapses
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              Become a trusted expert in the age of AI-driven Governance, Risk, and Compliance. Be among the first to experience the future of GRC infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <ArrowRight size={14} className="text-green-600" />
                </div>
                <p className="ml-3 text-gray-600">Access to AI-powered regulatory insights</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <ArrowRight size={14} className="text-green-600" />
                </div>
                <p className="ml-3 text-gray-600">Connect with GRC professionals</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <ArrowRight size={14} className="text-green-600" />
                </div>
                <p className="ml-3 text-gray-600">Exclusive early access to features</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <ArrowRight size={14} className="text-green-600" />
                </div>
                <p className="ml-3 text-gray-600">Influence product development</p>
              </div>
            </div>
          </div>
          
          {/* Right side: Waitlist form (collapsed by default) */}
          <div className="md:w-1/2 bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-center">Join Our Waitlist</h3>
            
            {isFormExpanded ? (
              <>
                <WaitlistForm />
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full flex items-center justify-center text-gray-500"
                  onClick={toggleForm}
                >
                  Collapse Form <ChevronUp className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Work Email
                      </label>
                      <div className="relative">
                        <input
                          id="email" 
                          type="email" 
                          placeholder="you@company.com" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  type="button" 
                  className="w-full bg-blue-700 hover:bg-blue-800 py-6 text-white"
                  onClick={toggleForm}
                >
                  <span className="flex items-center justify-center">
                    Complete Registration <ArrowRight className="ml-2" size={18} />
                  </span>
                </Button>
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-center text-gray-500"
                    onClick={toggleForm}
                  >
                    View Full Form <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            
            <p className="text-xs text-center text-gray-500 mt-4">
              By joining, you agree to our <a href="/legal/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
