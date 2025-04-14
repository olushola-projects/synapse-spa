
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WaitlistForm from "./WaitlistForm";
import { Link } from "react-router-dom";

const CTASection = () => {
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Left side: CTA text */}
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-900">
              Join the Regulatory Evolution with Synapses
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              Be among the first to experience the future of GRC infrastructure. Sign up for early access and stay updated on our launch.
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
            
            {/* Legal compliance status */}
            <div className="mt-10 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-bold mb-2">Current Compliance Status</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p>GDPR compliance in progress</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p>ISO 27001 certified</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p>SOC 2 compliance in progress</p>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                View our <Link to="/legal/security" className="text-blue-600 hover:underline">Security Policy</Link> to learn more.
              </div>
            </div>
          </div>
          
          {/* Right side: Waitlist form */}
          <div className="md:w-1/2 bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-center">Join Our Waitlist</h3>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
