
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ExternalFormDialog from '../ExternalFormDialog';
import InviteDialog from '../InviteDialog';
import { DashboardHeroEmbed } from './DashboardHeroEmbed';
import { USPFeatureSection } from '../features/USPFeatureSection';

export const SynapsesHeroContent: React.FC = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  return (
    <>
      {/* Hero Content - Main content section */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Headlines and CTAs with Stripe typography */}
            <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
              {/* Main headline - Stripe style typography */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                <div className="flex flex-col">
                  <span className="block">Transform</span>
                  <span className="block">Your Expertise</span>
                  <span className="block">With GRC</span>
                  <span className="block">Agents</span>
                </div>
              </h1>
              
              {/* Subheadline - Stripe style body text */}
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Join a global network of professionals to boost your expertise with GRC agents, exclusive testing of future solutions, comprehensive regulatory insights and personalized career resilience tools to upskill, adapt, and lead the way in shaping the future of GRC.
              </p>
              
              {/* Primary CTA Button - Stripe style */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 text-base rounded-lg"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  onClick={() => setShowFormDialog(true)}
                >
                  Get Early Access <ArrowRight size={18} />
                </Button>
              </div>

              {/* Trust indicators - Stripe style */}
              <div className="mt-6 flex items-center text-sm text-gray-600 space-x-6 font-medium" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  GRC Innovation Hub
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Join early adopters in our private pilot
                </span>
              </div>

              {/* USP Features positioned in hero as per image */}
              <div className="mt-12 pt-8">
                <USPFeatureSection />
              </div>
            </div>

            {/* Right side - Dashboard Embed */}
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
