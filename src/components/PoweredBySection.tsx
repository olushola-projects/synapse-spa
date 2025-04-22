
import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  {
    name: "OpenAI",
    src: "/lovable-uploads/bee24c50-c3a4-4ac5-a96a-4e8a6e1d5720.png",
    alt: "OpenAI logo"
  },
  {
    name: "Google Firebase",
    src: "/lovable-uploads/24bc5b6a-2ffe-469d-ae66-bec6fe163be5.png",
    alt: "Google Firebase logo"
  },
  {
    name: "Airtable",
    src: "/lovable-uploads/6a778cb7-3cb5-4529-9cc0-fdd90cbe4ddb.png",
    alt: "Airtable logo"
  },
  {
    name: "Microsoft",
    src: "/lovable-uploads/c4144d0f-dbcd-4fac-be19-6dd1ae7ffff3.png",
    alt: "Microsoft logo"
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
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-semibold text-center mb-12 text-gray-800">Powered By</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoweredBySection;
