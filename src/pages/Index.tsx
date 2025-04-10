
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Ensure embla carousel is properly initialized on page load and reinit on resize
  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Additional initialization if needed
    const carouselInit = () => {
      // Force reflow for any carousels on the page
      document.querySelectorAll('[aria-roledescription="carousel"]').forEach(
        (carousel) => {
          // Trigger reflow
          carousel.getBoundingClientRect();
        }
      );
    };
    
    // Call it now and on load
    carouselInit();
    window.addEventListener('load', carouselInit);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', carouselInit);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
