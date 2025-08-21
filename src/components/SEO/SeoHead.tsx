import React from 'react';
import { Helmet } from 'react-helmet';

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  structuredData?: {
    organization?: Record<string, any>;
    application?: Record<string, any>;
    [key: string]: Record<string, any> | undefined;
  };
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'Synapse - GRC Intelligence Platform',
  description = 'Empower your GRC career with Synapse - the intelligence platform where compliance professionals connect, grow, and shape the future.',
  canonicalUrl = 'https://www.joinsynapses.com',
  ogImage = '/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png',
  ogType = 'website',
  keywords = [
    'Synapse',
    'GRC',
    'Governance Risk Compliance',
    'Regulatory Technology',
    'RegTech',
    'AI in Compliance',
    'Regulatory Agents',
    'Compliance Career',
    'Risk Management',
    'Financial Compliance',
    'ESG Reporting',
    'Regulatory Intelligence',
    'Agentic Hub',
    'GRC Professionals',
    'Compliance Software',
    'Regulatory Compliance',
    'Compliance Platform',
    'GRC Solution',
    'Risk Management Software'
  ],
  structuredData
}) => {
  const joinedKeywords = keywords.join(', ');
  const fullTitle = title.includes('Synapse') ? title : `${title} | Synapse`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={joinedKeywords} />
      <link rel='canonical' href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content={ogType} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:site_name' content='Synapse' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@synapsesgrc' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={ogImage} />
      <meta name='twitter:image:alt' content='Synapse - GRC Intelligence Platform' />

      {/* Additional SEO tags */}
      <meta name='author' content='Synapse' />
      <meta name='robots' content='index, follow' />
      <meta name='googlebot' content='index, follow' />

      {/* Structured Data */}
      {structuredData &&
        Object.entries(structuredData).map(([key, data]) => {
          if (data) {
            return (
              <script key={key} type='application/ld+json'>
                {JSON.stringify(data)}
              </script>
            );
          }
          return null;
        })}
    </Helmet>
  );
};

export default SeoHead;
