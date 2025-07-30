import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ExternalFormDialog from './ExternalFormDialog';
import InviteDialog from './InviteDialog';
import { Menu, X } from 'lucide-react';
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
  return <>
      {/* Modern Glassmorphism Floating Header with Pill Navigation */}
      <motion.header initial={{
      y: 0,
      opacity: 1
    }} animate={{
      y: isVisible ? 0 : -100,
      opacity: isVisible ? 1 : 0
    }} transition={{
      duration: 0.4
    }} className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${isScrolled ? 'w-[96%] max-w-6xl' : 'w-[98%] max-w-7xl'}`}>
        {/* Main Navigation Container with Advanced Glassmorphism */}
        <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${isScrolled ? 'bg-white/85 backdrop-blur-2xl border border-white/30 shadow-2xl shadow-black/10' : 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5'}`}>
          {/* Animated Background Gradient */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-50' />

          {/* Content Container */}
          
        </div>

        {/* Enhanced Mobile Menu with Glassmorphism */}
        <AnimatePresence>
          {mobileMenuOpen && <motion.div initial={{
          opacity: 0,
          height: 0,
          y: -20
        }} animate={{
          opacity: 1,
          height: 'auto',
          y: 0
        }} exit={{
          opacity: 0,
          height: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }} className='lg:hidden mt-4'>
              <div className='bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl shadow-black/5 overflow-hidden'>
                <div className='px-6 py-6 space-y-1'>
                  {[{
                to: '/',
                label: 'Home'
              }, {
                to: '/agents',
                label: 'Agents'
              }, {
                to: '/nexus-agent',
                label: 'SFDR Navigator'
              }, {
                to: '/use-cases',
                label: 'Use Cases'
              }, {
                to: '/partners',
                label: 'Partners'
              }, {
                to: '/resources/faq',
                label: 'FAQ'
              }].map((item, index) => <motion.div key={item.to} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.05
              }}>
                      <Link to={item.to} className='block text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 py-3 px-4 rounded-xl transition-all duration-200' onClick={closeMobileMenu}>
                        {item.label}
                      </Link>
                    </motion.div>)}

                  <div className='flex flex-col gap-3 pt-6 mt-6 border-t border-slate-200/60'>
                    <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.2
                }}>
                      <Button variant='outline' size='sm' className='w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl py-3' onClick={() => {
                    openInviteDialog();
                    closeMobileMenu();
                  }}>
                        Invite
                      </Button>
                    </motion.div>
                    <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.25
                }}>
                      <Button size='sm' className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg' onClick={() => {
                    openFormDialog();
                    closeMobileMenu();
                  }}>
                        Get Early Access
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </motion.header>

      <ExternalFormDialog open={showFormDialog} onOpenChange={setShowFormDialog} title='Get Early Access' />

      <InviteDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} />
    </>;
};
export default Navbar;