import React from 'react';
import { NavbarDemo } from '@/components/ui/navbar-menu-demo';

/**
 * Test page to demonstrate the navbar menu component
 */
const NavbarMenuTest: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      {/* Navbar Demo */}
      <NavbarDemo />

      {/* Content to show the navbar overlay */}
      <div className='pt-32 px-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
            Synapses GRC Platform
          </h1>
          <p className='text-lg text-center text-gray-600 dark:text-gray-300 mb-12'>
            Experience our AI-powered navigation menu designed for GRC professionals. Hover over the
            menu items above to see the interactive dropdowns.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                AI-Powered Solutions
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Our navbar showcases AI agents specifically designed for GRC workflows, including
                SFDR Navigator, AML Investigator, and Risk Analyzer.
              </p>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                Smooth Animations
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Built with Framer Motion for fluid transitions and professional user experience that
                matches enterprise GRC platform standards.
              </p>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                React Router Integration
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Fully adapted for React Router navigation, ensuring seamless integration with your
                existing Synapses platform routing.
              </p>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              Component Features
            </h2>
            <ul className='text-left max-w-2xl mx-auto space-y-2 text-gray-600 dark:text-gray-300'>
              <li>✅ Fully TypeScript compatible</li>
              <li>✅ Tailwind CSS styling with custom shadow-input</li>
              <li>✅ React Router Link integration</li>
              <li>✅ Framer Motion animations</li>
              <li>✅ Dark mode support</li>
              <li>✅ GRC-focused menu structure</li>
              <li>✅ Responsive design</li>
              <li>✅ Accessibility features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarMenuTest;
