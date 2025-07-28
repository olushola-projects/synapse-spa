import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExternalFormDialog from './ExternalFormDialog';
import InviteDialog from './InviteDialog';

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
      {/* Glassmorphism Floating Header with Smart Hide/Show */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5'
            : 'bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-black/3'
        }`}
      >
        <div className='flex items-center justify-between px-6 py-4'>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to='/'
              className='text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300'
            >
              Synapses
            </Link>
          </motion.div>

          {/* Pill-Shaped Navigation - Centered */}
          <nav className='hidden lg:flex items-center justify-center flex-1'>
            <div className='flex items-center bg-white/40 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20 shadow-inner'>
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.to}
                    className='px-4 py-2 mx-1 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/60 rounded-full transition-all duration-200 backdrop-blur-sm'
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className='hidden md:flex items-center gap-3'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openInviteDialog}
              className='cursor-pointer'
            >
              <Button
                variant='outline'
                className='border border-white/30 text-foreground bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all duration-200 font-medium px-6 py-2 rounded-full shadow-sm hover:shadow-md'
              >
                Invite
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={openFormDialog}
              className='cursor-pointer'
            >
              <Button className='bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200'>
                Get Early Access
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden hover:bg-white/20 rounded-full'
              onClick={toggleMobileMenu}
            >
              <AnimatePresence mode='wait'>
                {mobileMenuOpen ? (
                  <motion.div
                    key='close'
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className='h-5 w-5 text-foreground' />
                  </motion.div>
                ) : (
                  <motion.div
                    key='menu'
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className='h-5 w-5 text-foreground' />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='md:hidden bg-white/90 backdrop-blur-xl border-t border-white/20 rounded-b-2xl overflow-hidden'
            >
              <nav className='p-6 space-y-4'>
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
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.to}
                      onClick={closeMobileMenu}
                      className='block py-3 px-4 text-foreground hover:text-primary transition-colors font-medium rounded-xl hover:bg-white/40 backdrop-blur-sm'
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                <div className='pt-4 space-y-3'>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={openInviteDialog}
                    className='cursor-pointer'
                  >
                    <Button
                      variant='outline'
                      className='w-full border border-white/30 text-foreground bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all duration-200 font-medium rounded-xl'
                    >
                      Invite
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={openFormDialog}
                    className='cursor-pointer'
                  >
                    <Button className='w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-medium rounded-xl'>
                      Get Early Access
                    </Button>
                  </motion.div>
                </div>
              </nav>
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
