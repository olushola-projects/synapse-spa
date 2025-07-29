import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ExternalFormDialog from './ExternalFormDialog';
import InviteDialog from './InviteDialog';

// Enterprise-grade animated icons with accessibility support
const MenuIcon = () => (
  <lord-icon
    src="https://cdn.lordicon.com/msoeawqm.json"
    trigger="hover"
    style={{width: '20px', height: '20px'}}
    aria-label="Open navigation menu"
  ></lord-icon>
);

const CloseIcon = () => (
  <lord-icon
    src="https://cdn.lordicon.com/nqtddedc.json"
    trigger="hover"
    style={{width: '20px', height: '20px'}}
    aria-label="Close navigation menu"
  ></lord-icon>
);

// Trust indicators for enterprise credibility
const TrustBadge = () => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    <span className="font-medium">SOC 2 Certified</span>
  </div>
);

// Navigation structure following enterprise information architecture
const navigationStructure = {
  solutions: {
    label: 'Solutions',
    items: [
      { to: '/agents', label: 'AI Agents', description: 'Intelligent automation solutions' },
      { to: '/nexus-agent', label: 'SFDR Navigator', description: 'Regulatory compliance platform' },
      { to: '/use-cases', label: 'Use Cases', description: 'Industry applications' }
    ]
  },
  company: {
    label: 'Company',
    items: [
      { to: '/partners', label: 'Partners', description: 'Strategic alliances' },
      { to: '/resources/faq', label: 'Resources', description: 'Knowledge center' }
    ]
  }
};

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
        <div className='flex items-center px-6 py-4 max-w-7xl mx-auto w-full'>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link
              to='/'
              className='text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300'
            >
              Synapses
            </Link>
          </motion.div>

          {/* Menu Links Container */}
          <nav className='hidden lg:flex items-center flex-1'>
            <div className='flex items-center gap-8'>
              {[
                { to: '/', label: 'Home' },
                { to: '/agents', label: 'Agents' },
                { to: '/nexus-agent', label: 'SFDR Navigator' },
                { to: '/use-cases', label: 'Use Cases' },
                { to: '/partners', label: 'Partners' },
                { to: '/resources/faq', label: 'FAQ' }
              ].map(item => (
                <motion.div key={item.to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.to}
                    className='text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-200 py-2 line-height-1.2'
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* CTA Buttons Container */}
          <div className='hidden md:flex items-center gap-4 ml-auto'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant='outline'
                size='sm'
                className='border-primary/20 text-primary hover:bg-primary/10 px-4 py-2 text-sm font-medium'
              >
                Invite
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size='sm'
                className='bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white px-4 py-2 text-sm font-medium'
              >
                Get Early Access
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden ml-auto'>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleMobileMenu}
              className='text-foreground/80 hover:text-foreground'
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='lg:hidden border-t border-border/20 bg-background/95 backdrop-blur-sm'
            >
              <div className='px-6 py-4 space-y-4'>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/agents', label: 'Agents' },
                  { to: '/nexus-agent', label: 'SFDR Navigator' },
                  { to: '/use-cases', label: 'Use Cases' },
                  { to: '/partners', label: 'Partners' },
                  { to: '/resources/faq', label: 'FAQ' }
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className='block text-sm font-medium text-foreground/80 hover:text-foreground py-2'
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className='flex flex-col gap-3 pt-4 border-t border-border/20'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full border-primary/20 text-primary hover:bg-primary/10'
                    onClick={openInviteDialog}
                  >
                    Invite
                  </Button>
                  <Button
                    size='sm'
                    className='w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white'
                    onClick={openFormDialog}
                  >
                    Get Early Access
                  </Button>
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
