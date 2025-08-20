import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Helmet } from 'react-helmet';
export const SeoHead = ({
  title = 'SFDR Navigator - CDD Agent',
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
  return _jsxs(Helmet, {
    children: [
      _jsx('title', { children: fullTitle }),
      _jsx('meta', { name: 'description', content: description }),
      _jsx('meta', { name: 'keywords', content: joinedKeywords }),
      _jsx('link', { rel: 'canonical', href: canonicalUrl }),
      _jsx('meta', { property: 'og:type', content: ogType }),
      _jsx('meta', { property: 'og:url', content: canonicalUrl }),
      _jsx('meta', { property: 'og:title', content: fullTitle }),
      _jsx('meta', { property: 'og:description', content: description }),
      _jsx('meta', { property: 'og:image', content: ogImage }),
      _jsx('meta', { property: 'og:image:width', content: '1200' }),
      _jsx('meta', { property: 'og:image:height', content: '630' }),
      _jsx('meta', { property: 'og:site_name', content: 'Synapse' }),
      _jsx('meta', { name: 'twitter:card', content: 'summary_large_image' }),
      _jsx('meta', { name: 'twitter:site', content: '@synapsesgrc' }),
      _jsx('meta', { name: 'twitter:title', content: fullTitle }),
      _jsx('meta', { name: 'twitter:description', content: description }),
      _jsx('meta', { name: 'twitter:image', content: ogImage }),
      _jsx('meta', { name: 'twitter:image:alt', content: 'Synapse - GRC Intelligence Platform' }),
      _jsx('meta', { name: 'author', content: 'Synapse' }),
      _jsx('meta', { name: 'robots', content: 'index, follow' }),
      _jsx('meta', { name: 'googlebot', content: 'index, follow' }),
      structuredData &&
        Object.entries(structuredData).map(([key, data]) => {
          if (data) {
            return _jsx(
              'script',
              { type: 'application/ld+json', children: JSON.stringify(data) },
              key
            );
          }
          return null;
        })
    ]
  });
};
export default SeoHead;
