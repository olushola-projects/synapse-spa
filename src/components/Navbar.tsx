
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

  // Handle scrolling to waitlist form
  const scrollToWaitlist = () => {
    const element = document.getElementById('cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"} transition-all duration-200`}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
          Synapse
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-gray-700 hover:text-blue-700 transition-colors">Home</a>
          <a href="/#features" className="text-gray-700 hover:text-blue-700 transition-colors">Features</a>
          <a href="/#how-it-works" className="text-gray-700 hover:text-blue-700 transition-colors">How It Works</a>
          <Link to="/partners" className="text-gray-700 hover:text-blue-700 transition-colors">Partners</Link>
          <Link to="/platform" className="text-gray-700 hover:text-blue-700 transition-colors">Platform</Link>
          <Link to="/resources" className="text-gray-700 hover:text-blue-700 transition-colors">Resources</Link>
          <Button size="sm" onClick={scrollToWaitlist}>Join Waitlist</Button>
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
            <a href="/#features" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Features</a>
            <a href="/#how-it-works" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">How It Works</a>
            <Link to="/partners" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Partners</Link>
            <Link to="/platform" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Platform</Link>
            <Link to="/resources" className="text-gray-700 hover:text-blue-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-100">Resources</Link>
            <Button className="mt-2" onClick={scrollToWaitlist}>Join Waitlist</Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
