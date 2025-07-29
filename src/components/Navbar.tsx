import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ExternalFormDialog from './ExternalFormDialog';
import InviteDialog from './InviteDialog';

import { Menu, X } from 'lucide-react';

// Simple menu icons
const MenuIcon = () => <Menu className="w-5 h-5" />;
const CloseIcon = () => <X className="w-5 h-5" />;


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Smart hide/show functionality
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }

      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openFormDialog = () => {
    setShowFormDialog(true);
  };

  const openInviteDialog = () => {
    setShowInviteDialog(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Modern Glassmorphism Floating Header with Pill Navigation */}
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          isScrolled
            ? 'w-[96%] max-w-6xl'
            : 'w-[98%] max-w-7xl'
        }`}
      >
        {/* Main Navigation Container with Advanced Glassmorphism */}
        <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-black/10'
            : 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5'
        }`}>
          
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-50" />
          
          {/* Content Container */}
          <div className='relative flex items-center justify-between px-8 py-5'>
            
            {/* Logo with Enhanced Animation - Aligned with Transform text */}
            <motion.div 
              whileHover={{ 
                scale: 1.05,
                filter: 'brightness(1.1)'
              }} 
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
              className="ml-8"
            >
              <Link
                to='/'
                className='text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-500'
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                Synapses
              </Link>
            </motion.div>

            {/* Pill-Shaped Navigation Container */}
            <nav className='hidden lg:block absolute left-8'>
              <div className={`flex items-center gap-1 px-6 py-3 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-white/60 backdrop-blur-lg border border-white/40 shadow-lg'
                  : 'bg-white/40 backdrop-blur-md border border-white/25 shadow-md'
              }`}>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/agents', label: 'Agents' },
                  { to: '/nexus-agent', label: 'SFDR Navigator' },
                  { to: '/use-cases', label: 'Use Cases' },
                  { to: '/partners', label: 'Partners' },
                  { to: '/resources/faq', label: 'FAQ' }
                ].map((item) => (
                  <motion.div 
                    key={item.to}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }}
                    className="rounded-full"
                  >
                    <Link
                      to={item.to}
                      className='block px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-all duration-200 rounded-full hover:bg-white/60 backdrop-blur-sm'
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* CTA Buttons with Micro-Interactions */}
            <div className='hidden md:flex items-center gap-3'>
              <motion.div 
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }} 
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              >
                <Button
                  variant='outline'
                  size='sm'
                  onClick={openInviteDialog}
                  className='border-blue-200/80 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300 px-5 py-2.5 text-sm font-semibold rounded-full backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md'
                >
                  Invite
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                }} 
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              >
                <Button
                  size='sm'
                  onClick={openFormDialog}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0'
                >
                  Get Early Access
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className='lg:hidden'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={toggleMobileMenu}
                  className='text-slate-700 hover:text-blue-600 hover:bg-white/60 rounded-full p-3'
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </Button>
              </motion.div>
            </div>
            
          </div>
        </div>

        {/* Enhanced Mobile Menu with Glassmorphism */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className='lg:hidden mt-4'
            >
              <div className='bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl shadow-black/5 overflow-hidden'>
                <div className='px-6 py-6 space-y-1'>
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/agents', label: 'Agents' },
                    { to: '/nexus-agent', label: 'SFDR Navigator' },
                    { to: '/use-cases', label: 'Use Cases' },
                    { to: '/partners', label: 'Partners' },
                    { to: '/resources/faq', label: 'FAQ' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        className='block text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 py-3 px-4 rounded-xl transition-all duration-200'
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <div className='flex flex-col gap-3 pt-6 mt-6 border-t border-slate-200/60'>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl py-3'
                        onClick={() => {
                          openInviteDialog();
                          closeMobileMenu();
                        }}
                      >
                        Invite
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Button
                        size='sm'
                        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg'
                        onClick={() => {
                          openFormDialog();
                          closeMobileMenu();
                        }}
                      >
                        Get Early Access
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <ExternalFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        title='Get Early Access'
      />

      <InviteDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} />
    </>
  );
};

export default Navbar;
