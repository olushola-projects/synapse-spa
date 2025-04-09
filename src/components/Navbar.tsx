
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-2xl font-display font-bold text-synapse-primary">
              Synapse
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-synapse-dark hover:text-synapse-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-synapse-dark hover:text-synapse-primary transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-synapse-dark hover:text-synapse-primary transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="text-sm font-medium text-synapse-dark hover:text-synapse-primary transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button variant="default" className="bg-synapse-primary hover:bg-synapse-secondary text-white">
              Join Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-base font-medium text-synapse-dark hover:text-synapse-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-base font-medium text-synapse-dark hover:text-synapse-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="text-base font-medium text-synapse-dark hover:text-synapse-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#faq" 
              className="text-base font-medium text-synapse-dark hover:text-synapse-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <Button className="w-full bg-synapse-primary hover:bg-synapse-secondary text-white">
              Join Waitlist
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
