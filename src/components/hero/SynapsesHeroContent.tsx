import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import ExternalFormDialog from '../ExternalFormDialog';
import InviteDialog from '../InviteDialog';
import { DashboardHeroEmbed } from './DashboardHeroEmbed';
import { useIsMobile } from '@/hooks/use-mobile';

export const SynapsesHeroContent: React.FC = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Header Navigation - Exact match to image */}
      <nav className="w-full px-6 lg:px-12 py-5 flex items-center justify-between relative z-20">
        <div className="text-3xl font-bold text-blue-700 tracking-tight">
          Synapses
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="text-blue-700 hover:text-blue-800 transition-colors font-bold">Home</a>
          <a href="/partners" className="text-blue-700 hover:text-blue-800 transition-colors font-bold">Become a Partner</a>
          <a href="/resources/faq" className="text-blue-700 hover:text-blue-800 transition-colors font-bold">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-colors font-bold"
            onClick={() => setShowInviteDialog(true)}
          >
            Invite
          </Button>
          
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            onClick={() => setShowFormDialog(true)}
          >
            Get Early Access
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-blue-700 hover:bg-blue-50"
        >
          Menu
        </Button>
      </nav>

      {/* Hero Content - Exact match to image layout */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Headlines and CTAs matching image exactly */}
            <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
              {/* Main headline - Exact match to image */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
                <div className="flex flex-col">
                  <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Transform</span>
                  <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Your Expertise</span>
                  <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">With GRC</span>
                  <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">Agents</span>
                </div>
              </h1>
              
              {/* Subheadline - Exact match to image */}
              <p className="mt-4 text-base md:text-lg text-gray-700 max-w-md leading-relaxed font-normal">
                Join a global network of professionals to boost your expertise with GRC agents, exclusive testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
              </p>
              
              {/* Primary CTA Button - Exact match to image */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setShowFormDialog(true)}
                >
                  Get Early Access <ArrowRight size={16} />
                </Button>
              </div>

              {/* Trust indicators - Exact match to image */}
              <div className="mt-4 flex items-center text-sm text-gray-500 space-x-6">
                <span className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  GRC Innovation Hub
                </span>
                <span className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  Join early adopters in our private pilot
                </span>
              </div>
            </div>

            {/* Right side - Dashboard Embed (keep current production) */}
            <div className="flex-1 flex justify-center lg:justify-end w-full lg:w-auto mt-8 lg:mt-0 lg:max-w-2xl">
              <DashboardHeroEmbed className="w-full max-w-[600px] lg:max-w-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog} 
        title="Get Early Access"
      />
      
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </>
  );
};
