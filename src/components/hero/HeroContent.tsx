import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users } from 'lucide-react';

// Simple icon components
const ArrowRightIcon = () => <ArrowRight className='w-4 h-4' />;
const ShieldIcon = () => <Shield className='w-4 h-4' />;
const UsersIcon = () => <Users className='w-4 h-4' />;
interface HeroContentProps {
  animate: boolean;
  onGetAccess: () => void;
  onInvite: () => void;
}

/**
 * HeroContent component - Main hero section content with improved alignment and visual hierarchy
 * Features precise logo alignment, enhanced typography, and professional GRC-focused messaging
 */
export const HeroContent: React.FC<HeroContentProps> = ({ animate, onGetAccess, onInvite }) => {
  return (
    <div
      className={`w-full text-left transition-all duration-700 ease-out pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 pb-10 md:pb-0 ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}
    >
      {/* Main Headline - Increased font sizing to big 4 for better alignment */}
      <h1
        style={{
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          textShadow: '0 1px 2px rgba(37, 99, 235, 0.1)'
        }}
        className='text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-blue-600 mb-6 font-medium lg:text-7xl'
      >
        Transform
        <br />
        Your Expertise
        <br />
        <span className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent'>
          With GRC Agents
        </span>
      </h1>

      {/* Enhanced subtitle with reduced sizing and width */}
      <p className='mt-6 text-sm md:text-base max-w-2xl leading-relaxed text-black font-light lg:text-base'>
        Join a global network of GRC professionals leveraging AI agents
        <br />
        for compliance excellence. Access exclusive testing of future
        <br />
        solutions, comprehensive regulatory insights, and personalized
        <br />
        career resilience tools to{' '}
        <span className='font-semibold text-blue-600'>upskill, adapt, and lead</span> the
        <br />
        transformation of governance, risk, and compliance.
      </p>

      {/* Enhanced CTA section with secondary action */}
      <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-start items-start'>
        <div onClick={onGetAccess} className='cursor-pointer'>
          <Button className='bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 '>
            Get Early Access <ArrowRightIcon />
          </Button>
        </div>
        <div onClick={onInvite} className='cursor-pointer'>
          <Button
            variant='outline'
            className='border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 text-base rounded-xl font-semibold hover-lift transition-all duration-300'
          >
            Invite Colleagues
          </Button>
        </div>
      </div>

      {/* Enhanced trust indicators with better visual hierarchy */}
      <div className='mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-6 text-sm'>
        <div className='flex items-center text-slate-500'>
          <div className='w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse'></div>
          <div className='mr-2 text-green-600'>
            <ShieldIcon />
          </div>
          <span className='font-medium'>GRC Innovation Hub</span>
        </div>
        <div className='flex items-center text-slate-500'>
          <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
          <div className='mr-2 text-blue-600'>
            <UsersIcon />
          </div>
          <span className='font-medium'>Join early adopters in our private pilot</span>
        </div>
      </div>
    </div>
  );
};
