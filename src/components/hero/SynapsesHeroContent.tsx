
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
      {/* Global Navigation - Stripe-inspired */}
      <nav className="w-full px-6 lg:px-12 py-5 flex items-center justify-between relative z-20">
        <div className="text-2xl font-semibold text-white tracking-tight">
          Synapses
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 font-medium px-4 py-2 h-10"
            onClick={() => setShowInviteDialog(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Invite Team
          </Button>
          
          <Button
            className="bg-white text-gray-900 hover:bg-gray-50 font-medium px-6 py-2 h-10 shadow-sm"
            onClick={() => setShowFormDialog(true)}
          >
            Start free trial
          </Button>
          
          <button className="text-white/80 hover:text-white transition-colors text-sm font-medium px-4 py-2">
            Sign in
          </button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:bg-white/10"
        >
          Menu
        </Button>
      </nav>

      {/* Hero Content - Stripe-inspired layout */}
      <header className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Headlines and CTAs */}
            <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
              {/* Main headline - Stripe typography style */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
                The GRC platform for ambitious teams
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl lg:text-2xl text-white/85 mb-8 leading-[1.4] font-normal max-w-2xl mx-auto lg:mx-0">
                From compliance automation to regulatory intelligence, Synapses helps you build the future of GRC—no matter your size or stage.
              </p>
              
              {/* Primary CTA Buttons - Stripe button style */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-50 font-medium px-8 py-4 h-12 text-base shadow-lg transition-all duration-200 rounded-md"
                  onClick={() => setShowFormDialog(true)}
                >
                  Start your integration
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/30 bg-transparent text-white hover:bg-white/10 font-medium px-8 py-4 h-12 text-base rounded-md"
                >
                  Contact sales
                </Button>
              </div>

              {/* Trust indicators - Stripe style */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Join 300+ teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Expert-built platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Enterprise ready</span>
                </div>
              </div>
            </div>

            {/* Right side - Dashboard Embed */}
            <div className="flex-1 flex justify-center lg:justify-end w-full lg:w-auto mt-8 lg:mt-0 lg:max-w-2xl">
              <DashboardHeroEmbed className="w-full max-w-[600px] lg:max-w-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog} 
        title="Start your free trial"
      />
      
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </>
  );
};
