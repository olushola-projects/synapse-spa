
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
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-all duration-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-bold text-black flex items-center gap-2">
              Synapses
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-black hover:text-gray-600 transition-colors font-medium">Home</Link>
              <Link to="/partners" className="text-black hover:text-gray-600 transition-colors font-medium">Become a Partner</Link>
              <Link to="/resources/faq" className="text-black hover:text-gray-600 transition-colors font-medium">FAQ</Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div onClick={openInviteDialog} className="cursor-pointer">
              <Button variant="outline" className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-colors font-medium">Invite</Button>
            </div>
            <div onClick={openFormDialog} className="cursor-pointer">
              <Button className="bg-black text-white hover:bg-gray-800 font-medium">Get Early Access</Button>
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
              <Link to="/" className="text-black hover:text-gray-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 font-medium">Home</Link>
              <Link to="/partners" className="text-black hover:text-gray-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 font-medium">Become a Partner</Link>
              <Link to="/resources/faq" className="text-black hover:text-gray-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 font-medium">FAQ</Link>
              <div onClick={openInviteDialog} className="text-gray-700 hover:text-black transition-colors py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer">
                <Button variant="outline" className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-colors font-medium w-full">Invite</Button>
              </div>
              <div onClick={openFormDialog} className="text-gray-700 hover:text-black transition-colors py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer">
                <Button className="mt-2 w-full bg-black text-white hover:bg-gray-800 font-medium">Get Early Access</Button>
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
