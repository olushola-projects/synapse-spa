import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ExternalFormDialog from "./ExternalFormDialog";
import InviteDialog from "./InviteDialog";
import JoinWaitlistDialog from "./JoinWaitlistDialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 64);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openFormDialog = () => {
    setShowFormDialog(true);
  };
  
  const openInviteDialog = () => {
    setShowInviteDialog(true);
  };
  
  const openWaitlistDialog = () => {
    setShowWaitlistDialog(true);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Account for header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"} transition-all duration-200`}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2 font-sans tracking-tight">
              Synapses
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-900 hover:text-blue-700 transition-colors font-medium text-base font-sans">Home</Link>
              <Link to="/partners" className="text-gray-900 hover:text-blue-700 transition-colors font-medium text-base font-sans">Become a Partner</Link>
              <Link to="/resources/faq" className="text-gray-900 hover:text-blue-700 transition-colors font-medium text-base font-sans">FAQ</Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div onClick={openInviteDialog} className="cursor-pointer">
              <Button variant="outline" className="border-2 border-gray-900 text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white transition-colors font-medium text-base font-sans px-4 py-2">Invite</Button>
            </div>
            
            <div onClick={openFormDialog} className="cursor-pointer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-base font-sans px-4 py-2">Get Early Access</Button>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b shadow-lg"
          >
            <nav className="container mx-auto p-4 flex flex-col gap-4">
              <Link to="/" className="text-gray-900 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 font-medium text-base font-sans">Home</Link>
              <Link to="/partners" className="text-gray-900 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 font-medium text-base font-sans">Become a Partner</Link>
              <Link to="/resources/faq" className="text-gray-900 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 font-medium text-base font-sans">FAQ</Link>
              <div onClick={openInviteDialog} className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer">
                <Button variant="outline" className="border-2 border-gray-900 text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white transition-colors font-medium w-full text-base font-sans">Invite</Button>
              </div>
              <div onClick={openFormDialog} className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer">
                <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-base font-sans">Get Early Access</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>
      
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog} 
        title="Get Early Access"
      />
      
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
      
      <JoinWaitlistDialog
        open={showWaitlistDialog}
        onOpenChange={setShowWaitlistDialog}
      />
    </>
  );
};

export default Navbar;
