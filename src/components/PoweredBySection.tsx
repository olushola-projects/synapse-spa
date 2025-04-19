
import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  {
    name: "OpenAI",
    src: "/lovable-uploads/openai-logo.svg",
    alt: "OpenAI logo"
  },
  {
    name: "Google Firebase",
    src: "/lovable-uploads/firebase-logo.svg",
    alt: "Google Firebase logo"
  },
  {
    name: "Airtable",
    src: "/lovable-uploads/airtable-logo.svg",
    alt: "Airtable logo"
  },
  {
    name: "Make.com",
    src: "/lovable-uploads/make-logo.svg",
    alt: "Make.com logo"
  },
  {
    name: "DeepL",
    src: "/lovable-uploads/deepl-logo.svg",
    alt: "DeepL logo"
  },
  {
    name: "Gemini",
    src: "/lovable-uploads/gemini-logo.svg",
    alt: "Gemini logo"
  },
  {
    name: "Anthropic",
    src: "/lovable-uploads/anthropic-logo.svg",
    alt: "Anthropic logo"
  },
  {
    name: "Microsoft",
    src: "/lovable-uploads/microsoft-logo.svg",
    alt: "Microsoft logo"
  },
  {
    name: "Google",
    src: "/lovable-uploads/google-logo.svg",
    alt: "Google logo"
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
