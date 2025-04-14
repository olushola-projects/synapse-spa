
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"} transition-all duration-200`}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <img src="/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png" alt="Logo" className="h-8 w-auto" />
          Synapse
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-700 transition-colors">Home</Link>
          <Link to="/#features" className="text-gray-700 hover:text-blue-700 transition-colors">Features</Link>
          <Link to="/#how-it-works" className="text-gray-700 hover:text-blue-700 transition-colors">How It Works</Link>
          <Link to="/partners" className="text-gray-700 hover:text-blue-700 transition-colors">Partners</Link>
          <Button size="sm">Join Waitlist</Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      
      {/* Mobile Navigation */}
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
            <Link to="/#features" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Features</Link>
            <Link to="/#how-it-works" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">How It Works</Link>
            <Link to="/partners" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Partners</Link>
            <Button className="mt-2">Join Waitlist</Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
