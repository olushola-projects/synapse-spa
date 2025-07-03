
import React from "react";
import { HeroParallax, HeroParallaxProduct } from "../ui/hero-parallax";

export const products: HeroParallaxProduct[] = [
  {
    title: "SFDR Navigator",
    link: "#sfdr",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
  },
  {
    title: "Risk Assessment Engine",
    link: "#risk",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    title: "Compliance Dashboard",
    link: "#compliance",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    title: "ESG Analytics",
    link: "#esg",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
  },
  {
    title: "Regulatory Reporting",
    link: "#reporting",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  },
  {
    title: "AML Investigation",
    link: "#aml",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  },
  {
    title: "Policy Management",
    link: "#policy",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
  },
  {
    title: "Audit Trail",
    link: "#audit",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
  },
  {
    title: "Third-Party Risk",
    link: "#third-party",
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
  },
  {
    title: "Incident Response",
    link: "#incident",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop",
  },
  {
    title: "Data Privacy Manager",
    link: "#privacy",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
  },
  {
    title: "Control Testing",
    link: "#control",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
  {
    title: "Business Continuity",
    link: "#continuity",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
  },
  {
    title: "Training Hub",
    link: "#training",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  },
  {
    title: "Regulatory Intelligence",
    link: "#intelligence",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
  },
];

export function HeroParallaxDemo() {
  return (
    <div className="min-h-screen w-full">
      <HeroParallax products={products} />
    </div>
  );
}

export default HeroParallaxDemo;
