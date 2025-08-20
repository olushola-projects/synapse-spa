import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import IndustryPerspectivesSection from '../components/IndustryPerspectivesSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import EnterpriseSection from '../components/EnterpriseSection';
import HowItWorksSection from '../components/HowItWorksSection';
import NexusAgentSection from '@/components/NexusAgentSection';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import SeoHead from '../components/SEO/SeoHead';
import { Logos3 } from '@/components/ui/logos3';
const Index = () => {
  const [visibleSections, setVisibleSections] = useState({
    features: false,
    video: false,
    testimonials: false,
    cta: false
  });
  // Custom logos combining existing PoweredBy logos with GRC-focused branding
  const customLogos = [
    {
      id: 'openai',
      src: '/lovable-uploads/bee24c50-c3a4-4ac5-a96a-4e8a6e1d5720.png',
      alt: 'OpenAI',
      className: 'h-14 w-auto'
    },
    {
      id: 'firebase',
      src: '/lovable-uploads/24bc5b6a-2ffe-469d-ae66-bec6fe163be5.png',
      alt: 'Google Firebase',
      className: 'h-10 w-auto'
    },
    {
      id: 'airtable',
      src: '/lovable-uploads/6a778cb7-3cb5-4529-9cc0-fdd90cbe4ddb.png',
      alt: 'Airtable',
      className: 'h-14 w-auto'
    },
    {
      id: 'microsoft',
      src: '/lovable-uploads/c4144d0f-dbcd-4fac-be19-6dd1ae7ffff3.png',
      alt: 'Microsoft',
      className: 'h-14 w-auto'
    },
    {
      id: 'google',
      src: '/lovable-uploads/0d37b216-879f-46ea-8740-e50726c3a6a3.png',
      alt: 'Google',
      className: 'h-10 w-auto'
    },
    {
      id: 'anthropic',
      src: '/lovable-uploads/a363f7e4-db90-4a53-a679-ddbf92f0cebc.png',
      alt: 'Anthropic',
      className: 'h-10 w-auto'
    }
  ];
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    const sectionObserver = new IntersectionObserver(entries => {
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
      document.querySelectorAll('[aria-roledescription="carousel"]').forEach(carousel => {
        carousel.getBoundingClientRect();
      });
    };
    carouselInit();
    window.addEventListener('load', carouselInit);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', carouselInit);
    };
  }, []);
  useEffect(() => {
    const handleHowItWorksClick = e => {
      const target = e.target;
      const isHowItWorksLink =
        target.textContent?.includes('How It Works') ||
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
  return _jsxs('div', {
    className: 'min-h-screen relative',
    children: [
      _jsx(SeoHead, {
        title: 'SFDR Navigator - CDD Agent',
        description:
          'Empower your GRC career with Synapse - the intelligence platform where compliance professionals connect, grow, and shape the future.',
        ogImage: '/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png',
        structuredData: {
          organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Synapse',
            url: 'https://www.joinsynapses.com',
            logo: 'https://www.joinsynapses.com/lovable-uploads/f88a2e71-50de-4711-83ef-4788c6f169fa.png',
            description:
              'Empower your GRC career with Synapse - the intelligence platform where compliance professionals connect, grow, and shape the future.',
            sameAs: [
              'https://twitter.com/synapsesgrc',
              'https://www.linkedin.com/company/joinsynapses'
            ]
          },
          application: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Synapse GRC Platform',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/ComingSoon'
            },
            description:
              'The intelligence platform where compliance professionals connect, grow, and shape the future.'
          }
        }
      }),
      _jsx(AnimatedBackground, {}),
      _jsx(Navbar, {}),
      _jsx(HeroSection, {}),
      _jsx('div', {
        id: 'features',
        className: `transition-opacity duration-1000 ${visibleSections.features ? 'opacity-100' : 'opacity-0'}`,
        children: _jsx(FeaturesSection, {})
      }),
      _jsx(HowItWorksSection, {}),
      _jsx(NexusAgentSection, {}),
      _jsx('div', {
        id: 'testimonials',
        className: `transition-opacity duration-1000 ${visibleSections.testimonials ? 'opacity-100' : 'opacity-0'}`,
        children: _jsx(IndustryPerspectivesSection, {})
      }),
      _jsx(Logos3, { heading: 'Powered By', logos: customLogos }),
      _jsx(EnterpriseSection, {}),
      _jsx(CTASection, {}),
      _jsx(Footer, {})
    ]
  });
};
export default Index;
