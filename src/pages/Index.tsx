
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
import HowItWorksSection from "../components/HowItWorksSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import SeoHead from "../components/SEO/SeoHead";

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

    // Close mobile menu on orientation change
    window.addEventListener('orientationchange', () => { 
      const navToggle = document.querySelector('#nav-toggle') as HTMLInputElement;
      if (navToggle) navToggle.checked = false;
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', carouselInit);
      window.removeEventListener('orientationchange', () => {});
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
      <SeoHead 
        title="Synapses - GRC Intelligence Platform"
        description="Empower your GRC career with Synapses - the intelligence platform where compliance professionals connect, grow, and shape the future."
        ogImage="/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png"
        structuredData={{
          organization: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Synapses",
            "url": "https://www.joinsynapses.com",
            "logo": "https://www.joinsynapses.com/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png",
            "description": "Empower your GRC career with Synapses - the intelligence platform where compliance professionals connect, grow, and shape the future.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Regina House, 69 Cheapside",
              "addressLocality": "London",
              "postalCode": "EC2V 6AZ",
              "addressCountry": "UK"
            },
            "email": "info@joinsynapses.com",
            "sameAs": [
              "https://twitter.com/synapsesgrc",
              "https://www.linkedin.com/company/joinsynapses"
            ]
          },
          application: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Synapses GRC Platform",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/ComingSoon"
            },
            "description": "The intelligence platform where compliance professionals connect, grow, and shape the future."
          }
        }}
      />
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      
      <div id="features" className={`transition-opacity duration-1000 ${visibleSections.features ? 'opacity-100' : 'opacity-0'}`}>
        <FeaturesSection />
      </div>
      
      <VideoSection />
      
      <HowItWorksSection />
      
      <div id="testimonials" className={`transition-opacity duration-1000 ${visibleSections.testimonials ? 'opacity-100' : 'opacity-0'}`}>
        <IndustryPerspectivesSection />
      </div>
      
      <PoweredBySection />
      
      <EnterpriseSection />
      
      <CTASection />
      
      <Footer />
    </div>
  );
};

export default Index;
