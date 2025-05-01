
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const logos = [
  {
    name: "OpenAI",
    src: "/lovable-uploads/bee24c50-c3a4-4ac5-a96a-4e8a6e1d5720.png",
    alt: "OpenAI logo",
    className: "h-32 md:h-40"
  },
  {
    name: "Google Firebase",
    src: "/lovable-uploads/24bc5b6a-2ffe-469d-ae66-bec6fe163be5.png",
    alt: "Google Firebase logo"
  },
  {
    name: "Airtable",
    src: "/lovable-uploads/6a778cb7-3cb5-4529-9cc0-fdd90cbe4ddb.png",
    alt: "Airtable logo",
    className: "h-32 md:h-40"
  },
  {
    name: "Microsoft",
    src: "/lovable-uploads/c4144d0f-dbcd-4fac-be19-6dd1ae7ffff3.png",
    alt: "Microsoft logo",
    className: "h-32 md:h-40"
  },
  {
    name: "Google",
    src: "/lovable-uploads/0d37b216-879f-46ea-8740-e50726c3a6a3.png",
    alt: "Google logo"
  },
  {
    name: "Anthropic",
    src: "/lovable-uploads/a363f7e4-db90-4a53-a679-ddbf92f0cebc.png",
    alt: "Anthropic logo"
  }
];

const PoweredBySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px 0px" });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4" ref={containerRef}>
        <h3 className="text-2xl font-semibold text-center mb-12 text-gray-800">Powered By</h3>
        <div className="overflow-x-auto">
          <div className="flex justify-center items-center space-x-16 min-w-max mx-auto">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`h-10 md:h-[40px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 ${logo.className || ''}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoweredBySection;
