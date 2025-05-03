import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import VideoSection from "../components/VideoSection";
import IndustryPerspectivesSection from "../components/IndustryPerspectivesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import PoweredBySection from "../components/PoweredBySection";
import EnterpriseSection from "../components/EnterpriseSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    features: false,
    video: false,
    testimonials: false,
    cta: false
  });

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const sections = ['features', 'how-it-works', 'testimonials', 'cta'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          sectionObserver.unobserve(element);
        }
      });
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const carouselInit = () => {
      document.querySelectorAll('[aria-roledescription="carousel"]').forEach(
        (carousel) => {
          carousel.getBoundingClientRect();
        }
      );
    };
    
    carouselInit();
    window.addEventListener('load', carouselInit);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', carouselInit);
    };
  }, []);

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
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      
      <div id="features" className={`transition-opacity duration-1000 ${visibleSections.features ? 'opacity-100' : 'opacity-0'}`}>
        <FeaturesSection />
      </div>
      
      <VideoSection />
      
      <div id="testimonials" className={`transition-opacity duration-1000 ${visibleSections.testimonials ? 'opacity-100' : 'opacity-0'}`}>
        <IndustryPerspectivesSection />
      </div>
      
      <PoweredBySection />
      
      <EnterpriseSection />
      
      <Footer />
    </div>
  );
};

export default Index;
