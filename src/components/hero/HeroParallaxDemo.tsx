
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export function HeroParallaxDemo() {
  return (
    <div className="min-h-screen w-full">
      <div className="absolute top-0 left-0 w-full">
        <HeroParallax products={grcProducts} />
      </div>
    </div>
  );
}

export const grcProducts = [
  {
    title: "Regulatory Compliance Dashboard",
    link: "#compliance",
    thumbnail: "/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png",
  },
  {
    title: "Risk Assessment Platform",
    link: "#risk-assessment",
    thumbnail: "/lovable-uploads/c5b1f529-364b-4a3f-9e4e-29fe1862e7b3.png",
  },
  {
    title: "AML Analysis Tools",
    link: "#aml-tools",
    thumbnail: "/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png",
  },
  {
    title: "Governance Framework",
    link: "#governance",
    thumbnail: "/lovable-uploads/24bc5b6a-2ffe-469d-ae66-bec6fe163be5.png",
  },
  {
    title: "Compliance Monitoring",
    link: "#monitoring",
    thumbnail: "/lovable-uploads/b494ebd4-31a1-4c16-aedd-19f958600d25.png",
  },
  {
    title: "Regulatory Updates Hub",
    link: "#updates",
    thumbnail: "/lovable-uploads/318526a2-7e1a-426e-97da-6a20311cb631.png",
  },
  {
    title: "GRC Analytics Suite",
    link: "#analytics",
    thumbnail: "/lovable-uploads/45cf99e7-e503-4ed3-b858-be606a5dd904.png",
  },
  {
    title: "Audit Management System",
    link: "#audit",
    thumbnail: "/lovable-uploads/6ac8bd07-6906-427c-b832-be14819a3aed.png",
  },
  {
    title: "Policy Management Portal",
    link: "#policy",
    thumbnail: "/lovable-uploads/88a5c7a6-e347-41ee-ad94-701d034e7258.png",
  },
  {
    title: "Incident Response Platform",
    link: "#incident",
    thumbnail: "/lovable-uploads/93f022b9-560f-49fe-95a3-72816c483659.png",
  },
  {
    title: "Training & Certification Hub",
    link: "#training",
    thumbnail: "/lovable-uploads/a363f7e4-db90-4a53-a679-ddbf92f0cebc.png",
  },
  {
    title: "Vendor Risk Assessment",
    link: "#vendor-risk",
    thumbnail: "/lovable-uploads/b580e547-9e9f-4145-9649-3b9f79e59b32.png",
  },
  {
    title: "Data Privacy Console",
    link: "#privacy",
    thumbnail: "/lovable-uploads/bee24c50-c3a4-4ac5-a96a-4e8a6e1d5720.png",
  },
  {
    title: "Financial Crimes Prevention",
    link: "#financial-crimes",
    thumbnail: "/lovable-uploads/c4144d0f-dbcd-4fac-be19-6dd1ae7ffff3.png",
  },
  {
    title: "Regulatory Intelligence",
    link: "#intelligence",
    thumbnail: "/lovable-uploads/db02338b-7e4e-46d0-bfe8-e9b9d9005d3f.png",
  },
];

export default HeroParallaxDemo;
