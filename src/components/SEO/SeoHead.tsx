
import React from "react";
import { Helmet } from "react-helmet";

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  structuredData?: Record<string, any>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = "Synapses - GRC Intelligence Platform",
  description = "Join a global network of GRC professionals to boost your expertise with regulatory agents, comprehensive insights and career resilience tools.",
  canonicalUrl = "https://www.joinsynapses.com",
  ogImage = "/lovable-uploads/93f022b9-560f-49fe-95a3-72816c483659.png",
  ogType = "website",
  keywords = [
    "GRC", 
    "Governance Risk Compliance", 
    "Regulatory Technology", 
    "RegTech", 
    "AI in Compliance",
    "Regulatory Agents",
    "Compliance Career",
    "Risk Management",
    "Financial Compliance",
    "ESG Reporting",
    "Regulatory Intelligence"
  ],
  structuredData
}) => {
  const joinedKeywords = keywords.join(", ");
  const fullTitle = title.includes("Synapses") ? title : `${title} | Synapses`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={joinedKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Synapses" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@synapsesgrc" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
