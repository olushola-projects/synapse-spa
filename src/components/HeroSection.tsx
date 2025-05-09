
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
      className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center justify-center gap-12"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Hero Content - Left Side */}
        <HeroContent
          animate={animate}
          onGetAccess={handleGetAccessClick}
          onLearnMore={handleLearnMoreClick}
        />

        {/* Hero Visual - Right Side */}
        <div className={`relative w-full transition-all duration-700 ease-out ${animate ? 'opacity-100' : 'opacity-0 translate-x-6'}`}>
          <USPFeatureSection />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
