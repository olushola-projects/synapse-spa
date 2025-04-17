
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import VideoSection from "../components/VideoSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const Index = () => {
  // State for tracking which sections are visible for animations
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    features: false,
    video: false,
    testimonials: false,
    faq: false,
    cta: false
  });

  // Setup intersection observers for each section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15, // When 15% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          
          // Once we've animated a section, we can unobserve it
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe each section element
    const sections = ['features', 'how-it-works', 'testimonials', 'faq', 'cta'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => {
      // Cleanup observer
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          sectionObserver.unobserve(element);
        }
      });
    };
  }, []);

  // Ensure embla carousel is properly initialized on page load and reinit on resize
  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Additional initialization for carousels
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

  // Handle "How It Works" navigation to redirect to Video Section
  useEffect(() => {
    const handleHowItWorksClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHowItWorksLink = target.textContent?.includes('How It Works') || 
                               target.closest('a')?.textContent?.includes('How It Works');
      
      if (isHowItWorksLink) {
        e.preventDefault();
        const videoSection = document.getElementById('how-it-works');
        if (videoSection) {
          const yOffset = -80;
          const y = videoSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };
    
    document.addEventListener('click', handleHowItWorksClick);
    
    return () => {
      document.removeEventListener('click', handleHowItWorksClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <div id="features" className={`transition-opacity duration-1000 ${visibleSections.features ? 'opacity-100' : 'opacity-0'}`}>
        <FeaturesSection />
      </div>
      
      <div id="how-it-works" className={`transition-opacity duration-1000 ${visibleSections.video ? 'opacity-100' : 'opacity-0'}`}>
        <VideoSection />
      </div>
      
      <div id="testimonials" className={`transition-opacity duration-1000 ${visibleSections.testimonials ? 'opacity-100' : 'opacity-0'}`}>
        <TestimonialsSection />
      </div>
      
      <div id="faq" className={`transition-opacity duration-1000 ${visibleSections.faq ? 'opacity-100' : 'opacity-0'}`}>
        <FAQSection />
      </div>
      
      <div id="cta" className={`transition-opacity duration-1000 ${visibleSections.cta ? 'opacity-100' : 'opacity-0'}`}>
        <CTASection />
      </div>
      
      <Footer />
      
      {/* Mobile optimization styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px) {
          .container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          
          h2 {
            font-size: 1.75rem !important;
          }
          
          .feature-grid {
            grid-template-columns: 1fr !important;
          }
          
          .chart-container {
            height: 300px !important;
          }
        }
      `}} />
    </div>
  );
};

export default Index;
