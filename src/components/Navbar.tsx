
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar appearance based on scroll
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Handle active section highlighting
      const sections = ['features', 'how-it-works', 'testimonials', 'faq'];
      let currentSection = '';
      
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click handler for navigation links
  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(sectionId);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo with subtle animation */}
          <div className="flex items-center">
            <a href="#" className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition-all duration-300">
              Synapses
            </a>
          </div>

          {/* Desktop Navigation with active state and hover effects */}
          <nav className="hidden md:flex items-center space-x-8">
            {['features', 'how-it-works', 'testimonials', 'faq'].map((item) => (
              <a 
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                className={`text-sm font-medium relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                  activeSection === item
                    ? 'text-synapse-primary after:bg-synapse-primary after:scale-x-100'
                    : 'text-synapse-dark hover:text-synapse-primary after:bg-synapse-primary'
                }`}
              >
                {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </a>
            ))}
          </nav>

          {/* Desktop CTA with enhanced hover effect */}
          <div className="hidden md:block">
            <Button 
              className="bg-synapse-primary hover:bg-synapse-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-[2px]"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-synapse-dark hover:text-synapse-primary hover:bg-transparent"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation with animations */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            {['features', 'how-it-works', 'testimonials', 'faq'].map((item, index) => (
              <a 
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                className={`text-base font-medium transition-all duration-300 ${
                  activeSection === item
                    ? 'text-synapse-primary'
                    : 'text-synapse-dark hover:text-synapse-primary'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </a>
            ))}
            <Button 
              className="w-full bg-synapse-primary hover:bg-synapse-secondary text-white mt-2 animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              Join Waitlist
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
