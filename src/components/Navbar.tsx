
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import ExternalFormDialog from "./ExternalFormDialog";
import InviteDialog from "./InviteDialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/60 transition-all duration-200 shadow-sm">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-3xl font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700 transition-colors">
              Synapses
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm tracking-wide">Home</Link>
              <Link to="/partners" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm tracking-wide">Partners</Link>
              <Link to="/resources/faq" className="text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm tracking-wide">FAQ</Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <div onClick={openInviteDialog} className="cursor-pointer">
              <Button variant="outline" className="border-2 border-blue-200 text-blue-600 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium px-6 py-2 rounded-lg">
                Invite
              </Button>
            </div>
            <div onClick={openFormDialog} className="cursor-pointer">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                Get Early Access
              </Button>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden hover:bg-slate-100" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6 text-slate-600" />
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
              <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-blue-50 font-medium">Home</Link>
              <Link to="/partners" className="text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-blue-50 font-medium">Become a Partner</Link>
              <Link to="/resources/faq" className="text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-blue-50 font-medium">FAQ</Link>
              <div onClick={openInviteDialog} className="text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-blue-50 cursor-pointer">
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-colors font-medium w-full">Invite</Button>
              </div>
              <div onClick={openFormDialog} className="text-blue-600 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-blue-50 cursor-pointer">
                <Button className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700 font-medium">Get Early Access</Button>
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
    </>
  );
};

export default Navbar;
