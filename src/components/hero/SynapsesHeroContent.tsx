
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
      {/* Global Navigation */}
      <nav className="w-full px-6 lg:px-10 py-4 flex items-center justify-between relative z-20">
        <div className="text-2xl font-bold text-white tracking-tight">
          Synapses
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-12"
            onClick={() => setShowInviteDialog(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Invite Team
          </Button>
          
          <Button
            className="bg-white text-gray-900 hover:bg-gray-100 font-medium h-12"
            onClick={() => setShowFormDialog(true)}
          >
            Enterprise Demo
          </Button>
          
          <button className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            Sign in
          </button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white"
        >
          Menu
        </Button>
      </nav>

      {/* Hero Content */}
      <header className="flex-1 flex items-center justify-center px-6 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-4">
            {/* Left side - Headlines and CTAs */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-4">
                Synapses
                <br />
                <span className="font-extrabold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  The Agentic Hub for GRC Professionals
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Activate AI agents, track regulations, and earn badges—built by compliance experts, for compliance experts.
              </p>
              
              {/* Primary CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-6">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 h-12 text-base shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => setShowFormDialog(true)}
                >
                  Get Early Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-6 h-12 text-base transition-all duration-200"
                >
                  Learn More
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/70 text-sm">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  300+ Early Adopters
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  AI-Powered Insights
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Expert-Built Platform
                </span>
              </div>
            </div>

            {/* Right side - Dashboard Embed */}
            <div className="flex-1 flex justify-center lg:justify-end w-full lg:w-auto mt-4 lg:mt-0">
              <DashboardHeroEmbed className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[65vw] lg:max-w-[960px]" />
            </div>
          </div>
        </div>
      </header>

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
