
import { useState, useEffect } from "react";
import { DiagonalShaderHero } from "./hero/DiagonalShaderHero";
import { SynapsesHeroContent } from "./hero/SynapsesHeroContent";

const HeroSection = () => {
  const [animate, setAnimate] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  return (
    <div
      style={{ minHeight: "calc(100vh - 64px)" }}
      className="w-full"
      id="hero-section"
    >
      {/* Shader Background with integrated hero content and features */}
      <DiagonalShaderHero
        colorStart="#ff511c"
        colorEnd="#9a89e4"
        speed={0.2}
      >
        {/* Hero Content with integrated USP features */}
        <SynapsesHeroContent />
      </DiagonalShaderHero>
    </div>
  );
};

export default HeroSection;
