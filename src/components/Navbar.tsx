import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import JoinWaitlistDialog from "./JoinWaitlistDialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);

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
          <Link to="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
            Synapses
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-700 transition-colors">Home</Link>
            <a 
              href="/#features" 
              className="text-gray-700 hover:text-blue-700 transition-colors"
              onClick={(e) => handleNavClick(e, "features")}
            >
              Features
            </a>
            <a 
              href="/#how-it-works" 
              className="text-gray-700 hover:text-blue-700 transition-colors"
              onClick={(e) => handleNavClick(e, "how-it-works")}
            >
              How It Works
            </a>
            <Link to="/partners" className="text-gray-700 hover:text-blue-700 transition-colors">Partners</Link>
            <div onClick={openWaitlistDialog} className="text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">
              <Button size="sm">Get Early Access</Button>
            </div>
          </nav>

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
              <Link to="/" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Home</Link>
              <a 
                href="/#features" 
                className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100"
                onClick={(e) => handleNavClick(e, "features")}
              >
                Features
              </a>
              <a 
                href="/#how-it-works" 
                className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100"
                onClick={(e) => handleNavClick(e, "how-it-works")}
              >
                How It Works
              </a>
              <Link to="/partners" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Partners</Link>
              <div onClick={openWaitlistDialog} className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer">
                <Button className="mt-2">Get Early Access</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>
      
      <JoinWaitlistDialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog} />
    </>
  );
};

export default Navbar;
