
import { useState } from "react";
import { USPFeatureSection } from "./features/USPFeatureSection";
import { HeroContent } from "./hero/HeroContent";

const HeroSection = () => {
  const [animate, setAnimate] = useState(false);

  // Trigger animations after component mounts
  useState(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  });

  const handleGetAccessClick = () => {
    // Open dialog or scroll to contact form
    const element = document.getElementById("cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      const yOffset = -80;
      const y = featuresSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 64px)" }}
      className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col items-center justify-center bg-gradient-to-br from-[#eef4ff] via-white to-[#f8faff]"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Hero Content - Left Side */}
        <div className="flex flex-col items-start">
          <HeroContent
            animate={animate}
            onGetAccess={handleGetAccessClick}
            onLearnMore={handleLearnMoreClick}
          />
          
          {/* USP Feature Section - Under Hero Content */}
          <div className={`mt-8 w-full transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
            <USPFeatureSection />
          </div>
        </div>

        {/* Hero Visual - Right Side */}
        <div className={`relative w-full transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-x-6'}`}>
          {/* Dashboard visualization restored to match the reference image */}
          <img 
            src="/lovable-uploads/b580e547-9e9f-4145-9649-3b9f79e59b32.png" 
            alt="Dashboard interface" 
            className="w-full h-auto shadow-2xl rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
